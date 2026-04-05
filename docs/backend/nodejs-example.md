# Node.js 示例

这是一个 Node.js 后端示例文档，展示了如何使用 Node.js 构建服务器端应用。

## Node.js 简介

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时，用于构建高性能的网络应用。

## 基本服务器示例

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

const port = 3000;
server.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}/`);
});
```

## Express 框架示例

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`应用运行在 http://localhost:${port}/`);
});
```

## 更多资源

- [Node.js 官方文档](https://nodejs.org/zh-cn/docs/)
- [Express 官方文档](https://expressjs.com/zh-cn/)
- [Node.js 教程](https://nodejs.org/zh-cn/docs/guides/)