const { spawn } = require('child_process');

console.log('🚀 Starting development server...');

// Start the development server
const server = spawn('npm', ['run', 'dev'], {
  cwd: '/home/user',
  stdio: 'inherit',
  detached: false
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

server.on('close', (code) => {
  console.log(`🔄 Server exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down server...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...');
  server.kill('SIGTERM');
  process.exit(0);
});