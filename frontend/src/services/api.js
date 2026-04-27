const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export function getToken() {
  return localStorage.getItem("hometic_token");
}

export function setSession(token, user) {
  localStorage.setItem("hometic_token", token);
  localStorage.setItem("hometic_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("hometic_token");
  localStorage.removeItem("hometic_user");
}

export function getStoredUser() {
  const raw = localStorage.getItem("hometic_user");
  return raw ? JSON.parse(raw) : null;
}

export async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.detail || "Có lỗi xảy ra");
  }
  return data;
}
