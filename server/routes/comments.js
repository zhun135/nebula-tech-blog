const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取文章评论
router.get('/:slug', (req, res) => {
  const comments = db.prepare('SELECT * FROM comments WHERE article_slug = ? ORDER BY created_at DESC').all(req.params.slug);
  res.json(comments);
});

// 提交评论
router.post('/:slug', (req, res) => {
  const { author, content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: '评论内容不能为空' });
  }
  const now = new Date().toISOString().split('T')[0];
  const result = db.prepare('INSERT INTO comments (article_slug, author, content, created_at) VALUES (?, ?, ?, ?)').run(
    req.params.slug, (author || '匿名').trim(), content.trim(), now
  );
  res.json({ id: result.lastInsertRowid, author: author || '匿名', content: content.trim(), likes: 0, created_at: now });
});

// 点赞评论
router.post('/like/:id', (req, res) => {
  db.prepare('UPDATE comments SET likes = likes + 1 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
