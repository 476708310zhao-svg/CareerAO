import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: '.env.local', override: false });
dotenv.config({ override: false });

type ProxyJob = {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  region: string;
  salary: string;
  jobType: string;
  industry: string;
  description: string;
  requirements: string[];
  visaSponsored: boolean;
  postedAt: string;
  viewCount: number;
  applyCount: number;
  applyUrl: string;
  source: string;
  sourceLabel: string;
};

const proxyFallbackJobs: ProxyJob[] = [
  {
    id: 'fallback-google-swe-2026',
    title: 'Software Engineer, New Grad 2026',
    company: 'Google',
    companyLogo: 'https://cdn.brandfetch.io/google.com/w/128/h/128/theme/light/icon',
    location: 'Mountain View, CA',
    region: '美国',
    salary: '$130k - $180k',
    jobType: '全职',
    industry: '互联网',
    description: '参与核心产品和基础设施研发，面向大规模用户构建高可靠系统。适合具备扎实算法、系统设计和工程实践能力的 New Grad 候选人。',
    requirements: ['Computer Science 相关背景', '熟悉数据结构与算法', '有大型项目或实习经历', '英文沟通能力良好'],
    visaSponsored: true,
    postedAt: '2026-06-01',
    viewCount: 2380,
    applyCount: 168,
    applyUrl: 'https://careers.google.com/',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-amazon-data-2026',
    title: 'Data Scientist, University Graduate',
    company: 'Amazon',
    companyLogo: 'https://cdn.brandfetch.io/amazon.com/w/128/h/128/theme/light/icon',
    location: 'Seattle, WA',
    region: '美国',
    salary: '$125k - $170k',
    jobType: '全职',
    industry: '互联网',
    description: '负责业务实验、预测模型和数据产品建设，和产品、工程团队共同提升用户体验与运营效率。',
    requirements: ['统计、计算机或数据科学背景', '熟悉 SQL 和 Python', '了解 A/B Test', '有机器学习项目经验'],
    visaSponsored: true,
    postedAt: '2026-05-31',
    viewCount: 1810,
    applyCount: 121,
    applyUrl: 'https://www.amazon.jobs/',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-msft-pm-2026',
    title: 'Product Manager Intern',
    company: 'Microsoft',
    companyLogo: 'https://cdn.brandfetch.io/microsoft.com/w/128/h/128/theme/light/icon',
    location: 'Redmond, WA',
    region: '美国',
    salary: '$45 - $65/hr',
    jobType: '实习',
    industry: '互联网',
    description: '参与 AI 产品功能规划、用户研究和指标分析，推动跨团队协作和产品落地。',
    requirements: ['产品 Sense 强', '能拆解用户需求和指标', '有数据分析能力', '可进行英文产品沟通'],
    visaSponsored: true,
    postedAt: '2026-05-30',
    viewCount: 1436,
    applyCount: 92,
    applyUrl: 'https://careers.microsoft.com/',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-goldman-analyst-2026',
    title: 'Investment Banking Analyst',
    company: 'Goldman Sachs',
    companyLogo: 'https://cdn.brandfetch.io/goldmansachs.com/w/128/h/128/theme/light/icon',
    location: 'New York, NY',
    region: '美国',
    salary: '$110k - $140k',
    jobType: '全职',
    industry: '金融',
    description: '参与 M&A、IPO 和资本市场项目，负责行业研究、财务建模、估值分析和客户材料准备。',
    requirements: ['金融或经济相关背景', '熟悉三张表和估值模型', 'Excel / PowerPoint 熟练', '抗压能力强'],
    visaSponsored: false,
    postedAt: '2026-05-29',
    viewCount: 1675,
    applyCount: 134,
    applyUrl: 'https://www.goldmansachs.com/careers/',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-mckinsey-ba-2026',
    title: 'Business Analyst',
    company: 'McKinsey & Company',
    companyLogo: 'https://cdn.brandfetch.io/mckinsey.com/w/128/h/128/theme/light/icon',
    location: 'New York, NY',
    region: '美国',
    salary: '$110k - $135k',
    jobType: '全职',
    industry: '咨询',
    description: '为客户提供战略咨询服务，参与市场研究、数据分析、方案设计和高层汇报。',
    requirements: ['优秀的结构化思维', '强数据分析能力', '沟通表达清晰', '有咨询或商业分析经历优先'],
    visaSponsored: false,
    postedAt: '2026-05-28',
    viewCount: 1295,
    applyCount: 88,
    applyUrl: 'https://www.mckinsey.com/careers',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-bytedance-frontend-2026',
    title: 'Frontend Engineer',
    company: 'ByteDance',
    companyLogo: 'https://cdn.brandfetch.io/bytedance.com/w/128/h/128/theme/light/icon',
    location: 'San Jose, CA',
    region: '美国',
    salary: '$140k - $190k',
    jobType: '全职',
    industry: '互联网',
    description: '负责全球化产品 Web 体验建设，优化性能、组件体系和前端工程效率。',
    requirements: ['熟悉 React / TypeScript', '了解前端性能优化', '有复杂业务项目经验', '能跨时区协作'],
    visaSponsored: true,
    postedAt: '2026-05-27',
    viewCount: 2120,
    applyCount: 147,
    applyUrl: 'https://jobs.bytedance.com/',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-tesla-me-2026',
    title: 'Mechanical Design Engineer',
    company: 'Tesla',
    companyLogo: 'https://cdn.brandfetch.io/tesla.com/w/128/h/128/theme/light/icon',
    location: 'Fremont, CA',
    region: '美国',
    salary: '$105k - $150k',
    jobType: '全职',
    industry: '新能源',
    description: '参与电动车与能源产品结构设计、验证和量产问题解决，推动设计从概念到制造落地。',
    requirements: ['机械工程相关背景', '熟悉 CAD 和 DFM', '有硬件项目经历', '能快速迭代解决问题'],
    visaSponsored: false,
    postedAt: '2026-05-26',
    viewCount: 1168,
    applyCount: 73,
    applyUrl: 'https://www.tesla.com/careers',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-jpm-risk-2026',
    title: 'Risk Analyst',
    company: 'JPMorgan Chase',
    companyLogo: 'https://cdn.brandfetch.io/jpmorganchase.com/w/128/h/128/theme/light/icon',
    location: 'London, UK',
    region: '英国',
    salary: '£55k - £75k',
    jobType: '全职',
    industry: '金融',
    description: '参与市场风险、信用风险和组合数据分析，为业务团队提供风险监控和策略建议。',
    requirements: ['金融工程或量化背景', '熟悉 Python / SQL', '理解风险指标', '英文写作能力好'],
    visaSponsored: true,
    postedAt: '2026-05-25',
    viewCount: 940,
    applyCount: 58,
    applyUrl: 'https://careers.jpmorgan.com/',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-tencent-pm-2026',
    title: '产品经理培训生',
    company: 'Tencent',
    companyLogo: 'https://cdn.brandfetch.io/tencent.com/w/128/h/128/theme/light/icon',
    location: '深圳',
    region: '中国',
    salary: '25k - 40k',
    jobType: '全职',
    industry: '互联网',
    description: '参与内容、社交或企业服务产品规划，负责需求分析、版本推进和用户增长策略。',
    requirements: ['有产品实习经历', '逻辑和表达清晰', '熟悉国内互联网产品', '能进行数据分析'],
    visaSponsored: false,
    postedAt: '2026-05-24',
    viewCount: 1520,
    applyCount: 102,
    applyUrl: 'https://join.qq.com/',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-sea-backend-2026',
    title: 'Backend Engineer',
    company: 'Sea',
    companyLogo: 'https://cdn.brandfetch.io/sea.com/w/128/h/128/theme/light/icon',
    location: 'Singapore',
    region: '新加坡',
    salary: 'SGD 90k - 130k',
    jobType: '全职',
    industry: '互联网',
    description: '负责交易、支付或增长系统后端研发，建设高可用服务和数据链路。',
    requirements: ['熟悉 Java / Go / Python', '了解分布式系统', '数据库基础扎实', '有高并发项目经验'],
    visaSponsored: true,
    postedAt: '2026-05-23',
    viewCount: 1086,
    applyCount: 81,
    applyUrl: 'https://www.sea.com/careers',
    source: 'proxy_fallback',
    sourceLabel: '精选职位',
  },
];

