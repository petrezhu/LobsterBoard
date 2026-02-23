#!/usr/bin/env node

/**
 * LobsterBoard Pages Server
 * Serves static files from /pages/ directory on port 8080
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PAGES_DIR = '/root/git/LobsterBoard/pages';
const PORT = 8080;

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

const server = http.createServer((req, res) => {
  // Parse URL
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Remove leading slash and 'pages/' prefix if present
  if (pathname.startsWith('/pages/')) {
    pathname = pathname.slice(6);
  }

  // Security: prevent directory traversal
  const fullPath = path.normalize(path.join(PAGES_DIR, pathname));
  if (!fullPath.startsWith(PAGES_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Check if path is a directory
  fs.stat(fullPath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found: ' + pathname);
        console.log(`❌ 404: ${pathname}`);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
        console.error(`❌ Error: ${err.message}`);
      }
      return;
    }

    // If directory, try index.html
    if (stats.isDirectory()) {
      const indexPath = path.join(fullPath, 'index.html');
      fs.stat(indexPath, (err, indexStats) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found: index.html in ' + pathname);
          console.log(`❌ 404: ${pathname}/index.html`);
          return;
        }
        serveFile(indexPath, res);
      });
      return;
    }

    // Serve file
    serveFile(fullPath, res);
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error');
      console.error(`❌ Read error: ${err.message}`);
      return;
    }

    res.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Length': data.length,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
    console.log(`✅ 200: ${filePath} (${mimeType})`);
  });
}

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 LobsterBoard Pages Server running on http://127.0.0.1:${PORT}`);
  console.log(`📁 Serving files from: ${PAGES_DIR}`);
});

server.on('error', (err) => {
  console.error(`❌ Server error: ${err.message}`);
  process.exit(1);
});
