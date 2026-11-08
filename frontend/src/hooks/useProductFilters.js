import { useMemo, useState } from "react";
import { finalPrice, discountPercent } from "../utils/product";

const DEFAULT_RANGE = { min: "", max: "" };

export const SORTS = [
  ["relevant", "Phù hợp nhất"],
  ["price-asc", "Giá thấp đến cao"],
  ["price-desc", "Giá cao đến thấp"],
  ["discount", "Giảm nhiều nhất"],
  ["newest", "Mới về"],
];

const SORTERS = {
  relevant: null,
  "price-asc": (a, b) => finalPrice(a) - finalPrice(b),
  "price-desc": (a, b) => finalPrice(b) - finalPrice(a),
  discount: (a, b) => discountPercent(b) - discountPercent(a),
  newest: (a, b) => b.id - a.id,
};

// Lọc (giá, thương hiệu, còn hàng) + sắp xếp, dùng chung cho trang Danh mục và Tìm kiếm
export default function useProductFilters(products) {
  const [priceRange, setPriceRange] = useState(DEFAULT_RANGE);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("relevant");

  const brandCounts = useMemo(() => {
    const counts = new Map();
    products.forEach(p => {
      const b = p.brand || "Hometic";
      counts.set(b, (counts.get(b) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const min = priceRange.min === "" ? 0 : Number(priceRange.min);
    const max = priceRange.max === "" ? Infinity : Number(priceRange.max);
    const list = products.filter(p => {
      const price = finalPrice(p);
      return price >= min && price <= max
        && (selectedBrands.length === 0 || selectedBrands.includes(p.brand || "Hometic"))
        && (!inStockOnly || (p.stock ?? 1) > 0);
    });
    const sorter = SORTERS[sort];
    return sorter ? [...list].sort(sorter) : list;
  }, [products, priceRange, selectedBrands, inStockOnly, sort]);

  const toggleBrand = (brandName) => {
    setSelectedBrands(prev =>
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
  };

  const resetFilters = () => {
    setPriceRange(DEFAULT_RANGE);
    setSelectedBrands([]);
    setInStockOnly(false);
  };

  const activeCount = selectedBrands.length + (priceRange.min !== "" || priceRange.max !== "" ? 1 : 0) + (inStockOnly ? 1 : 0);

  return {
    priceRange, setPriceRange,
    selectedBrands, toggleBrand, brandCounts,
    inStockOnly, setInStockOnly,
    sort, setSort,
    resetFilters, filteredProducts,
    activeCount, isFiltered: activeCount > 0,
  };
}
