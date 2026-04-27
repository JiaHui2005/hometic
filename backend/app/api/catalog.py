from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.api.deps import require_admin
from app.db.session import get_db
from app.models.entities import Category, Product
from app.schemas.dto import CategoryBase, CategoryOut, ProductCreate, ProductOut, ProductUpdate


router = APIRouter(tags=["catalog"])


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.name).all()


@router.post("/admin/categories", response_model=CategoryOut)
def create_category(payload: CategoryBase, db: Session = Depends(get_db), _=Depends(require_admin)):
    category = Category(**payload.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.get("/products", response_model=list[ProductOut])
def list_products(
    q: str | None = None,
    category_id: int | None = None,
    min_price: float | None = Query(default=None, ge=0),
    max_price: float | None = Query(default=None, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(Product).options(joinedload(Product.category))
    if q:
        query = query.filter(Product.name.ilike(f"%{q}%"))
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    return query.order_by(Product.created_at.desc()).all()


@router.get("/products/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).options(joinedload(Product.category)).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return product


@router.post("/admin/products", response_model=ProductOut)
def create_product(payload: ProductCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/admin/products/{product_id}", response_model=ProductOut)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/admin/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    db.delete(product)
    db.commit()
    return {"message": "Đã xoá sản phẩm"}
