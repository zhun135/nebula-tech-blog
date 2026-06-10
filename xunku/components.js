/* ===================================
   Nebula Tech Blog · 公共组件引擎
   导航栏 / 搜索覆盖层 / 页脚 / 主题切换 / 移动菜单
   含 05 游戏入口
   =================================== */

(function () {
  const currentPage = (function () {
    const path = window.location.pathname;
    const name = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
    if (!name || name === 'index') return 'index';
    if (name.startsWith('article')) return 'article';
    return name;
  })();

  const navHTML = `
    <nav class="navbar scrolled" id="navbar">
      <div class="nav-inner">
        <a href="index.html" class="logo">
          <span class="logo-bracket">&lt;</span>
          <span class="logo-text">Nebula</span>
          <span class="logo-dot">·</span>
          <span class="logo-sub">Tech</span>
          <span class="logo-bracket">/&gt;</span>
        </a>
        <ul class="nav-links">
          <li><a href="index.html" class="nav-item${currentPage === 'index' ? ' active' : ''}"><span class="nav-num">01</span> 首页</a></li>
          <li><a href="archive.html" class="nav-item${currentPage === 'archive' || currentPage === 'article' || currentPage === 'tags' ? ' active' : ''}"><span class="nav-num">02</span> 文章</a></li>
          <li><a href="index.html#categories" class="nav-item"><span class="nav-num">03</span> 分类</a></li>
          <li><a href="about.html" class="nav-item${currentPage === 'about' ? ' active' : ''}"><span class="nav-num">04</span> 关于</a></li>
          <li><a href="games.html" class="nav-item${currentPage === 'games' ? ' active' : ''}"><span class="nav-num">05</span> 游戏</a></li>
        </ul>
        <div class="nav-actions">
          <button class="btn-search" id="btn-search" aria-label="搜索">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button class="btn-theme" id="btn-theme" aria-label="切换主题">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          </button>
        </div>
        <button class="hamburger" id="hamburger" aria-label="菜单">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>`;

  const searchHTML = `
    <div class="search-overlay" id="search-overlay">
      <div class="search-modal">
        <input type="text" class="search-input" placeholder="搜索文章..." id="search-input">
        <div class="search-shortcut"><kbd>ESC</kbd> 关闭 · <kbd>Enter</kbd> 搜索</div>
      </div>
    </div>`;

  const footerHTML = `
    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo">
            <span class="logo-bracket">&lt;</span><span class="logo-text">Nebula</span><span class="logo-dot">·</span><span class="logo-sub">Tech</span><span class="logo-bracket">/&gt;</span>
          </a>
          <p>记录科技脉搏，探索数字宇宙的无限可能。</p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" class="social-link" aria-label="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 4-10 7L2 4"/></svg>
            </a>
          </div>
        </div>
        <div class="footer-links">
          <h4>快速导航</h4>
          <ul>
            <li><a href="index.html">首页</a></li>
            <li><a href="archive.html">文章归档</a></li>
            <li><a href="tags.html">标签云</a></li>
            <li><a href="about.html">关于我们</a></li>
            <li><a href="games.html">🎮 05游戏</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>热门专题</h4>
          <ul>
            <li><a href="archive.html?category=ai">AI 前沿</a></li>
            <li><a href="archive.html?category=systems">Rust 编程</a></li>
            <li><a href="archive.html?category=web">Web 3.0</a></li>
            <li><a href="archive.html?category=space">太空探索</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>友情链接</h4>
          <ul>
            <li><a href="#">TechCrunch</a></li>
            <li><a href="#">ArXiv 精选</a></li>
            <li><a href="#">Hacker News</a></li>
            <li><a href="#">GitHub Trends</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-line"></div>
        <p>&copy; 2026 Nebula Tech · 用热爱书写科技未来</p>
      </div>
    </footer>`;

  // ---------- 注入到占位符 ----------
  function inject(id, html) {
    const el = document.getElementById(id);
    if (el) el.outerHTML = html;
  }

  inject('nav-placeholder', navHTML);
  inject('search-placeholder', searchHTML);
  inject('footer-placeholder', footerHTML);

  // ---------- 主题切换 ----------
  const btnTheme = document.getElementById('btn-theme');
  if (btnTheme) {
    btnTheme.addEventListener('click', function () {
      document.body.classList.toggle('light');
      var isLight = document.body.classList.contains('light');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
  }

  // ---------- 搜索覆盖层 ----------
  const btnSearch = document.getElementById('btn-search');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');

  if (btnSearch && searchOverlay && searchInput) {
    btnSearch.addEventListener('click', function () {
      searchOverlay.classList.add('active');
      setTimeout(function () { searchInput.focus(); }, 100);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchOverlay.classList.toggle('active');
        if (searchOverlay.classList.contains('active')) {
          setTimeout(function () { searchInput.focus(); }, 100);
        }
      }
    });

    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) {
        searchOverlay.classList.remove('active');
      }
    });

    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var query = searchInput.value.trim();
        if (query) {
          window.location.href = 'archive.html?search=' + encodeURIComponent(query);
        }
      }
    });
  }

  // ---------- 移动端汉堡菜单 ----------
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    var links = navLinks.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    }
  }

  // ---------- 导航栏滚动效果 ----------
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY > 80;
      if (scrolled) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }
})();
