const { spawn, exec } = require('child_process');

console.log('🔄 Restarting development server...');

// Kill all node processes
console.log('🛑 Stopping existing processes...');
exec('pkill -f node || true', (error) => {
  setTimeout(() => {
    console.log('🚀 Starting Next.js development server...');
    
    // Start the development server
    const server = spawn('npm', ['run', 'dev'], {
      cwd: '/home/user',
      stdio: 'inherit'
    });
    
    server.on('error', (err) => {
      console.error('❌ Server error:', err);
    });
    
    server.on('close', (code) => {
      console.log(`🔄 Server exited with code ${code}`);
    });
    
    // Keep the process alive
    process.on('SIGINT', () => {
      console.log('🛑 Stopping server...');
      server.kill();
      process.exit();
    });
    
  }, 3000);
});