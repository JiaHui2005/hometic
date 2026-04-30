import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { formatVnd } from "../constants";

export default function ProductManager() {
  const emptyForm = {
    category_id: "",
    name: "",
    slug: "",
    description: "",
    price: "",
    sale_price: "",
    stock: "",
    image_url: "",
    smart_features: "",
  };
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    const [nextCategories, nextProducts] = await Promise.all([api("/categories"), api("/products")]);
    setCategories(nextCategories);
    setProducts(nextProducts);
  }

  useEffect(() => { load(); }, []);

  function edit(product) {
    setEditingId(product.id);
    setForm({
      category_id: product.category_id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      sale_price: product.sale_price || "",
      stock: product.stock,
      image_url: product.image_url || "",
      smart_features: product.smart_features || "",
    });
  }

  async function submit(event) {
    event.preventDefault();
    const payload = {
      category_id: Number(form.category_id),
      name: form.name,
      slug: form.slug,
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      stock: Number(form.stock),
      image_url: form.image_url,
      detail: {
        description: form.description,
        content: form.smart_features
      }
    };
    await api(editingId ? `/admin/products/${editingId}` : "/admin/products", {
      method: editingId ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
    setForm(emptyForm);
    setEditingId(null);
    load();
  }

  async function remove(id) {
    await api(`/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <section className="admin-products">
      <div className="panel">
        <h3>{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h3>
        <form className="form" onSubmit={submit}>
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
            <option value="">Chọn danh mục</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <input placeholder="Tên sản phẩm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          <textarea placeholder="Mô tả" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <input type="number" placeholder="Giá" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input type="number" placeholder="Giá khuyến mãi" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} />
          <input type="number" placeholder="Tồn kho" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          <input placeholder="Ảnh URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <textarea placeholder="Tính năng smart home" value={form.smart_features} onChange={(e) => setForm({ ...form, smart_features: e.target.value })} />
          <div className="split-actions">
            <button>{editingId ? "Lưu thay đổi" : "Tạo sản phẩm"}</button>
            {editingId && <button type="button" className="ghost" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Huỷ</button>}
          </div>
        </form>
      </div>
      <div className="table-list">
        {products.map((product) => (
          <article className="order-row" key={product.id}>
            <strong>{product.name}</strong>
            <span>{formatVnd(product.sale_price || product.price)} - Kho {product.stock}</span>
            <span className="row-actions">
              <button className="ghost" onClick={() => edit(product)}>Sửa</button>
              <button className="ghost danger" onClick={() => remove(product.id)}>Xoá</button>
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
