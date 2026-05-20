const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const analyzeButton = document.querySelector("[data-analyze-placeholder]");
const jdInput = document.querySelector("#jd-input");
const matchPreview = document.querySelector("#matchPreview");
const matchReportModal = document.querySelector("#matchReportModal");
const matchModalContent = document.querySelector("#matchModalContent");
const matchModalCloseButton = document.querySelector("[data-close-match-modal]");
const projectDetailModal = document.querySelector("#projectDetailModal");
const projectModalContent = document.querySelector("#projectModalContent");
const projectModalCloseButton = document.querySelector("[data-close-project-modal]");
const projectDetailHint = document.querySelector("[data-project-detail-hint]");
const copyEmailButton = document.querySelector("#copyEmailBtn");

const SCORE_RANGE = {
  min: 45,
  max: 95,
  neutral: 65,
};

const TARGET_RELEVANCE_KEYWORDS = [
  "AI 产品",
  "AI产品",
  "产品经理",
  "产品实习生",
  "数据分析",
  "数据分析师",
  "数据产品",
  "数据科学",
  "业务分析",
  "增长分析",
  "用户行为",
  "AI Agent",
  "AI Agent 产品",
  "大模型应用",
  "大模型",
  "LLM",
  "Agent",
  "Prompt",
  "Prompt Engineering",
  "工作流",
  "质量评估",
  "质量检查",
  "结构化输出",
  "JD 分析",
  "岗位匹配",
  "Resume Matching",
  "ATS",
  "SQL",
  "Python",
  "指标",
  "看板",
  "dashboard",
  "BI",
  "策略分析",
  "产品数据",
  "AI 产品经理",
  "大模型产品",
  "商业化增长",
  "B 端",
  "企业客户",
  "客户交付",
];

const LOW_RELEVANCE_KEYWORDS = ["行政", "电话销售", "线下销售", "门店", "客服", "前台", "人事", "财务", "会计", "纯运营执行"];

const RELEVANCE_GROUPS = {
  ai: ["AI Agent", "AI 产品", "AI产品", "AI 产品经理", "AI Agent 产品", "大模型", "大模型产品", "大模型应用", "LLM", "Agent", "Prompt", "Prompt Engineering", "workflow", "工作流", "质量评估", "质量检查"],
  data: ["数据分析", "数据分析师", "SQL", "Python", "Pandas", "指标", "指标体系", "可视化", "看板", "dashboard", "BI", "转化率", "用户行为", "业务分析", "增长分析", "产品数据"],
  product: ["产品经理", "产品实习生", "产品需求", "用户需求", "产品逻辑", "PRD", "原型", "prototype", "产品原型", "数据产品", "结构化输出", "JD 分析", "岗位匹配", "B 端", "商业化", "商业化增长", "企业客户", "客户交付", "团队管理"],
};

const ROLE_RELEVANCE_CONFIG = {
  core_fit: {
    label: "核心匹配",
    scoreFloor: 90,
    scoreCap: 95,
    reason: "岗位职责与 AI 产品、AI Agent、大模型应用产品、数据产品或指标分析方向高度重合。",
  },
  strong_fit: {
    label: "强相关",
    scoreFloor: 84,
    scoreCap: 91,
    reason: "岗位同时覆盖 AI 工具、产品、数据、指标或业务分析中的多个方向。",
  },
  adjacent_fit: {
    label: "相邻相关",
    scoreFloor: 72,
    scoreCap: 83,
    reason: "岗位与 AI 工具应用、信息结构化、内容策略或项目落地存在关联，但不是核心 AI 产品 / AI Agent 应用岗位。",
  },
  weak_fit: {
    label: "弱相关",
    scoreFloor: 55,
    scoreCap: 72,
    reason: "岗位更偏运营、内容、沟通或执行支持，与核心项目能力存在有限重合。",
  },
  low_fit: {
    label: "低相关",
    scoreFloor: 45,
    scoreCap: 65,
    reason: "岗位核心职责与 AI Agent 应用产品、大模型应用产品和统计背景的直接关联较弱。",
  },
};

const ROLE_KEYWORD_GROUPS = {
  aiCore: ["AI", "AIGC", "AI Agent", "Agent", "LLM", "大模型", "Prompt", "Prompt Engineering", "RAG", "Tool Calling", "大模型应用"],
  aiAgent: ["AI Agent", "Agent", "LLM", "Prompt", "Prompt Engineering", "RAG", "Tool Calling", "Guardrails", "质量评估"],
  productCore: ["产品经理", "产品需求", "产品原型", "用户需求", "工作流", "workflow", "产品设计", "功能设计", "PRD", "原型", "prototype", "MVP", "结构化输出", "质量检查"],
  dataCore: ["SQL", "Python", "Pandas", "DuckDB", "数据分析", "指标", "指标体系", "看板", "dashboard", "BI", "数据清洗", "可视化"],
  growthCore: ["指标体系", "用户行为", "用户行为分析", "转化率", "留存", "增长", "增长分析", "BI", "dashboard"],
  businessCore: ["业务", "产品", "策略", "分析", "业务分析", "业务建议", "产品数据", "策略分析"],
  agentBuild: ["workflow", "工作流", "产品", "原型", "prototype", "工具建设", "工具型产品", "结构化输出", "质量检查", "导出"],
  strongSignals: ["数据驱动", "策略分析", "产品运营", "工具建设", "指标分析", "业务分析", "用户需求", "数据产品", "AIGC 产品", "AI Agent 产品", "大模型应用产品", "JD 分析", "简历优化", "岗位匹配"],
  adjacentSignals: [
    "AI 工具",
    "AI工具",
    "AIGC",
    "内容生产",
    "内容制作",
    "内容分发",
    "课程分发",
    "信息结构化",
    "教育",
    "培训",
    "认证",
    "问答机器人训练",
    "用户教育",
    "项目运营",
    "内容策略",
    "AI 赋能",
    "AI赋能",
    "探索 AI",
  ],
  weakSignals: ["普通运营", "市场执行", "内容编辑", "社群运营", "客服支持", "销售支持", "行政协作", "活动执行", "用户沟通", "Office", "沟通表达", "英文沟通", "自我驱动", "执行落地"],
  lowSignals: ["行政助理", "行政", "电话销售", "线下销售", "前台", "人事", "财务", "会计", "纯设计", "纯客服", "客服", "门店", "销售支持"],
};

