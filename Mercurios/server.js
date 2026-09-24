const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5173;
const ROOT = __dirname;
const MERCURIX_ROOT = path.join(__dirname, '..', 'Mercurix');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const cleanUrl = req.url.split('?')[0];
  let filePath;
  const lowerUrl = cleanUrl.toLowerCase();
  const mercurixIdx = lowerUrl.indexOf('mercurix/');
  if (mercurixIdx !== -1) {
    const subPath = cleanUrl.substring(mercurixIdx + 'mercurix/'.length);
    filePath = path.join(MERCURIX_ROOT, subPath);
  } else {
    const relativePath = cleanUrl === '/' ? 'index.html' : cleanUrl.replace(/^\/+/, '');
    filePath = path.join(ROOT, relativePath);
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`MERCURIOS Preview Server running at http://localhost:${PORT}`);
});
