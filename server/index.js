const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3001;

app.use(express.json());

// CORS：允许前端跨域访问
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// API 路由
app.use('/api/articles', require('./routes/articles'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/subscribers', require('./routes/subscribers'));

// 健康检查
app.get('/api/health', (req, res) => {
  const articles = db.prepare('SELECT COUNT(*) AS n FROM articles').get().n;
  const comments = db.prepare('SELECT COUNT(*) AS n FROM comments').get().n;
  res.json({ status: 'ok', articles, comments, db: 'SQLite' });
});

// 静态文件服务（前端）
app.use(express.static(path.join(__dirname, '..', 'xunku')));

app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║  Nebula Tech · API 服务器已启动     ║');
  console.log('  ║  http://localhost:' + PORT + '                  ║');
  console.log('  ║  SQLite 数据库: data/nebula.db       ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
});
