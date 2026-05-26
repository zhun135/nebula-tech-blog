const express = require('express');
const router = express.Router();
const db = require('../db');

// 订阅
router.post('/', (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: '请输入有效的邮箱地址' });
  }
  const existing = db.prepare('SELECT id FROM subscribers WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: '该邮箱已订阅' });
  }
  const now = new Date().toISOString().split('T')[0];
  db.prepare('INSERT INTO subscribers (email, subscribed_at) VALUES (?, ?)').run(email, now);
  res.json({ ok: true, message: '订阅成功' });
});

module.exports = router;
