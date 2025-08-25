const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// Create the server that will proxy requests
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`📡 Proxying ${req.method} ${req.url} to port 3003`);
  
  // Proxy the request to port 3003
  proxy.web(req, res, {
    target: 'http://localhost:3003',
    changeOrigin: true,
    timeout: 30000
  });
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('❌ Proxy error:', err.message);
  if (!res.headersSent) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: ' + err.message);
  }
});

// Start the proxy server on port 3000
server.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Proxy server running on port 3000');
  console.log('🔄 Forwarding requests to port 3003');
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('🛑 Shutting down proxy server...');
  server.close(() => {
    console.log('✅ Proxy server stopped');
    process.exit(0);
  });
});

// Handle proxy server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('❌ Port 3000 is already in use. Please kill the process using port 3000 first.');
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});