// Định dạng tiền tệ VND
export const formatVnd = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

// Demo dữ liệu
export const demoCategories = [
  { id: 1, name: "Nhà bếp thông minh" },
  { id: 2, name: "Chăm sóc nhà cửa" },
  { id: 3, name: "Điện gia dụng" },
];

export const demoProducts = [
  {
    id: 1,
    category_id: 1,
    name: "Nồi chiên không dầu SmartCook 6L",
    description: "Điều khiển qua app, 12 chế độ nấu.",
    price: 2490000,
    sale_price: 2190000,
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80",
    category: demoCategories[0],
    images: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1594385208974-2e75f9d8ad48?auto=format&fit=crop&w=900&q=80"
    ],
    details: [
      { label: "Công suất", value: "1800W" },
      { label: "Dung tích", value: "6.0 Lít" },
      { label: "Chất liệu", value: "Thép không gỉ, nhựa ABS" },
      { label: "Tính năng", value: "Điều khiển WiFi, 12 chế độ" }
    ]
  },
  {
    id: 2,
    category_id: 2,
    name: "Robot hút bụi Hometic CleanBot X2",
    description: "Lập bản đồ laser, lau hút 2 trong 1.",
    price: 7990000,
    sale_price: 6990000,
    stock: 25,
    image_url: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?auto=format&fit=crop&w=900&q=80",
    category: demoCategories[1],
    images: [
      "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=900&q=80"
    ],
    details: [
      { label: "Lực hút", value: "4000Pa" },
      { label: "Pin", value: "5200mAh" },
      { label: "Thời gian chạy", value: "180 phút" },
      { label: "Cảm biến", value: "LiDAR 2.0" }
    ]
  },
  {
    id: 3,
    category_id: 3,
    name: "Máy lọc không khí AirJoy Pro",
    description: "Lọc HEPA H13, cảm biến bụi mịn.",
    price: 5290000,
    sale_price: 4890000,
    stock: 30,
    image_url: "https://images.unsplash.com/photo-1626430451221-0f3f12289c43?auto=format&fit=crop&w=900&q=80",
    category: demoCategories[2],
    images: [
      "https://images.unsplash.com/photo-1626430451221-0f3f12289c43?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=900&q=80"
    ],
    details: [
      { label: "Diện tích lọc", value: "50m2" },
      { label: "Màng lọc", value: "HEPA H13 3 lớp" },
      { label: "Độ ồn", value: "< 30dB" },
      { label: "Cảm biến", value: "PM2.5, VOCs" }
    ]
  },
];
