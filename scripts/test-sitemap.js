const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/sitemap',
  method: 'GET',
  headers: {
    'Accept': 'application/xml'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Content-Type: ${res.headers['content-type']}`);
  
  res.on('data', (chunk) => {
    console.log(`Body: ${chunk}`);
  });
  
  res.on('end', () => {
    console.log('Response ended');
  });
});

req.on('error', (error) => {
  console.error(`Problem with request: ${error.message}`);
});

req.end();