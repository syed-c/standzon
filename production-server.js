const express = require('express');
const next = require('next');
const path = require('path');

const dev = false; // Production mode
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

console.log('🚀 Starting ExhibitBay in production mode...');

app.prepare().then(() => {
  const server = express();

  // Serve static files
  server.use(express.static(path.join(__dirname, 'public')));

  // Handle all requests
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`✅ ExhibitBay server running on http://localhost:${PORT}`);
    console.log('🎯 Website is now live with GMB listings!');
  });
}).catch((ex) => {
  console.error('❌ Error starting server:', ex);
  process.exit(1);
});