import { createContext, useContext } from "react";

// Trạng thái dùng chung của cửa hàng (danh mục, sản phẩm, giỏ, so sánh, điều hướng).
// App giữ state và cung cấp qua Provider; component con đọc bằng useStore().
export const StoreContext = createContext(null);

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore phải được dùng bên trong <StoreContext.Provider>");
  return store;
}
