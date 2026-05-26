/* ===================================
   Nebula Tech Blog · 页面交互引擎
   粒子背景 / 打字效果 / 滚动动画 / 阅读进度
   =================================== */

// ---------- Particle Network Background ----------
var canvas = document.getElementById('particle-canvas');
if (canvas) {
  var ctx = canvas.getContext('2d');

  var particles = [];
  var mouseX = -500;
  var mouseY = -500;
  var width, height;
  var isMobile = window.innerWidth < 768;

  function Particle() {
    this.reset();
    this.y = Math.random() * height;
  }

  Particle.prototype.reset = function () {
    this.x = Math.random() * width;
    this.y = -5;
    this.z = Math.random() * 3 + 1;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = Math.random() * 0.3 + 0.1;
    this.radius = this.z * 0.8;
    this.opacity = Math.random() * 0.4 + 0.1;
  };

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;

    if (this.y > height + 5 || this.x < -5 || this.x > width + 5) {
      this.reset();
    }

    var dx = this.x - mouseX;
    var dy = this.y - mouseY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120 && mouseX > 0) {
      var angle = Math.atan2(dy, dx);
      var force = (120 - dist) / 120;
      this.x += Math.cos(angle) * force * 2;
      this.y += Math.sin(angle) * force * 2;
    }
  };

  Particle.prototype.draw = function () {
    var isLight = document.body.classList.contains('light');
    var hue = isLight ? '0, 119, 255' : '0, 229, 255';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + hue + ', ' + this.opacity + ')';
    ctx.fill();
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    isMobile = window.innerWidth < 768;
    var divisor = isMobile ? 14000 : 8500;
    var count = Math.floor((width * height) / divisor);
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawLines() {
    if (isMobile) return;
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          var opacity = (1 - dist / 120) * 0.12;
          var isLight = document.body.classList.contains('light');
          var color = isLight ? '0, 119, 255' : '0, 229, 255';
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + color + ', ' + opacity + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    drawLines();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  window.addEventListener('mouseleave', function () {
    mouseX = -500;
    mouseY = -500;
  });

  resize();
  animate();
}

// ---------- Typewriter Effect ----------
var typewriterEl = document.getElementById('typewriter');
if (typewriterEl) {
  var words = ['无限可能', '星辰大海', '数字宇宙', '智能未来', '量子纪元'];
  var wordIdx = 0;
  var charIdx = 0;
  var isDeleting = false;
  var typeSpeed = 100;
  var deleteSpeed = 55;
  var pauseTime = 1800;

  function typeLoop() {
    var current = words[wordIdx];
    if (isDeleting) {
      typewriterEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typewriterEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    if (!isDeleting && charIdx === current.length) {
      setTimeout(function () { isDeleting = true; typeLoop(); }, pauseTime);
      return;
    }
    if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, isDeleting ? deleteSpeed : typeSpeed);
  }

  setTimeout(typeLoop, 600);
}

// ---------- Counter Animation ----------
function animateCounters() {
  var statEls = document.querySelectorAll('.stat-num');
  for (var i = 0; i < statEls.length; i++) {
    (function (el) {
      var target = el.getAttribute('data-count');
      var isSuffix = target.indexOf('K') !== -1;
      var num = parseInt(target.replace('K', ''));
      var suffix = isSuffix ? 'K' : '';
      var current = 0;
      var increment = Math.ceil(num / 40);
      var timer = setInterval(function () {
        current += increment;
        if (current >= num) {
          el.textContent = num + suffix;
          clearInterval(timer);
        } else {
          el.textContent = current + suffix;
        }
      }, 30);
    })(statEls[i]);
  }
}

// ---------- Scroll Animations ----------
var scrollObserver = new IntersectionObserver(function (entries) {
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].isIntersecting) {
      entries[i].target.classList.add('animate-in');
      scrollObserver.unobserve(entries[i].target);
    }
  }
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

var animTargets = document.querySelectorAll('.blog-card, .category-card, .section-header');
for (var i = 0; i < animTargets.length; i++) {
  scrollObserver.observe(animTargets[i]);
}

var statsObserver = new IntersectionObserver(function (entries) {
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entries[i].target);
    }
  }
}, { threshold: 0.5 });

var statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

// ---------- Subscribe Form ----------
var form = document.getElementById('subscribe-form');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.querySelector('input').value.trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showToast('请输入邮箱地址', 'error');
      return;
    }
    if (!emailRegex.test(email)) {
      showToast('请输入有效的邮箱地址', 'error');
      return;
    }
    var subs = JSON.parse(localStorage.getItem('nebula_subscribers') || '[]');
    if (subs.indexOf(email) !== -1) {
      showToast('该邮箱已订阅过了', 'error');
      return;
    }
    subs.push(email);
    localStorage.setItem('nebula_subscribers', JSON.stringify(subs));
    showToast('订阅成功！欢迎加入星云社区', 'success');
    form.reset();
  });
}

