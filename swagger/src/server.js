/*
The simplest web server for opening swagger locally
 */
const fs = require('fs');
const http = require('http');

const hostname = '127.0.0.1';
const port = 3001;

const getContentType = (filepath) => {
  const fileEnding = filepath.split('.').reverse()[0];
  switch (fileEnding) {
    case 'html':
      return 'text/html'
    case 'css':
      return 'text/css'
    case 'js':
      return 'text/javascript'
    case 'png':
      return 'image/png'
    case 'yaml':
      return 'text/yaml'
    default:
      return 'text/plain';
  }
}

const getPath = (urlPath) => {

  if (urlPath === '/') {
    return `${__dirname}/index.dev.html`;
  }

  const re = /swagger\.yaml$/;
  if (re.test(urlPath)) {
    return `${__dirname}/../swagger.yaml`;
  }

  return `${__dirname}/../dist/${urlPath}`;
};


const server = http.createServer((req, res) => {
  const filePath = getPath(req.url);

  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('File not Found');
    return;
  }

  const contentType = getContentType(filePath);

  res.statusCode = 200;
  res.setHeader('Content-Type', contentType);
  res.end(fs.readFileSync(filePath, 'utf8'));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
