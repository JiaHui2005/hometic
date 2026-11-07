import React from "react";
import { createRoot } from "react-dom/client";
// CSS nền phải nạp trước để CSS của từng component ghi đè được
import "./styles/index.css";
import App from "./App";
import ErrorBoundary from "./components/common/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