const MATCH_CONFIG = {
  dimensions: {
    education: {
      label: "学历背景",
      weight: 0.15,
      keywords: [
        "UCSD",
        "University of California San Diego",
        "加州大学圣地亚哥",
        "统计",
        "statistics",
        "probability",
        "math",
        "数学",
        "本科",
        "bachelor",
        "GPA",
        "数据科学",
        "data science",
        "人工智能",
        "artificial intelligence",
      ],
      coreKeywords: ["UCSD", "statistics", "probability", "统计", "data science"],
      evidence: "UC San Diego Probability and Statistics 背景，具备统计建模、概率、回归和数据科学基础。",
    },
    dataAnalysis: {
      label: "数据分析能力",
      weight: 0.25,
      keywords: [
        "SQL",
        "Python",
        "Pandas",
        "DuckDB",
        "Excel",
        "数据分析",
        "指标",
        "指标体系",
        "可视化",
        "visualization",
        "dashboard",
        "regression",
        "回归",
        "统计分析",
        "漏斗",
        "funnel",
        "转化率",
        "conversion",
        "留存",
        "retention",
        "Top Movers",
        "数据清洗",
        "data cleaning",
        "EDA",
        "matplotlib",
        "GTFS",
      ],
      coreKeywords: ["SQL", "Python", "Pandas", "数据分析", "指标", "可视化", "统计分析"],
      evidence: "SOVA AI 与 UCSD Triton Transit 项目覆盖 SQL / DuckDB / Pandas、指标设计、可视化分析和数据报告输出。",
    },
    aiProduct: {
      label: "AI 产品能力",
      weight: 0.25,
      keywords: [
        "AI Agent",
        "Agent",
        "LLM",
        "大模型",
        "Prompt",
        "Prompt Engineering",
        "RAG",
        "Tool Calling",
        "workflow",
        "工作流",
        "AI 产品",
        "产品原型",
        "prototype",
        "指标异动",
        "Metric Spec",
        "AI workflow",
        "输出评测",
        "模型评测",
        "质量评估",
        "可解释性",
        "hallucination",
        "Guardrails",
        "结构化输出",
        "质量检查",
        "求职材料",
        "简历优化",
        "Resume Matching",
        "JD Analysis",
        "ATS",
        "PDF Export",
      ],
      coreKeywords: ["AI Agent", "LLM", "Prompt Engineering", "workflow", "AI 产品", "质量检查", "JD Analysis"],
      evidence: "CareerFit Agent 与 SOVA AI 展示了从 JD / 业务问题输入到 Agent 工作流、结构化输出和质量检查的产品化能力。",
    },
    projectExperience: {
      label: "项目经验",
      weight: 0.2,
      keywords: [
        "项目",
        "project",
        "GitHub",
        "demo",
        "prototype",
        "原型",
        "产品设计",
        "数据项目",
        "业务分析",
        "SOVA",
        "SOVA AI",
        "Triton Transit",
        "InsightFlow",
        "AI Exposure",
        "CareerFit",
        "CareerFit Agent",
        "ATS",
        "简历",
        "求职材料",
        "岗位匹配",
        "portfolio",
        "case study",
        "分析报告",
        "report",
      ],
      coreKeywords: ["project", "GitHub", "demo", "prototype", "项目", "产品设计", "CareerFit"],
      evidence: "作品集包含 CareerFit Agent、SOVA AI、InsightFlow AI、UCSD Triton Transit 和 AI Exposure 等可展示项目。",
    },
    businessUnderstanding: {
      label: "业务理解",
      weight: 0.15,
      keywords: [
        "业务",
        "business",
        "用户需求",
        "user needs",
        "产品需求",
        "产品逻辑",
        "PRD",
        "竞品",
        "competitor",
        "运营",
        "operation",
        "growth",
        "增长",
        "指标口径",
        "决策支持",
        "业务洞察",
        "异常信号",
        "conversion",
        "retention",
        "funnel",
        "用户行为",
        "user behavior",
        "stakeholder",
        "需求分析",
      ],
      coreKeywords: ["业务", "用户需求", "产品需求", "产品逻辑", "指标口径", "业务洞察", "需求分析"],
      evidence: "项目叙事强调从模糊业务问题出发，拆解需求、指标口径、分析路径和可执行建议。",
    },
  },
};

const SENIOR_REQUIREMENT_PATTERNS = [
  /3\s*年\s*以上/i,
  /5\s*年\s*以上/i,
  /\bsenior\b/i,
  /资深/,
  /带团队/,
  /团队管理/,
  /商业化经验/,
  /商业化/,
  /企业客户/,
  /大厂实习/,
  /B\s*端产品经验/i,
  /B\s*端/i,
  /正式产品经理实习/,
];

const EVIDENCE_RULES = [
  {
    triggers: [
      "CareerFit",
      "简历",
      "求职材料",
      "岗位匹配",
      "JD 分析",
      "JD Analysis",
      "ATS",
      "Resume Matching",
      "Quality Check",
      "质量检查",
      "PDF Export",
    ],
    jdNeed: "JD 分析、岗位匹配与 AI Agent 产品能力",
    evidence:
      "CareerFit Agent 项目中，我将 Master 简历、岗位 JD、经历证据匹配、定制摘要、质量检查和 A4 PDF 导出串成 AI 求职材料定制工作流。",
    ability: "AI Agent 应用产品设计、结构化输出、质量防护和大模型应用落地能力。",
  },
  {
    triggers: ["AI Agent", "LLM", "Prompt", "Prompt Engineering", "workflow", "工作流", "AI 产品", "Metric Spec", "指标异动"],
    jdNeed: "AI 产品 / Agent 工作流设计",
    evidence:
      "SOVA AI 项目中，我将“指标下跌但原因不明”的模糊业务问题拆解为指标澄清、字段识别、Metric Spec、指标计算、异动拆解、证据链和报告输出流程。",
    ability: "AI 产品设计、Agent 工作流设计、Prompt 结构设计和业务问题拆解能力。",
  },
  {
    triggers: ["SQL", "Python", "Pandas", "DuckDB", "指标", "Top Movers", "数据分析", "GTFS"],
    jdNeed: "数据分析、指标设计与 SQL / Python 能力",
    evidence:
      "UCSD Triton Transit 项目中，我基于 GTFS 数据使用 SQL / DuckDB / Pandas 完成服务时间、路线、站点和小时维度分析，并设计 Evening Service Gap Score。",
    ability: "数据清洗、指标设计、可视化分析和运营问题诊断能力。",
  },
  {
    triggers: ["dashboard", "visualization", "可视化", "report", "分析报告"],
    jdNeed: "数据可视化与分析报告输出",
    evidence:
      "UCSD Triton Transit 项目将晚间服务占比、末班车时间、路线 × 小时热力图和服务缺口评分转化为可展示的数据成果。",
    ability: "将数据结果转化为清晰图表和业务建议的能力。",
  },
  {
    triggers: ["产品原型", "prototype", "业务分析", "分析路径", "Prompt", "产品需求", "用户需求", "需求分析"],
    jdNeed: "产品原型、需求拆解与业务分析流程",
    evidence:
      "InsightFlow AI 项目中，我面向数据分析新手设计 AI 工具型产品原型，将模糊业务需求转化为分析问题、指标体系、业务假设、分析路径和汇报大纲。",
    ability: "产品原型设计、Prompt 框架设计和业务分析流程设计能力。",
  },
  {
    triggers: ["statistics", "regression", "AI Exposure", "BLS", "O*NET", "职业数据", "统计分析", "回归"],
    jdNeed: "统计分析、研究设计与谨慎解释",
    evidence:
      "AI Exposure 项目中，我围绕 AI 暴露度与薪资、就业规模、增长预期之间的关系设计分析问题，并整合 BLS、O*NET 和 AI exposure 数据进行比较。",
    ability: "统计分析、职业数据研究和非因果解释意识。",
  },
];

