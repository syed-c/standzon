const { exec } = require('child_process');

console.log('🔍 Checking for processes on port 3000...');

// Function to kill processes on port 3000
function killPort3000() {
  return new Promise((resolve) => {
    exec('ps aux | grep "3000" | grep -v grep', (error, stdout, stderr) => {
      if (stdout) {
        console.log('📋 Found processes:', stdout);
        
        // Kill processes
        exec('pkill -f "3000" || true', (killError) => {
          if (killError) {
            console.log('⚠️ Kill command completed');
          }
          
          setTimeout(() => {
            console.log('✅ Port 3000 should now be available');
            resolve();
          }, 2000);
        });
      } else {
        console.log('✅ No processes found on port 3000');
        resolve();
      }
    });
  });
}

// Function to start the server
async function startServer() {
  await killPort3000();
  
  console.log('🚀 Starting Next.js server on port 3000...');
  
  const server = exec('npm run dev', {
    cwd: '/home/user'
  });
  
  server.stdout.on('data', (data) => {
    console.log('📡 Server:', data.toString());
  });
  
  server.stderr.on('data', (data) => {
    console.error('⚠️ Server error:', data.toString());
  });
  
  server.on('close', (code) => {
    console.log(`🔄 Server exited with code ${code}`);
  });
}

startServer().catch(console.error);