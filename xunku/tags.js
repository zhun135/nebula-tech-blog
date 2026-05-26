/* ===================================
   Tags Page — 从 API 获取标签云
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

  var allArticles = [];

  // 从 API 加载所有文章
  function loadAll() {
    NebulaAPI.getArticles().then(function (articles) {
      allArticles = articles;
      renderTagCloud();
      renderArticleList(articles);
    });
  }

  // 构建标签频率
  function buildTagMap() {
    var map = {};
    allArticles.forEach(function (a) {
      (a.tags || []).forEach(function (tag) {
        map[tag] = (map[tag] || 0) + 1;
      });
    });
    return map;
  }

  function getSizeClass(count, max) {
    var ratio = count / max;
    if (ratio >= 0.75) return 'size-xl';
    if (ratio >= 0.5) return 'size-l';
    if (ratio >= 0.25) return 'size-m';
    return 'size-s';
  }

  function renderTagCloud() {
    var cloud = document.getElementById('tag-cloud');
    if (!cloud) return;

    var tagMap = buildTagMap();
    var counts = Object.values(tagMap);
    var maxCount = counts.length > 0 ? Math.max.apply(null, counts) : 1;
    var sortedTags = Object.keys(tagMap).sort(function (a, b) { return tagMap[b] - tagMap[a]; });

    cloud.innerHTML = sortedTags.map(function (tag) {
      return '<span class="tag-cloud-item ' + getSizeClass(tagMap[tag], maxCount) + '" data-tag="' + tag + '">' +
        tag + '<span class="tag-count">' + tagMap[tag] + '</span></span>';
    }).join('');

    cloud.querySelectorAll('.tag-cloud-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var tag = item.getAttribute('data-tag');
        var isActive = item.classList.contains('active');
        cloud.querySelectorAll('.tag-cloud-item').forEach(function (el) { el.classList.remove('active'); });
        if (!isActive) {
          item.classList.add('active');
          filterByTag(tag);
        } else {
          renderArticleList(allArticles);
        }
      });
    });
  }

  function filterByTag(tag) {
    var filtered = allArticles.filter(function (a) {
      return (a.tags || []).indexOf(tag) !== -1;
    });
    renderArticleList(filtered);
  }

  function renderArticleList(list) {
    var container = document.getElementById('filtered-articles');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = '<div class="no-results">没有找到匹配的文章</div>';
      return;
    }

    container.innerHTML = list.map(function (a) {
      return '<div class="filtered-article">' +
        '<div class="filtered-article-date">' + (a.created_at || '') + '</div>' +
        '<div class="filtered-article-body">' +
        '<h3><a href="' + a.slug + '.html">' + escapeHtml(a.title) + '</a></h3>' +
        '<p>' + escapeHtml(a.subtitle || '') + '</p>' +
        '<div class="filtered-article-tags">' +
        (a.tags || []).map(function (t) { return '<span class="mini-tag">' + escapeHtml(t) + '</span>'; }).join('') +
        '</div></div></div>';
    }).join('');
  }

  loadAll();

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
});
