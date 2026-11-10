import argparse
import re
from pathlib import Path

from app.db.session import SessionLocal
from app.models.entities import Category, Product, ProductDetail, User
from app.utils.uploads import UPLOAD_DIR, upload_to_cloudinary

SEED_DIR = Path(__file__).resolve().parents[3] / "database"
LOCAL_PREFIX = re.compile(r"^(?:https?://(?:localhost|127\.0\.0\.1)(?::\d+)?)?/?(static/uploads/[^\s'\"]+)$")
SEED_REF = re.compile(r"static/uploads/[^\s'\",)\]]+")


def local_key(url: str | None) -> str | None:
    """'static/uploads/a.jpg', '/static/uploads/a.jpg', 'http://localhost:8000/static/uploads/a.jpg' -> 'static/uploads/a.jpg'."""
    m = LOCAL_PREFIX.match(url or "")
    return m.group(1) if m else None


def public_id_for(filename: str) -> str:
    return re.sub(r"[^A-Za-z0-9_-]", "_", Path(filename).stem)


def is_real_image(u) -> bool:
    return isinstance(u, str) and (u.startswith("http") or u.startswith("static/") or u.startswith("/"))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    db = SessionLocal()
    try:
        products = db.query(Product).all()
        categories = db.query(Category).all()
        users = db.query(User).filter(User.avatar_url.isnot(None)).all()
        details = db.query(ProductDetail).all()

        seed_files = sorted(SEED_DIR.glob("*.sql"))
        referenced = {local_key(o.image_url) for o in products + categories}
        referenced |= {local_key(u.avatar_url) for u in users}
        referenced |= {local_key(g) for d in details for g in (d.gallery_urls or []) if isinstance(g, str)}
        for f in seed_files:
            referenced |= set(SEED_REF.findall(f.read_text(encoding="utf-8")))
        referenced.discard(None)

        on_disk = {f"static/uploads/{p.name}": p for p in UPLOAD_DIR.iterdir() if p.is_file()}
        to_upload = sorted(k for k in referenced if k in on_disk)
        missing = sorted(k for k in referenced if k not in on_disk)
        print(f"Ảnh đang được dùng: {len(referenced)} | có file: {len(to_upload)} | thiếu file: {len(missing)} | "
              f"không dùng (bỏ qua): {len(on_disk) - len(to_upload)}")
        for k in missing:
            print("  thiếu file:", k)
        if args.dry_run:
            return

        mapping = {}
        for i, key in enumerate(to_upload, 1):
            path = on_disk[key]
            mapping[key] = upload_to_cloudinary(path.read_bytes(), public_id_for(path.name), "legacy")
            print(f"  [{i}/{len(to_upload)}] {path.name} -> {mapping[key]}")

        def swap(url):
            return mapping.get(local_key(url), url)

        changed = 0
        for obj in products + categories:
            if swap(obj.image_url) != obj.image_url:
                obj.image_url = swap(obj.image_url)
                changed += 1
        for u in users:
            if swap(u.avatar_url) != u.avatar_url:
                u.avatar_url = swap(u.avatar_url)
                changed += 1
        for d in details:
            gallery = [swap(g) for g in (d.gallery_urls or []) if is_real_image(g)]
            if gallery != (d.gallery_urls or []):
                d.gallery_urls = gallery
                changed += 1
        db.commit()
        print(f"Đã cập nhật {changed} bản ghi trong DB")

        for f in seed_files:
            text = f.read_text(encoding="utf-8")
            new = SEED_REF.sub(lambda m: mapping.get(m.group(0), m.group(0)), text)
            if new != text:
                f.write_text(new, encoding="utf-8")
                print(f"Đã đổi URL trong {f.name}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
