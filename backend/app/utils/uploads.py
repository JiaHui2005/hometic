import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

# backend/static/uploads: cùng thư mục main.py phục vụ ở /static
STATIC_DIR = Path(__file__).resolve().parents[2] / "static"
UPLOAD_DIR = STATIC_DIR / "uploads"

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_BYTES = 5 * 1024 * 1024
CHUNK = 1024 * 1024


def save_image(file: UploadFile, prefix: str) -> str:
    """Lưu ảnh upload, trả về tên file. Tên do server tạo (không dùng tên từ client nên không thể chèn ../),
    chỉ nhận đuôi ảnh, tối đa 5 MB."""
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Chỉ nhận ảnh JPG, PNG, WEBP hoặc GIF")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    name = f"{prefix}_{uuid.uuid4().hex[:12]}{ext}"
    dest = UPLOAD_DIR / name
    size = 0
    with dest.open("wb") as out:
        while chunk := file.file.read(CHUNK):
            size += len(chunk)
            if size > MAX_BYTES:
                break
            out.write(chunk)
    if size > MAX_BYTES:
        dest.unlink(missing_ok=True)
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Ảnh tối đa 5 MB")
    return name
