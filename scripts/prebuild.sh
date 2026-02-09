#!/bin/bash
# Pre-build optimization script

echo "🧹 Cleaning up before build..."
rm -rf .next/cache 2>/dev/null || true

echo "📦 Installing dependencies with optimization..."
npm ci --prefer-offline --no-audit --no-fund --progress=false

echo "⚡ Pre-building common modules..."
npm run build -- --experimental-build-mode compile 2>/dev/null || true

echo "✅ Pre-build optimization complete!"