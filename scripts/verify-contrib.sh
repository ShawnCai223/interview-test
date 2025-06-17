#!/usr/bin/env bash
# verify-contrib.sh <git-url>
set -euo pipefail
REPO_URL="$1"
DIR=$(mktemp -d)
trap 'rm -rf "$DIR"' EXIT

echo "Cloning $REPO_URL..."
git clone --depth 1 "$REPO_URL" "$DIR" >/dev/null
cd "$DIR/template"

echo "Installing deps..."
pnpm install --frozen-lockfile --silent --ignore-scripts

echo "Running lint..."
pnpm lint

echo "Running tests..."
pnpm test

echo "✅ Submission looks good!" 