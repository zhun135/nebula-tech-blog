/* ===================================
   Tags Page — Tag Cloud & Filter
   =================================== */

const articles = [
  {
    title: '具身智能爆发：2026 人形机器人量产元年全解读',
    date: '2026.05.25',
    excerpt: 'Figure 03 进宝马工厂、Tesla Optimus Gen 3 量产启动、宇树 H1 全球出货超 500 台——人形机器人正从实验室以惊人速度走进工厂和家庭...',
    link: 'article-embodied-ai.html',
    tags: ['具身智能', '机器人', 'Figure', 'Optimus', '宇树']
  },
  {
    title: 'Rust 进入 Linux 内核：30 年 C 语言王朝的转折点',
    date: '2026.05.24',
    excerpt: 'Linus Torvalds 正式合并首个 Rust 设备驱动进内核主线，内存安全终于从编译时得到了保证。零内存漏洞 vs 70% 的 CVE，内核开发进入新纪元...',
    link: 'article-rust-kernel.html',
    tags: ['Rust', 'Linux', '内核', '开源']
  },
  {
    title: 'WebAssembly 2026：超越浏览器，重塑云端计算格局',
    date: '2026.05.22',
    excerpt: 'WASI Preview 3 正式发布、组件模型进入生产环境、浏览器外运行时生态爆发——WebAssembly 正从浏览器的沙盒走向服务器的核心...',
    link: 'article-wasm-2026.html',
    tags: ['WASM', 'WASI', '云计算', 'Web']
  },
  {
    title: 'GPT-5.5 vs Claude Opus 4.7：2026 大模型争霸战全景解读',
    date: '2026.05.24',
    excerpt: '短短两周内，OpenAI 发布 GPT-5.5 全面超越 Claude Opus 4.7，幻觉减少 60%。从参数竞赛到 Agent 协作，这场 AI 军备竞赛正在重新定义技术的边界...',
    link: 'article.html',
    tags: ['GPT-5.5', 'Claude', '深度']
  },
  {
    title: '中国"九章四号"再破世界纪录：3050 光子改写量子霸权',
    date: '2026.05.13',
    excerpt: '中国科大成功研制九章四号量子计算原型机，操控 3050 个光子，比超算快 10^54 倍...',
    link: 'article-jiuzhang.html',
    tags: ['九章', 'Nature', '量子']
  },
  {
    title: 'SpaceX 星舰 V3 第 12 次试飞：新一代系统首飞全记录',
    date: '2026.05.23',
    excerpt: '全新设计的星舰 V3 系统从得州 Starbase 升空，33 台猛禽 3 发动机成功点火...',
    link: 'article-starship.html',
    tags: ['SpaceX', 'V3', '星舰']
  },
  {
    title: 'Claude Code 实战指南：用 AI Agent 管理十万行代码库',
    date: '2026.04.16',
    excerpt: '深度体验多智能体共享记忆、"dreaming"机制与 100 万 token 长文本窗口...',
    link: 'article.html',
    tags: ['Claude Code', 'Agent', 'Rust']
  },
  {
    title: '法国 Pasqal 首次证明逻辑量子比特优于物理量子比特',
    date: '2026.05.21',
    excerpt: '逻辑量子比特在求解微分方程时准确度平均提升超 50%，非线性问题提升高达 10 倍...',
    link: 'article.html',
    tags: ['QEC', 'Pasqal', '量子']
  },
  {
    title: 'Claude Opus 4.6 Agent Teams 自主发现 500+ 零日漏洞',
    date: '2026.04.28',
    excerpt: 'Anthropic 披露 Claude Opus 4.6 的 16 个 Agent 并行协作，两周内发现超 500 个零日漏洞...',
    link: 'article.html',
    tags: ['安全', 'Agent']
  },
  {
    title: 'GPT-5 技术深度解析：多模态融合的新范式',
    date: '2026.05.20',
    excerpt: '深入探讨下一代大语言模型在架构设计、训练策略以及多模态理解方面的突破性进展...',
    link: 'article.html',
    tags: ['AI', '深度学习', 'LLM', 'GPT-5', '多模态', 'Transformer']
  },
  {
    title: '量子霸权之后：实用化量子计算的路线图',
    date: '2026.05.18',
    excerpt: '从实验室到商业化落地，量子计算正在经历关键的转折点...',
    link: 'article.html',
    tags: ['量子', '硬件']
  },
  {
    title: '去中心化社交协议：Nostr 与 ActivityPub 对比',
    date: '2026.05.15',
    excerpt: '两种主流去中心化社交协议的架构差异、生态发展及未来展望...',
    link: 'article.html',
    tags: ['Social', '协议', 'Web3']
  },
  {
    title: 'Rust 异步运行时深度对比：Tokio vs Async-std',
    date: '2026.05.12',
    excerpt: '从调度策略到生态系统，全面对比两大 Rust 异步运行时的设计与性能...',
    link: 'article.html',
    tags: ['Rust', 'Async']
  },
  {
    title: 'Starship 第四次试飞：完全可复用火箭时代来临',
    date: '2026.05.10',
    excerpt: '详细复盘 SpaceX Starship 的关键技术突破与未来深空探索计划...',
    link: 'article.html',
    tags: ['SpaceX', '火箭']
  },
  {
    title: '零知识证明在实际应用中的安全挑战',
    date: '2026.05.08',
    excerpt: 'ZKP 技术在隐私保护和扩容方案中的应用及其潜在安全风险分析...',
    link: 'article.html',
    tags: ['ZKP', '安全']
  },
  {
    title: '2025 AI 年度回顾：从 Claude 4 到开源浪潮',
    date: '2025.12.28',
    excerpt: '回顾 2025 年 AI 领域的重大进展，从模型能力飞跃到开源生态的全面崛起...',
    link: 'article.html',
    tags: ['年度回顾', 'AI']
  },
  {
    title: '扩散语言模型：一种文本生成的新范式',
    date: '2025.11.15',
    excerpt: '扩散模型在文本生成领域的应用，以及它相比自回归模型的潜在优势...',
    link: 'article.html',
    tags: ['Diffusion', 'NLP', 'AI']
  },
  {
    title: '用 Rust 重写核心基础设施的实践经验',
    date: '2025.10.20',
    excerpt: '分享将 Python 服务逐步迁移到 Rust 的真实案例、性能对比与踩坑记录...',
    link: 'article.html',
    tags: ['Rust', '实践']
  },
  {
    title: 'AI Agent 协作框架对比：AutoGen vs CrewAI vs LangGraph',
    date: '2025.09.05',
    excerpt: '2025 年三大 AI Agent 框架横向评测，从架构设计到实际生产部署...',
    link: 'article.html',
    tags: ['Agent', 'AI']
  }
];

