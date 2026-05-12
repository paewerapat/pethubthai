#!/bin/bash
# PetHub TH — Dev Start Script
# รัน frontend + backend พร้อมกันพร้อม colored output

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"

echo -e "${BOLD}"
echo "╔══════════════════════════════════════════╗"
echo "║         🐾  PetHub TH — Dev Mode        ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

# ── Prefix output ─────────────────────────────────────────────────────────────
prefix_output() {
  local prefix="$1"
  local color="$2"
  while IFS= read -r line; do
    echo -e "${color}${prefix}${NC} ${line}"
  done
}

# ── Cleanup on exit ───────────────────────────────────────────────────────────
cleanup() {
  echo -e "\n${YELLOW}⏹  Stopping all services...${NC}"
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
  wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
  echo -e "${GREEN}✓  Done${NC}"
  exit 0
}
trap cleanup INT TERM

# ── Start backend ─────────────────────────────────────────────────────────────
echo -e "${BLUE}▶  Starting backend  (port 3001)...${NC}"
(
  cd "$BACKEND_DIR"
  npm run start:dev 2>&1 | prefix_output "[BE]" "${BLUE}"
) &
BACKEND_PID=$!

# ── Start frontend ────────────────────────────────────────────────────────────
echo -e "${GREEN}▶  Starting frontend (port 3000)...${NC}"
(
  cd "$FRONTEND_DIR"
  npm run dev 2>&1 | prefix_output "[FE]" "${GREEN}"
) &
FRONTEND_PID=$!

echo ""
echo -e "  ${CYAN}Frontend:${NC}  http://localhost:3000"
echo -e "  ${CYAN}Backend:${NC}   http://localhost:3001/api"
echo ""
echo -e "  Press ${BOLD}Ctrl+C${NC} to stop all services"
echo ""

wait "$BACKEND_PID" "$FRONTEND_PID"