const PROJECT_DETAILS = {
  careerfit: {
    id: "careerfit",
    title: "CareerFit Agent",
    subtitle: "AI 求职材料匹配 Agent",
    category: "AI Agent / LLM Product / Resume Tailoring / Quality Guardrails",
    tags: ["AI Agent", "JD Analysis", "Resume Matching", "Quality Check", "ATS Keywords", "PDF Export"],
    background:
      "传统 AI 简历优化容易只做关键词堆叠或过度包装。CareerFit Agent 围绕真实岗位 JD，将 Master 简历、岗位要求、经历证据和质量检查机制串成一条 AI 求职材料定制流程，帮助生成更贴近岗位筛选逻辑、同时保持经历真实性的定制简历。",
    gallery: [{ src: "assets/careerfit-main.png", label: "AI 简历 Agent 工作台", fallback: "CAREERFIT AGENT" }],
    responsibilities: [
      {
        title: "产品定位",
        description: "明确目标用户为求职者和转岗候选人，将岗位匹配、简历定制、质量检查定义为 AI Agent 应用产品场景。",
      },
      {
        title: "JD 分析流程",
        description: "将岗位 JD 拆解为岗位职责、硬技能、软技能、业务场景、筛选关键词和内容优先级，为后续定制提供结构化输入。",
      },
      {
        title: "ResumeData 结构设计",
        description: "将 Master 简历整理为可编辑、可复用、可导出的结构化数据，使项目经历、技能证据和岗位要求可以被稳定匹配。",
      },
      {
        title: "质量防护机制",
        description: "设计真实性检查、证据覆盖、ATS 关键词覆盖和 A4 版面适配等质量检查，降低模型编造经历或过度包装的风险。",
      },
      {
        title: "导出体验",
        description: "设计 A4 简历预览、编辑导出和 PDF 输出链路，让 AI 生成结果进入可交付、可投递的求职材料流程。",
      },
    ],
    results: [
      {
        title: "AI 求职材料定制工作流",
        description: "从 Master 简历导入、JD 分析、岗位匹配、定制摘要到 PDF 导出形成闭环，体现 AI Agent 应用产品的端到端流程设计。",
      },
      {
        title: "结构化质量检查",
        description: "通过质量检查机制覆盖内容真实性、岗位贴合度、ATS 关键词和版面适配，使大模型输出更可控、更可信。",
      },
      {
        title: "产品化交付能力",
        description: "项目体现了从真实求职痛点出发，完成 AI 工作流、可视化界面、交互状态和线上部署的 MVP 落地能力。",
      },
      {
        title: "AI Agent 产品定位强化",
        description: "项目与 AI 产品经理实习、AI Agent 应用产品和大模型应用产品方向高度一致，是当前作品集的核心展示项目。",
      },
    ],
    methods: ["Next.js", "TypeScript", "LLM Prompt", "ResumeData Schema", "Quality Guardrails", "ATS Keywords", "PDF Export", "Vercel"],
    links: {
      github: "https://github.com/Zev55555/careerfit-agent",
      demo: "https://ai-zev-ai-resume-agent-saas.vercel.app/",
    },
  },
  sova: {
    id: "sova",
    title: "SOVA AI",
    subtitle: "AI 指标异动分析 Agent",
    category: "AI Product / Agent Workflow / Data Analysis Tool",
    tags: ["AI Agent", "Prompt Engineering", "Metric Spec", "DuckDB", "Top Movers", "Evidence Chain"],
    background:
      "业务团队经常遇到“指标下跌但原因不明”的问题。SOVA AI 将这种模糊业务需求拆解为指标澄清、字段识别、Metric Spec 生成、指标计算、异动拆解、证据链生成和报告输出，形成从问题输入到分析结论的结构化 AI 工作流。",
    gallery: [{ src: "assets/sova-workbench.png", label: "产品工作台", fallback: "SOVA AI 工作台" }],
    responsibilities: [
      {
        title: "产品定位",
        description: "明确目标用户、使用场景和核心问题，将“指标异动归因”定义为可被 AI 工作流辅助解决的业务分析场景。",
      },
      {
        title: "AI 交互流程设计",
        description: "设计 Step 1–10 分步式分析流程，引导用户确认指标口径、对比周期、拆解维度、字段需求和近期变化因素。",
      },
      {
        title: "指标口径设计",
        description: "将自然语言业务问题转化为结构化 Metric Spec，明确指标公式、分子分母、时间字段、拆解维度和辅助指标。",
      },
      {
        title: "分析链路设计",
        description: "基于 Pandas 和 DuckDB 设计 CSV / Excel 数据读取、字段识别、安全聚合、Top Movers 和辅助指标对比流程。",
      },
      {
        title: "多场景验证",
        description: "基于物流、SaaS、客服、游戏、营销等场景构造测试案例，验证字段识别、指标计算和报告输出的稳定性。",
      },
    ],
    results: [
      {
        title: "结构化 AI 分析工作流",
        description: "将模糊业务问题拆成可追踪、可计算、可复查的分析步骤，降低用户直接写 SQL 或自行设计分析路径的门槛。",
      },
      {
        title: "可复查指标计算链路",
        description: "通过 Metric Spec 和 DuckDB 聚合分析提高计算过程的可控性，避免直接让 LLM 自由生成不可验证结果。",
      },
      {
        title: "证据链与报告草稿输出",
        description: "支持输出本期 vs 上期变化、分子分母变化、维度拆解、Top Movers、辅助指标对比和报告草稿。",
      },
      {
        title: "AI 产品能力展示",
        description: "项目体现了 AI Agent 工作流设计、Prompt 结构设计、指标体系设计和业务分析流程产品化能力。",
      },
    ],
    methods: ["LLM", "Prompt Engineering", "Agent Workflow", "Metric Spec", "DuckDB", "Pandas", "Top Movers", "Evidence Chain"],
    links: {
      github: "https://github.com/Zev55555/Sova-ai",
      demo: "https://sovaai.filegear-sg.me",
    },
  },
  transit: {
    id: "transit",
    title: "UCSD Triton Transit",
    subtitle: "校园班车晚间服务缺口诊断与排班优化",
    category: "Data Analytics / Operations Optimization",
    tags: ["SQL", "Python", "DuckDB", "Pandas", "GTFS", "Heatmap", "Gap Score"],
    background:
      "项目针对 UCSD 校园班车晚间服务供给不足的问题，将“学生晚间出行体验”拆解为时间段、路线、站点和资源优先级四个分析维度，并基于 GTFS static feed 构建服务分析数据集，用数据定位晚间服务缺口并提出排班优化建议。",
    gallery: [{ src: "assets/transit-report.png", label: "晚间服务供给缺口诊断报告", fallback: "TRANSIT REPORT" }],
    responsibilities: [
      { title: "问题定义", description: "将校园晚间出行体验拆解为路线、站点、小时和资源优先级，明确 17:00–22:00 的服务缺口诊断目标。" },
      {
        title: "数据建模",
        description: "基于 GTFS static feed 中 routes、trips、stop_times、stops、calendar 等核心表，构建路线-站点-时间维度的数据集。",
      },
      { title: "指标设计", description: "计算每小时计划班次数、估算发车间隔、晚间服务占比、末班车时间和 Evening Service Gap Score。" },
      { title: "可视化分析", description: "通过路线 × 小时热力图、路线缺口评分图和站点覆盖分析，定位晚间服务供给不足的时段和路线。" },
      {
        title: "业务建议",
        description: "结合发车间隔、末班车时间和晚间班次占比识别高优先级路线，并提出增加晚间班次、延后末班车和补强重点站点覆盖等建议。",
      },
    ],
    results: [
      { title: "发现晚间服务下降", description: "分析发现服务缺口主要集中在 20:00 后，尤其是 21:00–22:00 时段。" },
      { title: "设计 Gap Score", description: "通过 Evening Service Gap Score 综合衡量路线晚间服务缺口，帮助识别优先优化对象。" },
      { title: "输出运营优化建议", description: "将分析结果转化为排班优化方向，包括增加晚间班次、延后末班车和补强重点站点覆盖。" },
      { title: "数据分析能力展示", description: "项目体现了 SQL / Python 数据处理、指标体系设计、可视化表达和运营问题诊断能力。" },
    ],
    methods: ["SQL", "DuckDB", "Python", "Pandas", "GTFS", "Matplotlib", "Heatmap", "Operational Analytics"],
    links: {
      github: "https://github.com/Zev55555/ucsd-triton-transit-service-gap",
    },
  },
  insightflow: {
    id: "insightflow",
    title: "InsightFlow AI",
    subtitle: "数据分析业务流程助手",
    category: "AI Data Analysis Tool / Prompt Engineering / Business Analysis",
    tags: ["AI Tool", "Prompt", "Business Analysis", "Product Prototype", "Workflow"],
    background:
      "InsightFlow AI 面向数据分析新手，帮助用户将模糊业务需求转化为分析问题、指标体系、业务假设、分析路径和汇报大纲。它是 SOVA AI 之前的早期产品探索，用于验证“模糊业务问题 → 结构化分析方案”的产品方向。",
    gallery: [{ src: "assets/insightflow-main.png", label: "产品首页", fallback: "INSIGHTFLOW" }],
    responsibilities: [
      { title: "产品原型设计", description: "面向数据分析新手设计 AI 工具型产品原型，明确用户输入、输出结构和基础交互流程。" },
      {
        title: "Prompt 框架设计",
        description: "设计结构化 Prompt 输出框架，使 AI 结果围绕业务问题重写、指标拆解、分析维度、可能假设、分析步骤和风险提醒展开。",
      },
      { title: "业务分析流程设计", description: "将用户输入的业务场景、分析问题和 CSV 字段信息转化为接近真实数据分析工作的分析方案。" },
      { title: "早期产品验证", description: "通过 InsightFlow 验证 AI 分析助手的产品方向，为后续 SOVA AI 的指标口径确认、输出结构和业务分析流程提供基础。" },
    ],
    results: [
      { title: "结构化分析方案输出", description: "支持从业务问题生成分析问题、指标体系、业务假设、分析路径和汇报大纲。" },
      { title: "Prompt 产品化实践", description: "将 Prompt 从单次问答转化为固定输出框架，提高 AI 输出的一致性和可读性。" },
      { title: "支撑 SOVA AI 迭代", description: "为后续 SOVA AI 的工作流设计、Prompt 结构和 AI 输出方式提供早期验证。" },
    ],
    methods: ["Prompt Engineering", "AI Workflow", "Product Prototype", "Business Analysis", "Web UI"],
    links: {
      github: "https://github.com/Zev55555/insightflow-ai",
      demo: "https://ai-data-analysis-assistant-six.vercel.app/",
    },
  },
  aiExposure: {
    id: "ai-exposure",
    title: "AI Exposure Analysis",
    subtitle: "AI 暴露度与编程职业就业前景分析",
    category: "Statistics / Career Data / Labor Market Research",
    tags: ["Statistics", "Pandas", "BLS", "O*NET", "Correlation", "Career Data"],
    background:
      "项目围绕“AI 暴露度是否与编程相关职业的薪资、就业规模和增长预期有关”设计分析问题，整合 BLS、O*NET 和 AI exposure 数据，比较不同技术岗位在 AI 影响下的就业前景差异。",
    gallery: [],
    responsibilities: [
      { title: "研究设计", description: "围绕 AI 暴露度、薪资、就业规模和增长预期之间的关系设计分析问题。" },
      { title: "数据整合", description: "整合 BLS、O*NET 和 AI exposure 数据，基于职业名称与 SOC code 构建职业层面的分析数据集。" },
      { title: "指标比较", description: "从薪资水平、就业规模、职业增长率和 AI 暴露度等维度比较不同职业群体。" },
      { title: "结果解释", description: "使用可视化和相关性分析解释变量关系，并说明样本量、代理变量和非因果解释等局限。" },
    ],
    results: [
      { title: "职业数据分析框架", description: "构建以职业为单位的数据分析思路，比较 AI 暴露度与就业指标之间的关系。" },
      { title: "变量比较与可视化", description: "通过分组统计、相关性分析和可视化展示不同职业群体的差异。" },
      { title: "统计解释意识", description: "强调相关性不等于因果关系，避免过度解释 AI exposure 与就业结果之间的关系。" },
    ],
    methods: ["Python", "Pandas", "Data Cleaning", "Correlation", "BLS", "O*NET", "AI Exposure"],
    links: {},
  },
};

