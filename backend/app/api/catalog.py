from typing import List
from fastapi import HTTPException, status
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from app.api.deps import require_admin, get_current_user_optional
from app.db.session import get_db
from sqlalchemy import or_
from app.schemas.dto import CategoryBase, CategoryOut, ProductCreate, ProductOut, ProductUpdate
from app.models.entities import Category, Product, ProductDetail, User

router = APIRouter(tags=["catalog"])

# --- Categories ---

@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả danh mục"""
    
    return db.query(Category).all()

@router.get("/categories/{id}", response_model=CategoryOut)
def get_category(id: int, db: Session = Depends(get_db)):
    """Lấy thông tin chi tiết một danh mục theo ID"""
    category = db.query(Category).filter(Category.id == id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy danh mục này"
        )
    return category

@router.post("/admin/categories", response_model=CategoryOut)
def create_category(payload: CategoryBase, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Tạo danh mục mới"""
    existing_category = db.query(Category).filter(Category.slug == payload.slug).first()
    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Slug '{payload.slug}' đã tồn tại. Vui lòng chọn slug khác."
        )

    if payload.parent_id:
        parent = db.query(Category).filter(Category.id == payload.parent_id).first()
        if not parent:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Danh mục cha với ID {payload.parent_id} không tồn tại."
            )

    new_category = Category(
        name=payload.name,
        slug=payload.slug,
        description=payload.description,
        image_url=payload.image_url,
        parent_id=payload.parent_id
    )

    try:
        db.add(new_category)
        db.commit()
        db.refresh(new_category)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi trong quá trình lưu danh mục vào hệ thống."
        )

    return new_category

@router.put("/admin/categories/{category_id}", response_model=CategoryOut)
def update_category(category_id: int, payload: CategoryBase, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Cập nhật danh mục"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Danh mục không tồn tại"
        )

    if payload.slug != category.slug:
        existing_slug = db.query(Category).filter(Category.slug == payload.slug).first()
        if existing_slug:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Slug '{payload.slug}' đã được sử dụng bởi danh mục khác"
            )

    if payload.parent_id:
        if payload.parent_id == category_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Một danh mục không thể làm cha của chính nó"
            )
        
        parent_exists = db.query(Category).filter(Category.id == payload.parent_id).first()
        if not parent_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Danh mục cha không tồn tại"
            )

    update_data = payload.model_dump()
    for key, value in update_data.items():
        setattr(category, key, value)

    try:
        db.commit()
        db.refresh(category)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi trong quá trình cập nhật dữ liệu"
        )

    return category

@router.delete("/admin/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Xoá danh mục"""
    category = db.query(Category).filter(Category.id == category_id).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Danh mục không tồn tại"
        )

    sub_categories = db.query(Category).filter(Category.parent_id == category_id).first()
    if sub_categories:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể ẩn danh mục này vì vẫn còn các danh mục con bên trong."
        )

    active_product = db.query(Product).filter(
        Product.category_id == category_id, 
        Product.is_active == True
    ).first()
    
    if active_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể ẩn danh mục vì vẫn còn sản phẩm đang kinh doanh thuộc danh mục này."
        )
    
    try:
        if hasattr(category, 'is_active'):
            category.is_active = False
            db.commit()
        else:
            raise HTTPException(
                status_code=500, 
                detail="Hệ thống chưa hỗ trợ cột is_active cho danh mục. Hãy cập nhật Database."
            )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Lỗi khi cập nhật trạng thái danh mục.")

    return None

# --- Products ---

@router.get("/products", response_model=List[ProductOut])
def list_products(
    q: str | None = None,
    category_id: int | None = None,
    min_price: float | None = Query(default=None, ge=0),
    max_price: float | None = Query(default=None, ge=0),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional)
):
    """Lấy danh sách sản phẩm (Lọc is_active theo vai trò người dùng)"""
    
    query = db.query(Product).options(
        joinedload(Product.category),
        joinedload(Product.detail) 
    )

    if not current_user or current_user.role != 'admin':
        query = query.filter(Product.is_active == True)

    if q:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{q}%"),
                Product.brand.ilike(f"%{q}%")
            )
        )

    if category_id:
        query = query.filter(Product.category_id == category_id)

    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    products = query.order_by(Product.created_at.desc()).all()

    return products

