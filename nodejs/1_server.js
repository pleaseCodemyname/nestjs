// import http from 'http'; // typescript 버전
const http = require('http'); // javascript 버전
const url = require('url'); // nodejs에서 기본적으로 제공

// localhost -> 127.0.0.1 -> loop back -> 서버를 실행한 컴퓨터
const host = 'localhost';
const port = 3000;

// 서버 만들기
const server = http.createServer((req, res) => {
  const path = url.parse(req.url).pathname; // request에는 path 관련 정보가 있음, url로 추출

  // 만약 root 페이지면
  if (path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Home Page!<h1>');
  } else if (path === '/post') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Post Page!</h1>');
  } else if (path === '/user') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>User Page!</h1>');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Page Not Found</h1>');
  }
});

// 어떤 host와 어떤 서버에서 듣고 있게 할 것인가?
server.listen(port, host, () => {
  console.log('server running on http://localhost:3000');
});
