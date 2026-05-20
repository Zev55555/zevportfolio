import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

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
  summary: "该报告基于 JD 关键词、项目证据和能力维度生成，用于快速判断岗位与候选人项目能力的重合程度。",
  roleRelevance: null,
};

const SYSTEM_PROMPT = `你是一位科技互联网公司的 AI 产品经理 / 数据分析岗位面试官，负责根据 JD 判断候选人与岗位的匹配度。

严格要求：
1. 只能基于候选人提供的真实简历内容分析。
2. 不允许编造候选人没有的实习、公司、奖项或工作经历。
3. 不允许说候选人有正式 AI 产品经理实习经历。
4. 可以说候选人有 AI 产品项目、Agent 工作流项目、数据分析项目和统计学背景。
5. 输出必须是 JSON。
6. 不要输出 markdown。
7. 不要输出解释性废话。
8. 结果要适合国内 HR 阅读，中文为主，英文技术词保留。
9. 本报告展示给 HR 或面试官阅读，而不是给候选人自己的面试建议。summary 和 highlights 必须使用第三方评估语气。
10. 不要写“建议候选人展示”“面试中建议补充”“可以用某项目证明”“建议重点展示”等候选人视角表达。
11. risks 字段默认返回空数组。不要主动输出负面风险。
12. 不要在 summary 中使用“缺乏”“未直接体现”“不足”“直接匹配度不足”“有待进一步阐述”等削弱候选人的措辞。
13. 不要因为 JD 中出现 AI、AIGC、逻辑思维、信息结构化等泛化关键词就给出 90+ 高分。必须先判断岗位本身是否属于候选人的核心目标方向：AI 产品经理实习、AI Agent 应用产品、大模型应用产品、数据产品、产品原型、业务工作流和质量评估。
14. 如果岗位主要是内容运营、课程制作、教育分发、社群运营、行政支持或销售支持，即使包含 AI 工具探索，也只能判定为相邻相关或弱相关，分数通常不应超过 83。
15. 只有当 JD 同时包含明确的 AI Agent / LLM / 产品需求 / 用户需求 / 工作流 / 结构化输出 / 质量评估 / 产品原型等核心职责时，才可以给 90–95。数据分析、SQL、Python 等能力作为支撑项，不再作为候选人的唯一主定位。
16. 如果 localReport 中包含 roleRelevance 或 scoreCap，请严格遵守该上限，不要突破。
17. 不要过度吹嘘，语气专业、可信、克制。
18. 不要给 100 分，不要超过 95 分，不要低于 45 分。

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

项目 1：
CareerFit Agent｜AI 求职材料匹配 Agent
内容：
围绕真实岗位 JD，将 Master 简历、岗位要求、经历证据匹配、定制摘要、质量检查和 A4 PDF 导出串成 AI 求职材料定制工作流，帮助生成更贴近岗位筛选逻辑、同时保持经历真实性的定制简历。
可体现：
AI Agent 应用产品设计、JD 语义拆解、结构化输出、质量防护、ATS 关键词覆盖、PDF 导出链路和大模型产品 MVP 落地能力。

项目 2：
SOVA AI｜AI 指标异动分析 Agent
内容：
针对业务团队常见的“指标下跌但原因不明”问题，将模糊业务需求拆解为指标澄清、字段识别、Metric Spec 生成、指标计算、异动拆解、证据链生成和报告输出。包含 Step 1–10 分步式 AI 分析流程、Metric Spec、DuckDB 指标计算、Top Movers、辅助指标对比和多场景测试。
可体现：
AI 产品设计、Agent 工作流设计、Prompt 结构设计、指标口径设计、数据分析链路设计和输出质量评估。

项目 3：
UCSD Triton Transit｜校园班车晚间服务缺口诊断与排班优化
内容：
基于 UCSD Triton Transit GTFS static feed，使用 routes、trips、stop_times、stops、calendar 等表构建路线-站点-时间维度的服务分析数据集。使用 SQL / DuckDB / Pandas 计算每小时计划班次数、估算发车间隔、晚间服务占比、末班车时间等指标。通过路线 × 小时热力图、路线缺口评分图和站点覆盖分析发现晚间服务缺口主要集中在 20:00 后，尤其 21:00–22:00。
可体现：
SQL、Python、DuckDB、Pandas、GTFS 数据处理、指标分析、可视化分析和运营优化建议能力。

项目 4：
InsightFlow AI｜数据分析业务流程助手
内容：
面向数据分析新手设计 AI 工具型产品原型，帮助用户将模糊业务需求转化为分析问题、指标体系、业务假设、分析路径和汇报大纲。该项目是 SOVA AI 的早期产品验证。
可体现：
产品原型设计、Prompt 框架设计、业务分析流程设计。

项目 5：
AI Exposure 与编程职业就业前景分析
内容：
围绕 AI 暴露度是否与编程相关职业的薪资、就业规模和增长预期有关设计分析问题，整合 BLS、O*NET 和 AI exposure 数据，完成字段清洗、变量标准化、分组统计和相关性分析。
可体现：
统计分析、职业数据研究、变量比较、相关性解释和非因果解释意识。

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

function loadLocalEnv() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key.startsWith("XIAOMI_") && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

loadLocalEnv();

function clampScore(value, fallback = 45) {
  const score = Number(value);
  if (!Number.isFinite(score)) return fallback;
  return Math.min(95, Math.max(45, Math.round(score)));
}

function getLevelFromScore(score) {
  if (score >= 85) return "高匹配";
  if (score >= 75) return "中高匹配";
  if (score >= 65) return "中等匹配";
  return "低匹配";
}

function asArray(value, fallback = []) {
  return Array.isArray(value) ? value.filter(Boolean) : fallback;
}

function normalizeRoleRelevance(value) {
  if (!value || typeof value !== "object") return null;

  const scoreFloor = clampScore(value.scoreFloor, 45);
  const scoreCap = clampScore(value.scoreCap, 95);
  return {
    category: typeof value.category === "string" ? value.category : "",
    label: typeof value.label === "string" ? value.label : "",
    scoreCap: Math.max(scoreFloor, scoreCap),
    scoreFloor: Math.min(scoreFloor, scoreCap),
    reason: typeof value.reason === "string" ? value.reason : "",
  };
}

function normalizeLocalReport(localReport) {
  const report = localReport && typeof localReport === "object" ? localReport : {};
  const dimensionScores = report.dimensionScores && typeof report.dimensionScores === "object" ? report.dimensionScores : {};
  const overallScore = clampScore(report.overallScore, DEFAULT_REPORT.overallScore);

  return {
    overallScore,
    level: VALID_LEVELS.includes(report.level) ? report.level : getLevelFromScore(overallScore),
    dimensionScores: DIMENSION_KEYS.reduce((scores, key) => {
      scores[key] = clampScore(dimensionScores[key], DEFAULT_REPORT.dimensionScores[key]);
      return scores;
    }, {}),
    matchedKeywords: asArray(report.matchedKeywords, DEFAULT_REPORT.matchedKeywords),
    missingKeywords: asArray(report.missingKeywords, DEFAULT_REPORT.missingKeywords),
    highlights: asArray(report.highlights, DEFAULT_REPORT.highlights),
    risks: asArray(report.risks, DEFAULT_REPORT.risks),
    summary: typeof report.summary === "string" && report.summary.trim() ? report.summary : DEFAULT_REPORT.summary,
    roleRelevance: normalizeRoleRelevance(report.roleRelevance),
  };
}

function extractJsonFromText(text) {
  const cleaned = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

function validateAndMergeReport(llmReport, localReport) {
  const local = normalizeLocalReport(localReport);
  const report = llmReport && typeof llmReport === "object" ? llmReport : {};
  const rawDimensionScores =
    report.dimensionScores && typeof report.dimensionScores === "object" ? report.dimensionScores : {};
  let overallScore = clampScore(report.overallScore, local.overallScore);
  const roleRelevance = normalizeRoleRelevance(report.roleRelevance) || local.roleRelevance;

  if (local.overallScore >= 85 && !roleRelevance) {
    overallScore = Math.max(overallScore, local.overallScore);
  }

  if (roleRelevance) {
    overallScore = Math.min(roleRelevance.scoreCap, Math.max(roleRelevance.scoreFloor, overallScore));
  }

  return {
    overallScore,
    level: getLevelFromScore(overallScore),
    dimensionScores: DIMENSION_KEYS.reduce((scores, key) => {
      scores[key] = clampScore(rawDimensionScores[key], local.dimensionScores[key]);
      return scores;
    }, {}),
    matchedKeywords: asArray(report.matchedKeywords, local.matchedKeywords),
    missingKeywords: asArray(report.missingKeywords, local.missingKeywords),
    highlights: asArray(report.highlights, local.highlights),
    risks: asArray(report.risks, []),
    summary: typeof report.summary === "string" && report.summary.trim() ? report.summary : local.summary,
    roleRelevance,
  };
}

function sendJson(res, statusCode, payload) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    res.status(statusCode).json(payload);
    return;
  }

  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function fallbackResponse(res, localReport, warning, statusCode = 200) {
  sendJson(res, statusCode, {
    source: "local_fallback",
    report: normalizeLocalReport(localReport),
    warning,
  });
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
如果 localReport.roleRelevance 存在，请严格遵守其中的 scoreCap / scoreFloor，尤其是 adjacent_fit、weak_fit、low_fit 不要突破上限。
summary 必须是 HR / 面试官视角的第三方评估语气，直接描述候选人项目与 JD 的匹配关系。
不要写“建议在作品集中重点展示”“面试中建议”“候选人可以用”“可以通过某项目证明”等候选人视角表达。
不要因为 AI、AIGC、逻辑思维、信息结构化等泛词给 90+。只有明确包含产品 / 数据 / AI Agent / 指标分析 / SQL / Python / 用户需求 / 工作流等核心职责时，才可进入 90–95。
不要输出 markdown。
只输出 JSON。`;
}

