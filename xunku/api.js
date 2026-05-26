/* ===================================
   Nebula Tech · 前端 API 封装层
   后端可用时调用 API，否则降级到 localStorage
   =================================== */

const API_BASE = (function () {
  // 自动检测：优先使用当前域名，本地开发时用 localhost:3001
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  return '/api';
})();

const NebulaAPI = {
  // ---------- 文章 ----------
  async getArticles(params = {}) {
    const qs = new URLSearchParams(params).toString();
    try {
      const res = await fetch(API_BASE + '/articles?' + qs);
      if (!res.ok) throw new Error('API 不可用');
      return await res.json();
    } catch (e) {
      console.warn('API 不可用，使用本地数据');
      return this._getLocalArticles(params);
    }
  },

  async getArticle(slug) {
    try {
      const res = await fetch(API_BASE + '/articles/' + slug);
      if (!res.ok) throw new Error('API 不可用');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async getTags() {
    try {
      const res = await fetch(API_BASE + '/articles/tags');
      if (!res.ok) throw new Error('API 不可用');
      return await res.json();
    } catch (e) {
      return {};
    }
  },

  // ---------- 评论 ----------
  async getComments(slug) {
    try {
      const res = await fetch(API_BASE + '/comments/' + slug);
      if (!res.ok) throw new Error('API 不可用');
      return await res.json();
    } catch (e) {
      return this._getLocalComments(slug);
    }
  },

  async postComment(slug, author, content) {
    try {
      const res = await fetch(API_BASE + '/comments/' + slug, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content })
      });
      if (!res.ok) throw new Error('API 不可用');
      return await res.json();
    } catch (e) {
      return this._postLocalComment(slug, author, content);
    }
  },

  async likeComment(id) {
    try {
      await fetch(API_BASE + '/comments/like/' + id, { method: 'POST' });
    } catch (e) { /* 降级：无操作 */ }
  },

  // ---------- 订阅 ----------
  async subscribe(email) {
    try {
      const res = await fetch(API_BASE + '/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    } catch (e) {
      // 降级到 localStorage
      const subs = JSON.parse(localStorage.getItem('nebula_subscribers') || '[]');
      if (subs.includes(email)) throw new Error('该邮箱已订阅');
      subs.push(email);
      localStorage.setItem('nebula_subscribers', JSON.stringify(subs));
      return { ok: true, message: '订阅成功（本地存储）' };
    }
  },

  // ---------- 本地降级 ----------
  _getLocalArticles(params) {
    // 使用页面已有的静态数据
    return [];
  },

  _getLocalComments(slug) {
    const key = 'nebula_comments_' + slug;
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  _postLocalComment(slug, author, content) {
    const key = 'nebula_comments_' + slug;
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    const now = new Date();
    const timeStr = now.toISOString().split('T')[0];
    const comment = { id: Date.now(), author: author || '匿名', content, likes: 0, created_at: timeStr };
    saved.push(comment);
    localStorage.setItem(key, JSON.stringify(saved));
    return comment;
  }
};

// 全局暴露
window.NebulaAPI = NebulaAPI;
