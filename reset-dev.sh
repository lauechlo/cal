#!/bin/bash
echo "🧹 Cleaning all caches and rebuilding..."

# Stop any running dev servers
pkill -f "next dev" 2>/dev/null || true

# Remove all caches
rm -rf .next
rm -rf node_modules/.cache
rm -rf .swc

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm install

# Start fresh dev server
echo "🚀 Starting dev server..."
npm run dev -- -p 4000
