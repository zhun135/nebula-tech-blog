/* ===================================
   Article Page — TOC Scroll Spy + Comments
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Detect article slug ----------
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '') || 'article';
  const slug = filename;

  // ---------- TOC Scroll Spy ----------
  const tocLinks = document.querySelectorAll('.toc-list a');
  if (tocLinks.length > 0) {
    const sections = [];
    tocLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const section = document.querySelector(href);
        if (section) sections.push({ el: section, link });
      }
    });

    function onScroll() {
      let current = sections[0];
      sections.forEach(({ el, link }) => {
        const top = el.getBoundingClientRect().top;
        if (top < 150) current = { el, link };
      });
      tocLinks.forEach(link => link.parentElement.classList.remove('active'));
      if (current) current.link.parentElement.classList.add('active');
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    tocLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          tocLinks.forEach(l => l.parentElement.classList.remove('active'));
          this.parentElement.classList.add('active');
        }
      });
    });
  }

  // ---------- Comments (localStorage) ----------
  const commentForm = document.getElementById('comment-form');
  const commentList = document.querySelector('.comment-list');

  if (commentForm && commentList) {
    const storageKey = `nebula_comments_${slug}`;

    function loadComments() {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (saved.length > 0) {
        commentList.innerHTML = '';
        saved.forEach((c, idx) => {
          const div = document.createElement('div');
          div.className = 'comment';
          div.innerHTML = `
            <div class="comment-avatar">${c.author[0].toUpperCase()}</div>
            <div class="comment-body">
              <div class="comment-header">
                <span class="comment-author">${escapeHtml(c.author)}</span>
                <span class="comment-time">${c.time}</span>
              </div>
              <p>${escapeHtml(c.content)}</p>
              <div class="comment-actions">
                <button class="like-btn" data-idx="${idx}">${c.likes} ${c.liked ? '已赞' : '赞'}</button>
              </div>
            </div>
          `;
          commentList.appendChild(div);
        });

        // Like button handlers
        commentList.querySelectorAll('.like-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-idx'));
            const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
            if (idx >= 0 && idx < saved.length) {
              if (!saved[idx].liked) {
                saved[idx].likes++;
                saved[idx].liked = true;
                localStorage.setItem(storageKey, JSON.stringify(saved));
                loadComments();
              }
            }
          });
        });
      }
    }

    // Handle form submit
    commentForm.addEventListener('submit', e => {
      e.preventDefault();
      const textarea = commentForm.querySelector('textarea');
      const content = textarea.value.trim();
      if (!content) return;

      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const now = new Date();
      const timeStr = now.toISOString().split('T')[0] + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0');

      saved.push({
        author: 'You',
        content: content,
        time: timeStr,
        likes: 0,
        liked: false
      });

      localStorage.setItem(storageKey, JSON.stringify(saved));
      textarea.value = '';
      loadComments();

      if (window.showToast) window.showToast('评论发表成功', 'success');
    });

    loadComments();
  }
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Copy link button ----------
document.querySelectorAll('.copy-link-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href).then(() => {
      if (window.showToast) window.showToast('链接已复制到剪贴板', 'success');
    }).catch(() => {
      if (window.showToast) window.showToast('复制失败，请手动复制', 'error');
    });
  });
});