function filterProxyFallbackJobs(query: Record<string, unknown>) {
  const keyword = String(query.keyword || query.query || '').trim().toLowerCase();
  const region = String(query.region || '').trim();
  const industry = String(query.industry || '').trim();
  const jobType = String(query.jobType || '').trim();
  const visaSponsored = String(query.visaSponsored || '').trim();

  return proxyFallbackJobs.filter((job) => {
    const matchesKeyword =
      !keyword ||
      job.title.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.description.toLowerCase().includes(keyword) ||
      job.requirements.join(' ').toLowerCase().includes(keyword);
    const matchesRegion = !region || region === '全部' || job.region === region;
    const matchesIndustry = !industry || industry === '全部' || job.industry === industry;
    const matchesType = !jobType || jobType === '全部' || job.jobType === jobType;
    const matchesVisa = visaSponsored !== 'true' || job.visaSponsored;
    return matchesKeyword && matchesRegion && matchesIndustry && matchesType && matchesVisa;
  });
}

function buildProxyJobsResponse(query: Record<string, unknown>) {
  const page = Math.max(1, parseInt(String(query.page || '1'), 10) || 1);
  const pageSize = Math.min(Math.max(1, parseInt(String(query.pageSize || '10'), 10) || 10), 50);
  const filtered = filterProxyFallbackJobs(query);
  const start = (page - 1) * pageSize;
  const list = filtered.slice(start, start + pageSize);

  return {
    code: 0,
    message: 'success',
    data: {
      list,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize) || 1,
      source: 'proxy_fallback',
      sources: ['proxy_fallback'],
    },
    meta: {
      generatedAt: new Date().toISOString(),
      reason: 'backend_unavailable',
    },
  };
}

