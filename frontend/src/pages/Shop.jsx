import React, { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { ProductStrip, ProductCard } from "../components/product";
import { getImgUrl } from "../services/api";
import { discountPercent, finalPrice, categoryTree } from "../utils/product";
import "./Shop.css";

const BUDGETS = [
  ["Dưới 1 triệu", 1000000],
  ["Dưới 3 triệu", 3000000],
  ["Dưới 5 triệu", 5000000],
  ["Dưới 10 triệu", 10000000],
  ["Không giới hạn", 0],
];

const ASSURANCES = [
  ["guide", "Cách đặt hàng", "Chọn sản phẩm, điền địa chỉ, thanh toán khi nhận hàng."],
  ["delivery", "Giao hàng và lắp đặt", "Nội thành TP.HCM và Hà Nội giao trong 2–4 giờ, tỉnh khác 2–4 ngày."],
  ["returns", "Đổi trả", "Đổi mới trong 7 ngày nếu lỗi kỹ thuật, hoàn tiền nếu giao sai mẫu."],
  ["warranty", "Bảo hành", "Bảo hành chính hãng, hỗ trợ kỹ thuật 8:00–22:00 mỗi ngày."],
];

export default function Shop() {
  const { catalog, categories, catalogLoading, openCategory, openFinder, openStaticPage, search } = useStore();
  const [finderGroup, setFinderGroup] = useState("");
  const [finderBudget, setFinderBudget] = useState(3000000);

  // Nhóm sản phẩm cụ thể (danh mục lá) đang có hàng, ảnh đại diện lấy từ sản phẩm thật
  const groups = useMemo(() => {
    const byCat = new Map();
    catalog.forEach(p => {
      if (!byCat.has(p.category_id)) byCat.set(p.category_id, []);
      byCat.get(p.category_id).push(p);
    });
    return categories
      .filter(c => byCat.has(c.id))
      .map(c => ({ cat: c, items: byCat.get(c.id) }))
      .sort((a, b) => b.items.length - a.items.length);
  }, [catalog, categories]);

  const brands = useMemo(() => {
    const counts = new Map();
    catalog.forEach(p => p.brand && counts.set(p.brand, (counts.get(p.brand) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([b]) => b);
  }, [catalog]);

  const deals = useMemo(
    () => [...catalog].filter(p => discountPercent(p) >= 10).sort((a, b) => discountPercent(b) - discountPercent(a)).slice(0, 10),
    [catalog]
  );

  const newest = useMemo(() => [...catalog].sort((a, b) => b.id - a.id).slice(0, 8), [catalog]);

  // "Bếp nhỏ": sản phẩm thuộc nhánh Nhà bếp, ưu tiên giá mềm
  const kitchenRoot = categories.find(c => c.slug === "nha-bep");
  const kitchen = useMemo(() => {
    if (!kitchenRoot) return [];
    const ids = categoryTree(categories, kitchenRoot.id);
    return catalog.filter(p => ids.has(p.category_id)).sort((a, b) => finalPrice(a) - finalPrice(b)).slice(0, 3);
  }, [catalog, categories, kitchenRoot]);

  const topBrands = brands.slice(0, 4);

  return (
    <div className="home">
      {/* MỞ ĐẦU: tiêu đề + cam kết dịch vụ | chiến dịch đang chạy */}
      <section className="container home-hero">
        <div className="home-hero__copy">
          <h1 className="home-hero__title">Đồ gia dụng chọn kỹ, giao ngay trong ngày</h1>
          <p className="home-hero__lead">
            {catalog.length ? `${catalog.length} sản phẩm` : "Hàng trăm sản phẩm"} cho bếp, phòng khách và nhà thông minh
            {topBrands.length ? `, từ ${topBrands.join(", ")} và nhiều thương hiệu khác.` : "."}
          </p>
          <div className="home-hero__cta">
            <button className="btn btn-primary btn-lg" onClick={() => document.getElementById("home-deals")?.scrollIntoView({ behavior: "smooth" })}>
              Xem hàng đang giảm
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => openFinder()}>
              Lọc theo nhu cầu
            </button>
          </div>
          <dl className="home-hero__facts">
            <div><dt>2–4 giờ</dt><dd>giao nội thành TP.HCM, Hà Nội</dd></div>
            <div><dt>Miễn phí</dt><dd>lắp đặt thiết bị lớn</dd></div>
            <div><dt>7 ngày</dt><dd>đổi mới nếu lỗi kỹ thuật</dd></div>
          </dl>
        </div>

        <a className="home-live" href="https://www.tiktok.com/@realpewpew" target="_blank" rel="noopener noreferrer">
          <img src="/pewpew_banner_1.png" alt="Phiên livestream bán thiết bị gia dụng cùng PewPew" />
          <div className="home-live__caption">
            <span className="home-live__status">Đang phát trực tiếp</span>
            <strong>Mega Live cùng PewPew</strong>
            <span>Mã giảm giá trong phiên live dùng được ngay tại giỏ hàng Hometic.</span>
            <span className="home-live__link">Mở trên TikTok <ArrowUpRight size={15} aria-hidden="true" /></span>
          </div>
        </a>
      </section>

      {/* MUA THEO NHÓM */}
      <section className="container section home-groups" aria-labelledby="home-groups-title">
        <div className="section-head">
          <h2 id="home-groups-title">Mua theo nhóm sản phẩm</h2>
        </div>
        {catalogLoading ? (
          <div className="group-list">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 72 }} />)}</div>
        ) : (
          <ul className="group-list">
            {groups.slice(0, 12).map(({ cat, items }) => (
              <li key={cat.id}>
                <button className="group-tile" onClick={() => openCategory(cat.slug)}>
                  <img src={getImgUrl(items[0].image_url || items[0].image)} alt="" loading="lazy" />
                  <span className="group-tile__name">{cat.name}</span>
                  <span className="group-tile__count">{items.length} sản phẩm</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ĐANG GIẢM */}
      <div className="container" id="home-deals">
        <ProductStrip
          title="Đang giảm nhiều"
          lead="Xếp theo mức giảm so với giá gốc"
          items={deals}
          layout="rail"
          action={<button className="section-head__link" onClick={() => search("")}>Xem tất cả sản phẩm</button>}
        />
      </div>

      {/* BIÊN TẬP: bếp nhỏ */}
      {kitchen.length > 0 && (
        <section className="home-edit" aria-labelledby="home-edit-title">
          <div className="container home-edit__inner">
            <div className="home-edit__copy">
              <h2 id="home-edit-title">Bếp nhỏ vẫn nấu đủ món</h2>
              <p>
                Với căn bếp chung cư, nồi chiên 4–6 lít đủ cho gia đình 2–4 người, còn lò vi sóng 20–23 lít
                vừa một đĩa lớn mà không chiếm hết mặt bếp. Đây là những mẫu đang có giá mềm nhất.
              </p>
              <button className="btn btn-outline" onClick={() => openFinder({ categoryId: kitchenRoot?.id, budget: 3000000 })}>
                Lọc đồ bếp dưới 3 triệu
              </button>
            </div>
            <div className="home-edit__products">
              {kitchen.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* LỌC THEO NHU CẦU */}
      <section className="home-finder" aria-labelledby="home-finder-title">
        <div className="container home-finder__inner">
          <div>
            <h2 id="home-finder-title">Chưa biết chọn mẫu nào?</h2>
            <p>Chọn nhóm và ngân sách, Hometic xếp các mẫu phù hợp kèm lý do cụ thể cho từng mẫu.</p>
          </div>
          <form
            className="home-finder__form"
            onSubmit={(e) => {
              e.preventDefault();
              openFinder({ categoryId: finderGroup ? Number(finderGroup) : null, budget: finderBudget });
            }}
          >
            <div className="field">
              <label htmlFor="hf-group">Nhóm sản phẩm</label>
              <select id="hf-group" className="select" value={finderGroup} onChange={(e) => setFinderGroup(e.target.value)}>
                <option value="">Tất cả</option>
                {groups.map(({ cat }) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <fieldset className="field home-finder__budget">
              <legend className="field-label">Ngân sách</legend>
              <div className="home-finder__chips">
                {BUDGETS.map(([label, v]) => (
                  <button
                    type="button"
                    key={label}
                    className="chip"
                    aria-pressed={finderBudget === v}
                    onClick={() => setFinderBudget(v)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
            <button type="submit" className="btn btn-primary home-finder__submit">Xem gợi ý</button>
          </form>
        </div>
      </section>

      {/* MỚI VỀ */}
      <div className="container">
        <ProductStrip title="Hàng mới về" items={newest} />
      </div>

      {/* THƯƠNG HIỆU + MUA YÊN TÂM */}
      <section className="container section home-trust">
        <div className="home-brands">
          <h2>Thương hiệu đang bán</h2>
          <ul>
            {brands.map(b => (
              <li key={b}><button onClick={() => search(b)}>{b}</button></li>
            ))}
          </ul>
        </div>
        <div className="home-assure">
          <h2>Mua yên tâm</h2>
          <dl>
            {ASSURANCES.map(([key, title, text]) => (
              <div key={key}>
                <dt><button onClick={() => openStaticPage(key)}>{title}</button></dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