const normalizeText = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const hasCjk = (value) => /[\u4e00-\u9fff]/.test(value);

const keywordToRegex = (keyword) => {
  const normalizedKeyword = normalizeText(keyword);
  const escaped = escapeRegExp(normalizedKeyword).replace(/\s+/g, "[\\s\\-_/]+");

  if (hasCjk(normalizedKeyword)) {
    return new RegExp(escaped, "i");
  }

  const startsWithWord = /^[a-z0-9]/i.test(normalizedKeyword);
  const endsWithWord = /[a-z0-9]$/i.test(normalizedKeyword);

  return new RegExp(`${startsWithWord ? "\\b" : ""}${escaped}${endsWithWord ? "\\b" : ""}`, "i");
};

const keywordMatches = (normalizedText, keyword) => keywordToRegex(keyword).test(normalizedText);

const unique = (items) => [...new Set(items.filter(Boolean))];

const clamp = (value, min = SCORE_RANGE.min, max = SCORE_RANGE.max) => Math.min(max, Math.max(min, value));

const getLevel = (score) => {
  if (score >= 85) return "高匹配";
  if (score >= 75) return "中高匹配";
  if (score >= 65) return "中等匹配";
  return "低匹配";
};

const getDimensionMatches = (normalizedText, dimension) => {
  const keywords = unique([...dimension.coreKeywords, ...dimension.keywords]);
  const matched = keywords.filter((keyword) => keywordMatches(normalizedText, keyword));
  const coreHits = dimension.coreKeywords.filter((keyword) => matched.includes(keyword));
  const normalHits = matched.filter((keyword) => !dimension.coreKeywords.includes(keyword));

  return { matched, coreHits, normalHits };
};

const scoreDimension = (matches) => {
  const coreBonus = Math.min(30, matches.coreHits.length * 10);
  const normalBonus = Math.min(18, matches.normalHits.length * 3.5);
  const breadthBonus = Math.min(7, matches.matched.length);

  return Math.round(clamp(SCORE_RANGE.neutral + coreBonus + normalBonus + breadthBonus));
};

const removeNestedKeywordNoise = (keywords) =>
  keywords.filter((keyword, index, allKeywords) => {
    const normalizedKeyword = normalizeText(keyword);

    return !allKeywords.some((candidate, candidateIndex) => {
      if (candidateIndex === index) return false;

      const normalizedCandidate = normalizeText(candidate);
      return normalizedCandidate.length > normalizedKeyword.length && keywordMatches(normalizedCandidate, normalizedKeyword);
    });
  });

const countKeywordHits = (normalizedText, keywords) => keywords.filter((keyword) => keywordMatches(normalizedText, keyword)).length;

const hasAnyKeyword = (normalizedText, keywords) => countKeywordHits(normalizedText, keywords) > 0;

const applyDimensionFloor = (dimensionScores, floors) => {
  Object.entries(floors).forEach(([key, score]) => {
    dimensionScores[key] = Math.max(dimensionScores[key] || SCORE_RANGE.min, score);
  });
};

const getRoleKeywordHits = (normalizedText) =>
  Object.entries(ROLE_KEYWORD_GROUPS).reduce((hits, [key, keywords]) => {
    hits[key] = countKeywordHits(normalizedText, keywords);
    return hits;
  }, {});

const buildRoleRelevance = (category, reasonOverride = "") => {
  const config = ROLE_RELEVANCE_CONFIG[category] || ROLE_RELEVANCE_CONFIG.weak_fit;
  return {
    category,
    label: config.label,
    scoreCap: config.scoreCap,
    scoreFloor: config.scoreFloor,
    reason: reasonOverride || config.reason,
  };
};

function classifyRoleRelevance(jdText, matchedKeywords = []) {
  const normalizedText = normalizeText(jdText);
  const hits = getRoleKeywordHits(normalizedText);
  const hasMatchedKeywords = Array.isArray(matchedKeywords) && matchedKeywords.length > 0;
  const hasCoreAIProduct = hits.aiCore >= 1 && hits.productCore >= 1;
  const hasCoreData = hits.dataCore >= 2;
  const hasGrowthProduct = hits.growthCore >= 2 && hits.businessCore >= 1;
  const hasAgentProduct = hits.aiAgent >= 2 && hits.agentBuild >= 1;
  const strongDirectionCount = [hits.aiCore > 0, hits.productCore > 0, hits.dataCore > 0, hits.growthCore > 0, hits.businessCore > 0, hits.strongSignals > 0].filter(Boolean).length;
  const hasAdjacentOnly = hits.adjacentSignals > 0 && !hasCoreAIProduct && !hasCoreData && !hasGrowthProduct && !hasAgentProduct;
  const hasLowSignals = hits.lowSignals > 0;
  const hasWeakSignals = hits.weakSignals > 0;

  if (hasCoreAIProduct || hasCoreData || hasGrowthProduct || hasAgentProduct) {
    if (hasCoreAIProduct) {
      return buildRoleRelevance("core_fit", "岗位核心职责明确覆盖 AI 产品、用户需求、产品原型或工作流设计。");
    }

    if (hasCoreData) {
      return buildRoleRelevance("core_fit", "岗位核心职责明确覆盖 SQL / Python、数据分析、指标体系或 Dashboard。");
    }

    if (hasGrowthProduct) {
      return buildRoleRelevance("core_fit", "岗位核心职责明确覆盖增长分析、用户行为、指标体系和业务分析。");
    }

    return buildRoleRelevance("core_fit", "岗位核心职责明确覆盖 AI Agent、LLM、Prompt 和工作流设计。");
  }

  if (hits.aiCore > 0 && strongDirectionCount >= 3) {
    return buildRoleRelevance("strong_fit");
  }

  if (hits.strongSignals >= 2 || (hasMatchedKeywords && strongDirectionCount >= 2 && !hasLowSignals)) {
    return buildRoleRelevance("strong_fit");
  }

  if (hasAdjacentOnly) {
    return buildRoleRelevance("adjacent_fit");
  }

  if (hasLowSignals && hits.aiCore === 0 && hits.dataCore === 0 && hits.productCore === 0) {
    return buildRoleRelevance("low_fit");
  }

  if (hasWeakSignals || hits.adjacentSignals > 0) {
    return buildRoleRelevance("weak_fit");
  }

  if (hasMatchedKeywords) {
    return buildRoleRelevance("weak_fit", "JD 命中少量相关技能词，但核心职责未明显指向 AI 产品或数据分析岗位。");
  }

  return buildRoleRelevance("low_fit");
}

