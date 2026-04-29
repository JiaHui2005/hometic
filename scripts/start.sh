#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
# Đường dẫn tệp đánh dấu (nằm trong thư mục backend)
MARKER_FILE="$BACKEND_DIR/.accounts_created"

echo "==> Hometic: chuẩn bị backend"
cd "$BACKEND_DIR"

if [ ! -f ".env" ]; then
  cp .env.example .env
fi

if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

source .venv/bin/activate
pip install -r requirements.txt

# --- PHẦN TẠO TÀI KHOẢN (CHỈ CHẠY 1 LẦN) ---
if [ ! -f "$MARKER_FILE" ]; then
    echo "🚀 Lần đầu khởi chạy: Đang tạo tài khoản test..."
    python -m app.utils.create_accounts
    touch "$MARKER_FILE"
    echo "✅ Đã tạo tài khoản và lưu trạng thái."
else
    echo "ℹ️ Tài khoản test đã được tạo trước đó, bỏ qua bước này."
fi
# ------------------------------------------

echo "==> Hometic: chuẩn bị frontend"
cd "$FRONTEND_DIR"
if [ ! -f ".env" ]; then
  cp .env.example .env
fi
npm install

echo "==> Hometic: khởi chạy API http://localhost:8000 và Web http://localhost:5173"
cd "$BACKEND_DIR"
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
API_PID=$!

cd "$FRONTEND_DIR"
npm run dev &
WEB_PID=$!

trap 'kill $API_PID $WEB_PID' EXIT
wait