function buildProxyJobDetail(id: string) {
  const job = proxyFallbackJobs.find((item) => item.id === id);
  if (!job) return null;
  return { code: 0, message: 'success', data: job };
}

type ResumeTailorReport = {
  schemaVersion: 'resume-tailor-analysis-v2';
  currentScore: number;
  optimizedScore: number;
  level: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendedKeywords: string[];
  dimensions: Array<{ name: string; score: number; note: string }>;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  optimizedResume: string;
  source: 'ai' | 'heuristic';
  fallbackReason?: string;
  generatedAt: string;
};

type ParsedResumeFile = {
  resume_name: string;
  resume_text: string;
  file_type: 'txt' | 'pdf' | 'docx';
  char_count: number;
};

const resumeStopWords = new Set([
  'the', 'and', 'for', 'with', 'you', 'your', 'our', 'are', 'will', 'can', 'this', 'that', 'from',
  'have', 'has', 'was', 'were', 'but', 'not', 'all', 'any', 'job', 'role', 'team', 'work', 'using',
  'use', 'used', 'experience', 'skills', 'ability', 'responsibilities', 'requirements', 'preferred',
  'qualifications', 'candidate', 'company', 'within', 'across', 'strong', 'excellent', 'including',
  'need', 'needs', 'hiring', 'hire', 'looking',
]);

const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (new Set(['.txt', '.pdf', '.docx']).has(ext)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only TXT, PDF, and DOCX resume files are supported.'));
  },
});

const cleanExtractedText = (text: string) =>
  text
    .replace(/\r/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const normalizeResumeText = (value: unknown) => String(value || '').toLowerCase();
const clampResumeScore = (score: number) => Math.max(0, Math.min(100, Math.round(score)));
const clampResumeTimeout = (value: unknown) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 12000;
  return Math.max(3000, Math.min(30000, Math.round(parsed)));
};

