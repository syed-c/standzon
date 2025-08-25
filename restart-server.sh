#!/bin/bash

# Kill all node processes and restart the server
echo "🔄 Restarting ExhibitBay server..."

# Kill existing processes
pkill -f "next" || true
pkill -f "node" || true
sleep 2

# Clear any file watcher issues
echo "🔧 Optimizing file watchers..."
sudo sysctl -w fs.inotify.max_user_watches=524288 || true
sudo sysctl -w fs.inotify.max_user_instances=256 || true

# Navigate to project directory
cd /home/user

# Start the server
echo "🚀 Starting development server..."
npm run dev

echo "✅ Server restarted successfully!"