const getRelevanceProfile = (normalizedText) => {
  const targetHitCount = countKeywordHits(normalizedText, TARGET_RELEVANCE_KEYWORDS);
  const lowRelevanceHitCount = countKeywordHits(normalizedText, LOW_RELEVANCE_KEYWORDS);
  const aiHitCount = countKeywordHits(normalizedText, RELEVANCE_GROUPS.ai);
  const dataHitCount = countKeywordHits(normalizedText, RELEVANCE_GROUPS.data);
  const productHitCount = countKeywordHits(normalizedText, RELEVANCE_GROUPS.product);
  const hasAI = aiHitCount > 0;
  const hasData = dataHitCount > 0;
  const hasProduct = productHitCount > 0;
  const isSenior = SENIOR_REQUIREMENT_PATTERNS.some((pattern) => pattern.test(normalizedText));
  const isLowRelevance = lowRelevanceHitCount > 0 && targetHitCount === 0;

  return {
    targetHitCount,
    lowRelevanceHitCount,
    aiHitCount,
    dataHitCount,
    productHitCount,
    hasAI,
    hasData,
    hasProduct,
    isSenior,
    isLowRelevance,
    isHighlyRelevant: hasAI && hasData && hasProduct,
  };
};

const buildHighlights = (normalizedText) =>
  EVIDENCE_RULES.filter((rule) => rule.triggers.some((keyword) => keywordMatches(normalizedText, keyword)))
    .slice(0, 4)
    .map(({ jdNeed, evidence, ability }) => ({ jdNeed, evidence, ability }));

const buildRisks = () => [];

const buildSummary = (roleRelevance) => {
  const category = roleRelevance?.category || "weak_fit";
  const reason = roleRelevance?.reason || "";

  if (category === "core_fit" && reason.includes("SQL / Python")) {
    return "候选人的 UCSD 统计学背景与数据分析项目能够支撑该岗位对数据敏感度、指标体系和业务分析能力的要求。UCSD Triton Transit 项目体现了其 SQL / Python 数据处理、指标分析和可视化表达能力；SOVA AI 项目补充体现了其对指标口径、异常拆解和报告输出链路的理解。整体来看，候选人与数据分析师 / 产品数据分析方向的岗位要求高度匹配。";
  }

  if (category === "core_fit" && reason.includes("增长分析")) {
    return "该岗位关注指标体系、用户行为和增长分析。候选人的 UCSD Triton Transit 项目体现了其围绕时间、路线、站点和服务缺口进行指标拆解的能力；SOVA AI 项目体现了其对指标异动、Top Movers 和证据链分析的理解。整体来看，候选人与数据产品、业务分析和增长分析方向具备较高匹配度。";
  }

  const summaries = {
    core_fit:
      "候选人与该岗位的 AI 产品、AI Agent 和大模型应用产品要求高度匹配。CareerFit Agent 项目体现了其对 JD 分析、经历证据匹配、质量检查和 PDF 导出链路的产品化理解；SOVA AI 项目体现了其对 Agent 工作流、结构化输出和业务问题拆解的理解。整体来看，候选人具备面向 AI 产品经理实习、AI Agent 应用产品和大模型应用产品方向的项目基础、技术理解和落地能力。",
    strong_fit:
      "候选人的项目经历覆盖 CareerFit Agent、SOVA AI 和 InsightFlow AI，能够支撑该岗位对 AI 工具应用、Agent 工作流、Prompt 结构设计和产品原型落地的要求。统计学背景和数据项目作为证据与指标判断能力补充，整体与 AI 产品和大模型应用相关岗位需求匹配度较高。",
    adjacent_fit:
      "该岗位与候选人在 AI 工具应用、信息结构化和项目落地方面存在一定关联，但岗位核心更偏内容、运营或项目支持。候选人的 AI 工作流项目和业务分析工具项目能够体现其结构化思考与 AI 应用意识，整体属于相邻相关方向。",
    weak_fit:
      "该岗位与候选人的部分项目能力存在有限关联，主要重合点集中在信息整理、结构化表达、工具应用和项目执行层面。候选人的核心优势仍主要集中在 AI Agent 应用产品、大模型产品原型、统计背景和业务问题拆解方向。",
    low_fit:
      "该岗位与候选人当前作品集的核心方向关联较弱。候选人的优势主要集中在 AI Agent 应用产品、大模型产品原型、统计背景和业务问题拆解方向，而该岗位的核心职责与这些能力的直接重合度有限。",
  };

  return summaries[category] || summaries.weak_fit;
};

