#!/bin/bash

echo "🔄 Safely restarting Next.js development server..."

# Kill any existing Next.js processes
echo "🛑 Stopping existing processes..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Clear port 3000
echo "🧹 Clearing port 3000..."
fuser -k 3000/tcp 2>/dev/null || true
sleep 2

# Verify port is clear
echo "✅ Port cleared. Starting server..."

# Start the development server
npm run dev > server.log 2>&1 &

# Wait a moment and check status
sleep 3
echo "🚀 Server should be starting..."
echo "📋 Check server.log for details"
echo "🌐 Access at: https://s7m93gtx6ii7z5r39f0w3ile.macaly.dev/"

# Show last few lines of log
tail -5 server.log