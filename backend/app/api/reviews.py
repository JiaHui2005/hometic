from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.entities import User
from app.schemas.dto import ReviewCreate, ReviewOut
from app.models.entities import Product, Review
from datetime import datetime
from sqlalchemy.exc import IntegrityError

router = APIRouter(tags=["reviews"])

@router.get("/products/{product_id}/reviews", response_model=list[ReviewOut])
def list_product_reviews(product_id: int, db: Session = Depends(get_db)):
    """Lấy danh sách đánh giá của một sản phẩm"""
    product_exists = db.query(Product).filter(Product.id == product_id).first()
    if not product_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sản phẩm không tồn tại"
        )

    reviews = (
        db.query(Review)
        .options(joinedload(Review.user)) 
        .filter(Review.product_id == product_id)
        .order_by(Review.created_at.desc()) 
        .all()
    )

    return reviews

@router.post("/reviews", response_model=ReviewOut)
def create_review(payload: ReviewCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Tạo đánh giá mới cho sản phẩm"""
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sản phẩm không tồn tại để đánh giá"
        )

    existing_review = db.query(Review).filter(
        Review.product_id == payload.product_id,
        Review.user_id == current_user.id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bạn đã đánh giá sản phẩm này rồi"
        )

    new_review = Review(
        user_id=current_user.id,
        product_id=payload.product_id,
        rating=payload.rating,
        comment=payload.comment,
        created_at=datetime.now()
    )

    db.add(new_review)
    try:
        db.commit()
    except IntegrityError:
        # UNIQUE(user_id, product_id) chặn đánh giá trùng khi gửi 2 lần cùng lúc
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bạn đã đánh giá sản phẩm này rồi")
    db.refresh(new_review)

    return new_review
