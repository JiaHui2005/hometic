import io
import logging
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.core.config import get_settings

logger = logging.getLogger(__name__)

STATIC_DIR = Path(__file__).resolve().parents[2] / "static"
UPLOAD_DIR = STATIC_DIR / "uploads"

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".jfif", ".png", ".webp", ".avif", ".gif"}
MAX_BYTES = 5 * 1024 * 1024
CHUNK = 1024 * 1024


def _read_limited(file: UploadFile) -> bytes:
    buffer = io.BytesIO()
    while chunk := file.file.read(CHUNK):
        if buffer.tell() + len(chunk) > MAX_BYTES:
            raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Ảnh tối đa 5 MB")
        buffer.write(chunk)
    return buffer.getvalue()


def _save_local(data: bytes, name: str) -> str:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    (UPLOAD_DIR / name).write_bytes(data)
    return f"static/uploads/{name}"


def upload_to_cloudinary(data: bytes, public_id: str, folder: str) -> str:
    """Tải ảnh lên Cloudinary, trả về URL https. Cloudinary tự từ chối file không phải ảnh."""
    import cloudinary
    import cloudinary.uploader

    settings = get_settings()
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True,
    )
    result = cloudinary.uploader.upload(
        data,
        folder=f"{settings.cloudinary_folder}/{folder}",
        public_id=public_id,
        resource_type="image",
        overwrite=False,
        unique_filename=False,
    )
    return result["secure_url"]


def save_image(file: UploadFile, prefix: str, folder: str = "products") -> str:
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Chỉ nhận ảnh JPG, PNG, WEBP, AVIF hoặc GIF")

    data = _read_limited(file)
    stem = f"{prefix}_{uuid.uuid4().hex[:12]}"

    if get_settings().storage_backend != "cloudinary":
        return _save_local(data, stem + ext)
    from cloudinary.exceptions import BadRequest

    try:
        return upload_to_cloudinary(data, stem, folder)
    except BadRequest:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File không phải ảnh hợp lệ")
    except Exception:
        logger.exception("Upload Cloudinary thất bại: %s", stem)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Chưa tải được ảnh lên, vui lòng thử lại")
