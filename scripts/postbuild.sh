#!/bin/bash
# Post-build optimization script

echo "🧹 Cleaning up after build..."
rm -rf .next/cache 2>/dev/null || true

echo "📊 Analyzing build output..."
du -sh .next/ 2>/dev/null || true

echo "✅ Build optimization complete!"