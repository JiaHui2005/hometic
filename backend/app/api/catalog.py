from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import require_admin
from app.db.session import get_db
from app.schemas.dto import CategoryBase, CategoryOut, ProductCreate, ProductOut, ProductUpdate

router = APIRouter(tags=["catalog"])

# --- Categories ---

@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả danh mục"""
    pass

@router.post("/admin/categories", response_model=CategoryOut)
def create_category(payload: CategoryBase, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Tạo danh mục mới"""
    pass

@router.put("/admin/categories/{category_id}", response_model=CategoryOut)
def update_category(category_id: int, payload: CategoryBase, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Cập nhật danh mục"""
    pass

@router.delete("/admin/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Xoá danh mục"""
    pass

# --- Products ---

@router.get("/products", response_model=list[ProductOut])
def list_products(
    q: str | None = None,
    category_id: int | None = None,
    min_price: float | None = Query(default=None, ge=0),
    max_price: float | None = Query(default=None, ge=0),
    db: Session = Depends(get_db),
):
    """Lấy danh sách sản phẩm (có lọc)"""
    pass

@router.get("/products/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Lấy chi tiết một sản phẩm"""
    pass

@router.post("/admin/products", response_model=ProductOut)
def create_product(payload: ProductCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Tạo sản phẩm mới kèm chi tiết"""
    pass

@router.put("/admin/products/{product_id}", response_model=ProductOut)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Cập nhật thông tin sản phẩm"""
    pass

@router.delete("/admin/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Xoá sản phẩm"""
    pass
