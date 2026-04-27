import React from "react";
import ProductStrip from "./ProductStrip";
import { demoCategories, demoProducts, formatVnd } from "../constants";

export default function Shop({ categories, products, filters, setFilters, addToCart, setActiveTab, setSelectedProduct }) {
  const displayProducts = Array.from({ length: 10 }, (_, index) => products[index % Math.max(products.length, 1)])
    .filter(Boolean)
    .map((product, index) => ({ ...product, viewKey: `${product.id}-${index}` }));
  
  const sections = [
    ["Bộ sưu tập mới", displayProducts.slice(0, 5)],
    ["Bán chạy nhất", displayProducts.slice(5, 10)],
  ];

  return (
    <main className="home-page">
      <section className="home-hero">
        <article className="hero-main">
          <div className="hero-copy">
            <span>Premium Home Solution</span>
            <h1>NÂNG TẦM KHÔNG GIAN SỐNG</h1>
            <p>Khám phá hệ sinh thái thiết bị gia dụng thông minh, tinh tế và hiện đại nhất cho ngôi nhà của bạn.</p>
            <button onClick={() => setActiveTab("shop")}>Mua sắm ngay</button>
          </div>
          <img src="https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?auto=format&fit=crop&w=700&q=80" alt="Robot hút bụi thông minh" />
        </article>
        <div className="hero-side">
          <article>
            <div className="hero-side-copy">
              <h3>Dòng SmartCook</h3>
              <p>Trải nghiệm nấu nướng đỉnh cao</p>
              <strong>{formatVnd(2490000)}</strong>
            </div>
            <img src="https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=520&q=80" alt="Máy hút bụi cầm tay" />
          </article>
          <article>
            <div className="hero-side-copy">
              <h3>AirPure Pro</h3>
              <p>Không khí sạch cho gia đình</p>
              <button className="ghost">Khám phá</button>
            </div>
            <img src="https://images.unsplash.com/photo-1626430451221-0f3f12289c43?auto=format&fit=crop&w=520&q=80" alt="Máy lọc không khí" />
          </article>
        </div>
      </section>

      {sections.map(([title, items]) => (
        <ProductStrip title={title} items={items} addToCart={addToCart} setActiveTab={setActiveTab} setSelectedProduct={setSelectedProduct} key={title} />
      ))}

      <section className="category-band">
        <div className="section-heading">
          <h2>Danh mục nổi bật</h2>
        </div>
        <div className="category-tiles">
          <article onClick={() => setActiveTab("category_detail")}>
            <img src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80" alt="Nhà bếp" />
            <span>Gia dụng Nhà bếp</span>
          </article>
          <article onClick={() => setActiveTab("category_detail")}>
            <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80" alt="Phòng tắm" />
            <span>Thiết bị vệ sinh</span>
          </article>
          <article onClick={() => setActiveTab("category_detail")}>
            <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" alt="Phòng ngủ" />
            <span>Tiện ích phòng ngủ</span>
          </article>
        </div>
      </section>
    </main>
  );
}
