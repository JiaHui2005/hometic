// Tự kiểm tra các hàm tính toán sản phẩm/gợi ý: chạy bằng `npm run check`
import assert from "node:assert/strict";
const P = await import("./product.js");
const G = await import("./guidance.js");
assert.equal(P.normalize("Nồi Chiên Đỏ"), "noi chien do");
assert.ok(P.matchesQuery({ name: "Nồi chiên không dầu Philips", brand: "Philips" }, "noi chien philips"));
assert.ok(!P.matchesQuery({ name: "Quạt đứng", brand: "Senko" }, "noi"));
assert.deepEqual(P.parseSpec("1.5 HP"), { n: 1.5, unit: "hp" });
assert.deepEqual(P.comparable("6L", "4.1L"), [6, 4.1]);
assert.equal(P.comparable("6L", "1500W"), null);
assert.equal(P.discountPercent({ price: 2490000, sale_price: 2190000 }), 12);
assert.equal(P.stockStatus({ stock: 5 }).tone, "low");
const cat = { id: 12, name: "Nồi chiên không dầu" };
const mk = (id, price, cap, noise) => ({ id, category_id: 12, category: cat, price, sale_price: null, stock: 20, name: "n" + id, detail: { specifications: { capacity: cap, noise } } });
const catalog = [mk(1, 2e6, "6L", "40dB"), mk(2, 3e6, "4L", "35dB"), mk(3, 4e6, "5L", "50dB")];
const h = G.productHighlights(catalog[0], catalog).map(x => x.title);
assert.ok(h.some(t => t.startsWith("Giá thấp nhất")), h);
assert.ok(h.some(t => t.startsWith("Dung tích cao nhất")), h);
assert.ok(G.productHighlights(catalog[1], catalog).some(x => x.title.startsWith("Độ ồn thấp nhất")));
const alts = G.alternatives(catalog[1], catalog).map(a => a.label);
assert.deepEqual(alts, ["Tiết kiệm hơn", "Nâng cấp"]);
const r = G.rankForNeeds(catalog, { budget: 3.5e6 });
assert.equal(r[r.length - 1].product.id, 3); // vượt ngân sách xếp cuối
const C = await import("./coupon.js");
const kitchen = { code: "KITCHEN2024", discount_type: "percent", discount_value: 10, min_order_value: 500000, max_discount_value: 200000 };
assert.equal(C.couponDiscount(kitchen, 1000000), 100000);
assert.equal(C.couponDiscount(kitchen, 10000000), 200000); // bị chặn bởi mức giảm tối đa
assert.equal(C.couponDiscount(kitchen, 400000), 0);        // chưa đạt đơn tối thiểu
assert.ok(C.couponProblem(kitchen, 400000).includes("100.000"));
assert.equal(C.couponProblem(kitchen, 600000), null);
assert.equal(C.couponDiscount({ discount_type: "fixed", discount_value: 50000, min_order_value: 0 }, 30000), 30000);
console.log("utils ok");
