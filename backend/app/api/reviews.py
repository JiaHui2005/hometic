from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.entities import User
from app.schemas.dto import ReviewCreate, ReviewOut
from app.models.entities import Product, Review
from datetime import datetime

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
    db.commit()
    db.refresh(new_review)

    return new_review

@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(review_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Xoá đánh giá (chỉ người tạo hoặc admin mới có quyền)"""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy đánh giá này"
        )
    
    if review.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xoá đánh giá của người khác"
        )
    
    db.delete(review)
    db.commit()
    
    return None