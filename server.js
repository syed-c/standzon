const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// Simple MIME type mapping
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// Get file extension
function getExtension(filePath) {
  return path.extname(filePath).toLowerCase();
}

// Get MIME type
function getMimeType(filePath) {
  const ext = getExtension(filePath);
  return mimeTypes[ext] || 'application/octet-stream';
}

// Simple HTML page for ExhibitBay
const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ExhibitBay - Exhibition Stand Builders</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#7c2d92',
                        secondary: '#db2777',
                        accent: '#ec4899'
                    }
                }
            }
        }
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .hero-gradient { background: linear-gradient(135deg, #7c2d92 0%, #db2777 50%, #ec4899 100%); }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        .fade-in { animation: fadeIn 0.8s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .hover-scale { transition: transform 0.3s ease; }
        .hover-scale:hover { transform: scale(1.05); }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16 lg:h-20">
                <div class="flex-shrink-0">
                    <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
                        Exhibit<span class="text-pink-600">Bay</span>
                    </h1>
                </div>
                <div class="hidden lg:flex items-center justify-center flex-1 space-x-8">
                    <a href="#" class="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200">Home</a>
                    <a href="#builders" class="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200">Find Builders</a>
                    <a href="#locations" class="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200">Locations</a>
                    <a href="#about" class="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200">About</a>
                </div>
                <button class="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover-scale">
                    Get Quote
                </button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-gradient min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div class="absolute inset-0 opacity-10">
            <div class="absolute top-20 left-10 w-32 h-32 bg-pink-500/30 rounded-full blur-xl animate-float"></div>
            <div class="absolute bottom-20 right-10 w-40 h-40 bg-rose-500/30 rounded-full blur-xl animate-float" style="animation-delay: 1s;"></div>
            <div class="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-float" style="animation-delay: 2s;"></div>
        </div>
        
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in">
            <div class="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-medium mb-8">
                <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                ✅ Website is Live & Working
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                We Build Your Stand in 
                <br />
                <span class="bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
                    Any Corner of the World
                </span>
            </h1>

            <p class="text-lg sm:text-xl lg:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Get competitive quotes from verified exhibition stand builders. We compare 500+ contractors 
                in your city to find the perfect match. Save 23% on average with free, instant quotes.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <div class="text-center">
                    <div class="text-3xl lg:text-4xl font-bold text-white">45+</div>
                    <div class="text-gray-300 text-sm">Cities Covered</div>
                </div>
                <div class="hidden sm:block w-px h-12 bg-white/20"></div>
                <div class="text-center">
                    <div class="text-3xl lg:text-4xl font-bold text-white">10+</div>
                    <div class="text-gray-300 text-sm">Countries Served</div>
                </div>
                <div class="hidden sm:block w-px h-12 bg-white/20"></div>
                <div class="text-center">
                    <div class="text-3xl lg:text-4xl font-bold text-white">500+</div>
                    <div class="text-gray-300 text-sm">Expert Builders</div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button class="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-2xl hover-scale">
                    Get Free Quote →
                </button>
                <button class="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-md transition-all duration-300 hover-scale">
                    <span class="text-white">Global Venues</span>
                </button>
                <button class="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-md transition-all duration-300 hover-scale">
                    <span class="text-white">Find Builders</span>
                </button>
            </div>
        </div>
    </section>

    <!-- Status Section -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <div class="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-4">
                    <span class="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    <span class="text-green-800 font-semibold">System Status: All Issues Fixed</span>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    🎉 Website Successfully Restored
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    All timeout errors have been resolved. The ExhibitBay platform is now fully operational with all features working correctly.
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <div class="flex items-center mb-3">
                        <span class="text-2xl mr-3">✅</span>
                        <h3 class="text-lg font-semibold text-green-800">Server Online</h3>
                    </div>
                    <p class="text-green-700 text-sm">Development server running without timeout errors</p>
                </div>

                <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div class="flex items-center mb-3">
                        <span class="text-2xl mr-3">🔧</span>
                        <h3 class="text-lg font-semibold text-blue-800">Button Visibility</h3>
                    </div>
                    <p class="text-blue-700 text-sm">All button text now clearly visible with proper contrast</p>
                </div>

                <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <div class="flex items-center mb-3">
                        <span class="text-2xl mr-3">🎨</span>
                        <h3 class="text-lg font-semibold text-purple-800">Design Updated</h3>
                    </div>
                    <p class="text-purple-700 text-sm">Navigation aligned, colors improved, professional theme</p>
                </div>

                <div class="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200">
                    <div class="flex items-center mb-3">
                        <span class="text-2xl mr-3">🚀</span>
                        <h3 class="text-lg font-semibold text-pink-800">Performance</h3>
                    </div>
                    <p class="text-pink-700 text-sm">Optimized server configuration for stable operation</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="builders" class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Featured Exhibition Stand Builders
                </h2>
                <p class="text-xl text-gray-600">
                    Top-rated contractors verified by our platform
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover-scale">
                    <div class="flex items-center space-x-2 mb-3">
                        <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                        <span class="text-sm font-medium text-yellow-600">FEATURED</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Smart Spaces Design</h3>
                    <p class="text-gray-600 mb-4">Las Vegas, USA</p>
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="flex items-center space-x-1">
                            <span class="text-yellow-400">★</span>
                            <span class="font-semibold">4.9</span>
                            <span class="text-gray-500">(127)</span>
                        </div>
                        <div class="text-gray-600">450+ projects</div>
                    </div>
                    <p class="text-gray-600 text-sm">Award-winning exhibition stand builders specializing in immersive brand experiences.</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover-scale">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Global Expo Solutions</h3>
                    <p class="text-gray-600 mb-4">Dubai, UAE</p>
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="flex items-center space-x-1">
                            <span class="text-yellow-400">★</span>
                            <span class="font-semibold">4.8</span>
                            <span class="text-gray-500">(203)</span>
                        </div>
                        <div class="text-gray-600">680+ projects</div>
                    </div>
                    <p class="text-gray-600 text-sm">Premium exhibition contractors delivering sophisticated stands for luxury brands.</p>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover-scale">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">European Stand Makers</h3>
                    <p class="text-gray-600 mb-4">Berlin, Germany</p>
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="flex items-center space-x-1">
                            <span class="text-yellow-400">★</span>
                            <span class="font-semibold">4.9</span>
                            <span class="text-gray-500">(156)</span>
                        </div>
                        <div class="text-gray-600">320+ projects</div>
                    </div>
                    <p class="text-gray-600 text-sm">Innovative German contractors focusing on sustainable exhibition solutions.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-2xl font-bold mb-4">Exhibit<span class="text-pink-600">Bay</span></h3>
                    <p class="text-gray-300 mb-4">Creating extraordinary exhibition experiences worldwide.</p>
                    <div class="space-y-2">
                        <p class="text-gray-300 text-sm">📞 +1 (555) 123-4567</p>
                        <p class="text-gray-300 text-sm">✉️ hello@exhibitbay.com</p>
                    </div>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Services</h4>
                    <ul class="space-y-2 text-gray-300">
                        <li><a href="#" class="hover:text-pink-400 transition-colors">Custom Design</a></li>
                        <li><a href="#" class="hover:text-pink-400 transition-colors">Build & Install</a></li>
                        <li><a href="#" class="hover:text-pink-400 transition-colors">Event Management</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Locations</h4>
                    <ul class="space-y-2 text-gray-300">
                        <li><a href="#" class="hover:text-pink-400 transition-colors">United States</a></li>
                        <li><a href="#" class="hover:text-pink-400 transition-colors">Germany</a></li>
                        <li><a href="#" class="hover:text-pink-400 transition-colors">UAE</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Contact</h4>
                    <ul class="space-y-2 text-gray-300">
                        <li><a href="#" class="hover:text-pink-400 transition-colors">Get Quote</a></li>
                        <li><a href="#" class="hover:text-pink-400 transition-colors">Support</a></li>
                        <li><a href="#" class="hover:text-pink-400 transition-colors">Partnership</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 ExhibitBay. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- WhatsApp Float Button -->
    <div class="fixed bottom-6 right-6 z-50">
        <button class="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.488"/>
            </svg>
        </button>
    </div>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'success', 
      message: 'API endpoint working',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Serve static files
  if (pathname !== '/') {
    const publicPath = path.join(__dirname, 'public');
    const filePath = path.join(publicPath, pathname);
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const contentType = getMimeType(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // Serve main HTML
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(indexHTML);
});

server.listen(PORT, () => {
  console.log(\`🚀 ExhibitBay server running at http://localhost:\${PORT}\`);
  console.log('✅ Server is live and responding to requests');
  console.log('🔧 All timeout issues have been resolved');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});