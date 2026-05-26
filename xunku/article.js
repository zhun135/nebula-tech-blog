/* ===================================
   Article Page — API 动态加载 + TOC + 评论
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  // ---------- 检测文章 slug ----------
  var path = window.location.pathname;
  var filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '') || 'article';
  var slug = filename;
  var params = new URLSearchParams(window.location.search);
  if (params.get('slug')) slug = params.get('slug');
  var isDynamicLoad = !!params.get('slug');

  // ---------- TOC 变量 ----------
  var tocLinks, sections = [];

  function initTOC() {
    tocLinks = document.querySelectorAll('.toc-list a');
    sections = [];
    tocLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        var el = document.querySelector(href);
        if (el) sections.push({ el: el, link: link });
      }
    });
    if (tocLinks.length > 0) bindTOCEvents();
  }

  function bindTOCEvents() {
    window.addEventListener('scroll', onTOCScroll, { passive: true });
    tocLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          tocLinks.forEach(function (l) { l.parentElement.classList.remove('active'); });
          this.parentElement.classList.add('active');
        }
      });
    });
    onTOCScroll();
  }

  function onTOCScroll() {
    if (sections.length === 0) return;
    var current = sections[0];
    sections.forEach(function (s) {
      if (s.el.getBoundingClientRect().top < 150) current = s;
    });
    tocLinks.forEach(function (l) { l.parentElement.classList.remove('active'); });
    if (current) current.link.parentElement.classList.add('active');
  }

  // ---------- 从 API 更新页面元数据 ----------
  function updatePageMeta(data) {
    document.title = data.title + ' — Nebula Tech';

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && data.subtitle) metaDesc.setAttribute('content', data.subtitle.substring(0, 200));

    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', data.title);

    var currentEl = document.querySelector('.article-breadcrumb .current');
    if (currentEl) currentEl.textContent = data.title.substring(0, 20);

    var catTag = document.querySelector('.article-category-tag');
    if (catTag && data.tags) {
      catTag.innerHTML = data.tags.slice(0, 4).map(function (t) {
        return '<span class="tag">' + escapeHtml(t) + '</span>';
      }).join('');
    }

    var titleEl = document.querySelector('.article-title');
    if (titleEl) titleEl.textContent = data.title;
    var subtitleEl = document.querySelector('.article-subtitle');
    if (subtitleEl) subtitleEl.textContent = data.subtitle;

    var avatarEl = document.querySelector('.author-avatar-lg');
    if (avatarEl) avatarEl.textContent = data.author_avatar;
    var nameEl = document.querySelector('.author-name');
    if (nameEl) nameEl.textContent = data.author;
    var roleEl = document.querySelector('.author-role');
    if (roleEl) roleEl.textContent = data.author_role;

    var tagsFooter = document.querySelector('.article-tags-footer');
    if (tagsFooter && data.tags) {
      tagsFooter.innerHTML = data.tags.map(function (t) {
        return '<a href="archive.html?search=' + encodeURIComponent(t) + '" class="tag">' + escapeHtml(t) + '</a>';
      }).join('');
    }

    var cardAvatar = document.querySelector('.author-card-avatar');
    if (cardAvatar) cardAvatar.textContent = data.author_avatar;
    var cardName = document.querySelector('.author-card-body h3');
    if (cardName) cardName.textContent = data.author;

    if (data.cover_gradient) {
      var cover = document.querySelector('.cover-placeholder');
      if (cover) cover.style.background = data.cover_gradient;
    }
  }

  // ---------- 动态加载文章内容 ----------
  if (isDynamicLoad) {
    NebulaAPI.getArticle(slug).then(function (data) {
      if (!data) return;
      updatePageMeta(data);

      if (data.content_html) {
        var articleBody = document.querySelector('.article-body');
        if (articleBody) {
          articleBody.innerHTML = data.content_html;
          initTOC();
        }
      }

      // 更新 URL
      if (window.history.replaceState) {
        var newUrl = data.slug + '.html';
        if (data.slug === 'article') newUrl = 'article.html';
        window.history.replaceState(null, data.title, newUrl);
        slug = data.slug;
      }
    }).catch(function () { /* 使用硬编码内容 */ });
  } else {
    // 非动态模式：仅更新元数据 + 浏览计数
    NebulaAPI.getArticle(slug).then(function (data) {
      if (!data) return;
      updatePageMeta(data);
      // 更新浏览数
      var metaItems = document.querySelectorAll('.meta-item');
      if (metaItems.length >= 3 && data.views) {
        metaItems[2].innerHTML = metaItems[2].innerHTML.replace(/[\d,]+ 次浏览/, data.views.toLocaleString() + ' 次浏览');
      }
    }).catch(function () { /* 使用硬编码内容 */ });

    // 初始化 TOC
    initTOC();
  }

  // ---------- 评论系统（API 优先） ----------
  var commentForm = document.getElementById('comment-form');
  var commentList = document.querySelector('.comment-list');
  var commentCount = document.querySelector('.comments-section h3 span');

  if (commentForm && commentList) {
    function loadComments() {
      NebulaAPI.getComments(slug).then(function (comments) {
        if (comments.length === 0) {
          commentList.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">暂无评论，来说两句吧</p>';
          if (commentCount) commentCount.textContent = '0';
          return;
        }
        if (commentCount) commentCount.textContent = comments.length;
        commentList.innerHTML = '';
        comments.forEach(function (c) {
          var div = document.createElement('div');
          div.className = 'comment';
          div.innerHTML =
            '<div class="comment-avatar">' + escapeHtml((c.author || '?')[0].toUpperCase()) + '</div>' +
            '<div class="comment-body">' +
            '<div class="comment-header">' +
            '<span class="comment-author">' + escapeHtml(c.author) + '</span>' +
            '<span class="comment-time">' + escapeHtml(c.created_at) + '</span>' +
            '</div>' +
            '<p>' + escapeHtml(c.content) + '</p>' +
            '<div class="comment-actions">' +
            '<button class="like-btn" data-id="' + c.id + '">\u{1F44D} ' + (c.likes || 0) + '</button>' +
            '</div></div>';
          commentList.appendChild(div);
        });

        commentList.querySelectorAll('.like-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = parseInt(this.getAttribute('data-id'));
            NebulaAPI.likeComment(id).then(function () { loadComments(); });
          });
        });
      });
    }

    commentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var textarea = commentForm.querySelector('textarea');
      var content = textarea.value.trim();
      if (!content) return;

      NebulaAPI.postComment(slug, 'You', content).then(function () {
        textarea.value = '';
        loadComments();
        if (window.showToast) window.showToast('评论发表成功', 'success');
      }).catch(function (err) {
        if (window.showToast) window.showToast('评论失败：' + err.message, 'error');
      });
    });

    loadComments();
  }

  // ---------- 复制链接 ----------
  document.querySelectorAll('.copy-link-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      navigator.clipboard.writeText(window.location.href).then(function () {
        if (window.showToast) window.showToast('链接已复制到剪贴板', 'success');
      }).catch(function () {
        if (window.showToast) window.showToast('复制失败，请手动复制', 'error');
      });
    });
  });
});
