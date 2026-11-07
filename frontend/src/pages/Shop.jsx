import React from "react";
import { ArrowUpRight, Truck, ShieldCheck, Wrench } from "lucide-react";
import { ProductStrip } from "../components/product";
import { formatVnd } from "../utils/format";
import "./Shop.css";

const CATEGORY_IMAGES = [
  "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
];

const FALLBACK_CATEGORIES = [
  { id: "kitchen", name: "Gia dụng Nhà bếp" },
  { id: "bath", name: "Thiết bị vệ sinh" },
  { id: "bedroom", name: "Tiện ích phòng ngủ" },
];

const PROMISES = [
  [Truck, "Giao trong 2–4 giờ ở nội thành TP.HCM và Hà Nội"],
  [Wrench, "Lắp đặt miễn phí cho thiết bị lớn"],
  [ShieldCheck, "Đổi mới trong 7 ngày nếu lỗi kỹ thuật"],
];

export default function Shop({ categories, products, setFilters, addToCart, setActiveTab, setSelectedProduct }) {
  const displayProducts = products
    .slice(0, 10)
    .map((product, index) => ({ ...product, viewKey: `${product.id}-${index}` }));

  const sections = [
    ["Hàng mới về", displayProducts.slice(0, 5)],
    ["Bán chạy", displayProducts.slice(5, 10)],
  ];

  const parentCategories = (categories || []).filter(c => c.parent_id === null || c.parent_id === undefined);
  const featuredCategories = (parentCategories.length ? parentCategories : FALLBACK_CATEGORIES).slice(0, 3);

  const openCategory = (cat) => {
    if (cat.slug && setFilters) setFilters(prev => ({ ...prev, category_slug: cat.slug, q: "" }));
    setActiveTab("category_detail");
  };

  return (
    <div className="home">
      {/* HERO */}
      <section className="container hero">
        <div className="hero__copy">
          <h1 className="hero__title">Siêu tiệc công nghệ cho cả gia đình</h1>
          <p className="hero__lead">
            Săn ngay các thiết bị thông minh với ưu đãi chưa từng có cùng anh PewPew.
          </p>
          <div className="hero__cta">
            <button className="btn btn-primary btn-lg" onClick={() => setActiveTab("search")}>
              Mua sắm ngay
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => document.getElementById("home-categories")?.scrollIntoView({ behavior: "smooth" })}>
              Xem danh mục
            </button>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__arch">
            <img src="/pewpew_banner_1.png" alt="PewPew giới thiệu thiết bị gia dụng Hometic" />
          </div>
        </div>
      </section>

      {/* PROMOS */}
      <section className="container promos">
        <article className="promo">
          <img src="/pewpew_banner_3.png" alt="" />
          <div>
            <h3>Gội là mê, mượt là ghiền</h3>
            <p>Tóc đẹp chuẩn salon cùng PewPew</p>
            <strong className="price">{formatVnd(99000)}</strong>
          </div>
        </article>

        <a className="promo promo--live" href="https://www.tiktok.com/@realpewpew" target="_blank" rel="noopener noreferrer">
          <img src="/pewpew_banner_2.png" alt="" />
          <div>
            <span className="live-dot">Đang phát trực tiếp</span>
            <h3>Mega Live cùng PewPew</h3>
            <p>Săn deal độc quyền trên TikTok</p>
          </div>
          <ArrowUpRight className="promo__arrow" size={20} />
        </a>

        <ul className="promises">
          {PROMISES.map(([Icon, text]) => (
            <li key={text}>
              <Icon size={17} />
              {text}
            </li>
          ))}
        </ul>
      </section>

      {/* PRODUCT STRIPS */}
      <div className="container">
        {sections.map(([title, items]) => (
          <ProductStrip
            key={title}
            title={title}
            items={items}
            addToCart={addToCart}
            setActiveTab={setActiveTab}
            setSelectedProduct={setSelectedProduct}
          />
        ))}
      </div>

      {/* CATEGORIES */}
      <section id="home-categories" className="container section">
        <div className="section-head">
          <h2>Mua theo phòng</h2>
        </div>
        <div className="rooms">
          {featuredCategories.map((cat, i) => (
            <button key={cat.id} className="room" onClick={() => openCategory(cat)}>
              <span className="room__arch">
                <img src={CATEGORY_IMAGES[i % CATEGORY_IMAGES.length]} alt="" loading="lazy" />
              </span>
              <span className="room__label">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
