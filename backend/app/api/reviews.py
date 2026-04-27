from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.entities import User
from app.schemas.dto import ReviewCreate, ReviewOut

router = APIRouter(tags=["reviews"])

@router.get("/products/{product_id}/reviews", response_model=list[ReviewOut])
def list_product_reviews(product_id: int, db: Session = Depends(get_db)):
    """Lấy danh sách đánh giá của một sản phẩm"""
    pass

@router.post("/reviews", response_model=ReviewOut)
def create_review(payload: ReviewCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Tạo đánh giá mới cho sản phẩm"""
    pass

@router.delete("/reviews/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Xoá đánh giá (chỉ người tạo hoặc admin mới có quyền)"""
    pass