function analyzeJDMatch(jdText) {
  const normalizedText = normalizeText(jdText);
  const dimensionScores = {};
  const dimensionMatches = {};
  const profile = getRelevanceProfile(normalizedText);

  Object.entries(MATCH_CONFIG.dimensions).forEach(([key, dimension]) => {
    const matches = getDimensionMatches(normalizedText, dimension);
    dimensionMatches[key] = matches;
    dimensionScores[key] = scoreDimension(matches);
  });

  const highlights = buildHighlights(normalizedText);

  if (highlights.length >= 2) {
    dimensionScores.projectExperience = Math.max(dimensionScores.projectExperience, 88);
  }

  if (profile.targetHitCount > 0 && !profile.isLowRelevance) {
    applyDimensionFloor(dimensionScores, {
      education: 88,
      projectExperience: 86,
    });
  }

  if (profile.hasData) {
    applyDimensionFloor(dimensionScores, {
      dataAnalysis: 90,
      businessUnderstanding: 86,
    });
  }

  if (profile.hasAI) {
    applyDimensionFloor(dimensionScores, {
      aiProduct: 90,
      projectExperience: 88,
    });
  }

  if (profile.hasProduct) {
    applyDimensionFloor(dimensionScores, {
      aiProduct: profile.hasAI ? 91 : 88,
      businessUnderstanding: 88,
      projectExperience: 88,
    });
  }

  if (profile.isSenior && (profile.hasAI || profile.hasProduct)) {
    applyDimensionFloor(dimensionScores, {
      education: 86,
      aiProduct: 88,
      projectExperience: 86,
      businessUnderstanding: 86,
    });
  }

  if (profile.isHighlyRelevant) {
    applyDimensionFloor(dimensionScores, {
      education: 90,
      dataAnalysis: 92,
      aiProduct: 92,
      projectExperience: 90,
      businessUnderstanding: 90,
    });
  }

  let overallScore = Math.round(
    clamp(
      Object.entries(MATCH_CONFIG.dimensions).reduce(
        (total, [key, dimension]) => total + dimensionScores[key] * dimension.weight,
        0,
      ),
    ),
  );

  if (!profile.isLowRelevance) {
    if (profile.targetHitCount >= 5) {
      overallScore += 11;
    } else if (profile.targetHitCount >= 3) {
      overallScore += 7;
    } else if (profile.targetHitCount >= 1) {
      overallScore += 4;
    }

    if (profile.isHighlyRelevant) {
      overallScore = Math.max(overallScore, 90);
    } else if (profile.hasData && (profile.targetHitCount >= 4 || profile.dataHitCount >= 3)) {
      overallScore = Math.max(overallScore, 90);
    } else if (profile.hasAI && profile.hasProduct) {
      overallScore = Math.max(overallScore, profile.isSenior ? 82 : 91);
    } else if (profile.hasAI && profile.aiHitCount >= 2) {
      overallScore = Math.max(overallScore, profile.isSenior ? 82 : 90);
    } else if (profile.hasData) {
      overallScore = Math.max(overallScore, 88);
    }
  }

  if (profile.isSenior && !profile.hasData && !profile.isHighlyRelevant) {
    overallScore = Math.min(Math.max(overallScore, 80), 84);
  }

  if (profile.isLowRelevance) {
    overallScore = Math.min(overallScore, 60);
    Object.keys(dimensionScores).forEach((key) => {
      dimensionScores[key] = Math.min(dimensionScores[key], 60);
    });
  }

  const matchedKeywords = removeNestedKeywordNoise(
    unique(Object.values(dimensionMatches).flatMap((matches) => [...matches.coreHits, ...matches.normalHits])),
  ).slice(0, 12);
  const roleRelevance = classifyRoleRelevance(jdText, matchedKeywords);

  overallScore = Math.round(clamp(overallScore, roleRelevance.scoreFloor, roleRelevance.scoreCap));
  const level = getLevel(overallScore);
  const missingKeywords = unique(
    Object.values(MATCH_CONFIG.dimensions).flatMap((dimension) =>
      dimension.coreKeywords.filter((keyword) => !keywordMatches(normalizedText, keyword)),
    ),
  ).slice(0, 8);
  const risks = buildRisks();

  return {
    overallScore,
    level,
    dimensionScores,
    matchedKeywords,
    missingKeywords,
    highlights,
    risks,
    summary: buildSummary(roleRelevance),
    roleRelevance,
  };
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const escapeHTML = escapeHtml;

const toArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const toFiniteScore = (value) => {
  const score = Number(value);
  return Number.isFinite(score) ? Math.round(clamp(score, 0, 100)) : null;
};

function getLevelClass(level) {
  const levelMap = {
    高匹配: "level-high",
    中高匹配: "level-mid-high",
    中等匹配: "level-medium",
    低匹配: "level-low",
  };

  return levelMap[level] || "level-pending";
}

function formatDimensionLabel(key) {
  const labels = {
    education: "学历背景",
    dataAnalysis: "数据分析能力",
    aiProduct: "AI 产品能力",
    projectExperience: "项目经验",
    businessUnderstanding: "业务理解",
  };

  return labels[key] || key;
}

const normalizeReport = (report = {}) => {
  const safeReport = report && typeof report === "object" ? report : {};
  const dimensionScores =
    safeReport.dimensionScores && typeof safeReport.dimensionScores === "object" ? safeReport.dimensionScores : {};

  return {
    overallScore: toFiniteScore(safeReport.overallScore),
    level: typeof safeReport.level === "string" && safeReport.level.trim() ? safeReport.level : "待判断",
    dimensionScores,
    matchedKeywords: toArray(safeReport.matchedKeywords),
    missingKeywords: toArray(safeReport.missingKeywords),
    highlights: toArray(safeReport.highlights),
    risks: toArray(safeReport.risks),
    roleRelevance:
      safeReport.roleRelevance && typeof safeReport.roleRelevance === "object" ? safeReport.roleRelevance : null,
    summary:
      typeof safeReport.summary === "string" && safeReport.summary.trim()
        ? safeReport.summary
        : "当前报告基于 JD 关键词、项目证据和能力维度生成，用于快速判断岗位与候选人项目能力的重合程度。",
  };
};

const renderMatchPreviewMessage = (message, tone = "info") => {
  if (!matchPreview) return;
  matchPreview.className = `match-preview match-preview--${tone}`;
  matchPreview.innerHTML = `<p>${escapeHtml(message)}</p>`;
};

const renderMatchLoading = (progress, message = "正在分析") => {
  if (!matchPreview) return;

  const safeProgress = clamp(Number(progress) || 0, 0, 100);
  matchPreview.className = "match-preview match-preview--loading";
  matchPreview.innerHTML = `
    <div class="match-loading-card">
      <div class="match-loading-top">
        <span data-progress-label>${escapeHTML(message)}</span>
        <strong data-progress-value>${Math.round(safeProgress)}%</strong>
      </div>
      <div class="match-progress" aria-hidden="true">
        <span data-progress-fill style="width: ${safeProgress}%"></span>
      </div>
    </div>
  `;
};

const updateProgressUI = (progress, message = "正在分析") => {
  if (!matchPreview) return;

  const safeProgress = clamp(Number(progress) || 0, 0, 100);
  const label = matchPreview.querySelector("[data-progress-label]");
  const value = matchPreview.querySelector("[data-progress-value]");
  const fill = matchPreview.querySelector("[data-progress-fill]");

  if (!label || !value || !fill) {
    renderMatchLoading(safeProgress, message);
    return;
  }

  label.textContent = message;
  value.textContent = `${Math.round(safeProgress)}%`;
  fill.style.width = `${safeProgress}%`;
};

const renderMatchPreview = (report) => {
  if (!matchPreview) return;

  const safeReport = normalizeReport(report);
  const keywordHtml = safeReport.matchedKeywords
    .slice(0, 5)
    .map((keyword) => `<span>${escapeHtml(keyword)}</span>`)
    .join("");
  const highlightHtml = safeReport.highlights
    .slice(0, 2)
    .map(
      (highlight) => `
        <article class="preview-highlight">
          <strong>${escapeHtml(highlight.jdNeed)}</strong>
          <p>${escapeHtml(highlight.evidence)}</p>
          <small>${escapeHtml(highlight.ability)}</small>
        </article>
      `,
    )
    .join("");

  matchPreview.className = "match-preview match-preview--ready";
  matchPreview.innerHTML = `
    <div class="preview-score-row">
      <div>
        <span class="preview-label">Match Score</span>
        <strong>${safeReport.overallScore === null ? "--" : safeReport.overallScore}</strong>
      </div>
      <div class="preview-meta">
        <span class="preview-level">${escapeHtml(safeReport.level)}</span>
      </div>
    </div>

    <div class="preview-keywords" aria-label="命中关键词">
      ${keywordHtml || "<span>暂无明显命中关键词</span>"}
    </div>

    <div class="preview-highlights">
      ${highlightHtml || "<p>暂未匹配到明确项目证据。更完整的岗位描述可生成更清晰的匹配亮点。</p>"}
    </div>

    <p class="preview-summary">${escapeHTML(safeReport.summary)}</p>

    <button class="secondary-action preview-report-button" type="button" data-open-match-modal>
      查看完整报告
    </button>
  `;
};

const requestLLMEnhancedReport = async (jdText, localReport) => {
  const response = await fetch("/api/analyze-jd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jdText,
      localReport,
    }),
  });

  if (!response.ok) {
    throw new Error("AI enhancement request failed");
  }

  return response.json();
};

const renderKeywordPills = (keywords, className = "keyword-pill", emptyText = "暂无明显关键词命中", limit = 12) => {
  const items = toArray(keywords).slice(0, limit);

  if (!items.length) {
    return `<p class="modal-empty">${escapeHTML(emptyText)}</p>`;
  }

  return items.map((keyword) => `<span class="${className}">${escapeHTML(keyword)}</span>`).join("");
};

const renderDimensionRows = (dimensionScores = {}) => {
  const dimensionKeys = ["education", "dataAnalysis", "aiProduct", "projectExperience", "businessUnderstanding"];
  const rows = dimensionKeys
    .filter((key) => Object.prototype.hasOwnProperty.call(dimensionScores, key))
    .map((key) => {
      const score = toFiniteScore(dimensionScores[key]);
      const width = score === null ? 0 : score;

      return `
        <div class="dimension-row">
          <div class="dimension-row-top">
            <span>${escapeHTML(formatDimensionLabel(key))}</span>
            <strong>${score === null ? "--" : score}</strong>
          </div>
          <div class="dimension-bar" aria-hidden="true">
            <span style="width: ${width}%"></span>
          </div>
        </div>
      `;
    })
    .join("");

  return rows || `<p class="modal-empty">暂无维度评分数据。</p>`;
};

