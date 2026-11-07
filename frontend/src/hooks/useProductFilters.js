import { useMemo, useState } from "react";

const DEFAULT_RANGE = { min: 0, max: 50000000 };

// Bộ lọc giá + thương hiệu dùng chung cho trang Danh mục và Tìm kiếm
export default function useProductFilters(products) {
  const [priceRange, setPriceRange] = useState(DEFAULT_RANGE);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const availableBrands = useMemo(() => {
    const brands = products.map(p => p.brand || "Hometic");
    return [...new Set(brands)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const price = p.sale_price || p.price;
      const matchPrice = price >= priceRange.min && price <= priceRange.max;
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand || "Hometic");
      return matchPrice && matchBrand;
    });
  }, [products, priceRange, selectedBrands]);

  const toggleBrand = (brandName) => {
    setSelectedBrands(prev =>
      prev.includes(brandName)
        ? prev.filter(b => b !== brandName)
        : [...prev, brandName]
    );
  };

  const resetFilters = () => {
    setPriceRange(DEFAULT_RANGE);
    setSelectedBrands([]);
  };

  const isFiltered = selectedBrands.length > 0 || priceRange.min !== DEFAULT_RANGE.min || priceRange.max !== DEFAULT_RANGE.max;

  return { priceRange, setPriceRange, selectedBrands, toggleBrand, resetFilters, availableBrands, filteredProducts, isFiltered };
}
