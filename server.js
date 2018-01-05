(function() {
'use strict';

const http = require('http');
const url = require('url');
var fs = require('fs');
var path = require('path');

const hostname = '127.0.0.1';
const port = 3000;
const websiteDirectory = 'www';


const EXT_MAP = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword'
};


const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    serveGetRequest(req, res);
  } else if (req.method === 'POST') {
    servePostRequest(req, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function serveGetRequest(req, res) {
  // parse URL
  const parsedUrl = url.parse(req.url);
  // extract URL path
  let pathname = parsedUrl.pathname;

  // Index page requested
  if (pathname === '/') {
    pathname = './index.html';
  }
  // based on the URL path, extract the file extension. e.g. .js, .doc, ...
  const fileName = path.parse(path.basename(pathname));

  try {
    // TODO: cache reads
    var filePath = path.join(__dirname, websiteDirectory, fileName.base);
    var data = fs.readFileSync(filePath);

    res.setHeader('Content-Type', parseContentType(fileName.base));
    res.write(data);
    res.end();
  } catch (err) {
    console.error(err);
    res.statusCode = 404;
    res.end(`File ${pathname} not found!`);
  }
}

function servePostRequest(req, res) {
  var body = '';

  req.on('data', function(data) {
    body += data;
  });

  req.on('end', function() {
    var parsedData = JSON.parse(body);
    console.debug('Post request:');
    console.debug(parsedData);
  });
}

function parseContentType(filename) {
  const ext = path.parse(filename).ext;
  return EXT_MAP[ext] || 'text/html';
}

})();