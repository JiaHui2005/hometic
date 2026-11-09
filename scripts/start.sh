#!/usr/bin/env bash
# Khởi chạy toàn bộ Hometic trên máy dev: MySQL (Docker) → Backend (FastAPI) → Frontend (Vite).
#   ./scripts/start.sh            chạy tất cả, Ctrl+C để dừng FE + BE (MySQL vẫn chạy, giữ dữ liệu)
#   ./scripts/start.sh --stop-db  dừng luôn container MySQL khi thoát
# Tương thích bash 3.2 (macOS mặc định).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
DB_CONTAINER="hometic_db"
API_PORT=8000
WEB_PORT=5173
STOP_DB=0
[ "${1:-}" = "--stop-db" ] && STOP_DB=1

if [ -t 1 ]; then
  BOLD=$'\033[1m'; DIM=$'\033[2m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RED=$'\033[31m'; RESET=$'\033[0m'
else
  BOLD=""; DIM=""; GREEN=""; YELLOW=""; RED=""; RESET=""
fi

step() { printf '\n%s==> %s%s\n' "$BOLD" "$1" "$RESET"; }
ok()   { printf '%s✓%s %s\n' "$GREEN" "$RESET" "$1"; }
warn() { printf '%s!%s %s\n' "$YELLOW" "$RESET" "$1"; }
die()  { printf '%s✗ %s%s\n' "$RED" "$1" "$RESET" >&2; exit 1; }

# Chờ một lệnh trả về thành công, tối đa $1 giây
wait_for() {
  local timeout=$1 label=$2; shift 2
  local start=$SECONDS
  until "$@" >/dev/null 2>&1; do
    [ $((SECONDS - start)) -ge "$timeout" ] && die "Hết thời gian chờ: $label (${timeout}s)"
    sleep 2
  done
}

port_busy() { lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }

# ---------------------------------------------------------------- 1. Kiểm tra môi trường
step "Kiểm tra công cụ"
for cmd in docker python3 node npm curl lsof; do
  command -v "$cmd" >/dev/null 2>&1 || die "Chưa cài '$cmd'. Xem phần Cài đặt trong README."
done
python3 -c 'import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)' \
  || die "Cần Python 3.10 trở lên (đang có $(python3 --version 2>&1))."
node -e 'process.exit(parseInt(process.versions.node) >= 18 ? 0 : 1)' \
  || die "Cần Node.js 18 trở lên (đang có $(node --version))."
ok "Python $(python3 --version | cut -d' ' -f2), Node $(node --version), $(docker --version | cut -d',' -f1)"

for port in $API_PORT $WEB_PORT; do
  port_busy "$port" && die "Cổng $port đang bị chiếm. Tắt tiến trình đó (lsof -i :$port) rồi chạy lại."
done

# ---------------------------------------------------------------- 2. Database (MySQL trong Docker)
step "Database: MySQL"
if ! docker info >/dev/null 2>&1; then
  if [ "$(uname)" = "Darwin" ] && [ -d "/Applications/Docker.app" ]; then
    warn "Docker chưa chạy, đang mở Docker Desktop…"
    open -a Docker
    wait_for 120 "Docker Desktop khởi động" docker info
  else
    die "Docker chưa chạy. Bật Docker (Linux: sudo systemctl start docker) rồi chạy lại."
  fi
fi
ok "Docker đang chạy"

if port_busy 3306 && [ -z "$(docker ps -q --filter "name=^${DB_CONTAINER}$")" ]; then
  die "Cổng 3306 đang bị một MySQL khác chiếm. Tắt nó (vd. brew services stop mysql) rồi chạy lại."
fi

(cd "$ROOT_DIR" && docker compose up -d mysql >/dev/null)
db_healthy() { [ "$(docker inspect -f '{{.State.Health.Status}}' "$DB_CONTAINER" 2>/dev/null)" = "healthy" ]; }
if ! db_healthy; then
  echo "${DIM}  Lần đầu sẽ lâu hơn (tải image và nạp dữ liệu mẫu)…${RESET}"
  wait_for 240 "MySQL sẵn sàng" db_healthy
fi
# init.sql nạp dữ liệu sau khi healthcheck đã đạt → chờ đến khi bảng sản phẩm có trong DB
wait_for 120 "nạp dữ liệu mẫu" docker exec "$DB_CONTAINER" mysql -uroot hometic_db -e "SELECT 1 FROM products LIMIT 1"
ok "MySQL sẵn sàng tại localhost:3306 (container $DB_CONTAINER)"

# ---------------------------------------------------------------- 3. Backend
step "Backend: FastAPI"
cd "$BACKEND_DIR"
if [ ! -f .env ]; then
  cp .env.example .env
  ok "Tạo backend/.env từ .env.example"
fi
if [ ! -d .venv ]; then
  python3 -m venv .venv
  ok "Tạo môi trường ảo .venv"
fi
# shellcheck disable=SC1091
source .venv/bin/activate

# Chỉ cài lại thư viện khi requirements.txt thay đổi
REQ_HASH="$(shasum requirements.txt | cut -d' ' -f1)"
if [ "$(cat .venv/.requirements.sha 2>/dev/null || true)" != "$REQ_HASH" ]; then
  echo "${DIM}  Cài thư viện Python…${RESET}"
  pip install -q --disable-pip-version-check -r requirements.txt
  echo "$REQ_HASH" > .venv/.requirements.sha
fi
ok "Thư viện Python đã đủ"

# Tạo tài khoản thử nghiệm (bỏ qua nếu đã có)
python -m app.utils.create_accounts >/dev/null && ok "Tài khoản thử nghiệm sẵn sàng"

# ---------------------------------------------------------------- 4. Frontend
step "Frontend: React + Vite"
cd "$FRONTEND_DIR"
if [ ! -f .env ]; then
  cp .env.example .env
  ok "Tạo frontend/.env từ .env.example"
fi
# Chỉ npm install khi chưa có node_modules hoặc package-lock.json mới hơn lần cài trước
if [ ! -f node_modules/.package-lock.json ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  echo "${DIM}  Cài thư viện Node…${RESET}"
  npm install --no-audit --no-fund --loglevel=error
fi
ok "Thư viện Node đã đủ"

# ---------------------------------------------------------------- 5. Khởi chạy
step "Khởi chạy"
# Mỗi server chạy trong nhóm tiến trình riêng để dừng được cả cây (uvicorn --reload, npm → vite)
set -m
API_PID=""
WEB_PID=""
cleanup() {
  trap - INT TERM EXIT
  echo
  step "Đang dừng Hometic"
  for pid in $API_PID $WEB_PID; do
    kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
  ok "Đã dừng Backend và Frontend"
  if [ "$STOP_DB" = 1 ]; then
    (cd "$ROOT_DIR" && docker compose stop mysql >/dev/null) && ok "Đã dừng MySQL"
  else
    echo "${DIM}  MySQL vẫn chạy để giữ dữ liệu. Dừng bằng: docker compose stop mysql${RESET}"
  fi
}
# Ctrl+C là cách dừng bình thường → thoát mã 0; lỗi khi khởi động vẫn giữ mã lỗi
trap 'cleanup; exit 0' INT TERM
trap cleanup EXIT

cd "$BACKEND_DIR"
uvicorn app.main:app --reload --no-access-log --host 0.0.0.0 --port "$API_PORT" > >(sed -l "s/^/${DIM}[api]${RESET} /") 2>&1 &
API_PID=$!

cd "$FRONTEND_DIR"
npm run dev -- --port "$WEB_PORT" --strictPort > >(sed -l "s/^/${DIM}[web]${RESET} /") 2>&1 &
WEB_PID=$!

# Nếu server chết khi đang khởi động thì báo ngay, không ngồi chờ hết thời gian
api_ready() { kill -0 "$API_PID" 2>/dev/null || die "Backend dừng khi khởi động: xem log [api] ở trên."; curl -sf "http://localhost:$API_PORT/api/health"; }
web_ready() { kill -0 "$WEB_PID" 2>/dev/null || die "Frontend dừng khi khởi động: xem log [web] ở trên."; curl -sf "http://localhost:$WEB_PORT"; }
wait_for 90 "Backend trả lời" api_ready
wait_for 60 "Frontend trả lời" web_ready

cat <<EOF

${BOLD}${GREEN}Hometic đã chạy${RESET}
  Website      http://localhost:$WEB_PORT
  API          http://localhost:$API_PORT/api
  Swagger      http://localhost:$API_PORT/docs
  Database     localhost:3306  (root, không mật khẩu, DB hometic_db)

  Tài khoản thử nghiệm
    Quản trị   admin@hometic.com / 123456
    Khách      user@hometic.com  / 123456

${DIM}Nhấn Ctrl+C để dừng.${RESET}

EOF

wait
