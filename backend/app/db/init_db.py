from app.db.session import Base, engine
from app.models import entities  # noqa: F401  (đăng ký các bảng vào Base.metadata)


def init_db() -> None:
    """Chỉ tạo bảng còn thiếu. Dữ liệu mẫu nạp từ database/*.sql, tài khoản thử nghiệm từ app.utils.create_accounts.
    create_all không sửa bảng đã có: thay đổi schema đi qua database/migrations/."""
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
