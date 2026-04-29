const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// --- Session Management ---

export const getTokens = () => ({
  accessToken: localStorage.getItem("hometic_access_token"),
  refreshToken: localStorage.getItem("hometic_refresh_token")
});

export const setSession = (tokens, user) => {
  localStorage.setItem("hometic_access_token", tokens.access_token);
  localStorage.setItem("hometic_refresh_token", tokens.refresh_token);
  localStorage.setItem("hometic_user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("hometic_access_token");
  localStorage.removeItem("hometic_refresh_token");
  localStorage.removeItem("hometic_user");
};

export const getStoredUser = () => {
  const raw = localStorage.getItem("hometic_user");
  return raw ? JSON.parse(raw) : null;
};

// --- API Wrapper ---

async function refreshAccessToken() {
  const { refreshToken } = getTokens();
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  if (!response.ok) {
    clearSession();
    window.location.reload(); // Force login
    throw new Error("Session expired");
  }

  const data = await response.json();
  setSession({ access_token: data.access_token, refresh_token: data.refresh_token }, data.user);
  return data.access_token;
}

export async function api(path, options = {}) {
  let { accessToken } = getTokens();

  const makeRequest = async (token) => {
    return fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  };

  let response = await makeRequest(accessToken);

  // If 401 Unauthorized, try to refresh token
  if (response.status === 401 && !path.includes("/auth/login")) {
    try {
      const newToken = await refreshAccessToken();
      response = await makeRequest(newToken);
    } catch (err) {
      // Refresh failed or no refresh token
      return response;
    }
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.detail || "Có lỗi xảy ra");
  }
  return data;
}

// --- Specific Services ---

export const authService = {
  login: (credentials) => api("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (userData) => api("/auth/register", { method: "POST", body: JSON.stringify(userData) }),
  getMe: () => api("/auth/me"),
  updateMe: (data) => api("/auth/me", { method: "PUT", body: JSON.stringify(data) }),
  uploadAvatar: async (formData) => {
    const accessToken = localStorage.getItem("hometic_access_token");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

    const response = await fetch(`${API_URL}/auth/upload-avatar`, {
      method: "POST",
      headers: {
        // TUYỆT ĐỐI KHÔNG để Content-Type ở đây
        "Authorization": `Bearer ${accessToken}`
      },
      body: formData // Truyền trực tiếp, trình duyệt sẽ tự xử lý Content-Type
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Không thể tải ảnh lên");
    }

    return response.json();
  },
  changePassword: (data) => api("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify(data)
  }),
  forgotPassword: (data) => api("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  resetPassword: (data) => api("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data)
  }),
};

export const catalogService = {
  getCategories: () => api("/categories"),
  getCategory: (id) => api(`/categories/${id}`),
  getProducts: (params = "") => api(`/products${params}`),
  getProduct: (id) => api(`/products/${id}`),
  getProductsByCategory: (slug) => api(`/products/category/${slug}`),

  // Admin Product CRUD
  createProduct: (data) => api("/admin/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id, data) => api(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  restoreProduct: (id) => api(`/admin/products/${id}/restore`, { method: "PATCH" }), // Thêm dòng này
  deleteProduct: (id) => api(`/admin/products/${id}`, { method: "DELETE" }),

  // Admin Category CRUD
  createCategory: (data) => api("/admin/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id, data) => api(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategory: (id) => api(`/admin/categories/${id}`, { method: "DELETE" }),
  restoreCategory: (id) => api(`/admin/categories/${id}/restore`, { method: "PATCH" }),
};

export const orderService = {
  checkout: (data) => api("/checkout", { method: "POST", body: JSON.stringify(data) }),
  getMyOrders: () => api("/my-orders"),
  getMyOrder: (id) => api(`/my-orders/${id}`),

  // Admin
  getAllOrders: () => api("/admin/orders"),
  getAdminOrderDetail: (id) => api(`/admin/orders/${id}`),
  getUserOrders: (userId) => api(`/admin/users/${userId}/orders`),
  updateOrderStatus: (id, status) => api(`/admin/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  getCoupons: () => api("/admin/coupons"),
  createCoupon: (data) => api("/admin/coupons", { method: "POST", body: JSON.stringify(data) }),
  deleteCoupon: (id) => api(`/admin/coupons/${id}`, { method: "DELETE" }),
};

export const reviewService = {
  getProductReviews: (productId) => api(`/products/${productId}/reviews`),
  createReview: (data) => api("/reviews", { method: "POST", body: JSON.stringify(data) }),
  deleteReview: (id) => api(`/reviews/${id}`, { method: "DELETE" }),
};

export const adminService = {
  getDashboard: () => api("/admin/dashboard"),
  getCharts: () => api("/admin/charts"),
  getUsers: () => api("/admin/users"),
  searchUsers: (query) => api(`/admin/users/search?q=${encodeURIComponent(query)}`),
  getUserOrders: (userId) => api(`/admin/users/${userId}/orders`),
  updateUser: (id, data) => api(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteUser: (id) => api(`/admin/users/${id}`, { method: "DELETE" }),
  uploadImage: async (file) => {
    const accessToken = localStorage.getItem("hometic_access_token");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/admin/upload`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${accessToken}` },
      body: formData
    });

    if (!response.ok) throw new Error("Upload failed");
    return response.json();
  }
};

export const couponService = {
  getMyCoupons: () => api("/coupons/my-coupons"),
  checkCoupon: (code) => api(`/coupons/check/${code}`),
  claimCoupon: (code) => api(`/coupons/claim/${code}`, { method: "POST" }),
};
