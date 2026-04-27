#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

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
