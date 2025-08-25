const { exec } = require('child_process');
const fs = require('fs');

console.log('🚨 Emergency server restart initiated...');

// Kill all node processes
exec('pkill -f "node" || true', (error, stdout, stderr) => {
  if (error) {
    console.log('Process kill completed (expected)');
  }
  
  setTimeout(() => {
    console.log('⚡ Starting Next.js server...');
    
    // Start Next.js server with production build
    const nextServer = exec('cd /home/user && npm run build && npm start', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Server start error:', error);
        return;
      }
      console.log('✅ Server output:', stdout);
    });
    
    nextServer.stdout.on('data', (data) => {
      console.log('📡 Server:', data.toString());
    });
    
    nextServer.stderr.on('data', (data) => {
      console.error('⚠️ Server error:', data.toString());
    });
    
  }, 3000);
});

console.log('🔄 Emergency restart script completed');