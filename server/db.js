const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'nebula.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ---------- 建表 ----------
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT DEFAULT '',
    author TEXT DEFAULT '',
    author_avatar TEXT DEFAULT '',
    author_role TEXT DEFAULT '',
    category TEXT DEFAULT '',
    tags TEXT DEFAULT '[]',
    read_time INTEGER DEFAULT 5,
    content_html TEXT DEFAULT '',
    toc_json TEXT DEFAULT '[]',
    cover_gradient TEXT DEFAULT '',
    created_at TEXT DEFAULT '',
    views INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_slug TEXT NOT NULL,
    author TEXT DEFAULT '匿名',
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT '',
    FOREIGN KEY (article_slug) REFERENCES articles(slug)
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TEXT DEFAULT ''
  );
`);

// ---------- 种子数据 ----------
const count = db.prepare('SELECT COUNT(*) AS n FROM articles').get();
if (count.n === 0) {
  const now = new Date().toISOString().split('T')[0];
  const articles = [
    {
      slug: 'article',
      title: 'GPT-5.5 vs Claude Opus 4.7：2026 大模型争霸战全景解读',
      subtitle: '短短两周内，OpenAI 发布 GPT-5.5 全面超越 Claude Opus 4.7，幻觉减少 60%。从参数竞赛到 Agent 协作，这场 AI 军备竞赛正在重新定义技术的边界...',
      author: 'Zhang San', author_avatar: 'Z', author_role: 'AI 研究员',
      category: 'AI · 大模型', tags: '["GPT-5.5","Claude","深度"]',
      read_time: 14, cover_gradient: 'linear-gradient(135deg, #0a1628, #1a2744, #0d1f3c)',
      created_at: '2026-05-24', views: 3284,
      toc_json: '[{"id":"s1","title":"架构设计"},{"id":"s2","title":"训练策略"},{"id":"s3","title":"多模态融合"}]',
      content_html: '<section id="s1"><h2>1. 架构设计：混合专家模型的进化</h2><p>GPT-5 在架构上延续了 GPT-4 的混合专家（Mixture of Experts, MoE）设计思路，但进行了多项关键改进。最大的变化在于专家路由机制的重新设计——从静态路由转向了动态上下文感知路由。</p><p>传统的 MoE 架构中，每个 Token 会被分配到固定的 1-2 个专家网络中进行计算。而 GPT-5 引入了 <strong>自适应稀疏激活</strong>（Adaptive Sparse Activation），能够根据 Token 的语义复杂度动态调整激活的专家数量。</p><p>另一个值得关注的创新是<strong>跨层参数共享</strong>。GPT-5 在某些浅层网络中引入了参数共享机制，将参数量减少了约 23%。</p></section><section id="s2"><h2>2. 训练策略：从预训练到 RLHF</h2><p>GPT-5 的训练流程分为三个阶段。预训练数据规模达到了 <strong>15 万亿 Token</strong>，覆盖超过 200 种语言和 100 种编程语言。RLHF 阶段引入了 <strong>Constitutional AI</strong> 框架，确保输出符合安全性、公平性和透明性的要求。</p></section>'
    },
    {
      slug: 'article-jiuzhang',
      title: '中国"九章四号"再破世界纪录：3050 光子改写量子霸权',
      subtitle: '中国科大成功研制九章四号量子计算原型机，操控 3050 个光子，比超算快 10^54 倍，论文登 Nature。',
      author: 'Li Si', author_avatar: 'L', author_role: '量子计算研究员',
      category: '量子计算', tags: '["九章","Nature","量子"]',
      read_time: 10, cover_gradient: 'linear-gradient(135deg,#1a0a28,#2d1a44,#0d1f3c,#0a1628)',
      created_at: '2026-05-13', views: 8921,
      toc_json: '[{"id":"s1","title":"九章系列进化"},{"id":"s2","title":"核心技术突破"},{"id":"s3","title":"量子优势意义"}]',
      content_html: '<section id="s1"><h2>1. 九章系列：从 76 光子到 3050 光子的进化</h2><p>2020 年 12 月，中国科大团队首次实现"九章"光量子计算原型机，操控 <strong>76 个光子</strong>。六年后的今天，九章系列已经完成了四次重大迭代，光子数达到 3050 个。</p><p>从 76 到 3050 光子，跨度超过 40 倍；量子优势比从 10^5 到 10^54，意味着超算需要花费超过 <strong>10^42 年</strong>才能完成九章四号在 <strong>25 微秒</strong>内生成一个样本的计算。</p></section><section id="s2"><h2>2. 核心技术突破</h2><p>九章四号最核心的创新在于研发了<strong>高效率光参量振荡器（OPO）光源</strong>，光源效率达到了惊人的 <strong>92%</strong>。系统总效率达到了 <strong>51%</strong>，希尔伯特空间维度达到了约 <strong>10^2461 维</strong>。</p></section>'
    },
    {
      slug: 'article-starship',
      title: 'SpaceX 星舰 V3 第 12 次试飞：新一代系统首飞全记录',
      subtitle: '全新设计的星舰 V3 系统从得州 Starbase 升空，33 台猛禽 3 发动机成功点火，部署卫星后受控溅落。',
      author: 'Wang Wu', author_avatar: 'W', author_role: '航天科技记者',
      category: '航天科技', tags: '["SpaceX","V3","星舰"]',
      read_time: 8, cover_gradient: 'linear-gradient(135deg,#0a0a28,#1a1a44,#0a1628,#28160a)',
      created_at: '2026-05-23', views: 5812,
      toc_json: '[{"id":"s1","title":"发射概况"},{"id":"s2","title":"成功里程碑"},{"id":"s3","title":"技术困难"}]',
      content_html: '<section id="s1"><h2>1. 发射概况：V3 系统的首次亮相</h2><p>美国中部时间 2026 年 5 月 22 日 17:30，SpaceX 在得克萨斯州 Starbase 发射基地进行了星舰系统的第 12 次综合飞行测试——也是全新 V3 版本星舰的首次整体飞行。这枚高达 <strong>124 米</strong>的巨型火箭在 33 台猛禽 3 发动机的轰鸣中升空。</p></section><section id="s2"><h2>2. 成功的里程碑</h2><p>飞船在轨期间成功部署了 <strong>20 颗星链模拟卫星</strong>。大气层再入测试中，SpaceX 有意<strong>移除了一块隔热瓦片</strong>进行破坏性测试。最终飞船按计划完成翻转机动并受控溅落在印度洋预定海域。</p></section>'
    },
    {
      slug: 'article-embodied-ai',
      title: '具身智能爆发：2026 人形机器人量产元年全解读',
      subtitle: 'Figure 03 进宝马工厂、Tesla Optimus Gen 3 量产启动、宇树 H1 全球出货超 500 台——人形机器人正从实验室以惊人速度走进工厂和家庭。',
      author: 'Zhang San', author_avatar: 'Z', author_role: 'AI 研究员',
      category: 'AI · 机器人', tags: '["具身智能","机器人","Figure","Optimus","宇树"]',
      read_time: 11, cover_gradient: 'linear-gradient(135deg,#0a1628,#1a2744,#16281a,#0a1628)',
      created_at: '2026-05-25', views: 1256,
      toc_json: '[{"id":"s1","title":"Figure 03"},{"id":"s2","title":"Optimus Gen 3"},{"id":"s3","title":"中国力量"},{"id":"s4","title":"核心技术栈"}]',
      content_html: '<section id="s1"><h2>1. Figure 03：人形机器人进厂打工</h2><p>2026 年 4 月，<strong>Figure AI</strong> 正式发布第三代产品 <strong>Figure 03</strong>，并宣布与宝马集团扩大合作——在南卡罗来纳州 Spartanburg 工厂部署 <strong>50 台</strong>人形机器人。Figure 03 搭载 Helix VLA 模型，实现了从自然语言指令到全身精细动作的端到端控制。</p></section><section id="s2"><h2>2. Optimus Gen 3：马斯克的万台量产计划</h2><p>Tesla 在德州超级工厂内部已部署超过 <strong>200 台</strong> Optimus。Gen 3 执行器完全自研，扭矩密度提升 40%。灵巧手自由度从 11 个提升至 <strong>22 个</strong>，可以完成穿针引线级别的精细操作。</p></section>'
    },
    {
      slug: 'article-rust-kernel',
      title: 'Rust 进入 Linux 内核：30 年 C 语言王朝的转折点',
      subtitle: 'Linus Torvalds 正式合并首个 Rust 设备驱动进内核主线，内存安全终于从编译时得到了保证。',
      author: 'Wang Wu', author_avatar: 'W', author_role: '全栈开发者',
      category: '系统编程', tags: '["Rust","Linux","内核","开源"]',
      read_time: 9, cover_gradient: 'linear-gradient(135deg,#28160a,#44301a,#1a1628,#0a0a18)',
      created_at: '2026-05-24', views: 2108,
      toc_json: '[{"id":"s1","title":"历史性合并"},{"id":"s2","title":"内存安全"},{"id":"s3","title":"社区争论"}]',
      content_html: '<section id="s1"><h2>1. 历史性合并：首个 Rust 驱动入主线</h2><p>2026 年 5 月 20 日，<strong>Linus Torvalds</strong> 在 Linux 6.12-rc1 合并窗口中接受了一个历史性的 Pull Request——<strong>首个用 Rust 编写的设备驱动程序</strong>被正式合并进内核主线。</p></section><section id="s2"><h2>2. 为什么是 Rust？内存安全的终极方案</h2><p>微软的研究表明，Windows 内核中约 <strong>70% 的 CVE</strong> 与内存安全问题有关。Rust 的所有权系统和借用检查器在编译时就能消除 use-after-free、缓冲区溢出和数据竞争三类最危险的内存错误。</p></section>'
    },
    {
      slug: 'article-wasm-2026',
      title: 'WebAssembly 2026：超越浏览器，重塑云端计算格局',
      subtitle: 'WASI Preview 3 正式发布、组件模型进入生产环境、浏览器外运行时生态爆发——WebAssembly 正从浏览器的沙盒走向服务器的核心。',
      author: 'Wang Wu', author_avatar: 'W', author_role: '全栈开发者',
      category: 'Web 开发', tags: '["WASM","WASI","云计算","Web"]',
      read_time: 7, cover_gradient: 'linear-gradient(135deg,#0a2816,#1a442a,#0a1628,#16281a)',
      created_at: '2026-05-22', views: 1892,
      toc_json: '[{"id":"s1","title":"WASI Preview 3"},{"id":"s2","title":"组件模型"},{"id":"s3","title":"运行时生态"}]',
      content_html: '<section id="s1"><h2>1. WASI Preview 3：服务器端 WASM 的拐点</h2><p>2026 年 4 月，W3C 正式发布了 <strong>WASI Preview 3</strong> 规范——首次引入了完整的异步 I/O 模型、套接字支持和线程管理接口。这意味着可以用 Rust、Go、C++ 编写 WASM 模块，直接在运行时上以接近原生的性能运行服务器应用。</p></section><section id="s2"><h2>2. 组件模型：真正的语言无关互操作</h2><p>WASM 组件模型允许不同语言编写的模块之间进行高效的类型安全通信。相比传统容器微服务，启动时间从秒级降到微秒级，内存占用从几十 MB 降到几百 KB。</p></section>'
    }
  ];

  const insert = db.prepare(`
    INSERT INTO articles (slug, title, subtitle, author, author_avatar, author_role, category, tags, read_time, content_html, toc_json, cover_gradient, created_at, views)
    VALUES (@slug, @title, @subtitle, @author, @author_avatar, @author_role, @category, @tags, @read_time, @content_html, @toc_json, @cover_gradient, @created_at, @views)
  `);

  const insertMany = db.transaction((items) => {
    for (const a of items) insert.run(a);
  });
  insertMany(articles);
  console.log('数据库初始化完成：已插入 ' + articles.length + ' 篇种子文章');
}

// 种子评论
const commentCount = db.prepare('SELECT COUNT(*) AS n FROM comments').get();
if (commentCount.n === 0) {
  const comments = [
    { article_slug: 'article', author: 'Li Si', content: '动态路由的设计确实很巧妙，但我在想这会带来多少额外的计算开销？有没有具体的 benchmarks？', likes: 24, created_at: '2026-05-25' },
    { article_slug: 'article', author: 'Wang Wu', content: '关于持续学习的问题说得很对，这是目前 LLM 最大的短板之一。', likes: 18, created_at: '2026-05-26' },
    { article_slug: 'article-jiuzhang', author: 'QuantumFan', content: '从 255 光子到 3050 光子，这个跨度太大了！光源效率 92% 更是惊人。', likes: 56, created_at: '2026-05-14' },
    { article_slug: 'article-starship', author: 'RocketFan', content: 'V3 的进步太大了！虽然助推器回收失败，但完成卫星部署和大气再入已经非常了不起。', likes: 42, created_at: '2026-05-23' },
    { article_slug: 'article-embodied-ai', author: 'RobotFan', content: 'Figure 03 进宝马工厂这个案例太有说服力了！这才是人形机器人真正的用武之地。', likes: 32, created_at: '2026-05-25' },
    { article_slug: 'article-rust-kernel', author: 'KernelDev', content: '做内核开发 15 年了，去年尝试用 Rust 写了一个小驱动后，真的被 borrow checker 说服了。', likes: 47, created_at: '2026-05-25' }
  ];
  const insert = db.prepare('INSERT INTO comments (article_slug, author, content, likes, created_at) VALUES (@article_slug, @author, @content, @likes, @created_at)');
  const insertMany = db.transaction((items) => { for (const c of items) insert.run(c); });
  insertMany(comments);
}

module.exports = db;
