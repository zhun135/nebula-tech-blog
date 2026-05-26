const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取文章列表
router.get('/', (req, res) => {
  const { category, tag, search, limit } = req.query;
  let sql = 'SELECT id, slug, title, subtitle, author, author_avatar, category, tags, read_time, created_at, views FROM articles WHERE 1=1';
  const params = {};

  if (category && category !== 'all') {
    // 模糊匹配分类（支持 AI、ai、AI · 机器人 等变体）
    sql += ' AND (LOWER(category) LIKE @cat OR LOWER(category) LIKE @cat2)';
    const cat = category.toLowerCase();
    params.cat = `%${cat}%`;
    params.cat2 = `%${cat.replace(/[·\s]+/g, '')}%`;
  }
  if (tag) {
    sql += ' AND tags LIKE @tag';
    params.tag = `%"${tag}"%`;
  }
  if (search) {
    sql += ' AND (title LIKE @search OR subtitle LIKE @search)';
    params.search = `%${search}%`;
  }
  sql += ' ORDER BY created_at DESC';
  if (limit) sql += ' LIMIT ' + parseInt(limit);

  const articles = db.prepare(sql).all(params);
  res.json(articles.map(a => ({ ...a, tags: JSON.parse(a.tags || '[]') })));
});

// 获取标签统计
router.get('/tags', (req, res) => {
  const articles = db.prepare('SELECT tags FROM articles').all();
  const tagMap = {};
  articles.forEach(a => {
    const tags = JSON.parse(a.tags || '[]');
    tags.forEach(t => { tagMap[t] = (tagMap[t] || 0) + 1; });
  });
  res.json(tagMap);
});

// 获取单篇文章
router.get('/:slug', (req, res) => {
  const article = db.prepare('SELECT * FROM articles WHERE slug = ?').get(req.params.slug);
  if (!article) return res.status(404).json({ error: '文章不存在' });

  // 增加浏览次数
  db.prepare('UPDATE articles SET views = views + 1 WHERE slug = ?').run(req.params.slug);

  // 附加评论
  const comments = db.prepare('SELECT * FROM comments WHERE article_slug = ? ORDER BY created_at DESC').all(req.params.slug);

  res.json({
    ...article,
    tags: JSON.parse(article.tags || '[]'),
    toc: JSON.parse(article.toc_json || '[]'),
    comments
  });
});

// 获取文章统计
router.get('/stats/overview', (req, res) => {
  const totalArticles = db.prepare('SELECT COUNT(*) AS n FROM articles').get().n;
  const totalViews = db.prepare('SELECT SUM(views) AS n FROM articles').get().n || 0;
  const totalComments = db.prepare('SELECT COUNT(*) AS n FROM comments').get().n;
  const categories = db.prepare('SELECT category, COUNT(*) AS n FROM articles GROUP BY category ORDER BY n DESC').all();
  res.json({ totalArticles, totalViews, totalComments, categories });
});

module.exports = router;
