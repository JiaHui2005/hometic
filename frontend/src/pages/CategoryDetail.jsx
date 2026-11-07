import React, { useState, useEffect } from "react";
import { SlidersHorizontal, X, PackageOpen } from "lucide-react";
import { catalogService } from "../services/api";
import alertService from "../services/alertService";
import { ProductCard, ProductFilters } from "../components/product";
import useProductFilters from "../hooks/useProductFilters";

export default function CategoryDetail({ categories, filters, addToCart, setActiveTab, setSelectedProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("Cửa hàng");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filterState = useProductFilters(products);
  const { filteredProducts, resetFilters } = filterState;

  useEffect(() => {
    if (!filters?.category_slug) {
      setProducts([]);
      setCategoryName("Cửa hàng");
      return;
    }

    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const data = await catalogService.getProductsByCategory(filters.category_slug);
        setProducts(data || []);

        const targetCategory = categories?.find(c => c.slug === filters.category_slug);
        if (targetCategory) {
          setCategoryName(targetCategory.name);
        } else if (data && data.length > 0) {
          const currentCat = data.find(p => p.category.slug === filters.category_slug);
          if (currentCat) {
            setCategoryName(currentCat.category.name);
          } else {
            setCategoryName(filters.category_slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
          }
        } else {
          setCategoryName("Danh mục sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu danh mục:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [filters?.category_slug, categories]);

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const catName = product.category?.name || categoryName;
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setActiveTab("product_detail");
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    setActiveTab("cart");
    alertService.success(`Đã thêm thành công "${product.name}" vào giỏ hàng!`);
  };

  const categoryEntries = Object.entries(groupedProducts);

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <button onClick={() => setActiveTab("shop")}>Trang chủ</button>
        <span>/</span>
        <span>{categoryName}</span>
      </nav>

      <header style={{ marginBottom: 32 }}>
        <h1 className="page-title">{categoryName}</h1>
        {!loading && <p className="page-lead">{filteredProducts.length} sản phẩm</p>}
      </header>

      <div className="catalog">
        <aside className="catalog__aside">
          <ProductFilters {...filterState} />
        </aside>

        <div>
          <div className="catalog__toolbar">
            <button className="btn btn-outline btn-sm catalog__filter-btn" onClick={() => setShowMobileFilters(true)}>
              <SlidersHorizontal size={15} />
              Bộ lọc
            </button>
          </div>

          {loading ? (
            <div className="loading-block">
              <div className="spinner" />
              <p>Đang tải sản phẩm…</p>
            </div>
          ) : categoryEntries.length > 0 ? (
            categoryEntries.map(([catName, catProducts]) => (
              <section key={catName} className="catalog__group">
                {categoryEntries.length > 1 && (
                  <h2 className="catalog__group-title">
                    {catName}
                    <small>{catProducts.length}</small>
                  </h2>
                )}
                <div className="product-grid">
                  {catProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      meta={product.brand || "Hometic"}
                      onOpen={handleProductClick}
                      onBuy={handleBuyNow}
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="empty-state">
              <span className="empty-icon"><PackageOpen size={28} /></span>
              <h3>Không có sản phẩm phù hợp</h3>
              <p>Thử nới khoảng giá, bỏ bớt thương hiệu, hoặc xem danh mục khác.</p>
              <button className="btn btn-secondary" onClick={resetFilters}>Xoá bộ lọc</button>
            </div>
          )}
        </div>
      </div>

      {/* Bộ lọc dạng bottom-sheet trên mobile */}
      <div className={`sheet-backdrop${showMobileFilters ? " is-open" : ""}`} onClick={() => setShowMobileFilters(false)} />
      <div className={`sheet${showMobileFilters ? " is-open" : ""}`} role="dialog" aria-label="Bộ lọc">
        <div className="sheet__handle" />
        <div className="sheet__head">
          <h2>Bộ lọc</h2>
          <button className="icon-btn" onClick={() => setShowMobileFilters(false)} aria-label="Đóng bộ lọc"><X size={20} /></button>
        </div>
        <ProductFilters {...filterState} onDone={() => setShowMobileFilters(false)} />
      </div>
    </div>
  );
}
