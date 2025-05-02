/**
 * Express는 Http 모듈보다 훨씬 가독성도 좋고 이해하기 쉬운 버전이라 생각하면된다.
 */

const express = require('express');

const app = express();

// 하나의 app 인스턴스에 route에 관련된 기능을 붙여줄 수 있음(가독성 좋음)
app.get('/', (req, res) => {
  res.send('<h1>Home Page</h1>');
});

app.get('/post', (req, res) => {
  res.send('<h1>Post Page</h1>');
});

app.get('/user', (req, res) => {
  res.send('<h1>User Page</h1>');
});

// 404에러는 app.use()사용(위에 있는 응답들에 해당하는게 없으면 app.use(404로 간다))
app.use((req, res) => {
  res.status(404).send('<h1>404 Page Not Found!</h1>');
});

app.listen(3000, () => {
  console.log('server running on http://localhost:3000');
});
