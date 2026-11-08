// Gợi ý mua hàng dựa trên dữ liệu thật của catalog (giá, thông số, tồn kho) — không có mô hình AI.
// Mỗi lý do đều chỉ ra con số mà nó dựa vào để người mua tự kiểm chứng.
import { finalPrice, discountPercent, specEntries, comparable, lowerIsBetter, median, matchesQuery, normalize } from "./product.js";
import { formatVnd } from "./format.js";

const peersOf = (product, catalog) =>
  catalog.filter(p => p.id !== product.id && p.category_id === product.category_id);

// "Vì sao nên chọn" trên trang chi tiết
export function productHighlights(product, catalog) {
  const peers = peersOf(product, catalog);
  const group = [product, ...peers];
  const notes = [];
  const price = finalPrice(product);
  const catName = product.category?.name?.toLowerCase() || "cùng nhóm";

  if (group.length >= 3) {
    const prices = group.map(finalPrice);
    const med = median(prices);
    if (price === Math.min(...prices)) {
      notes.push({ title: `Giá thấp nhất trong ${group.length} ${catName}`, detail: `${formatVnd(price)}, các mẫu khác từ ${formatVnd(Math.min(...peers.map(finalPrice)))}.` });
    } else if (price < med * 0.92) {
      notes.push({ title: `Rẻ hơn mức giá phổ biến của nhóm`, detail: `Thấp hơn khoảng ${Math.round((1 - price / med) * 100)}% so với giá giữa của ${group.length} ${catName}.` });
    }
  }

  for (const spec of specEntries(product)) {
    const vals = peers
      .map(p => specEntries(p).find(s => s.key === spec.key))
      .filter(Boolean)
      .map(s => comparable(spec.value, s.value))
      .filter(Boolean);
    if (vals.length < 1) continue;
    const mine = vals[0][0];
    const others = vals.map(v => v[1]);
    const best = lowerIsBetter(spec.key) ? mine < Math.min(...others) : mine > Math.max(...others);
    if (best) {
      notes.push({
        title: `${spec.label} ${lowerIsBetter(spec.key) ? "thấp nhất" : "cao nhất"} trong nhóm`,
        detail: `${spec.value}, so với ${vals.length} mẫu ${catName} khác đang bán.`,
      });
    }
  }

  const off = discountPercent(product);
  if (off >= 15) notes.push({ title: `Đang giảm ${off}%`, detail: `Giá gốc ${formatVnd(product.price)}.` });

  return notes.slice(0, 3);
}

// Các lựa chọn thay thế: rẻ hơn / cùng tầm giá / cao cấp hơn, kèm lý do
export function alternatives(product, catalog) {
  const peers = peersOf(product, catalog);
  if (!peers.length) return [];
  const price = finalPrice(product);
  const out = [];
  const cheaper = peers.filter(p => finalPrice(p) < price).sort((a, b) => finalPrice(b) - finalPrice(a))[0];
  if (cheaper) out.push({ product: cheaper, label: "Tiết kiệm hơn", reason: `Rẻ hơn ${formatVnd(price - finalPrice(cheaper))}` });
  const similar = peers
    .filter(p => p !== cheaper && Math.abs(finalPrice(p) - price) / price <= 0.2)
    .sort((a, b) => Math.abs(finalPrice(a) - price) - Math.abs(finalPrice(b) - price))[0];
  if (similar) out.push({ product: similar, label: "Cùng tầm giá", reason: `Chênh ${formatVnd(Math.abs(finalPrice(similar) - price))}` });
  const pricier = peers.filter(p => finalPrice(p) > price && p !== similar).sort((a, b) => finalPrice(a) - finalPrice(b))[0];
  if (pricier) out.push({ product: pricier, label: "Nâng cấp", reason: `Thêm ${formatVnd(finalPrice(pricier) - price)}` });
  return out;
}

// Bộ chọn sản phẩm: lọc theo nhóm + ngân sách, chấm điểm theo nhu cầu, giải thích từng kết quả
export function rankForNeeds(catalog, { categoryIds, budget, needs = "", priority = "value" }) {
  const pool = catalog.filter(p => (!categoryIds || categoryIds.has(p.category_id)) && (p.stock ?? 1) > 0);
  const needTerms = normalize(needs).split(/\s+/).filter(t => t.length > 1);

  const scored = pool.map(p => {
    const price = finalPrice(p);
    const reasons = [];
    const tradeoffs = [];
    let score = 0;

    if (budget) {
      if (price <= budget) {
        score += 40;
        reasons.push(`Trong ngân sách, còn dư ${formatVnd(budget - price)}`);
      } else {
        score -= 40;
        tradeoffs.push(`Vượt ngân sách ${formatVnd(price - budget)}`);
      }
    }

    const matched = needTerms.filter(t => matchesQuery(p, t));
    if (needTerms.length) {
      score += matched.length * 15;
      if (matched.length) reasons.push(`Khớp nhu cầu: “${matched.join("”, “")}”`);
    }

    const off = discountPercent(p);
    if (priority === "value") score += off / 2 - price / 1e6;
    if (priority === "premium") score += price / 1e6;
    if (off >= 15) reasons.push(`Đang giảm ${off}%`);
    if (p.stock <= 10) tradeoffs.push(`Chỉ còn ${p.stock} sản phẩm`);

    return { product: p, score, reasons, tradeoffs, withinBudget: !budget || price <= budget };
  });

  return scored.sort((a, b) => b.score - a.score);
}
