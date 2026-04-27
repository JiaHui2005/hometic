// Định dạng tiền tệ VND
export const formatVnd = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

// Demo dữ liệu
export const demoCategories = [
  { id: 1, name: "Gia dụng Nhà bếp", slug: "nha-bep" },
  { id: 2, name: "Thiết bị vệ sinh", slug: "ve-sinh" },
  { id: 3, name: "Tiện ích phòng ngủ", slug: "phong-ngu" },
];

export const demoProducts = [
  {
    id: 1,
    category_id: 1,
    name: "Nồi cơm điện SmartCook Pro",
    description: "Nồi cơm điện cao tần thông minh, điều khiển qua App.",
    price: 2490000,
    stock: 50,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=520&q=80",
    images: ["https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=520&q=80"],
    details: [
      { label: "Dung tích", value: "1.8L" },
      { label: "Công suất", value: "1200W" },
      { label: "Chất liệu", value: "Lòng nồi chống dính cao cấp" },
      { label: "Tính năng", value: "Điều khiển qua Wifi/App" }
    ]
  },
  {
    id: 2,
    category_id: 1,
    name: "Bếp từ đôi Hometic Dual",
    description: "Bếp từ âm 2 vùng nấu, công suất mạnh mẽ.",
    price: 8900000,
    stock: 20,
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=520&q=80",
    images: ["https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=520&q=80"],
    details: [
      { label: "Vùng nấu", value: "02" },
      { label: "Công suất", value: "4000W" },
      { label: "Mặt kính", value: "Schott Ceran" },
      { label: "Hẹn giờ", value: "99 phút" }
    ]
  },
  {
    id: 3,
    category_id: 2,
    name: "Robot hút bụi Hometic S9",
    description: "Robot hút bụi lau nhà thế hệ mới, cảm biến LiDAR.",
    price: 7500000,
    stock: 30,
    image: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?auto=format&fit=crop&w=520&q=80",
    images: ["https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?auto=format&fit=crop&w=520&q=80"],
    details: [
      { label: "Lực hút", value: "4000Pa" },
      { label: "Pin", value: "5200mAh" },
      { label: "Thời gian chạy", value: "180 phút" },
      { label: "Cảm biến", value: "LiDAR 3D" }
    ]
  },
  {
    id: 4,
    category_id: 2,
    name: "Máy hút bụi cầm tay AirPure V1",
    description: "Thiết kế không dây, trọng lượng nhẹ, lực hút cực mạnh.",
    price: 1200000,
    stock: 100,
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=520&q=80",
    images: ["https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=520&q=80"],
    details: [
      { label: "Lực hút", value: "15000Pa" },
      { label: "Trọng lượng", value: "1.2kg" },
      { label: "Độ ồn", value: "<70dB" }
    ]
  },
  {
    id: 5,
    category_id: 3,
    name: "Máy lọc không khí PureAir Pro",
    description: "Lọc sạch bụi mịn PM2.5, khử mùi hiệu quả.",
    price: 3500000,
    stock: 40,
    image: "https://images.unsplash.com/photo-1626430451221-0f3f12289c43?auto=format&fit=crop&w=520&q=80",
    images: ["https://images.unsplash.com/photo-1626430451221-0f3f12289c43?auto=format&fit=crop&w=520&q=80"],
    details: [
      { label: "Diện tích phòng", value: "45m2" },
      { label: "Màng lọc", value: "HEPA H13" },
      { label: "Tính năng", value: "Cảm biến chất lượng không khí" }
    ]
  }
];