const renderHighlightCards = (highlights) => {
  const items = toArray(highlights).slice(0, 4);

  if (!items.length) {
    return `<p class="modal-empty">暂未匹配到明确项目证据。更完整的岗位描述可生成更清晰的匹配亮点。</p>`;
  }

  return items
    .map((highlight) => {
      const jdNeed = highlight && typeof highlight.jdNeed === "string" ? highlight.jdNeed : "待判断";
      const evidence = highlight && typeof highlight.evidence === "string" ? highlight.evidence : "暂无项目证据。";
      const ability = highlight && typeof highlight.ability === "string" ? highlight.ability : "暂无能力说明。";

      return `
        <article class="highlight-card">
          <div>
            <span>JD 需要</span>
            <p>${escapeHTML(jdNeed)}</p>
          </div>
          <div>
            <span>项目证据</span>
            <p>${escapeHTML(evidence)}</p>
          </div>
          <div>
            <span>体现能力</span>
            <p>${escapeHTML(ability)}</p>
          </div>
        </article>
      `;
    })
    .join("");
};

function renderMatchModal(report) {
  if (!matchModalContent) return;

  const safeReport = normalizeReport(report);
  const scoreText = safeReport.overallScore === null ? "--" : safeReport.overallScore;
  const levelClass = getLevelClass(safeReport.level);

  matchModalContent.innerHTML = `
    <div class="match-modal-header">
      <div>
        <p class="modal-kicker">JD Match Report</p>
        <h2 id="matchModalTitle">AI 岗位匹配报告</h2>
        <p>基于 JD 关键词、项目证据和能力维度生成</p>
      </div>
      <div class="match-score-hero ${levelClass}">
        <span>${escapeHTML(safeReport.level)}</span>
        <strong class="score-number">${scoreText}<small>/ 100</small></strong>
      </div>
    </div>

    <section class="modal-section">
      <div class="modal-section-title">
        <h3>维度矩阵</h3>
        <p>分数越高，代表 JD 与该能力维度的关键词和项目证据越贴近。</p>
      </div>
      <div class="dimension-grid">
        ${renderDimensionRows(safeReport.dimensionScores)}
      </div>
    </section>

    <section class="modal-section">
      <div class="modal-section-title">
        <h3>JD 关键词匹配</h3>
      </div>
      <div class="keyword-cloud">
        ${renderKeywordPills(safeReport.matchedKeywords, "keyword-pill", "暂无明显关键词命中", 12)}
      </div>
    </section>

    <section class="modal-section">
      <div class="modal-section-title">
        <h3>匹配亮点</h3>
      </div>
      <div class="highlight-grid">
        ${renderHighlightCards(safeReport.highlights)}
      </div>
    </section>

    <section class="summary-card">
      <span>总结</span>
      <p>${escapeHTML(safeReport.summary)}</p>
    </section>

    <div class="modal-actions">
      <button class="secondary-action" type="button" data-close-match-modal>关闭</button>
      <button class="primary-action" type="button" data-scroll-projects>查看代表项目</button>
    </div>
  `;
}

const getProjectDetail = (projectId) =>
  PROJECT_DETAILS[projectId] || Object.values(PROJECT_DETAILS).find((project) => project.id === projectId);

const renderProjectTags = (tags, className = "project-method-pill") =>
  toArray(tags)
    .map((tag) => `<span class="${className}">${escapeHTML(tag)}</span>`)
    .join("");

const renderProjectDetailItems = (items) =>
  toArray(items)
    .map(
      (item) => `
        <article class="project-detail-item">
          <h4>${escapeHTML(item.title || "")}</h4>
          <p>${escapeHTML(item.description || "")}</p>
        </article>
      `,
    )
    .join("");

function renderProjectGallery(project, activeIndex = 0) {
  const gallery = toArray(project.gallery);
  if (!gallery.length) return "";

  const activeItem = gallery[activeIndex] || gallery[0] || {};
  const thumbnails = gallery.length > 1
    ? `
      <div class="project-thumbnails" role="tablist" aria-label="项目展示缩略图">
        ${gallery
          .map(
            (item, index) => `
              <button class="project-thumb ${index === activeIndex ? "is-active" : ""}" type="button" data-project-thumb="${index}" role="tab" aria-selected="${index === activeIndex ? "true" : "false"}">
                <span>${escapeHTML(item.label)}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    `
    : "";

  return `
    <div class="project-gallery-main">
      <div class="project-gallery-fallback">
        <strong>${escapeHTML(activeItem.fallback || project.title)}</strong>
        <span>${escapeHTML(activeItem.label || "项目展示")}</span>
      </div>
      ${
        activeItem.src
          ? `<img src="${escapeHTML(activeItem.src)}" alt="${escapeHTML(`${project.title} - ${activeItem.label || "项目展示"}`)}" />`
          : ""
      }
    </div>
    ${thumbnails}
  `;
}

function renderProjectModal(project) {
  if (!projectModalContent) return;

  const githubButton = project.links?.github
    ? `<a class="project-button secondary" href="${escapeHTML(project.links.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`
    : "";
  const demoButton = project.links?.demo
    ? `<a class="project-button" href="${escapeHTML(project.links.demo)}" target="_blank" rel="noopener noreferrer">打开项目</a>`
    : "";
  const gallerySection = toArray(project.gallery).length
    ? `
      <section class="project-detail-card">
        <h3 class="project-detail-section-title">UI / 成果展示</h3>
        <div class="project-gallery" data-project-gallery>
          ${renderProjectGallery(project, 0)}
        </div>
      </section>
    `
    : "";

  projectModalContent.innerHTML = `
    <div class="project-modal-header">
      <span class="project-modal-category">${escapeHTML(project.category)}</span>
      <h2 class="project-modal-title" id="projectModalTitle">${escapeHTML(project.title)}</h2>
      <p class="project-modal-subtitle">${escapeHTML(project.subtitle)}</p>
      <div class="project-modal-tags">
        ${renderProjectTags(project.tags)}
      </div>
    </div>

    <section class="project-detail-card">
      <h3 class="project-detail-section-title">项目背景</h3>
      <p>${escapeHTML(project.background)}</p>
    </section>

    ${gallerySection}

    <section class="project-detail-card">
      <h3 class="project-detail-section-title">核心职责</h3>
      <div class="project-detail-grid">
        ${renderProjectDetailItems(project.responsibilities)}
      </div>
    </section>

    <section class="project-detail-card">
      <h3 class="project-detail-section-title">核心成果</h3>
      <div class="project-detail-grid">
        ${renderProjectDetailItems(project.results)}
      </div>
    </section>

    <section class="project-detail-card">
      <h3 class="project-detail-section-title">技术与方法</h3>
      <div class="project-methods">
        ${renderProjectTags(project.methods)}
      </div>
    </section>

    <div class="project-modal-actions">
      ${demoButton}
      ${githubButton}
      <button class="project-button secondary" type="button" data-close-project-modal>关闭</button>
    </div>
  `;

  projectModalContent.dataset.activeProject = project.id;
  bindProjectGalleryImageFallbacks();
}

function openProjectModal(projectId) {
  const project = getProjectDetail(projectId);
  if (!project) return;

  renderProjectModal(project);
  projectDetailModal?.classList.add("is-open");
  projectDetailModal?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProjectModal() {
  projectDetailModal?.classList.remove("is-open");
  projectDetailModal?.setAttribute("aria-hidden", "true");

  if (!matchReportModal?.classList.contains("is-open")) {
    document.body.classList.remove("modal-open");
  }
}

function bindProjectGalleryImageFallbacks() {
  projectModalContent?.querySelectorAll(".project-gallery-main img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("is-hidden");
    });
  });
}

function handleProjectThumbnailClick(index) {
  const project = getProjectDetail(projectModalContent?.dataset.activeProject || "");
  const galleryContainer = projectModalContent?.querySelector("[data-project-gallery]");

  if (!project || !galleryContainer) return;

  galleryContainer.innerHTML = renderProjectGallery(project, index);
  bindProjectGalleryImageFallbacks();
}

