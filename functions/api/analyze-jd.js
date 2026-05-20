const VALID_LEVELS = ["高匹配", "中高匹配", "中等匹配", "低匹配"];
const DIMENSION_KEYS = ["education", "dataAnalysis", "aiProduct", "projectExperience", "businessUnderstanding"];

const DEFAULT_REPORT = {
  overallScore: 45,
  level: "低匹配",
  dimensionScores: {
    education: 45,
    dataAnalysis: 45,
    aiProduct: 45,
    projectExperience: 45,
    businessUnderstanding: 45,
  },
  matchedKeywords: [],
  missingKeywords: [],
  highlights: [],
  risks: [],
  summary: "该岗位与候选人当前作品集的核心方向关联较弱。候选人的优势主要集中在 AI Agent 应用产品、大模型产品原型、统计背景和业务问题拆解方向，而该岗位的核心职责与这些能力的直接重合度有限。",
  roleRelevance: null,
};

const SYSTEM_PROMPT = `你是一位科技互联网公司的 AI 产品经理 / 数据分析岗位面试官，负责根据 JD 判断候选人与岗位的匹配度。

严格要求：
1. 只能基于候选人提供的真实简历内容分析，不允许编造实习、公司、奖项或工作经历。
2. 不允许说候选人有正式 AI 产品经理实习经历。
3. 本报告展示给 HR 或面试官阅读，而不是给候选人自己的面试建议。summary 和 highlights 必须使用第三方评估语气。
4. 不要写“建议候选人展示”“面试中建议补充”“可以用某项目证明”“建议重点展示”等候选人视角表达。
5. 不要主动输出负面风险。risks 默认返回空数组。
6. 不要在 summary 中使用“缺乏”“未直接体现”“不足”“直接匹配度不足”“有待进一步阐述”等削弱候选人的措辞。
7. 不要因为 JD 中出现 AI、AIGC、逻辑思维、信息结构化等泛化关键词就给出 90+ 高分。必须先判断岗位本身是否属于候选人的核心目标方向：AI 产品经理实习、AI Agent 应用产品、大模型应用产品、数据产品、产品原型、业务工作流和质量评估。
8. 如果岗位主要是内容运营、课程制作、教育分发、社群运营、行政支持或销售支持，即使包含 AI 工具探索，也只能判定为相邻相关或弱相关，分数通常不应超过 83。
9. 只有当 JD 同时包含明确的 AI Agent / LLM / 产品需求 / 用户需求 / 工作流 / 结构化输出 / 质量评估 / 产品原型等核心职责时，才可以给 90-95。数据分析、SQL、Python 等能力作为支撑项，不再作为候选人的唯一主定位。
10. 如果 localReport 中包含 roleRelevance 或 scoreCap，请严格遵守该上限，不要突破。
11. 不要给 100 分，不要超过 95 分，不要低于 45 分。
12. 输出必须是 JSON，不要输出 markdown，不要输出解释性废话。

候选人固定背景：
姓名：Zev Xiao / 肖正午
学校：University of California, San Diego
专业：Probability and Statistics
方向：AI 产品经理实习 / AI Agent 应用产品 / 大模型应用产品
GPA：3.7/4.0

相关课程：
Artificial Intelligence, Data Science, Probability, Statistical Modeling, Regression Analysis, Linear Algebra, Computer Science Basics

技能：
AI Agent, LLM, Prompt Engineering, RAG, Tool Calling, Workflow Design, Guardrails, 结构化输出, 质量评估, JD Analysis, Resume Matching, ATS Keywords, PDF Export, PRD, 用户流程, 产品原型, SQL, Python, Pandas, DuckDB, 指标体系, 可视化。

项目 1：CareerFit Agent｜AI 求职材料匹配 Agent
内容：围绕真实岗位 JD，将 Master 简历、岗位要求、经历证据匹配、定制摘要、质量检查和 A4 PDF 导出串成 AI 求职材料定制工作流，帮助生成更贴近岗位筛选逻辑、同时保持经历真实性的定制简历。
可体现：AI Agent 应用产品设计、JD 语义拆解、结构化输出、质量防护、ATS 关键词覆盖、PDF 导出链路和大模型产品 MVP 落地能力。

项目 2：SOVA AI｜AI 指标异动分析 Agent
内容：针对“指标下跌但原因不明”的业务问题，将模糊需求拆解为指标澄清、字段识别、Metric Spec、指标计算、异动拆解、证据链生成和报告输出。
可体现：AI 产品设计、Agent 工作流设计、Prompt 结构设计、指标口径设计、数据分析链路设计和输出质量评估。

项目 3：UCSD Triton Transit｜校园班车晚间服务缺口诊断与排班优化
内容：基于 UCSD Triton Transit GTFS static feed，使用 SQL / DuckDB / Pandas 分析路线、站点、时间维度的服务供给，识别 20:00 后尤其 21:00-22:00 的晚间服务缺口。
可体现：SQL、Python、DuckDB、Pandas、GTFS 数据处理、指标分析、可视化分析和运营优化建议能力。

项目 4：InsightFlow AI｜数据分析业务流程助手
内容：面向数据分析新手设计 AI 工具型产品原型，将模糊业务需求转化为分析问题、指标体系、业务假设、分析路径和汇报大纲。
可体现：产品原型设计、Prompt 框架设计、业务分析流程设计。

项目 5：AI Exposure 与编程职业就业前景分析
内容：围绕 AI 暴露度与编程相关职业的薪资、就业规模和增长预期之间的关系，整合 BLS、O*NET 和 AI exposure 数据进行分析。
可体现：统计分析、职业数据研究、变量比较、相关性解释和非因果解释意识。

必须输出以下 JSON schema：
{
  "overallScore": number,
  "level": "高匹配" | "中高匹配" | "中等匹配" | "低匹配",
  "dimensionScores": {
    "education": number,
    "dataAnalysis": number,
    "aiProduct": number,
    "projectExperience": number,
    "businessUnderstanding": number
  },
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "highlights": [
    {
      "jdNeed": string,
      "evidence": string,
      "ability": string
    }
  ],
  "risks": string[],
  "summary": string,
  "roleRelevance": {
    "category": string,
    "label": string,
    "scoreCap": number,
    "scoreFloor": number,
    "reason": string
  }
}`;

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function clampScore(score, min = 45, max = 95) {
  const number = Number(score);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function getLevelFromScore(score) {
  if (score >= 85) return "高匹配";
  if (score >= 75) return "中高匹配";
  if (score >= 65) return "中等匹配";
  return "低匹配";
}

function normalizeArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

function normalizeDimensionScores(scores = DEFAULT_REPORT.dimensionScores) {
  return DIMENSION_KEYS.reduce((acc, key) => {
    acc[key] = clampScore(scores?.[key] ?? DEFAULT_REPORT.dimensionScores[key]);
    return acc;
  }, {});
}

function normalizeLocalReport(report) {
  const source = report && typeof report === "object" ? report : DEFAULT_REPORT;
  const overallScore = clampScore(source.overallScore ?? DEFAULT_REPORT.overallScore);

  return {
    overallScore,
    level: VALID_LEVELS.includes(source.level) ? source.level : getLevelFromScore(overallScore),
    dimensionScores: normalizeDimensionScores(source.dimensionScores),
    matchedKeywords: normalizeArray(source.matchedKeywords, DEFAULT_REPORT.matchedKeywords),
    missingKeywords: normalizeArray(source.missingKeywords, DEFAULT_REPORT.missingKeywords),
    highlights: normalizeArray(source.highlights, DEFAULT_REPORT.highlights),
    risks: normalizeArray(source.risks, DEFAULT_REPORT.risks),
    summary: typeof source.summary === "string" && source.summary.trim() ? source.summary : DEFAULT_REPORT.summary,
    roleRelevance: source.roleRelevance && typeof source.roleRelevance === "object" ? source.roleRelevance : null,
  };
}

function extractJsonFromText(text) {
  if (typeof text !== "string") return null;
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (error) {
    return null;
  }
}

function validateAndMergeReport(llmReport, localReport) {
  const local = normalizeLocalReport(localReport);
  const source = llmReport && typeof llmReport === "object" ? llmReport : {};
  const relevance = local.roleRelevance || source.roleRelevance || null;
  const scoreFloor = Number.isFinite(Number(relevance?.scoreFloor)) ? Number(relevance.scoreFloor) : 45;
  const scoreCap = Number.isFinite(Number(relevance?.scoreCap)) ? Number(relevance.scoreCap) : 95;

  const overallScore = clampScore(source.overallScore ?? local.overallScore, scoreFloor, scoreCap);
  const dimensionScores = normalizeDimensionScores({
    ...local.dimensionScores,
    ...(source.dimensionScores || {}),
  });

  return {
    overallScore,
    level: getLevelFromScore(overallScore),
    dimensionScores,
    matchedKeywords: normalizeArray(source.matchedKeywords, local.matchedKeywords).slice(0, 12),
    missingKeywords: normalizeArray(source.missingKeywords, local.missingKeywords).slice(0, 8),
    highlights: normalizeArray(source.highlights, local.highlights).slice(0, 4),
    risks: [],
    summary: typeof source.summary === "string" && source.summary.trim() ? source.summary : local.summary,
    roleRelevance: relevance,
  };
}

function fallbackPayload(localReport, warning) {
  return {
    source: "local_fallback",
    report: normalizeLocalReport(localReport),
    warning,
  };
}

function buildUserPrompt(jdText, localReport) {
  return `以下是岗位 JD：
${jdText}

以下是本地关键词评分结果：
${JSON.stringify(localReport, null, 2)}

请基于 JD 和本地评分结果，生成更自然、更适合 HR 阅读的匹配报告。
请保留同样的 JSON schema。
不要编造候选人没有的经历。
不要主动输出负面风险，risks 默认返回 []。
如果 localReport.roleRelevance 存在，请严格遵守其中的 scoreCap / scoreFloor。
summary 必须是 HR / 面试官视角的第三方评估语气，不要写候选人视角建议。
不要输出 markdown，只输出 JSON。`;
}

async function callModel(env, jdText, localReport) {
  const apiKey = env.XIAOMI_API_KEY;
  const baseUrl = env.XIAOMI_BASE_URL || "https://token-plan-sgp.xiaomimimo.com/v1";
  const model = env.XIAOMI_MODEL || "MiMo-V2.5-Pro";

  if (!apiKey) {
    return fallbackPayload(localReport, "missing_api_key");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(jdText, localReport) },
        ],
        temperature: 0.2,
        max_tokens: 900,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return fallbackPayload(localReport, "llm_request_failed");
    }

    const data = await response.json();
    const message = data?.choices?.[0]?.message;
    const content = message?.content || message?.reasoning_content;
    const llmReport = extractJsonFromText(content);

    if (!llmReport) {
      return fallbackPayload(localReport, "invalid_llm_json");
    }

    return {
      source: "llm",
      report: validateAndMergeReport(llmReport, localReport),
    };
  } catch (error) {
    clearTimeout(timeout);
    return fallbackPayload(localReport, error?.name === "AbortError" ? "llm_timeout" : "llm_response_failed");
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const jdText = typeof body.jdText === "string" ? body.jdText.trim() : "";
    const localReport = normalizeLocalReport(body.localReport);

    if (jdText.length < 20) {
      return jsonResponse(fallbackPayload(localReport, "invalid_jd_text"), 400);
    }

    return jsonResponse(await callModel(env, jdText, localReport));
  } catch (error) {
    return jsonResponse(fallbackPayload(DEFAULT_REPORT, "request_processing_failed"), 400);
  }
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  return jsonResponse({ error: "Method not allowed" }, 405);
}
