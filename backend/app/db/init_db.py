from app.core.security import hash_password
from app.db.session import Base, SessionLocal, engine
from app.models.entities import Category, Product, User, UserRole


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.email == "admin@hometic.vn").first():
            db.add(
                User(
                    full_name="Admin Hometic",
                    email="admin@hometic.vn",
                    hashed_password=hash_password("admin123"),
                    role=UserRole.admin,
                )
            )
        if not db.query(User).filter(User.email == "customer@hometic.vn").first():
            db.add(
                User(
                    full_name="Khách hàng Hometic",
                    email="customer@hometic.vn",
                    hashed_password=hash_password("customer123"),
                    role=UserRole.customer,
                )
            )
        db.commit()

        if db.query(Category).count() == 0:
            categories = [
                Category(name="Nhà bếp thông minh", slug="nha-bep-thong-minh", description="Thiết bị bếp kết nối và tiết kiệm thời gian."),
                Category(name="Chăm sóc nhà cửa", slug="cham-soc-nha-cua", description="Robot, máy hút bụi, lọc không khí."),
                Category(name="Điện gia dụng", slug="dien-gia-dung", description="Sản phẩm gia dụng thiết yếu cho gia đình."),
            ]
            db.add_all(categories)
            db.commit()
            for category in categories:
                db.refresh(category)
            products = [
                Product(
                    category_id=categories[0].id,
                    name="Nồi chiên không dầu SmartCook 6L",
                    slug="noi-chien-khong-dau-smartcook-6l",
                    description="Điều khiển qua app, 12 chế độ nấu, lòng nồi chống dính.",
                    price=2490000,
                    sale_price=2190000,
                    stock=40,
                    image_url="https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80",
                    smart_features="Điều khiển Wi-Fi, hẹn giờ, nhắc vệ sinh.",
                ),
                Product(
                    category_id=categories[1].id,
                    name="Robot hút bụi Hometic CleanBot X2",
                    slug="robot-hut-bui-hometic-cleanbot-x2",
                    description="Lập bản đồ laser, lau hút 2 trong 1, tự quay về dock sạc.",
                    price=7990000,
                    sale_price=6990000,
                    stock=25,
                    image_url="https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?auto=format&fit=crop&w=900&q=80",
                    smart_features="LiDAR, vùng cấm ảo, điều khiển giọng nói.",
                ),
                Product(
                    category_id=categories[2].id,
                    name="Máy lọc không khí AirJoy Pro",
                    slug="may-loc-khong-khi-airjoy-pro",
                    description="Lọc HEPA H13, cảm biến bụi mịn PM2.5, vận hành êm.",
                    price=5290000,
                    sale_price=4890000,
                    stock=30,
                    image_url="https://images.unsplash.com/photo-1626430451221-0f3f12289c43?auto=format&fit=crop&w=900&q=80",
                    smart_features="Theo dõi chất lượng không khí, tự động tăng giảm công suất.",
                ),
            ]
            db.add_all(products)
            db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