async function parseRequestBody(req) {
  if (req && typeof req[Symbol.asyncIterator] === "function") {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const rawBody = Buffer.concat(chunks).toString("utf8").replace(/^\uFEFF/, "");
    if (rawBody) {
      return JSON.parse(rawBody);
    }
  }

  try {
    return typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch (error) {
    return {};
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const body = await parseRequestBody(req);
    const jdText = typeof body.jdText === "string" ? body.jdText.trim() : "";
    const localReport = normalizeLocalReport(body.localReport);

    if (jdText.length < 20) {
      fallbackResponse(res, localReport, "invalid_jd_text", 400);
      return;
    }

    const apiKey = process.env.XIAOMI_API_KEY;
    const baseUrl = process.env.XIAOMI_BASE_URL || "https://token-plan-sgp.xiaomimimo.com/v1";
    const model = process.env.XIAOMI_MODEL || "mimo-v2.5";

    if (!apiKey) {
      fallbackResponse(res, localReport, "missing_api_key");
      return;
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
        fallbackResponse(res, localReport, "llm_request_failed");
        return;
      }

      const data = await response.json();
      const message = data?.choices?.[0]?.message;
      const content = message?.content || message?.reasoning_content;

      if (!content) {
        fallbackResponse(res, localReport, "empty_llm_response");
        return;
      }

      const llmReport = extractJsonFromText(content);
      const report = validateAndMergeReport(llmReport, localReport);

      sendJson(res, 200, {
        source: "llm",
        report,
      });
    } catch (error) {
      clearTimeout(timeout);
      fallbackResponse(res, localReport, error?.name === "AbortError" ? "llm_timeout" : "llm_response_failed");
    }
  } catch (error) {
    fallbackResponse(res, DEFAULT_REPORT, "request_processing_failed", 400);
  }
}
