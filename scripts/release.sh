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
echo "🔍 [1/5] 运行 typecheck..."
if ! pnpm typecheck; then
  log_error "typecheck 失败，发布中止"
  exit 1
fi
log_info "typecheck 通过"

echo ""
echo "🔍 [2/5] 运行 lint..."
if ! pnpm lint; then
  log_error "lint 失败，发布中止"
  exit 1
fi
log_info "lint 通过"

echo ""
echo "🔍 [3/5] 运行单测..."
if ! pnpm test; then
  log_error "单测失败，发布中止"
  exit 1
fi
log_info "单测通过"

echo ""

# 2. 提交工作区所有改动
echo "📦 [4/5] 提交工作区改动..."
HAS_COMMITS=true
if ! git rev-parse HEAD &>/dev/null; then
  HAS_COMMITS=false
fi

if [ -n "$(git status --porcelain)" ]; then
  git add -A
  if [ "$HAS_COMMITS" = false ]; then
    git commit -m "chore: 项目初始化" --no-verify
    log_info "初始 commit 已创建"
  else
    git commit -m "chore: pre-release commit" --no-verify
    log_info "工作区改动已提交"
  fi
else
  log_info "工作区无改动，跳过"
fi

# 3. 执行 standard-version（bump + changelog + commit + tag）
echo ""
echo "📦 [5/5] 执行 standard-version..."
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
