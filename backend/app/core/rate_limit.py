import threading
import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request, status


class RateLimiter:
    """Cửa sổ trượt: mỗi khoá giữ hàng đợi thời điểm các lần gọi, bỏ các mốc đã ra khỏi cửa sổ. O(1) khấu hao mỗi lần.
    shortcut: lưu trong RAM của từng tiến trình (2 worker = 2 bộ đếm riêng, khởi động lại là mất);
    chuyển sang Redis khi chạy nhiều máy hoặc cần giới hạn chính xác."""

    def __init__(self, limit: int, window_seconds: int):
        self.limit = limit
        self.window = window_seconds
        self._hits: dict[str, deque] = defaultdict(deque)
        self._lock = threading.Lock()

    def allow(self, key: str) -> bool:
        now = time.monotonic()
        with self._lock:
            hits = self._hits[key]
            while hits and hits[0] <= now - self.window:
                hits.popleft()
            if len(hits) >= self.limit:
                return False
            hits.append(now)
            return True

    def reset(self) -> None:
        with self._lock:
            self._hits.clear()


login_by_ip = RateLimiter(limit=20, window_seconds=300)
login_by_email = RateLimiter(limit=10, window_seconds=300)
otp_by_ip = RateLimiter(limit=10, window_seconds=900)
otp_by_email = RateLimiter(limit=3, window_seconds=900)
ALL_LIMITERS = (login_by_ip, login_by_email, otp_by_ip, otp_by_email)


def client_ip(request: Request) -> str:
    # shortcut: sau reverse proxy đây là IP của proxy; khi deploy sau Nginx hãy chạy uvicorn với --proxy-headers
    return request.client.host if request.client else "unknown"


def enforce(*checks: tuple[RateLimiter, str]) -> None:
    for limiter, key in checks:
        if not limiter.allow(key):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Bạn thao tác quá nhiều lần. Vui lòng thử lại sau ít phút.",
            )