function openMatchModal() {
  if (!window.lastMatchReport) {
    renderMatchPreviewMessage("请先粘贴 JD 并生成分析结果，再查看完整报告。", "warning");
    return;
  }

  renderMatchModal(window.lastMatchReport);
  matchReportModal?.classList.add("is-open");
  matchReportModal?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeMatchModal() {
  matchReportModal?.classList.remove("is-open");
  matchReportModal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

const setActiveStep = (activeIndex) => {
  const analysisSteps = [...document.querySelectorAll(".analysis-step")];
  analysisSteps.forEach((step, index) => {
    step.classList.toggle("is-active", index === activeIndex);
  });
};

const setStepText = (index, message) => {
  const analysisSteps = [...document.querySelectorAll(".analysis-step")];
  const step = analysisSteps[index];
  if (!step) return;

  const marker = step.querySelector("span");
  step.textContent = "";
  if (marker) step.append(marker);
  step.append(` ${message}`);
};

const wait = (duration) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

const runConsoleSteps = async () => {
  const analysisSteps = [...document.querySelectorAll(".analysis-step")];
  if (!analysisSteps.length) return;

  const localStepCount = Math.min(3, analysisSteps.length);
  for (let index = 0; index < localStepCount; index += 1) {
    setActiveStep(index);
    await wait(index === localStepCount - 1 ? 360 : 520);
  }
};

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
};

const closeMobileNav = () => {
  navLinks?.classList.remove("is-open");
  document.body.classList.remove("nav-open");
};

const updateParallax = () => {
  const y = window.scrollY;

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0);
    item.style.transform = `translate3d(0, ${y * speed}px, 0)`;
  });
};

let isAnalyzing = false;
let progressAnimationFrame = null;
let progressAnimationState = null;

const lerp = (start, end, ratio) => start + (end - start) * clamp(ratio, 0, 1);

const getLoadingProgress = (elapsedMs) => {
  if (elapsedMs < 500) {
    return lerp(0, 18, elapsedMs / 500);
  }

  if (elapsedMs < 1200) {
    return lerp(18, 38, (elapsedMs - 500) / 700);
  }

  if (elapsedMs < 2200) {
    return lerp(38, 62, (elapsedMs - 1200) / 1000);
  }

  if (elapsedMs < 3500) {
    return lerp(62, 78, (elapsedMs - 2200) / 1300);
  }

  const slowElapsed = elapsedMs - 3500;
  return Math.min(92, 78 + 14 * (1 - Math.exp(-slowElapsed / 3500)));
};

const easeOutCubic = (ratio) => 1 - Math.pow(1 - clamp(ratio, 0, 1), 3);

function stopProgressAnimation() {
  if (progressAnimationFrame !== null) {
    window.cancelAnimationFrame(progressAnimationFrame);
  }

  progressAnimationFrame = null;
  progressAnimationState = null;
}

function startProgressAnimation() {
  stopProgressAnimation();
  renderMatchLoading(0, "正在分析");

  progressAnimationState = {
    current: 0,
    message: "正在分析",
    isCompleting: false,
    startedAt: performance.now(),
    completeStartTime: 0,
    completeFrom: 0,
    resolveComplete: null,
  };

  const tick = () => {
    if (!progressAnimationState) return;

    const state = progressAnimationState;
    const now = performance.now();

    if (state.isCompleting) {
      const ratio = (now - state.completeStartTime) / 420;
      state.current = lerp(state.completeFrom, 100, easeOutCubic(ratio));

      if (ratio >= 1) {
        state.current = 100;
        updateProgressUI(state.current, state.message);
        const resolve = state.resolveComplete;
        stopProgressAnimation();
        resolve?.();
        return;
      }
    } else {
      state.current = getLoadingProgress(now - state.startedAt);
    }

    updateProgressUI(state.current, state.message);
    progressAnimationFrame = window.requestAnimationFrame(tick);
  };

  progressAnimationFrame = window.requestAnimationFrame(tick);
}

async function completeProgressAnimation(message = "已生成匹配报告，可查看完整报告") {
  if (!progressAnimationState) {
    renderMatchLoading(100, message);
    await wait(420);
    return;
  }

  const elapsed = performance.now() - progressAnimationState.startedAt;
  if (elapsed < 1500) {
    await wait(1500 - elapsed);
  }

  const reachedComplete = new Promise((resolve) => {
    if (!progressAnimationState) {
      resolve();
      return;
    }

    progressAnimationState.message = message;
    progressAnimationState.isCompleting = true;
    progressAnimationState.completeStartTime = performance.now();
    progressAnimationState.completeFrom = progressAnimationState.current;
    progressAnimationState.resolveComplete = resolve;
  });

  await reachedComplete;
  await wait(420);
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const input = document.createElement("input");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  return copied;
}

navToggle?.addEventListener("click", () => {
  navLinks?.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", navLinks?.classList.contains("is-open"));
});

navLinks?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMobileNav();
  }
});

copyEmailButton?.addEventListener("click", async () => {
  const email = copyEmailButton.getAttribute("data-email") || "xzw13537504508@gmail.com";
  const originalText = copyEmailButton.textContent || "Copy Email";

  try {
    const copied = await copyTextToClipboard(email);
    copyEmailButton.textContent = copied ? "已复制" : "Copy Failed";
  } catch (error) {
    copyEmailButton.textContent = "Copy Failed";
  }

  window.setTimeout(() => {
    copyEmailButton.textContent = originalText;
  }, 1500);
});

matchPreview?.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const trigger = target?.closest("[data-open-match-modal]");

  if (trigger) {
    openMatchModal();
  }
});

matchReportModal?.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const closeTrigger = target?.closest("[data-close-match-modal]");
  const projectTrigger = target?.closest("[data-scroll-projects]");

  if (event.target === matchReportModal || closeTrigger) {
    closeMatchModal();
    return;
  }

  if (projectTrigger) {
    closeMatchModal();
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

matchModalCloseButton?.addEventListener("click", closeMatchModal);

document.querySelectorAll(".project-media img").forEach((image) => {
  image.addEventListener("error", () => {
    image.classList.add("is-hidden");
    image.closest(".project-media")?.classList.add("is-fallback");
  });
});

document.querySelectorAll("[data-project-detail]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const projectId = button.getAttribute("data-project-id") || button.closest("[data-project-card]")?.getAttribute("data-project-card") || "";
    openProjectModal(projectId);

    if (projectDetailHint) {
      projectDetailHint.textContent = "";
    }
  });
});

projectDetailModal?.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;

  if (event.target === projectDetailModal || target?.closest("[data-close-project-modal]")) {
    closeProjectModal();
    return;
  }

  const thumb = target?.closest("[data-project-thumb]");
  if (thumb) {
    handleProjectThumbnailClick(Number(thumb.getAttribute("data-project-thumb")));
  }
});

projectModalCloseButton?.addEventListener("click", closeProjectModal);

analyzeButton?.addEventListener("click", async () => {
  if (isAnalyzing) return;

  const jdText = jdInput?.value.trim() || "";

  if (jdText.length < 20) {
    window.lastMatchReport = null;
    renderMatchPreviewMessage("请粘贴更完整的职位描述，方便生成更准确的匹配分析。", "warning");
    analyzeButton.textContent = "开始分析匹配度";
    setActiveStep(0);
    return;
  }

  isAnalyzing = true;
  analyzeButton.disabled = true;
  analyzeButton.textContent = "正在分析...";
  window.lastMatchReport = null;
  closeMatchModal();
  startProgressAnimation();

  const localReport = analyzeJDMatch(jdText);
  let finalReport = localReport;

  try {
    const data = await requestLLMEnhancedReport(jdText, localReport);
    finalReport = data?.report || localReport;
    await completeProgressAnimation("已生成匹配报告，可查看完整报告");
  } catch (error) {
    finalReport = localReport;
    await completeProgressAnimation("已生成匹配报告，可查看完整报告");
  } finally {
    stopProgressAnimation();
    window.lastMatchReport = finalReport;
    renderMatchPreview(finalReport);
    if (matchReportModal?.classList.contains("is-open")) {
      renderMatchModal(finalReport);
    }
    analyzeButton.textContent = "重新分析匹配度";
    analyzeButton.disabled = false;
    isAnalyzing = false;
  }
});

window.addEventListener("scroll", () => {
  setHeaderState();
  updateParallax();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMobileNav();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (projectDetailModal?.classList.contains("is-open")) {
    closeProjectModal();
    return;
  }

  if (matchReportModal?.classList.contains("is-open")) {
    closeMatchModal();
  }
});

window.analyzeJDMatch = analyzeJDMatch;
window.openMatchModal = openMatchModal;
window.closeMatchModal = closeMatchModal;
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.lastMatchReport = null;

setHeaderState();
updateParallax();
