#!/bin/bash

# ExhibitBay Platform Startup Script
# This script handles proper server startup and prevents file descriptor issues

echo "🚀 Starting ExhibitBay Platform..."

# Kill any existing processes
echo "🔄 Cleaning up existing processes..."
pkill -f "next-server" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true
pkill -f "npm.*dev" 2>/dev/null || true

# Wait for processes to terminate
sleep 2

# Increase file descriptor limits
echo "📈 Increasing file descriptor limits..."
ulimit -n 65536
ulimit -u 4096

# Set environment variables for better performance
export NODE_OPTIONS="--max-old-space-size=4096"
export NEXT_TELEMETRY_DISABLED=1
export WATCHPACK_POLLING=true

# Clear Node.js cache
echo "🧹 Clearing Node.js cache..."
rm -rf .next/cache 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true

# Create data directory for persistence
echo "📁 Ensuring data directory exists..."
mkdir -p data

# Start the development server with proper error handling
echo "🚀 Starting Next.js development server..."
echo "📍 Server will be available at: http://localhost:3000"
echo "🔄 Press Ctrl+C to stop the server"

# Use exec to replace the shell process
exec npm run dev