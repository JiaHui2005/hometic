import logging
import time

from fastapi import Request

logger = logging.getLogger("hometic.request")

SLOW_REQUEST_MS = 500


def setup_logging(level: str) -> None:
    logging.basicConfig(
        level=level.upper(),
        format="%(asctime)s %(levelname)-7s %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )


async def log_requests(request: Request, call_next):
    """Mỗi request một dòng: method, path, status, thời gian xử lý. Request chậm ghi WARNING."""
    start = time.perf_counter()
    try:
        response = await call_next(request)
    except Exception:
        logger.exception("%s %s -> 500 (lỗi không bắt được)", request.method, request.url.path)
        raise
    ms = (time.perf_counter() - start) * 1000
    level = logging.WARNING if ms >= SLOW_REQUEST_MS else logging.INFO
    logger.log(level, "%s %s -> %d (%.1f ms)", request.method, request.url.path, response.status_code, ms)
    response.headers["X-Process-Time-Ms"] = f"{ms:.1f}"
    return response