@router.get("/products/{product_id}", response_model=ProductOut)
def get_product(
    product_id: int, 
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional) # Thêm cái này
):
    """Lấy chi tiết một sản phẩm"""
    product = (
        db.query(Product)
        .options(
            joinedload(Product.category),
            joinedload(Product.detail)
        )
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")

    if not product.is_active:
        if not current_user or current_user.role != 'admin':
            raise HTTPException(status_code=404, detail="Sản phẩm này đã ngừng kinh doanh")

    return product

@router.get("/products/category/{category_slug}", response_model=List[ProductOut])
def get_products_by_category(
    category_slug: str,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional)
):
    """Lấy danh sách sản phẩm theo danh mục (bao gồm cả danh mục con)"""
    
    category = db.query(Category).filter(Category.slug == category_slug).first()
    if not category:
        raise HTTPException(status_code=404, detail="Danh mục không tồn tại")

    category_ids = [category.id]
    
    sub_categories = db.query(Category.id).filter(Category.parent_id == category.id).all()
    sub_ids = [c.id for c in sub_categories]
    category_ids.extend(sub_ids)
    
    if sub_ids:
        grandchild_categories = db.query(Category.id).filter(Category.parent_id.in_(sub_ids)).all()
        category_ids.extend([c.id for c in grandchild_categories])

    query = db.query(Product).options(
        joinedload(Product.category),
        joinedload(Product.detail)
    ).filter(Product.category_id.in_(category_ids))

    if not current_user or current_user.role != 'admin':
        query = query.filter(Product.is_active == True)

    products = query.order_by(Product.created_at.desc()).all()
    
    return products

@router.post("/admin/products", response_model=ProductOut)
def create_product(payload: ProductCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Tạo sản phẩm mới kèm chi tiết"""
    category = db.query(Category).filter(Category.id == payload.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Danh mục (category_id) không tồn tại"
        )

    existing_slug = db.query(Product).filter(Product.slug == payload.slug).first()
    if existing_slug:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slug sản phẩm đã tồn tại, vui lòng chọn slug khác"
        )

    product_data = payload.model_dump(exclude={'detail'})
    detail_data = payload.detail.model_dump() if payload.detail else {}

    new_product = Product(**product_data)
    
    try:
        db.add(new_product)
        db.flush()  

        if detail_data:
            new_detail = ProductDetail(
                product_id=new_product.id,
                **detail_data
            )
            db.add(new_detail)
        
        db.commit()
        db.refresh(new_product)
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi hệ thống khi tạo sản phẩm: " + str(e)
        )

    return new_product

@router.put("/admin/products/{product_id}", response_model=ProductOut)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Cập nhật thông tin sản phẩm"""
    product = (
        db.query(Product)
        .options(joinedload(Product.detail))
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy sản phẩm"
        )

    update_data = payload.model_dump(exclude_unset=True)
    detail_data = update_data.pop('detail', None)

    for key, value in update_data.items():
        setattr(product, key, value)

    if detail_data:
        if product.detail:
            for key, value in detail_data.items():
                setattr(product.detail, key, value)
        else:
            new_detail = ProductDetail(product_id=product.id, **detail_data)
            db.add(new_detail)

    try:
        db.commit()
        db.refresh(product)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Lỗi khi cập nhật sản phẩm: {str(e)}"
        )

    return product

@router.delete("/admin/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    """[Admin] Xoá sản phẩm"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sản phẩm không tồn tại hoặc đã bị xóa trước đó"
        )
    
    if not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sản phẩm này đã được ẩn khỏi hệ thống từ trước"
        )

    product.is_active = False
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lỗi hệ thống khi cập nhật trạng thái sản phẩm"
        )

    return None
