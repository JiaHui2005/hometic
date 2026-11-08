// Các phép tính về sản phẩm dùng chung: giá, giảm giá, tồn kho, thông số, tìm kiếm.

export const finalPrice = (p) => p.sale_price || p.price || 0;

export const discountPercent = (p) =>
  p.sale_price && p.price && p.sale_price < p.price
    ? Math.round((1 - p.sale_price / p.price) * 100)
    : 0;

export const savings = (p) => (p.sale_price && p.price > p.sale_price ? p.price - p.sale_price : 0);

// Tồn kho → nhãn hiển thị. Không có số liệu thì không nói gì.
export function stockStatus(p) {
  if (typeof p.stock !== "number") return null;
  if (p.stock <= 0) return { tone: "out", label: "Tạm hết hàng" };
  if (p.stock <= 10) return { tone: "low", label: `Chỉ còn ${p.stock} sản phẩm` };
  return { tone: "in", label: "Còn hàng" };
}

const SPEC_LABELS = {
  capacity: "Dung tích",
  power: "Công suất",
  levels: "Số tốc độ",
  noise: "Độ ồn",
  wings: "Số cánh",
  cadr: "Lưu lượng lọc (CADR)",
  area: "Diện tích phòng",
  resolution: "Độ phân giải",
  storage: "Lưu trữ",
  methods: "Số cách mở khoá",
  battery: "Pin",
  colors: "Màu sắc",
  length: "Chiều dài",
  technology: "Công nghệ",
  gas: "Loại gas",
  modes: "Chế độ",
  max_weight: "Tải trọng tối đa",
  bluetooth: "Bluetooth",
  water_tank: "Bình chứa nước",
  color_temp: "Nhiệt độ màu",
  accessories: "Phụ kiện",
  suction: "Lực hút",
  runtime: "Thời gian sử dụng",
  size: "Kích thước màn hình",
  channels: "Kênh âm thanh",
};

export const specLabel = (key) =>
  SPEC_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");

// Thông số càng THẤP càng tốt (để so sánh có hướng)
const LOWER_IS_BETTER = new Set(["noise"]);
export const lowerIsBetter = (key) => LOWER_IS_BETTER.has(key);

export function specEntries(p) {
  const s = p?.detail?.specifications;
  if (s && typeof s === "object" && !Array.isArray(s)) {
    return Object.entries(s).map(([key, value]) => ({ key, label: specLabel(key), value: String(value) }));
  }
  // dữ liệu demo cũ: details = [{label, value}]
  return (p?.details || []).map(d => ({ key: d.label, label: d.label, value: String(d.value) }));
}

// "6L" → {n: 6, unit: "l"}; "1.5 HP" → {n: 1.5, unit: "hp"}; "16 triệu" → null-ish unit
export function parseSpec(value) {
  const m = String(value).replace(",", ".").match(/(\d+(?:\.\d+)?)\s*([a-zA-Zµ³0-9/]*)/);
  if (!m) return null;
  return { n: parseFloat(m[1]), unit: m[2].toLowerCase() };
}

// Hai thông số chỉ so sánh được khi cùng đơn vị
export function comparable(a, b) {
  const x = parseSpec(a), y = parseSpec(b);
  return x && y && x.unit === y.unit ? [x.n, y.n] : null;
}

// Tóm tắt 2 thông số đầu để đặt dưới tên sản phẩm: "6L, 1500W"
export const keySpecs = (p, n = 2) => specEntries(p).slice(0, n).map(s => s.value).join(", ");

// Bỏ dấu tiếng Việt để tìm "noi chien" vẫn ra "Nồi chiên"
export const normalize = (s = "") =>
  s.toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").trim();

export function matchesQuery(p, q) {
  const terms = normalize(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const hay = normalize([p.name, p.brand, p.category?.name, p.detail?.description, ...specEntries(p).map(s => s.value)].join(" "));
  return terms.every(t => hay.includes(t));
}

// Tập con các danh mục (gồm chính nó) — danh mục có 3 cấp cha/con/cháu
export function categoryTree(categories, rootId) {
  const ids = new Set([rootId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of categories) {
      if (ids.has(c.parent_id) && !ids.has(c.id)) { ids.add(c.id); grew = true; }
    }
  }
  return ids;
}

export const median = (nums) => {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};