// Build tag frequency map
function buildTagMap() {
  const map = {};
  articles.forEach(article => {
    article.tags.forEach(tag => {
      map[tag] = (map[tag] || 0) + 1;
    });
  });
  return map;
}

// Determine tag size class
function getSizeClass(count, max) {
  const ratio = count / max;
  if (ratio >= 0.75) return 'size-xl';
  if (ratio >= 0.5) return 'size-l';
  if (ratio >= 0.25) return 'size-m';
  return 'size-s';
}

// Render tag cloud
function renderTagCloud() {
  const cloud = document.getElementById('tag-cloud');
  if (!cloud) return;

  const tagMap = buildTagMap();
  const maxCount = Math.max(...Object.values(tagMap));
  const sortedTags = Object.keys(tagMap).sort((a, b) => tagMap[b] - tagMap[a]);

  cloud.innerHTML = sortedTags.map(tag => {
    const cls = getSizeClass(tagMap[tag], maxCount);
    return `<span class="tag-cloud-item ${cls}" data-tag="${tag}">
      ${tag}<span class="tag-count">${tagMap[tag]}</span>
    </span>`;
  }).join('');

  // Click handler
  cloud.querySelectorAll('.tag-cloud-item').forEach(item => {
    item.addEventListener('click', () => {
      const tag = item.getAttribute('data-tag');
      const isActive = item.classList.contains('active');

      // Toggle active
      cloud.querySelectorAll('.tag-cloud-item').forEach(el => el.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
        filterByTag(tag);
      } else {
        // Show all when de-selecting
        renderArticleList(articles);
      }
    });
  });
}

// Filter articles by tag
function filterByTag(tag) {
  const filtered = articles.filter(a => a.tags.includes(tag));
  renderArticleList(filtered);
}

// Render article list
function renderArticleList(list) {
  const container = document.getElementById('filtered-articles');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = '<div class="no-results">没有找到匹配的文章</div>';
    return;
  }

  container.innerHTML = list.map(a => `
    <div class="filtered-article">
      <div class="filtered-article-date">${a.date}</div>
      <div class="filtered-article-body">
        <h3><a href="${a.link}">${a.title}</a></h3>
        <p>${a.excerpt}</p>
        <div class="filtered-article-tags">
          ${a.tags.map(t => `<span class="mini-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderTagCloud();
  renderArticleList(articles);
});