const extractResumeKeywords = (text: string) => {
  const words = normalizeResumeText(text)
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .map((word) => word.trim().replace(/^[^a-z0-9+#]+|[^a-z0-9+#]+$/g, ''))
    .filter((word) => word.length >= 3 && !resumeStopWords.has(word));
  const counts = new Map<string, number>();
  for (const word of words) counts.set(word, (counts.get(word) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 28).map(([word]) => word);
};

const toResumeTitleCase = (keyword: string) =>
  keyword
    .split(/([/+\-.#])/)
    .map((part) => (/^[a-z]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join('');

const uniqueResumeStrings = (value: unknown, limit: number) => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of value) {
    const text = String(item || '').trim();
    const key = text.toLowerCase();
    if (text && !seen.has(key)) {
      seen.add(key);
      result.push(text);
    }
    if (result.length >= limit) break;
  }
  return result;
};

const normalizeResumeDimensions = (value: unknown, fallback: ResumeTailorReport['dimensions']) => {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((item: any) => ({
      name: String(item?.name || '').trim(),
      score: clampResumeScore(Number(item?.score ?? 0)),
      note: String(item?.note || '').trim(),
    }))
    .filter((item) => item.name && item.note)
    .slice(0, 6);
  return normalized.length ? normalized : fallback;
};

const normalizeResumeAiReport = (raw: any, fallback: ResumeTailorReport): ResumeTailorReport => {
  const currentScore = clampResumeScore(Number(raw?.currentScore ?? fallback.currentScore));
  const optimizedScore = clampResumeScore(Math.max(currentScore, Number(raw?.optimizedScore ?? fallback.optimizedScore)));
  return {
    schemaVersion: 'resume-tailor-analysis-v2',
    currentScore,
    optimizedScore,
    level: String(raw?.level || fallback.level).trim(),
    matchedKeywords: uniqueResumeStrings(raw?.matchedKeywords, 14).length ? uniqueResumeStrings(raw?.matchedKeywords, 14) : fallback.matchedKeywords,
    missingKeywords: uniqueResumeStrings(raw?.missingKeywords, 14).length ? uniqueResumeStrings(raw?.missingKeywords, 14) : fallback.missingKeywords,
    recommendedKeywords: uniqueResumeStrings(raw?.recommendedKeywords, 10).length ? uniqueResumeStrings(raw?.recommendedKeywords, 10) : fallback.recommendedKeywords,
    dimensions: normalizeResumeDimensions(raw?.dimensions, fallback.dimensions),
    strengths: uniqueResumeStrings(raw?.strengths, 5).length ? uniqueResumeStrings(raw?.strengths, 5) : fallback.strengths,
    gaps: uniqueResumeStrings(raw?.gaps, 6).length ? uniqueResumeStrings(raw?.gaps, 6) : fallback.gaps,
    suggestions: uniqueResumeStrings(raw?.suggestions, 6).length ? uniqueResumeStrings(raw?.suggestions, 6) : fallback.suggestions,
    optimizedResume: String(raw?.optimizedResume || fallback.optimizedResume).trim(),
    source: 'ai',
    generatedAt: new Date().toISOString(),
  };
};

const extractResumeJsonObject = (text: string) => {
  const cleaned = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new Error('AI response was not valid JSON.');
  }
};

const withResumeTimeout = async <T,>(promise: Promise<T>, ms: number) =>
  Promise.race<T>([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`AI request timed out after ${ms}ms.`)), ms)),
  ]);

const buildResumeTailorPrompt = (body: any, fallback: ResumeTailorReport) => `You are an expert ATS resume strategist.
Return one valid JSON object only. No markdown, no comments, no prose outside JSON.

JSON schema:
{
  "currentScore": number from 0 to 100,
  "optimizedScore": number from 0 to 100 and not lower than currentScore,
  "level": "High Match" | "Medium Match" | "Needs Work",
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "recommendedKeywords": string[],
  "dimensions": [{"name": string, "score": number from 0 to 100, "note": string}],
  "strengths": string[],
  "gaps": string[],
  "suggestions": string[],
  "optimizedResume": string
}

Be concrete, truthful, and do not invent work history.

Target role: ${body.job_title || 'Target Role'}
Company: ${body.company_name || 'Target Company'}
Region: ${body.target_region || 'Not specified'}

Heuristic baseline:
${JSON.stringify({ currentScore: fallback.currentScore, optimizedScore: fallback.optimizedScore, matchedKeywords: fallback.matchedKeywords, missingKeywords: fallback.missingKeywords })}

Resume:
${String(body.resume_text || '').slice(0, 9000)}

Job description:
${String(body.job_description || '').slice(0, 9000)}`;

const analyzeResumeTailor = (body: any): ResumeTailorReport => {
  const resumeText = String(body.resume_text || '');
  const jobDescription = String(body.job_description || '');
  const jobTitle = String(body.job_title || 'Target Role');
  const companyName = String(body.company_name || 'Target Company');
  const jdKeywords = extractResumeKeywords(jobDescription);
  const resumeNormalized = normalizeResumeText(resumeText);
  const matched = jdKeywords.filter((keyword) => resumeNormalized.includes(keyword));
  const missing = jdKeywords.filter((keyword) => !resumeNormalized.includes(keyword)).slice(0, 12);
  const matchRatio = jdKeywords.length ? matched.length / jdKeywords.length : 0;
  const currentScore = clampResumeScore(36 + matchRatio * 48 + (resumeText.length > 900 ? 12 : resumeText.length > 400 ? 8 : 3));
  const optimizedScore = clampResumeScore(currentScore + Math.max(12, Math.min(24, missing.length * 3)));
  const recommendedKeywords = missing.slice(0, 8).map(toResumeTitleCase);
  const matchedKeywords = matched.slice(0, 12).map(toResumeTitleCase);
  const missingKeywords = missing.map(toResumeTitleCase);
  const possessiveCompany = companyName.endsWith('s') ? `${companyName}'` : `${companyName}'s`;
  return {
    schemaVersion: 'resume-tailor-analysis-v2',
    currentScore,
    optimizedScore,
    level: currentScore >= 82 ? 'High Match' : currentScore >= 65 ? 'Medium Match' : 'Needs Work',
    matchedKeywords,
    missingKeywords,
    recommendedKeywords,
    dimensions: [
      { name: 'JD Keyword Coverage', score: clampResumeScore(matchRatio * 100), note: `${matched.length}/${jdKeywords.length || 1} priority JD keywords are reflected in the resume.` },
      { name: 'Role Positioning', score: clampResumeScore(currentScore + (jobTitle !== 'Target Role' ? 6 : 0)), note: `Position the summary and first project around ${jobTitle}.` },
      { name: 'Evidence Strength', score: resumeText.match(/\d|%|\$/) ? 78 : 58, note: resumeText.match(/\d|%|\$/) ? 'Resume includes quantified evidence; keep the strongest metrics near the top.' : 'Add measurable outcomes such as scale, speed, revenue, accuracy, or user impact.' },
      { name: 'ATS Readability', score: resumeText.length > 400 ? 76 : 54, note: 'Use standard section names, direct skill wording, and concise bullet structure.' },
    ],
    strengths: matchedKeywords.length ? [`Already reflects ${matchedKeywords.slice(0, 3).join(', ')} from the JD.`, 'Core background can be repositioned more directly for the target role.'] : ['Resume has enough raw material to tailor, but JD keywords need to be surfaced more clearly.'],
    gaps: missingKeywords.length ? missingKeywords.slice(0, 5).map((keyword) => `Missing or under-emphasized keyword: ${keyword}.`) : ['No obvious priority keyword gaps found in the current heuristic pass.'],
    suggestions: [
      `Rewrite the first summary line to name ${jobTitle}${companyName ? ` at ${companyName}` : ''} directly.`,
      'Move the most relevant project or work experience into the first half of the resume.',
      recommendedKeywords.length ? `Add natural evidence for: ${recommendedKeywords.slice(0, 5).join(', ')}.` : 'Keep JD wording consistent with the resume while avoiding keyword stuffing.',
      'Convert responsibilities into impact bullets with action, scope, and result.',
    ],
    optimizedResume: [
      'SUMMARY',
      `${jobTitle} candidate with experience aligned to ${possessiveCompany} role requirements, combining ${matchedKeywords.slice(0, 4).join(', ') || 'relevant technical and business skills'} with measurable delivery across projects.`,
      '',
      'SELECTED IMPACT',
      `- Reframed prior experience around ${jobTitle} requirements, emphasizing ${recommendedKeywords.slice(0, 3).join(', ') || 'role-critical skills'} where supported by real evidence.`,
      '- Built clearer ATS coverage by mirroring priority JD language and tying each skill to a concrete project, tool, or business result.',
      '- Strengthened resume bullets with action verbs, scope, and measurable outcomes to improve recruiter scan speed.',
      '',
      'KEYWORDS TO WEAVE IN',
      recommendedKeywords.length ? recommendedKeywords.join(' | ') : 'Current keyword coverage is healthy; focus on stronger evidence and metrics.',
    ].join('\n'),
    source: 'heuristic',
    generatedAt: new Date().toISOString(),
  };
};

const analyzeResumeTailorWithAi = async (ai: GoogleGenAI | null, body: any, fallback: ResumeTailorReport): Promise<ResumeTailorReport> => {
  if (process.env.ENABLE_RESUME_TAILOR_AI !== 'true') return { ...fallback, fallbackReason: 'ai_disabled' };
  if (!ai) return { ...fallback, fallbackReason: 'ai_not_configured' };
  const timeoutMs = clampResumeTimeout(process.env.RESUME_TAILOR_AI_TIMEOUT_MS);
  try {
    const response = await withResumeTimeout(
      ai.models.generateContent({
        model: process.env.RESUME_TAILOR_AI_MODEL || 'gemini-2.5-flash',
        contents: buildResumeTailorPrompt(body, fallback),
        config: { responseMimeType: 'application/json' },
      }),
      timeoutMs,
    );
    return normalizeResumeAiReport(extractResumeJsonObject(response.text || ''), fallback);
  } catch (error: any) {
    console.error('Resume tailor AI fallback:', error?.message || error);
    return { ...fallback, fallbackReason: error?.message || 'ai_failed' };
  }
};

const parseResumeFile = async (file: Express.Multer.File): Promise<ParsedResumeFile> => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.txt') {
    const resumeText = cleanExtractedText(file.buffer.toString('utf8'));
    return { resume_name: file.originalname, resume_text: resumeText, file_type: 'txt', char_count: resumeText.length };
  }
  if (ext === '.pdf') {
    const parser = new PDFParse({ data: file.buffer });
    try {
      const parsed = await parser.getText();
      const resumeText = cleanExtractedText(parsed.text || '');
      return { resume_name: file.originalname, resume_text: resumeText, file_type: 'pdf', char_count: resumeText.length };
    } finally {
      await parser.destroy();
    }
  }
  if (ext === '.docx') {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    const resumeText = cleanExtractedText(parsed.value || '');
    return { resume_name: file.originalname, resume_text: resumeText, file_type: 'docx', char_count: resumeText.length };
  }
  throw new Error('Unsupported resume file type.');
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize Gemini API
  // Note: We initialize lazily or handle missing keys gracefully if needed, 
  // but for Gemini in this environment, process.env.GEMINI_API_KEY is provided.
  let ai: GoogleGenAI | null = null;
  try {
    if (process.env.GEMINI_API_KEY) {
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  } catch (e) {
    console.error("Failed to initialize Gemini API:", e);
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/proxy/resume-tailor/parse-resume', (req, res) => {
    resumeUpload.single('resume')(req, res, async (uploadError) => {
      try {
        if (uploadError) throw uploadError;
        if (!req.file) {
          return res.status(400).json({ message: 'Please upload a TXT, PDF, or DOCX resume file.' });
        }
        const parsed = await parseResumeFile(req.file);
        if (parsed.char_count < 40) {
          return res.status(422).json({
            message: 'Could not extract enough resume text from this file. Please try another file or paste the resume text manually.',
          });
        }
        res.json(parsed);
      } catch (error: any) {
        console.error('Resume parse error:', error);
        const isSizeError = error?.code === 'LIMIT_FILE_SIZE';
        res.status(isSizeError ? 413 : 400).json({
          message: isSizeError ? 'Resume file must be 5MB or smaller.' : error.message || 'Failed to parse resume file.',
        });
      }
    });
  });

  app.post('/api/proxy/resume-tailor/analyze', async (req, res) => {
    try {
      const { resume_text, job_description } = req.body || {};
      if (!resume_text || String(resume_text).trim().length < 80) {
        return res.status(400).json({ message: 'Please provide at least 80 characters of resume text.' });
      }
      if (!job_description || String(job_description).trim().length < 80) {
        return res.status(400).json({ message: 'Please provide at least 80 characters of job description.' });
      }
      const fallback = analyzeResumeTailor(req.body);
      const report = await analyzeResumeTailorWithAi(ai, req.body, fallback);
      res.json(report);
    } catch (error: any) {
      console.error('Resume tailor analyze error:', error);
      res.status(500).json({ message: error.message || 'Failed to analyze resume match.' });
    }
  });

  // Proxy Campus Calendar Endpoint
  // This forwards the request to your real backend to bypass browser CORS errors in AI Studio Dev Env
  app.get('/api/campus', async (req, res) => {
    try {
      const BASE_URL = process.env.VITE_API_BASE_URL || process.env.REAL_API_BASE_URL;
      
      if (BASE_URL && !BASE_URL.includes('localhost')) {
        const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
        // Forward to the real backend location
        let url = `${BASE_URL}/api/campus${queryParams ? `?${queryParams}` : ''}`;
        
        // If the BASE_URL already ends with /api, avoid double /api
        if (BASE_URL.endsWith('/api')) {
           url = `${BASE_URL}/campus${queryParams ? `?${queryParams}` : ''}`;
        }
        
        const fetchHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
        if (req.headers.authorization) {
          fetchHeaders['Authorization'] = req.headers.authorization;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: fetchHeaders
        });

        const data = await response.json();
        return res.status(response.status).json(data);
      }

      // -------------------------------------------------------------
      // Fallback: If no real backend is configured, return Mock Data
      // -------------------------------------------------------------
      const { region, type, role, gradYear } = req.query;
      
      let mockData = [
        { id: 101, date: '今日开启', day: 'Sep 15', company: 'Google', title: '2027 Software Engineering Intern', type: 'Internship (暑期)', role: 'SDE / Tech', gradYear: '2027届', location: 'US / Canada', status: 'upcoming', applyUrl: 'https://careers.google.com/' },
        { id: 102, date: '3天后截止', day: 'Sep 18', company: 'Meta', title: 'New Grad 2026 - Software Engineer', type: 'Full-time (秋招)', role: 'SDE / Tech', gradYear: '2026届', location: 'US', status: 'closing-soon', applyUrl: 'https://metacareers.com/' },
        { id: 103, date: '下周', day: 'Sep 22', company: 'Jane Street', title: 'Quantitative Researcher Campus Hire', type: 'Full-time (秋招)', role: 'Finance / Quant', gradYear: '2026届', location: 'Hong Kong / NY', status: 'upcoming', applyUrl: 'https://janestreet.com/' },
        { id: 104, date: '本月末', day: 'Sep 30', company: 'Tencent 腾讯', title: '2026届产品经理培训生 (提前批)', type: 'Full-time (秋招)', role: 'PM / Operations', gradYear: '2026届', location: 'Shenzhen / Beijing', status: 'upcoming', applyUrl: 'https://join.qq.com/' },
        { id: 105, date: 'Oct 01', day: 'Oct 01', company: 'Apple', title: 'Hardware Engineering Intern', type: 'Internship (暑期)', role: 'SDE / Tech', gradYear: '2027届', location: 'Cupertino, CA', status: 'upcoming', applyUrl: 'https://apple.com/jobs' },
        { id: 106, date: 'Oct 05', day: 'Oct 05', company: 'ByteDance', title: 'Research Scientist - Gen AI', type: 'Full-time (秋招)', role: 'Data / AI', gradYear: '2025届', location: 'Singapore / US', status: 'upcoming', applyUrl: 'https://jobs.bytedance.com/' }
      ];

      if (region && region !== 'All') mockData = mockData.filter(d => d.location.includes(region as string));
      if (type && type !== 'All') mockData = mockData.filter(d => d.type === type);
      if (role && role !== 'All') mockData = mockData.filter(d => d.role === role);
      if (gradYear && gradYear !== 'All') mockData = mockData.filter(d => d.gradYear === gradYear);

      await new Promise(resolve => setTimeout(resolve, 800));
      res.json({ data: mockData });

    } catch (error) {
      console.error('Campus Calendar Proxy error:', error);
      res.status(500).json({ error: 'Failed to proxy request', useMock: true });
    }
  });



  // Generic Proxy endpoint for real Mini-Program API
  app.all('/api/proxy/*', async (req, res) => {
    const targetPath = req.params[0];
    const sendJobsFallback = () => {
      if (targetPath === 'jobs') return res.json(buildProxyJobsResponse(req.query as Record<string, unknown>));
      if (targetPath === 'jobs/recommend/list') {
        return res.json({ code: 0, message: 'success', data: proxyFallbackJobs.slice(0, 5) });
      }
      if (targetPath.startsWith('jobs/')) {
        const rawId = decodeURIComponent(targetPath.replace(/^jobs\//, ''));
        const detail = buildProxyJobDetail(rawId);
        if (detail) return res.json(detail);
      }
      return null;
    };

    try {
      const REAL_API_BASE_URL = process.env.REAL_API_BASE_URL || process.env.VITE_API_BASE_URL || '';
      
      if (!REAL_API_BASE_URL) {
        const fallback = sendJobsFallback();
        if (fallback) return fallback;
        return res.json({ useMock: true });
      }

      // Extract the target path, e.g., /api/proxy/jobs -> /api/jobs
      const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
      const baseUrl = REAL_API_BASE_URL.replace(/\/$/, '');
      const apiPrefix = baseUrl.endsWith('/api') ? '' : '/api';
      const url = `${baseUrl}${apiPrefix}/${targetPath}${queryParams ? `?${queryParams}` : ''}`;

      const response = await fetch(url, {
        method: req.method,
        headers: {
          'Authorization': req.headers.authorization || '',
          'Content-Type': req.headers['content-type'] || 'application/json'
        },
        body: ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) ? JSON.stringify(req.body) : undefined
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error:', error);
      const fallback = sendJobsFallback();
      if (fallback) return fallback;
      res.status(500).json({ error: 'Failed to fetch from real API', useMock: true });
    }
  });

  // AI Polish Endpoint
  app.post('/api/ai/polish-resume', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: 'Gemini API is not configured.' });
      }

      const { text, role } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      const prompt = `You are an expert resume writer and career coach. 
Please rewrite the following resume bullet points to make them more professional, impactful, and aligned with the STAR (Situation, Task, Action, Result) method. 
Target Role: ${role || 'General Professional'}

Original text:
${text}

Please provide the rewritten bullet points. Make them concise, use strong action verbs, and quantify results where possible (you can add placeholder numbers like [X]% if needed). Return ONLY the bullet points, starting each with a bullet character (•).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('AI Polish Error:', error);
      res.status(500).json({ error: error.message || 'Failed to polish resume' });
    }
  });

  // AI Interview Chat Endpoint
  app.post('/api/ai/interview-chat', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: 'Gemini API is not configured.' });
      }

      const { messages, role, company, jd, type } = req.body;
      
      const systemInstruction = `You are an expert AI interviewer conducting a ${type} interview for a ${role} position at ${company}.
      ${jd ? `Here is the job description context: ${jd}` : ''}
      Keep your responses concise, conversational, and professional. Ask one question at a time. Evaluate the candidate's responses and ask follow-up questions based on their answers. Do not break character.`;

      const formattedMessages = messages.map((m: any) => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: formattedMessages,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error('AI Interview Error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate response' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // In Express v4, use app.get('*', ...)
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
