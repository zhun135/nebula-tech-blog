/* ===================================
   Archive Page — 从 API 加载文章
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

  var filterTabs = document.querySelectorAll('.filter-tab');
  var archiveList = document.getElementById('archive-list');
  var pagination = document.querySelector('.pagination');

  var ITEMS_PER_PAGE = 6;
  var currentPage = 1;
  var activeFilter = 'all';
  var activeSearch = '';

  // 读取 URL 参数
  var params = new URLSearchParams(window.location.search);
  var categoryParam = params.get('category');
  var searchParam = params.get('search');

  if (searchParam) activeSearch = searchParam.toLowerCase().trim();
  if (categoryParam) {
    activeFilter = categoryParam;
    filterTabs.forEach(function (t) { t.classList.remove('active'); });
    var matchTab = document.querySelector('.filter-tab[data-filter="' + categoryParam + '"]');
    if (matchTab) matchTab.classList.add('active');
  }

  // 从 API 加载
  function loadArticles() {
    var query = {};
    if (activeFilter !== 'all') query.category = activeFilter;
    if (activeSearch) query.search = activeSearch;

    NebulaAPI.getArticles(query).then(function (articles) {
      renderArticles(articles);
    });
  }

  // 按年份分组并渲染
  function renderArticles(articles) {
    var years = {};
    articles.forEach(function (a) {
      var year = a.created_at ? a.created_at.substring(0, 4) : '2026';
      if (!years[year]) years[year] = [];
      years[year].push(a);
    });

    var html = '';
    var yearKeys = Object.keys(years).sort().reverse();

    yearKeys.forEach(function (year) {
      var items = years[year];
      html += '<div class="archive-year-group">';
      html += '<div class="year-header">';
      html += '<span class="year-num">' + year + '</span>';
      html += '<span class="year-count">' + items.length + ' 篇</span>';
      html += '<div class="year-line"></div>';
      html += '</div><div class="year-articles">';

      items.forEach(function (a) {
        var catClass = getCatClass(a.category);
        var dateStr = a.created_at ? a.created_at.substring(5) : '';
        var tags = a.tags || [];
        html += '<article class="archive-item" data-category="' + getCatSlug(a.category) + '">';
        html += '<div class="archive-item-image"><div class="archive-img-placeholder ' + catClass + '"></div></div>';
        html += '<div class="archive-item-body">';
        html += '<div class="archive-item-meta">';
        html += '<span class="archive-date">' + dateStr + '</span>';
        html += '<span class="archive-cat">' + escapeHtml(a.category) + '</span>';
        html += '<span class="archive-read">' + a.read_time + ' min</span>';
        html += '</div>';
        html += '<h3><a href="' + a.slug + '.html">' + escapeHtml(a.title) + '</a></h3>';
        html += '<p>' + escapeHtml(a.subtitle.substring(0, 80)) + '...</p>';
        html += '<div class="archive-item-tags">';
        tags.forEach(function (t) { html += '<span class="tag">' + escapeHtml(t) + '</span>'; });
        html += '</div></div></article>';
      });

      html += '</div></div>';
    });

    archiveList.innerHTML = html;
    filterAndPaginate();
  }

  function getCatClass(cat) {
    var c = (cat || '').toLowerCase();
    if (c.includes('ai') || c.includes('人工')) return 'img-ai';
    if (c.includes('量子')) return 'img-quantum';
    if (c.includes('空间') || c.includes('航天') || c.includes('space')) return 'img-space';
    if (c.includes('系统') || c.includes('rust')) return 'img-rust';
    if (c.includes('web')) return 'img-web3';
    if (c.includes('安全')) return 'img-security';
    return 'img-ai';
  }

  function getCatSlug(cat) {
    var c = (cat || '').toLowerCase();
    if (c.includes('ai') || c.includes('人工')) return 'ai';
    if (c.includes('量子')) return 'quantum';
    if (c.includes('航天') || c.includes('space')) return 'space';
    if (c.includes('系统')) return 'systems';
    if (c.includes('web')) return 'web';
    if (c.includes('安全')) return 'security';
    if (c.includes('机器') || c.includes('具身')) return 'robot';
    return 'ai';
  }

  // 前端过滤 + 分页
  function filterAndPaginate() {
    var items = archiveList.querySelectorAll('.archive-item');
    var visible = [];
    items.forEach(function (item) {
      var cat = item.getAttribute('data-category');
      if (activeFilter !== 'all' && cat !== activeFilter) {
        item.classList.add('filtered-out');
        return;
      }
      if (activeSearch) {
        var title = (item.querySelector('h3 a') || {}).textContent || '';
        var desc = (item.querySelector('p') || {}).textContent || '';
        if (title.toLowerCase().indexOf(activeSearch) === -1 && desc.toLowerCase().indexOf(activeSearch) === -1) {
          item.classList.add('filtered-out');
          return;
        }
      }
      item.classList.remove('filtered-out');
      visible.push(item);
    });

    var totalPages = Math.ceil(visible.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    visible.forEach(function (item, i) {
      if (i >= (currentPage - 1) * ITEMS_PER_PAGE && i < currentPage * ITEMS_PER_PAGE) {
        item.classList.remove('filtered-out');
      } else {
        item.classList.add('filtered-out');
      }
    });

    // 更新年份分组
    var yearGroups = archiveList.querySelectorAll('.archive-year-group');
    yearGroups.forEach(function (group) {
      var visible = group.querySelectorAll('.archive-item:not(.filtered-out)');
      group.style.display = visible.length > 0 ? '' : 'none';
    });

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (!pagination) return;
    if (totalPages <= 1) { pagination.innerHTML = ''; return; }

    var html = '';
    html += '<a href="#" class="page-btn' + (currentPage === 1 ? ' disabled' : '') + '" data-page="prev">&larr; 上一页</a>';
    for (var i = 1; i <= totalPages; i++) {
      if (totalPages <= 7 || i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        html += '<a href="#" class="page-num' + (i === currentPage ? ' active' : '') + '" data-page="' + i + '">' + i + '</a>';
      } else if (i === 2 || i === totalPages - 1) {
        html += '<span class="page-ellipsis">...</span>';
      }
    }
    html += '<a href="#" class="page-btn' + (currentPage === totalPages ? ' disabled' : '') + '" data-page="next">下一页 &rarr;</a>';
    pagination.innerHTML = html;

    pagination.querySelectorAll('[data-page]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var page = btn.getAttribute('data-page');
        if (page === 'prev') currentPage = Math.max(1, currentPage - 1);
        else if (page === 'next') currentPage = Math.min(totalPages, currentPage + 1);
        else currentPage = parseInt(page);
        filterAndPaginate();
        window.scrollTo({ top: archiveList.offsetTop - 80, behavior: 'smooth' });
      });
    });
  }

  // 过滤标签点击
  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      filterTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      activeFilter = tab.getAttribute('data-filter');
      activeSearch = '';
      currentPage = 1;
      filterAndPaginate();
    });
  });

  // 排序
  var sortSelect = document.querySelector('.sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      var sortBy = sortSelect.value;
      var yearGroups = archiveList.querySelectorAll('.archive-year-group');
      yearGroups.forEach(function (group) {
        var container = group.querySelector('.year-articles');
        if (!container) return;
        var articles = Array.from(container.querySelectorAll('.archive-item'));
        articles.sort(function (a, b) {
          var dateA = (a.querySelector('.archive-date') || {}).textContent || '';
          var dateB = (b.querySelector('.archive-date') || {}).textContent || '';
          var readA = parseInt((a.querySelector('.archive-read') || {}).textContent) || 0;
          var readB = parseInt((b.querySelector('.archive-read') || {}).textContent) || 0;
          if (sortBy === 'oldest') return dateA.localeCompare(dateB);
          if (sortBy === 'longest') return readB - readA;
          return dateB.localeCompare(dateA);
        });
        articles.forEach(function (a) { container.appendChild(a); });
      });
      currentPage = 1;
      filterAndPaginate();
    });
  }

  // 初始加载
  loadArticles();

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
});
