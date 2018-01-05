// I guess that's the main function, 
// I kept updating the code until jshint was pleased, 
// if you don't know what jshint is or don't care just remove them
// and don't forget to remove the matching stuff " })();" in the end of the file
(function() {
'use strict';

const http = require('http');
const url = require('url');
var fs = require('fs');
var path = require('path');

const hostname = '127.0.0.1';
const port = 3000;
const websiteDirectory = 'www';

// I'm not smart enough to create this table,
// The smart guy's answer is here  https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http/29046869#29046869
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

// Logic to handle get requests
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

    // Send response including requested file
    res.setHeader('Content-Type', parseContentType(fileName.base));
    res.write(data);
    res.end();
  } catch (err) {
    console.error(err);
    res.statusCode = 404;   // file not found error code, to be displayed in browser
    res.end(`File ${pathname} not found!`);
  }
}

// Logic to handle post requests
function servePostRequest(req, res) {
  var body = '';
  
  // HTTP is stream based, data arrives in multiple chunks,
  // on('data') will keep getting called until all data is transferred 
  // through POST request, then on('end') will be called.
  // POST requests might include files or whatever, that's another reason
  // to keep code here intact.
  req.on('data', function(data) {
    body += data;
  });

  req.on('end', function() {
    var parsedData = JSON.parse(body);
    console.debug('Post request:');
    console.debug(parsedData);
  });
}

// Match the requested filename with content type header
function parseContentType(filename) {
  const ext = path.parse(filename).ext;
  return EXT_MAP[ext] || 'text/html';
}

})();