from datetime import date
from sqlalchemy.orm import Session

from app.db.session import SessionLocal, engine
from app.db.init_db import Base
from app.models.entities import User, UserRole
from app.core.security import hash_password


def create_test_accounts():
    """Create admin and user test accounts"""
    
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    try:
        admin_exists = db.query(User).filter(User.email == "admin@hometic.com").first()
        user_exists = db.query(User).filter(User.email == "user@hometic.com").first()
        
        if admin_exists:
            print(f"✓ Admin account already exists: {admin_exists.email}")
        else:
            admin_user = User(
                email="admin@hometic.com",
                password_hash=hash_password("123456"),
                full_name="Admin Hometic",
                phone="0123456789",
                birthday=date(1990, 1, 1),
                gender="Nam",
                role=UserRole.admin,
                provider="local",
                avatar_url=None
            )
            db.add(admin_user)
            print(f"✓ Created admin account: admin@hometic.com (password: 123456)")
        
        if user_exists:
            print(f"✓ User account already exists: {user_exists.email}")
        else:
            regular_user = User(
                email="user@hometic.com",
                password_hash=hash_password("123456"),
                full_name="User Hometic",
                phone="0987654321",
                birthday=date(2000, 6, 15),
                gender="Nữ",
                role=UserRole.customer,
                provider="local",
                avatar_url=None
            )
            db.add(regular_user)
            print(f"✓ Created user account: user@hometic.com (password: 123456)")
        
        db.commit()
        print("Tọa 2 loại tài khoản thành công")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating accounts: {str(e)}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    create_test_accounts()
