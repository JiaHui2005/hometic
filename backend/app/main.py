from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import auth, catalog, orders, reviews, admin, coupons
from app.core.config import get_settings
from app.core.logging import setup_logging, log_requests
from app.db.init_db import init_db
from app.utils.uploads import STATIC_DIR
import logging

settings = get_settings()
setup_logging(settings.log_level)

# SECRET_KEY yếu thì ai cũng tự ký được token admin: không cho chạy production, cảnh báo khi dev
if settings.secret_key_is_weak:
    if settings.app_env == "production":
        raise RuntimeError("SECRET_KEY phải dài ít nhất 32 ký tự ngẫu nhiên khi APP_ENV=production")
    logging.getLogger("hometic").warning("SECRET_KEY yếu, chỉ dùng khi phát triển. Tạo khoá mới: python -c \"import secrets; print(secrets.token_urlsafe(48))\"")

app = FastAPI(title=settings.app_name)

app.middleware("http")(log_requests)
# Nén JSON: danh sách sản phẩm ~74 KB còn khoảng 1/5, tải nhanh hơn rõ trên 4G
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    # nosniff: trình duyệt không tự đoán kiểu file, ảnh upload không bị chạy như HTML/JS
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/api/health")
def health():
    return {"status": "ok", "service": settings.app_name}

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Registering Routers
app.include_router(auth.router, prefix="/api")
app.include_router(catalog.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(admin.router, prefix="/api/admin")
app.include_router(coupons.router, prefix="/api")
