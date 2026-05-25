/* ===================================
   Archive Page — Filter, Sort, Search, Pagination
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  const filterTabs = document.querySelectorAll('.filter-tab');
  const archiveItems = document.querySelectorAll('.archive-item');
  const yearGroups = document.querySelectorAll('.archive-year-group');
  const pagination = document.querySelector('.pagination');
  const archiveList = document.getElementById('archive-list');

  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;
  let activeFilter = 'all';
  let activeSearch = '';

  // ---------- Read URL params ----------
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get('category');
  const searchParam = params.get('search');

  if (searchParam) {
    activeSearch = searchParam.toLowerCase().trim();
  }

  // ---------- Apply initial filter from URL ----------
  if (categoryParam) {
    activeFilter = categoryParam;
    filterTabs.forEach(t => t.classList.remove('active'));
    const matchTab = document.querySelector(`.filter-tab[data-filter="${categoryParam}"]`);
    if (matchTab) {
      matchTab.classList.add('active');
    }
  }

  // ---------- Filter and search ----------
  function getVisibleItems() {
    const visible = [];
    archiveItems.forEach(item => {
      const cat = item.getAttribute('data-category');
      const titleEl = item.querySelector('h3 a');
      const descEl = item.querySelector('p');
      const title = titleEl ? titleEl.textContent.toLowerCase() : '';
      const desc = descEl ? descEl.textContent.toLowerCase() : '';

      // Category filter
      if (activeFilter !== 'all' && cat !== activeFilter) {
        item.classList.add('filtered-out');
        return;
      }

      // Search filter
      if (activeSearch && !title.includes(activeSearch) && !desc.includes(activeSearch)) {
        item.classList.add('filtered-out');
        return;
      }

      item.classList.remove('filtered-out');
      visible.push(item);
    });
    return visible;
  }

  // ---------- Pagination ----------
  function paginate(items) {
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;

    // Clamp current page
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    // Hide all, then show current page
    items.forEach((item, i) => {
      const inPage = i >= (currentPage - 1) * ITEMS_PER_PAGE && i < currentPage * ITEMS_PER_PAGE;
      if (inPage) {
        item.classList.remove('filtered-out');
      } else {
        item.classList.add('filtered-out');
      }
    });

    // Update year group visibility
    setTimeout(() => {
      yearGroups.forEach(group => {
        const visibleInGroup = group.querySelectorAll('.archive-item:not(.filtered-out)');
        group.style.display = visibleInGroup.length > 0 ? '' : 'none';
      });
    }, 50);

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (!pagination) return;
    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }

    let html = '';
    html += `<a href="#" class="page-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="prev">← 上一页</a>`;

    for (let i = 1; i <= totalPages; i++) {
      if (totalPages <= 7 || i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        html += `<a href="#" class="page-num ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`;
      } else if (i === 2 || i === totalPages - 1) {
        html += '<span class="page-ellipsis">...</span>';
      }
    }

    html += `<a href="#" class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="next">下一页 →</a>`;
    pagination.innerHTML = html;

    // Bind pagination clicks
    pagination.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const page = btn.getAttribute('data-page');
        if (page === 'prev') currentPage = Math.max(1, currentPage - 1);
        else if (page === 'next') currentPage = Math.min(totalPages, currentPage + 1);
        else currentPage = parseInt(page);
        applyAll();
        window.scrollTo({ top: (archiveList ? archiveList.offsetTop : 300) - 80, behavior: 'smooth' });
      });
    });
  }

  // ---------- Apply all filters ----------
  function applyAll() {
    const visible = getVisibleItems();
    paginate(visible);
  }

  // ---------- Filter tab clicks ----------
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.getAttribute('data-filter');
      activeSearch = '';
      currentPage = 1;
      applyAll();
    });
  });

  // ---------- Sort ----------
  const sortSelect = document.querySelector('.sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const sortBy = sortSelect.value;

      yearGroups.forEach(group => {
        const articlesContainer = group.querySelector('.year-articles');
        if (!articlesContainer) return;
        const articles = Array.from(articlesContainer.querySelectorAll('.archive-item'));

        articles.sort((a, b) => {
          const dateA = a.querySelector('.archive-date').textContent.trim();
          const dateB = b.querySelector('.archive-date').textContent.trim();
          const readA = parseInt(a.querySelector('.archive-read').textContent) || 0;
          const readB = parseInt(b.querySelector('.archive-read').textContent) || 0;

          switch (sortBy) {
            case 'oldest':
              return dateA.localeCompare(dateB);
            case 'longest':
              return readB - readA;
            case 'latest':
            default:
              return dateB.localeCompare(dateA);
          }
        });

        articles.forEach(article => articlesContainer.appendChild(article));
      });

      currentPage = 1;
      applyAll();
    });
  }

  // ---------- Initial render ----------
  applyAll();

  // If there's an archive list and a filter was applied, scroll to it
  if (archiveList && (categoryParam || searchParam)) {
    setTimeout(() => {
      archiveList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }
});
