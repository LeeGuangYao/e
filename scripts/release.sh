#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}✔ $1${NC}"; }
log_warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
log_error() { echo -e "${RED}✖ $1${NC}"; }

echo ""
echo "=============================="
echo "  🚀 一键发布流程"
echo "=============================="
echo ""

# 1. 前置校验
echo "🔍 [1/4] 运行 typecheck..."
if ! pnpm typecheck; then
  log_error "typecheck 失败，发布中止"
  exit 1
fi
log_info "typecheck 通过"

echo ""
echo "🔍 [2/4] 运行 lint..."
if ! pnpm lint; then
  log_error "lint 失败，发布中止"
  exit 1
fi
log_info "lint 通过"

echo ""
echo "🔍 [3/4] 运行单测..."
if ! pnpm test; then
  log_error "单测失败，发布中止"
  exit 1
fi
log_info "单测通过"

echo ""

# 2. 检测是否为首次发布（无 commit 历史）
HAS_COMMITS=true
if ! git rev-parse HEAD &>/dev/null; then
  HAS_COMMITS=false
  log_warn "当前分支无 commit 历史，先创建初始 commit"
  git add -A
  git commit -m "chore: 项目初始化" --no-verify
  log_info "初始 commit 已创建"
fi

# 3. 执行 standard-version（bump + changelog + commit + tag）
echo "📦 [4/4] 执行 standard-version..."
SV_ARGS=("$@")
if [ "$HAS_COMMITS" = false ]; then
  SV_ARGS+=("--first-release")
fi
if ! pnpm exec standard-version "${SV_ARGS[@]}"; then
  log_error "standard-version 执行失败"
  exit 1
fi
log_info "standard-version 完成"

# 4. 获取新版本号
NEW_VERSION=$(node -p "require('./package.json').version")
NEW_TAG="v${NEW_VERSION}"

echo ""
echo "🚀 推送到远程（含 tag ${NEW_TAG}）..."
if ! git push --follow-tags origin HEAD; then
  log_warn "推送失败，但本地 commit 和 tag 已创建"
  log_warn "请手动执行：git push --follow-tags origin HEAD"
  exit 1
fi

echo ""
echo "=============================="
log_info "发布完成！版本 ${NEW_TAG} 已推送到远程"
echo "=============================="
echo ""