// ---------- Smooth scroll for nav links ----------
var anchors = document.querySelectorAll('a[href^="#"]');
for (var i = 0; i < anchors.length; i++) {
  anchors[i].addEventListener('click', function (e) {
    e.preventDefault();
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

console.log('%c🚀 Nebula Tech Blog %c已就绪',
  'color: #00e5ff; font-size: 1.2em; font-weight: bold;',
  'color: #8888a0;');
console.log('%c⚡ 粒子引擎 · 打字效果 · 主题切换 · 搜索覆盖层 · 阅读进度',
  'color: #b44dff; font-size: 0.9em;');

// ---------- Reading Progress Bar ----------
(function () {
  var bar = document.createElement('div');
  bar.className = 'reading-progress';
  document.body.appendChild(bar);

  window.addEventListener('scroll', function () {
    var scrollTop = document.documentElement.scrollTop;
    var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = Math.min(progress, 100) + '%';
  }, { passive: true });
})();

// ---------- Back to Top Button ----------
(function () {
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', '回到顶部');
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ---------- Toast Notification Helper ----------
function showToast(message, type) {
  type = type || 'info';
  var container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 2800);
}

// ---------- 首页文章动态加载 ----------
(function () {
  var featuredGrid = document.querySelector('.featured-grid');
  if (!featuredGrid) return;

  NebulaAPI.getArticles({ limit: 6 }).then(function (articles) {
    if (!articles || articles.length === 0) return;

    var catClassMap = {
      'ai': 'img-ai', '量子计算': 'img-quantum', '航天科技': 'img-space',
      '系统编程': 'img-rust', 'web': 'img-web3', '安全': 'img-security',
      '机器人': 'img-ai', 'space': 'img-space'
    };

    function getCatClass(cat) {
      var c = (cat || '').toLowerCase();
      if (c.indexOf('ai') !== -1 || c.indexOf('人工') !== -1 || c.indexOf('机器') !== -1) return 'img-ai';
      if (c.indexOf('量子') !== -1) return 'img-quantum';
      if (c.indexOf('航天') !== -1 || c.indexOf('space') !== -1) return 'img-space';
      if (c.indexOf('系统') !== -1 || c.indexOf('rust') !== -1) return 'img-rust';
      if (c.indexOf('web') !== -1) return 'img-web3';
      if (c.indexOf('安全') !== -1) return 'img-security';
      return 'img-ai';
    }

    function getCatSlug(cat) {
      var c = (cat || '').toLowerCase();
      if (c.indexOf('ai') !== -1 || c.indexOf('人工') !== -1) return 'ai';
      if (c.indexOf('量子') !== -1) return 'quantum';
      if (c.indexOf('航天') !== -1 || c.indexOf('space') !== -1) return 'space';
      if (c.indexOf('系统') !== -1) return 'systems';
      if (c.indexOf('web') !== -1) return 'web';
      if (c.indexOf('安全') !== -1) return 'security';
      if (c.indexOf('机器') !== -1 || c.indexOf('具身') !== -1) return 'robot';
      return 'all';
    }

    var mainArticle = articles[0];
    var restArticles = articles.slice(1, 6);

    var html = '';

    // 主推文章（大卡片）
    html += '<article class="blog-card featured-main">';
    html += '<div class="card-image">';
    html += '<div class="card-img-placeholder ' + getCatClass(mainArticle.category) + '"></div>';
    html += '<div class="card-category">' + escapeHtml(mainArticle.category) + '</div>';
    html += '</div>';
    html += '<div class="card-body">';
    html += '<div class="card-meta">';
    html += '<span class="meta-date">' + (mainArticle.created_at || '') + '</span>';
    html += '<span class="meta-divider">|</span>';
    html += '<span class="meta-read">' + mainArticle.read_time + ' min 阅读</span>';
    html += '</div>';
    html += '<h3 class="card-title"><a href="' + mainArticle.slug + '.html">' + escapeHtml(mainArticle.title) + '</a></h3>';
    html += '<p class="card-excerpt">' + escapeHtml((mainArticle.subtitle || '').substring(0, 150)) + '...</p>';
    html += '<div class="card-footer">';
    html += '<div class="author"><div class="author-avatar">' + escapeHtml(mainArticle.author_avatar) + '</div><span>' + escapeHtml(mainArticle.author) + '</span></div>';
    html += '<div class="card-tags">';
    (mainArticle.tags || []).slice(0, 3).forEach(function (t) { html += '<span class="tag">' + escapeHtml(t) + '</span>'; });
    html += '</div></div></div></article>';

    // 其余文章（小卡片）
    restArticles.forEach(function (a) {
      html += '<article class="blog-card">';
      html += '<div class="card-image">';
      html += '<div class="card-img-placeholder ' + getCatClass(a.category) + '"></div>';
      html += '<div class="card-category">' + escapeHtml(a.category) + '</div>';
      html += '</div>';
      html += '<div class="card-body">';
      html += '<div class="card-meta">';
      html += '<span class="meta-date">' + (a.created_at || '') + '</span>';
      html += '<span class="meta-divider">|</span>';
      html += '<span class="meta-read">' + a.read_time + ' min 阅读</span>';
      html += '</div>';
      html += '<h3 class="card-title"><a href="' + a.slug + '.html">' + escapeHtml(a.title) + '</a></h3>';
      html += '<p class="card-excerpt">' + escapeHtml((a.subtitle || '').substring(0, 100)) + '...</p>';
      html += '<div class="card-footer">';
      html += '<div class="author"><div class="author-avatar">' + escapeHtml(a.author_avatar) + '</div><span>' + escapeHtml(a.author) + '</span></div>';
      html += '<div class="card-tags">';
      (a.tags || []).slice(0, 3).forEach(function (t) { html += '<span class="tag">' + escapeHtml(t) + '</span>'; });
      html += '</div></div></div></article>';
    });

    featuredGrid.innerHTML = html;

    // 重新观察新卡片
    var newCards = featuredGrid.querySelectorAll('.blog-card');
    for (var i = 0; i < newCards.length; i++) {
      scrollObserver.observe(newCards[i]);
    }
  }).catch(function () {
    // API 不可用，保留静态 HTML
  });

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
})();
