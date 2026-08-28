import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import vm from 'vm';
import { createRequire } from 'module';
import { GoogleGenAI } from '@google/genai';

const require = createRequire(import.meta.url);
const multer = require('multer') as typeof import('multer');
const pdfParse = require('pdf-parse') as typeof import('pdf-parse');
const mammoth = require('mammoth') as typeof import('mammoth');
const docx = require('docx') as typeof import('docx');
const { PDFParse } = pdfParse;
const { Document, HeadingLevel, Packer, Paragraph, TextRun } = docx;

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

type MiniProgramQuestion = {
  id: string | number;
  title: string;
  question: string;
  category: string;
  categoryName: string;
  difficulty: string;
  answer: string;
  views: number;
  likes: number;
  isFeatured: boolean;
  isHot: boolean;
  source: string;
};

type RawQuestion = Record<string, unknown>;

type ResumeTailorDimension = {
  label: string;
  score: number;
  note: string;
};

type ResumeTailorSuggestion = {
  section: string;
  original: string;
  issue: string;
  suggestion: string;
};

type ResumeTailorAnalysis = {
  currentScore: number;
  optimizedScore: number;
  level: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendedKeywords: string[];
  dimensions: ResumeTailorDimension[];
  gaps: string[];
  strengths: string[];
  suggestions: ResumeTailorSuggestion[];
  optimizedResume: string;
  source?: 'ai' | 'heuristic';
  generatedAt?: string;
  fallbackReason?: string;
  schemaVersion?: string;
};

type ResumeTailorRecord = {
  id: string;
  user_id: string;
  resume_name: string;
  job_title: string;
  company_name: string;
  job_url: string;
  target_region: string;
  current_score: number;
  optimized_score: number;
  analysis: ResumeTailorAnalysis;
  created_at: string;
  updated_at: string;
};

type ResumeTailorPayload = {
  resume_text?: string;
  resume_name?: string;
  job_title?: string;
  company_name?: string;
  job_description?: string;
  job_url?: string;
  target_region?: string;
  user_id?: string;
};

type JdAnalyzerPayload = {
  job_description?: string;
  job_title?: string;
  company_name?: string;
  job_url?: string;
  target_region?: string;
};

type JdAnalyzerAction = {
  title: string;
  detail: string;
  priority: string;
};

type JdAnalyzerAnalysis = {
  roleType: string;
  seniority: string;
  difficultyScore: number;
  difficultyLabel: string;
  summary: string;
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  responsibilities: string[];
  hiddenRequirements: string[];
  resumePreparation: string[];
  interviewPreparation: string[];
  actionPlan: JdAnalyzerAction[];
  source?: 'ai' | 'heuristic';
  generatedAt?: string;
  fallbackReason?: string;
  schemaVersion?: string;
};

type ApplicationJobSnapshot = {
  title?: string;
  company?: string;
  location?: string;
  salary?: string;
  applyUrl?: string;
};

type ApplicationRecord = {
  id: string;
  user_id: string;
  jobId: string | number;
  jobSnapshot: ApplicationJobSnapshot;
  status: string;
  statusText: string;
  note?: string;
  nextAction?: string;
  source?: string;
  resumeVersionId?: string;
  interviewDate?: string;
  appliedAt: string;
  viewedAt?: string;
  createdAt: string;
  updatedAt: string;
};

const resumeTailorRecordsFile = path.resolve(
  process.env.RESUME_TAILOR_RECORDS_FILE || path.join(process.cwd(), 'data', 'resume-tailor-records.json'),
);
let resumeTailorRecordsCache: ResumeTailorRecord[] | null = null;

const applicationRecordsFile = path.resolve(
  process.env.APPLICATION_RECORDS_FILE || path.join(process.cwd(), 'data', 'application-records.json'),
);
let applicationRecordsCache: ApplicationRecord[] | null = null;

function normalizeResumeTailorRecord(value: any): ResumeTailorRecord | null {
  if (!value || typeof value !== 'object' || !value.analysis) return null;

  const userId = String(value.user_id || '').trim();
  if (!userId) return null;

  const createdAt = String(value.created_at || new Date().toISOString());
  return {
    id: String(value.id || Date.now()),
    user_id: userId,
    resume_name: String(value.resume_name || 'Manual resume text'),
    job_title: String(value.job_title || ''),
    company_name: String(value.company_name || ''),
    job_url: String(value.job_url || ''),
    target_region: String(value.target_region || ''),
    current_score: Number(value.current_score || value.analysis.currentScore || 0),
    optimized_score: Number(value.optimized_score || value.analysis.optimizedScore || 0),
    analysis: value.analysis as ResumeTailorAnalysis,
    created_at: createdAt,
    updated_at: String(value.updated_at || createdAt),
  };
}

function readResumeTailorRecords() {
  if (resumeTailorRecordsCache) return resumeTailorRecordsCache;

  try {
    const parsed = JSON.parse(fs.readFileSync(resumeTailorRecordsFile, 'utf8'));
    resumeTailorRecordsCache = Array.isArray(parsed)
      ? parsed.map(normalizeResumeTailorRecord).filter((record): record is ResumeTailorRecord => Boolean(record))
      : [];
  } catch (error: any) {
    if (error?.code !== 'ENOENT') {
      console.warn('Failed to read resume tailor records:', error);
    }
    resumeTailorRecordsCache = [];
  }

  return resumeTailorRecordsCache;
}

function writeResumeTailorRecords(records: ResumeTailorRecord[]) {
  const nextRecords = records.slice(0, 500);
  fs.mkdirSync(path.dirname(resumeTailorRecordsFile), { recursive: true });
  fs.writeFileSync(resumeTailorRecordsFile, JSON.stringify(nextRecords, null, 2), 'utf8');
  resumeTailorRecordsCache = nextRecords;
}

const applicationStatusLabels: Record<string, string> = {
  saved: '已收藏',
  applied: '已投递',
  screening: '简历筛选中',
  oa: 'OA',
  interview_1: '一面',
  interview_2: '二面',
  final: '终面',
  offer: 'Offer',
  rejected: 'Rejected',
  archived: '已放弃',
};

function getApplicationUserId(req: express.Request) {
  const rawAuthorization = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  const bodyUserId = typeof req.body?.user_id === 'string' ? req.body.user_id : '';
  const queryUserId = typeof req.query.user_id === 'string' ? req.query.user_id : '';
  return (bodyUserId || queryUserId || rawAuthorization || 'local').slice(0, 160);
}

function normalizeApplicationRecord(value: any): ApplicationRecord | null {
  if (!value || typeof value !== 'object') return null;
  const userId = String(value.user_id || value.userId || '').trim();
  if (!userId) return null;

  const now = new Date().toISOString();
  const status = String(value.status || 'applied');
  const createdAt = String(value.createdAt || value.created_at || value.appliedAt || now);
  const jobSnapshot = value.jobSnapshot || value.job || {};
  return {
    id: String(value.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    user_id: userId,
    jobId: value.jobId || value.job_id || value.id || `manual-${Date.now()}`,
    jobSnapshot: {
      title: String(jobSnapshot.title || value.job_title || ''),
      company: String(jobSnapshot.company || value.company_name || ''),
      location: String(jobSnapshot.location || value.location || ''),
      salary: String(jobSnapshot.salary || value.salary || ''),
      applyUrl: String(jobSnapshot.applyUrl || value.job_url || value.applyUrl || ''),
    },
    status,
    statusText: String(value.statusText || applicationStatusLabels[status] || status),
    note: value.note ? String(value.note) : '',
    nextAction: value.nextAction ? String(value.nextAction) : '',
    source: String(value.source || 'website'),
    resumeVersionId: value.resumeVersionId ? String(value.resumeVersionId) : '',
    interviewDate: value.interviewDate ? String(value.interviewDate) : '',
    appliedAt: String(value.appliedAt || value.application_date || createdAt),
    viewedAt: value.viewedAt ? String(value.viewedAt) : '',
    createdAt,
    updatedAt: String(value.updatedAt || value.updated_at || createdAt),
  };
}

function readApplicationRecords() {
  if (applicationRecordsCache) return applicationRecordsCache;

  try {
    const parsed = JSON.parse(fs.readFileSync(applicationRecordsFile, 'utf8'));
    applicationRecordsCache = Array.isArray(parsed)
      ? parsed.map(normalizeApplicationRecord).filter((record): record is ApplicationRecord => Boolean(record))
      : [];
  } catch (error: any) {
    if (error?.code !== 'ENOENT') {
      console.warn('Failed to read application records:', error);
    }
    applicationRecordsCache = [];
  }

  return applicationRecordsCache;
}

function writeApplicationRecords(records: ApplicationRecord[]) {
  const nextRecords = records.slice(0, 1000);
  fs.mkdirSync(path.dirname(applicationRecordsFile), { recursive: true });
  fs.writeFileSync(applicationRecordsFile, JSON.stringify(nextRecords, null, 2), 'utf8');
  applicationRecordsCache = nextRecords;
}

function buildApplicationStatistics(records: ApplicationRecord[]) {
  const count = (statuses: string[]) => records.filter((record) => statuses.includes(record.status)).length;
  return {
    total: records.length,
    saved: count(['saved']),
    applied: count(['applied']),
    viewed: count(['screening']),
    interview: count(['oa', 'interview_1', 'interview_2', 'final']),
    offer: count(['offer']),
    rejected: count(['rejected', 'archived']),
  };
}

function buildApplicationResponse(records: ApplicationRecord[]) {
  const sorted = records
    .slice()
    .sort((a, b) => Date.parse(b.updatedAt || b.createdAt) - Date.parse(a.updatedAt || a.createdAt));
  return {
    code: 0,
    message: 'success',
    data: {
      list: sorted,
      statistics: buildApplicationStatistics(sorted),
      storage: 'file',
    },
  };
}

const RESUME_TAILOR_MAX_FILE_BYTES = 5 * 1024 * 1024;
const resumeTailorUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: RESUME_TAILOR_MAX_FILE_BYTES,
    files: 1,
  },
});

type ResumeFileType = 'pdf' | 'docx' | 'txt';

function createHttpError(message: string, status = 400) {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
}

function normalizeResumeText(text: string) {
  return text
    .replace(/^\uFEFF/, '')
    .replace(/\u0000/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function getResumeFileType(file: Express.Multer.File): ResumeFileType | null {
  const extension = path.extname(file.originalname || '').toLowerCase();
  if (extension === '.pdf' || file.mimetype === 'application/pdf') return 'pdf';
  if (
    extension === '.docx' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'docx';
  }
  if (extension === '.txt' || file.mimetype === 'text/plain') return 'txt';
  return null;
}

async function parseResumeFile(file: Express.Multer.File) {
  const fileType = getResumeFileType(file);
  if (!fileType) {
    throw createHttpError('Only PDF, DOCX, and TXT resumes are supported', 415);
  }

  let resumeText = '';
  if (fileType === 'txt') {
    resumeText = file.buffer.toString('utf8');
  } else if (fileType === 'pdf') {
    const parser = new PDFParse({ data: file.buffer });
    try {
      const parsed = await parser.getText({ first: 20, pageJoiner: '\n\n' });
      resumeText = parsed.text || '';
    } finally {
      await parser.destroy().catch(() => undefined);
    }
  } else {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    resumeText = parsed.value || '';
  }

  const normalizedText = normalizeResumeText(resumeText);
  if (!normalizedText) {
    throw createHttpError('No readable resume text was found. Please paste the resume text manually.', 422);
  }

  return {
    resume_name: file.originalname,
    resume_text: normalizedText,
    file_type: fileType,
    char_count: normalizedText.length,
  };
}

function safeDownloadName(value = 'optimized-resume') {
  const cleaned = value
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5_-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
  return cleaned || 'optimized-resume';
}

function isResumeSectionHeading(line: string) {
  const normalized = line.trim();
  if (!normalized || normalized.length > 48) return false;
  return /^[A-Z][A-Z\s/&-]{2,}$/.test(normalized);
}

function createResumeParagraphs(text: string) {
  return normalizeResumeText(text).split('\n').map((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      return new Paragraph({ text: '', spacing: { after: 120 } });
    }

    if (isResumeSectionHeading(line)) {
      return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: line,
            bold: true,
            size: 24,
          }),
        ],
      });
    }

    const isBullet = /^[-*•]\s+/.test(line);
    const text = line.replace(/^[-*•]\s+/, '');
    return new Paragraph({
      bullet: isBullet ? { level: 0 } : undefined,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text,
          size: 22,
        }),
      ],
    });
  });
}

async function buildResumeDocxBuffer(payload: any) {
  const optimizedResume = normalizeResumeText(String(payload.optimized_resume || payload.optimizedResume || ''));
  if (!optimizedResume) {
    throw createHttpError('optimized_resume is required', 400);
  }

  const jobTitle = String(payload.job_title || 'Optimized Resume').trim();
  const companyName = String(payload.company_name || '').trim();
  const currentScore = Number(payload.current_score || payload.currentScore || 0);
  const optimizedScore = Number(payload.optimized_score || payload.optimizedScore || 0);
  const scoreLine = currentScore && optimizedScore
    ? `ATS Match Score: ${currentScore} -> ${optimizedScore}`
    : 'Generated by Zhiyin AI Resume Tailor';

  const document = new Document({
    creator: 'Zhiyin Career',
    title: jobTitle,
    description: 'Optimized resume generated by Zhiyin AI Resume Tailor',
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: jobTitle,
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: companyName ? `${companyName} | ${scoreLine}` : scoreLine,
                color: '64748B',
                size: 20,
              }),
            ],
          }),
          ...createResumeParagraphs(optimizedResume),
        ],
      },
    ],
  });

  return Packer.toBuffer(document);
}

const uploadResumeFile: express.RequestHandler = (req, res, next) => {
  resumeTailorUpload.single('resume')(req, res, (error: any) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        code: 413,
        message: 'Resume file must be 5MB or smaller',
      });
      return;
    }

    res.status(400).json({
      code: 400,
      message: error.message || 'Failed to upload resume file',
    });
  });
};

const resumeTailorKeywordBank = [
  { label: 'Python', aliases: ['python', 'pandas', 'numpy'] },
  { label: 'SQL', aliases: ['sql', 'postgres', 'mysql', 'bigquery', 'snowflake'] },
  { label: 'Machine Learning', aliases: ['machine learning', 'ml model', 'modeling'] },
  { label: 'Cloud', aliases: ['cloud', 'cloud platform', 'cloud services'] },
  { label: 'AWS', aliases: ['aws', 'amazon web services'] },
  { label: 'Docker', aliases: ['docker', 'container'] },
  { label: 'Data Pipeline', aliases: ['data pipeline', 'etl', 'pipeline'] },
  { label: 'Dashboard', aliases: ['dashboard', 'tableau', 'power bi', 'looker'] },
  { label: 'Stakeholder Communication', aliases: ['stakeholder', 'cross-functional', 'communication'] },
  { label: 'A/B Testing', aliases: ['a/b', 'ab test', 'experiment'] },
  { label: 'Product Analytics', aliases: ['product analytics', 'user behavior', 'retention'] },
  { label: 'React', aliases: ['react', 'typescript', 'javascript'] },
  { label: 'Node.js', aliases: ['node.js', 'nodejs', 'express'] },
  { label: 'Project Management', aliases: ['project management', 'roadmap', 'prioritization'] },
  { label: 'Quantified Impact', aliases: ['%', 'improved', 'reduced', 'increased', 'saved'] },
];

const resumeTailorFallbackKeywords = [
  'Python',
  'SQL',
  'Machine Learning',
  'Cloud',
  'Data Pipeline',
  'Dashboard',
  'AWS',
  'Docker',
  'Stakeholder Communication',
];

const resumeTailorStopWords = new Set([
  'with',
  'from',
  'and',
  'are',
  'that',
  'this',
  'will',
  'your',
  'have',
  'into',
  'work',
  'team',
  'role',
  'data',
  'using',
  'build',
  'need',
  'hire',
  'hiring',
  'preferred',
  'includes',
  'including',
  'strong',
  'skills',
  'experience',
  'responsibilities',
  'requirements',
]);

const clampScore = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function toTitleCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function resumeIncludesAlias(text: string, label: string) {
  const lower = text.toLowerCase();
  const keyword = resumeTailorKeywordBank.find((item) => item.label === label);
  const aliases = keyword?.aliases || [label.toLowerCase()];
  return aliases.some((alias) => lower.includes(alias.toLowerCase()));
}

function extractResumeTailorKeywords(text: string) {
  const lower = text.toLowerCase();
  const bankMatches = resumeTailorKeywordBank
    .filter((item) => item.aliases.some((alias) => lower.includes(alias.toLowerCase())))
    .map((item) => item.label);

  const words = Array.from(text.matchAll(/[A-Za-z][A-Za-z+#.-]{2,}/g), (match) => match[0]);
  const counts: Record<string, number> = {};
  words.forEach((word) => {
    const normalized = word.toLowerCase();
    if (resumeTailorStopWords.has(normalized)) return;
    counts[normalized] = (counts[normalized] || 0) + 1;
  });

  const fallbackMatches = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word]) => toTitleCase(word));

  const seen = new Set<string>();
  const uniqueKeywords = [...bankMatches, ...fallbackMatches].filter((keyword) => {
    const normalized = keyword.toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });

  return uniqueKeywords
    .filter((keyword) => {
      const normalized = keyword.toLowerCase();
      return !uniqueKeywords.some((other) => {
        const otherNormalized = other.toLowerCase();
        return otherNormalized !== normalized && otherNormalized.includes(normalized);
      });
    })
    .slice(0, 12);
}

function getResumeTailorLevel(score: number) {
  if (score >= 88) return '很高';
  if (score >= 74) return '高';
  if (score >= 58) return '中';
  return '低';
}

function buildHeuristicResumeTailorAnalysis(payload: ResumeTailorPayload): ResumeTailorAnalysis {
  const resumeText = String(payload.resume_text || payload.resume_name || 'Uploaded resume file').trim();
  const jobDescription = String(payload.job_description || '').trim();
  const jobTitle = String(payload.job_title || 'Data Analyst').trim();
  const companyName = String(payload.company_name || 'Target Company').trim();
  const jdKeywords = extractResumeTailorKeywords(jobDescription);
  const coreKeywords = jdKeywords.length ? jdKeywords : resumeTailorFallbackKeywords;
  const matchedKeywords = coreKeywords.filter((keyword) => resumeIncludesAlias(resumeText, keyword));
  const missingKeywords = coreKeywords.filter((keyword) => !resumeIncludesAlias(resumeText, keyword)).slice(0, 8);
  const matchRatio = matchedKeywords.length / Math.max(coreKeywords.length, 1);
  const hasMetrics = /\d+%|\$|reduced|increased|improved|saved|grew|automated/i.test(resumeText);
  const hasProjects = /project|built|launched|implemented|designed|developed/i.test(resumeText);
  const hasLeadership = /stakeholder|cross-functional|led|partnered|managed|communicat/i.test(resumeText);
  const currentScore = clampScore(Math.round(45 + matchRatio * 34 + (hasMetrics ? 8 : 0) + (hasProjects ? 5 : 0) + (hasLeadership ? 4 : 0)), 46, 88);
  const optimizedScore = clampScore(currentScore + 14 + Math.min(missingKeywords.length * 2, 10), currentScore + 6, 96);
  const recommendedKeywords = Array.from(new Set([...missingKeywords, ...coreKeywords.slice(0, 5)])).slice(0, 8);

  return {
    currentScore,
    optimizedScore,
    level: getResumeTailorLevel(currentScore),
    matchedKeywords,
    missingKeywords,
    recommendedKeywords,
    dimensions: [
      {
        label: '技能关键词匹配',
        score: clampScore(Math.round(42 + matchRatio * 54), 35, 96),
        note: `${matchedKeywords.length}/${coreKeywords.length} 个核心关键词已出现`,
      },
      {
        label: '工作经验匹配',
        score: clampScore(hasLeadership ? currentScore + 3 : currentScore - 7, 38, 94),
        note: hasLeadership ? '已体现跨团队协作或业务沟通' : '建议补充业务合作与职责边界',
      },
      {
        label: '项目经历匹配',
        score: clampScore(hasProjects ? currentScore + 4 : currentScore - 10, 36, 94),
        note: hasProjects ? '项目描述可继续绑定 JD 关键词' : '需要补充与岗位职责相关的项目',
      },
      {
        label: '行业关键词匹配',
        score: clampScore(Math.round(48 + matchRatio * 40), 40, 92),
        note: missingKeywords.length ? `缺少 ${missingKeywords.slice(0, 3).join(' / ')}` : '核心术语覆盖良好',
      },
      {
        label: '量化成果表达',
        score: hasMetrics ? 84 : 52,
        note: hasMetrics ? '已有量化结果，可进一步突出影响范围' : '建议加入百分比、规模、效率提升等数字',
      },
      {
        label: 'ATS 格式规范',
        score: 82,
        note: '建议使用清晰标题、标准项目符号和可解析文本',
      },
    ],
    strengths: [
      matchedKeywords.length ? `已覆盖 ${matchedKeywords.slice(0, 4).join(' / ')} 等关键词` : '已有基础简历内容，可开始对齐目标岗位',
      hasProjects ? '简历中有可改写的项目或经历素材' : '可通过项目经历补齐岗位能力证明',
      hasMetrics ? '已有量化表达，适合进一步强化结果影响' : '当前表达可以通过量化指标快速提分',
    ],
    gaps: [
      missingKeywords.length ? `缺少 ${missingKeywords.slice(0, 5).join(' / ')} 等 JD 高频词` : '关键词覆盖较完整，下一步应优化表达密度',
      '部分经历需要从“做了什么”改成“用什么工具，在什么场景，带来什么结果”',
      `Summary 需要直接对齐 ${jobTitle || '目标岗位'} 的核心能力`,
      '技能区建议按 Programming / Data / Tools / Business 分组，提高 ATS 可读性',
    ],
    suggestions: [
      {
        section: 'Summary',
        original: 'Data analyst with experience in reporting and analysis.',
        issue: '表达偏泛，没有体现岗位关键词和业务结果。',
        suggestion: `${jobTitle || 'Data Analyst'} with hands-on experience in ${recommendedKeywords.slice(0, 3).join(', ')}, turning product data into measurable business recommendations for ${companyName || 'target teams'}.`,
      },
      {
        section: 'Skills',
        original: 'Python, SQL, Excel',
        issue: '技能列表没有按 JD 优先级排序，也缺少工具链上下文。',
        suggestion: `Programming: Python, SQL | Analytics: ${recommendedKeywords.slice(0, 3).join(', ')} | Tools: Tableau, AWS, Docker | Business: Stakeholder Communication`,
      },
      {
        section: 'Experience',
        original: 'Responsible for data analysis.',
        issue: '缺少工具、动作、对象和结果，ATS 与招聘经理都难以判断价值。',
        suggestion: 'Built SQL-based dashboards to track weekly user growth, improving reporting efficiency by 35% and enabling product teams to identify retention opportunities.',
      },
      {
        section: 'Projects',
        original: 'Worked on a dashboard project.',
        issue: '项目没有绑定岗位职责，也没有展示端到端能力。',
        suggestion: `Designed a ${recommendedKeywords[0] || 'data'} project that cleaned raw event data, modeled key metrics, and delivered an executive dashboard for weekly decision-making.`,
      },
    ],
    optimizedResume: `SUMMARY
${jobTitle || 'Data Analyst'} with experience in SQL, Python, dashboarding, and stakeholder-facing analytics. Skilled at translating product and business questions into measurable insights, with hands-on exposure to ${recommendedKeywords.slice(0, 4).join(', ')}.

SKILLS
Programming & Data: Python, SQL, data cleaning, data modeling
Analytics & Visualization: dashboards, KPI tracking, product analytics, experiment analysis
Tools & Platforms: Tableau, Excel, AWS, Docker
Business: stakeholder communication, requirements clarification, executive-ready reporting

EXPERIENCE
Data Analyst
- Built SQL-based dashboards to track weekly user growth, improving reporting efficiency by 35%.
- Partnered with product stakeholders to define retention metrics and translate analysis into roadmap recommendations.
- Automated recurring reporting workflows and reduced manual data preparation time for weekly business reviews.

PROJECTS
JD-Matched Analytics Project
- Designed an end-to-end data pipeline for product event data, including cleaning, metric modeling, and dashboard delivery.
- Added ${recommendedKeywords.slice(0, 3).join(', ')} into project framing to better align with the target role.
- Presented insights with quantified outcomes, business context, and next-step recommendations.`,
    source: 'heuristic',
    generatedAt: new Date().toISOString(),
  };
}

function parseAiJsonResponseLegacy(text = '') {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  return JSON.parse(raw.trim());
}

function normalizeAiResumeTailorAnalysisLegacy(candidate: any, fallback: ResumeTailorAnalysis): ResumeTailorAnalysis {
  const next = {
    ...fallback,
    ...candidate,
    dimensions: Array.isArray(candidate?.dimensions) ? candidate.dimensions : fallback.dimensions,
    matchedKeywords: Array.isArray(candidate?.matchedKeywords) ? candidate.matchedKeywords : fallback.matchedKeywords,
    missingKeywords: Array.isArray(candidate?.missingKeywords) ? candidate.missingKeywords : fallback.missingKeywords,
    recommendedKeywords: Array.isArray(candidate?.recommendedKeywords) ? candidate.recommendedKeywords : fallback.recommendedKeywords,
    gaps: Array.isArray(candidate?.gaps) ? candidate.gaps : fallback.gaps,
    strengths: Array.isArray(candidate?.strengths) ? candidate.strengths : fallback.strengths,
    suggestions: Array.isArray(candidate?.suggestions) ? candidate.suggestions : fallback.suggestions,
    optimizedResume: typeof candidate?.optimizedResume === 'string' && candidate.optimizedResume.trim()
      ? candidate.optimizedResume
      : fallback.optimizedResume,
    currentScore: clampScore(Number(candidate?.currentScore || fallback.currentScore), 0, 100),
    optimizedScore: clampScore(Number(candidate?.optimizedScore || fallback.optimizedScore), 0, 100),
    source: 'ai' as const,
    generatedAt: new Date().toISOString(),
  };
  return {
    ...next,
    level: typeof candidate?.level === 'string' ? candidate.level : getResumeTailorLevel(next.currentScore),
  };
}

async function buildResumeTailorAnalysisLegacy(ai: GoogleGenAI | null, payload: ResumeTailorPayload) {
  const fallback = buildHeuristicResumeTailorAnalysis(payload);
  const aiEnabled = process.env.ENABLE_RESUME_TAILOR_AI === 'true';
  if (!ai || !aiEnabled) return fallback;

  try {
    const prompt = `You are an expert resume tailoring engine. Analyze the resume against the target job description and return ONLY valid JSON.

Required JSON shape:
{
  "currentScore": number,
  "optimizedScore": number,
  "level": "低" | "中" | "高" | "很高",
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "recommendedKeywords": string[],
  "dimensions": [{"label": string, "score": number, "note": string}],
  "gaps": string[],
  "strengths": string[],
  "suggestions": [{"section": string, "original": string, "issue": string, "suggestion": string}],
  "optimizedResume": string
}

Job title: ${payload.job_title || ''}
Company: ${payload.company_name || ''}
Target region: ${payload.target_region || ''}
Job URL: ${payload.job_url || ''}

Resume:
${payload.resume_text || payload.resume_name || ''}

Job description:
${payload.job_description || ''}

The optimizedResume should be a complete English resume draft tailored to the JD. Keep suggestions concise and practical.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return normalizeAiResumeTailorAnalysis(parseAiJsonResponse(response.text || ''), fallback);
  } catch (error) {
    console.warn('Resume Tailor AI fallback:', error);
    return fallback;
  }
}

const RESUME_TAILOR_ANALYSIS_SCHEMA_VERSION = 'resume-tailor-analysis-v2';
const RESUME_TAILOR_LEVELS = ['\u4f4e', '\u4e2d', '\u9ad8', '\u5f88\u9ad8'];
const RESUME_TAILOR_DEFAULT_AI_TIMEOUT_MS = 12000;
const RESUME_TAILOR_MIN_AI_TIMEOUT_MS = 3000;
const RESUME_TAILOR_MAX_AI_TIMEOUT_MS = 30000;

function getResumeTailorAiTimeoutMs() {
  const configured = Number(process.env.RESUME_TAILOR_AI_TIMEOUT_MS);
  if (!Number.isFinite(configured) || configured <= 0) {
    return RESUME_TAILOR_DEFAULT_AI_TIMEOUT_MS;
  }
  return clampScore(
    Math.round(configured),
    RESUME_TAILOR_MIN_AI_TIMEOUT_MS,
    RESUME_TAILOR_MAX_AI_TIMEOUT_MS,
  );
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(createHttpError(message, 504)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeout) clearTimeout(timeout);
  });
}

function withAnalysisSchema(analysis: ResumeTailorAnalysis): ResumeTailorAnalysis {
  return {
    ...analysis,
    schemaVersion: RESUME_TAILOR_ANALYSIS_SCHEMA_VERSION,
    generatedAt: analysis.generatedAt || new Date().toISOString(),
  };
}

function withFallbackReason(analysis: ResumeTailorAnalysis, reason: string): ResumeTailorAnalysis {
  return {
    ...withAnalysisSchema(analysis),
    source: 'heuristic',
    fallbackReason: reason,
  };
}

function parseAiJsonResponse(text = '') {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const trimmed = raw.trim();
  const jsonText = trimmed.startsWith('{')
    ? trimmed
    : trimmed.slice(trimmed.indexOf('{'), trimmed.lastIndexOf('}') + 1);

  if (!jsonText || !jsonText.startsWith('{') || !jsonText.endsWith('}')) {
    throw createHttpError('AI response did not contain a JSON object', 502);
  }

  const parsed = JSON.parse(jsonText);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw createHttpError('AI response JSON must be an object', 502);
  }
  return parsed as Record<string, unknown>;
}

function normalizeString(value: unknown, fallback = '') {
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim();
  return normalized || fallback;
}

function normalizeStringList(value: unknown, fallback: string[], min = 1, max = 10) {
  if (!Array.isArray(value)) return fallback;
  const seen = new Set<string>();
  const normalized = value
    .map((item) => normalizeString(item))
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, max);

  return normalized.length >= min ? normalized : fallback;
}

function normalizeScore(value: unknown, fallback: number, min = 0, max = 100) {
  const score = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(score)) return clampScore(Math.round(fallback), min, max);
  return clampScore(Math.round(score), min, max);
}

function normalizeLevel(value: unknown, currentScore: number) {
  const normalized = normalizeString(value);
  return RESUME_TAILOR_LEVELS.includes(normalized) ? normalized : getResumeTailorLevel(currentScore);
}

function normalizeDimensions(value: unknown, fallback: ResumeTailorDimension[]) {
  const candidate = Array.isArray(value) ? value : [];
  return Array.from({ length: 6 }, (_, index) => {
    const item = candidate[index] && typeof candidate[index] === 'object'
      ? candidate[index] as Record<string, unknown>
      : {};
    const fallbackItem = fallback[index] || fallback[0] || { label: 'ATS', score: 60, note: 'Needs review' };

    return {
      label: normalizeString(item.label, fallbackItem.label),
      score: normalizeScore(item.score, fallbackItem.score),
      note: normalizeString(item.note, fallbackItem.note),
    };
  });
}

function normalizeSuggestions(value: unknown, fallback: ResumeTailorSuggestion[]) {
  const candidate = Array.isArray(value) ? value : [];
  return Array.from({ length: 4 }, (_, index) => {
    const item = candidate[index] && typeof candidate[index] === 'object'
      ? candidate[index] as Record<string, unknown>
      : {};
    const fallbackItem = fallback[index] || fallback[0] || {
      section: 'Summary',
      original: 'Original resume section',
      issue: 'Needs stronger JD alignment',
      suggestion: 'Rewrite this section with role keywords, tools, scope, and measurable outcomes.',
    };

    return {
      section: normalizeString(item.section, fallbackItem.section),
      original: normalizeString(item.original, fallbackItem.original),
      issue: normalizeString(item.issue, fallbackItem.issue),
      suggestion: normalizeString(item.suggestion, fallbackItem.suggestion),
    };
  });
}

function normalizeAiResumeTailorAnalysis(
  candidate: Record<string, unknown>,
  fallback: ResumeTailorAnalysis,
): ResumeTailorAnalysis {
  const currentScore = normalizeScore(candidate.currentScore, fallback.currentScore);
  let optimizedScore = normalizeScore(candidate.optimizedScore, fallback.optimizedScore);
  if (optimizedScore < currentScore) {
    optimizedScore = clampScore(Math.max(fallback.optimizedScore, currentScore + 6), currentScore, 100);
  }

  return {
    ...fallback,
    currentScore,
    optimizedScore,
    level: normalizeLevel(candidate.level, currentScore),
    matchedKeywords: normalizeStringList(candidate.matchedKeywords, fallback.matchedKeywords, 1, 10),
    missingKeywords: normalizeStringList(candidate.missingKeywords, fallback.missingKeywords, 1, 10),
    recommendedKeywords: normalizeStringList(candidate.recommendedKeywords, fallback.recommendedKeywords, 3, 10),
    dimensions: normalizeDimensions(candidate.dimensions, fallback.dimensions),
    gaps: normalizeStringList(candidate.gaps, fallback.gaps, 3, 6),
    strengths: normalizeStringList(candidate.strengths, fallback.strengths, 3, 6),
    suggestions: normalizeSuggestions(candidate.suggestions, fallback.suggestions),
    optimizedResume: normalizeString(candidate.optimizedResume).length >= 80
      ? normalizeString(candidate.optimizedResume)
      : fallback.optimizedResume,
    source: 'ai',
    generatedAt: new Date().toISOString(),
    schemaVersion: RESUME_TAILOR_ANALYSIS_SCHEMA_VERSION,
  };
}

function getResumeTailorFallbackReason(error: unknown) {
  const status = typeof error === 'object' && error ? (error as { status?: number }).status : undefined;
  const message = error instanceof Error ? error.message : String(error || '');
  if (status === 504 || /timed?\s*out|timeout/i.test(message)) return 'ai_timeout';
  if (/json|schema|response/i.test(message)) return 'ai_invalid_response';
  return 'ai_error';
}

async function buildResumeTailorAnalysis(ai: GoogleGenAI | null, payload: ResumeTailorPayload) {
  const fallback = buildHeuristicResumeTailorAnalysis(payload);
  const aiEnabled = process.env.ENABLE_RESUME_TAILOR_AI === 'true';
  if (!aiEnabled) return withAnalysisSchema(fallback);
  if (!ai) return withFallbackReason(fallback, 'ai_not_configured');

  try {
    const prompt = `You are an expert resume tailoring engine. Analyze the resume against the target job description.

Return ONLY one valid JSON object. Do not include markdown, comments, prose, or trailing commas.

Required schema:
{
  "currentScore": integer from 0 to 100,
  "optimizedScore": integer from 0 to 100 and greater than or equal to currentScore,
  "level": one of ["\u4f4e", "\u4e2d", "\u9ad8", "\u5f88\u9ad8"],
  "matchedKeywords": string array with 3 to 10 items,
  "missingKeywords": string array with 3 to 10 items,
  "recommendedKeywords": string array with 3 to 10 items,
  "dimensions": exactly 6 objects, each with {"label": string, "score": integer from 0 to 100, "note": string},
  "gaps": string array with 3 to 6 items,
  "strengths": string array with 3 to 6 items,
  "suggestions": exactly 4 objects, each with {"section": string, "original": string, "issue": string, "suggestion": string},
  "optimizedResume": a complete English resume draft tailored to the JD
}

All fields are required. If evidence is missing, infer conservatively from the resume and JD.

Job title: ${payload.job_title || ''}
Company: ${payload.company_name || ''}
Target region: ${payload.target_region || ''}
Job URL: ${payload.job_url || ''}

Resume:
${payload.resume_text || payload.resume_name || ''}

Job description:
${payload.job_description || ''}

Keep suggestions concise, practical, and specific to the target role.`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      }),
      getResumeTailorAiTimeoutMs(),
      'AI analysis timed out',
    );

    return normalizeAiResumeTailorAnalysis(parseAiJsonResponse(response.text || ''), fallback);
  } catch (error) {
    const fallbackReason = getResumeTailorFallbackReason(error);
    console.warn('Resume Tailor AI fallback:', fallbackReason, error);
    return withFallbackReason(fallback, fallbackReason);
  }
}

const JD_ANALYZER_SCHEMA_VERSION = 'jd-analyzer-v1';
const JD_ANALYZER_DEFAULT_AI_TIMEOUT_MS = 10000;
const JD_ANALYZER_MIN_AI_TIMEOUT_MS = 3000;
const JD_ANALYZER_MAX_AI_TIMEOUT_MS = 30000;

function getJdAnalyzerAiTimeoutMs() {
  const configured = Number(process.env.JD_ANALYZER_AI_TIMEOUT_MS);
  if (!Number.isFinite(configured) || configured <= 0) {
    return JD_ANALYZER_DEFAULT_AI_TIMEOUT_MS;
  }
  return clampScore(Math.round(configured), JD_ANALYZER_MIN_AI_TIMEOUT_MS, JD_ANALYZER_MAX_AI_TIMEOUT_MS);
}

function getJdAnalyzerDifficultyLabel(score: number) {
  if (score >= 82) return '高';
  if (score >= 64) return '中高';
  if (score >= 46) return '中';
  return '入门';
}

function inferJdRoleType(text: string, title: string) {
  const source = `${title} ${text}`.toLowerCase();
  if (/data scientist|machine learning|ml engineer|ai engineer|research scientist/.test(source)) return 'Data / AI';
  if (/data analyst|business analyst|analytics|bi\b|tableau|dashboard|sql/.test(source)) return 'Data Analytics';
  if (/frontend|front-end|react|vue|web developer|typescript/.test(source)) return 'Frontend Engineering';
  if (/backend|back-end|server|node\.?js|java|spring|distributed/.test(source)) return 'Backend Engineering';
  if (/product manager|\bpm\b|roadmap|user research|go-to-market/.test(source)) return 'Product Management';
  if (/consult|strategy|business development|investment|finance|risk/.test(source)) return 'Business / Finance';
  if (/design|ux|ui|researcher/.test(source)) return 'Design / Research';
  return 'General Professional';
}

function inferJdSeniority(text: string, title: string) {
  const source = `${title} ${text}`.toLowerCase();
  if (/intern|internship|co-op|summer/.test(source)) return 'Internship';
  if (/new grad|graduate|entry level|junior|campus|2026|2027/.test(source)) return 'New Grad / Entry';
  if (/senior|staff|principal|lead|manager/.test(source)) return 'Senior';
  if (/3\+|4\+|5\+|years|yrs|experience/.test(source)) return 'Mid-Level';
  return 'Early Career';
}

function extractJdSentences(text: string, fallback: string[], max = 5) {
  const normalized = text
    .replace(/\r/g, '\n')
    .split(/\n|(?<=[.!?])\s+/)
    .map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter((line) => line.length >= 24 && line.length <= 220)
    .slice(0, max);
  return normalized.length ? normalized : fallback;
}

function buildHeuristicJdAnalyzerAnalysis(payload: JdAnalyzerPayload): JdAnalyzerAnalysis {
  const jobDescription = String(payload.job_description || '').trim();
  const jobTitle = String(payload.job_title || 'Target Role').trim();
  const companyName = String(payload.company_name || 'target company').trim();
  const roleType = inferJdRoleType(jobDescription, jobTitle);
  const seniority = inferJdSeniority(jobDescription, jobTitle);
  const keywords = extractResumeTailorKeywords(jobDescription);
  const mustHaveSkills = (keywords.length ? keywords : resumeTailorFallbackKeywords).slice(0, 8);
  const niceToHaveSkills = Array.from(new Set([
    ...keywords.slice(4, 12),
    'Stakeholder Communication',
    'Quantified Impact',
    'Business Context',
  ])).filter((skill) => !mustHaveSkills.includes(skill)).slice(0, 8);

  const source = `${jobTitle} ${jobDescription}`.toLowerCase();
  const difficultyScore = clampScore(
    38 +
      Math.min(mustHaveSkills.length * 4, 24) +
      (/senior|lead|staff|principal|manager/.test(source) ? 18 : 0) +
      (/system design|architecture|distributed|scale/.test(source) ? 10 : 0) +
      (/machine learning|model|algorithm|quant/.test(source) ? 8 : 0) +
      (/stakeholder|cross-functional|ambiguous|ownership/.test(source) ? 6 : 0),
    35,
    94,
  );
  const difficultyLabel = getJdAnalyzerDifficultyLabel(difficultyScore);

  const responsibilities = extractJdSentences(jobDescription, [
    `Deliver work aligned with ${jobTitle} responsibilities at ${companyName}.`,
    'Collaborate with cross-functional partners to clarify requirements and ship measurable outcomes.',
    'Use role-relevant tools and domain knowledge to solve practical business problems.',
  ], 5);

  const hiddenRequirements = [
    /stakeholder|cross-functional|partner/.test(source)
      ? '岗位隐含要求较强的跨团队沟通和需求澄清能力。'
      : '即使 JD 没有明说，也需要在简历中体现协作对象和业务场景。',
    /ambiguous|fast-paced|ownership|independently/.test(source)
      ? 'JD 强调不确定环境，需要准备 ownership 和主动推进案例。'
      : '建议准备一个从模糊问题到明确方案的项目案例。',
    /metric|kpi|impact|growth|revenue|efficiency/.test(source)
      ? '招聘方会关注结果指标，简历和面试都要量化业务影响。'
      : '需要把经历改写成“动作 + 工具 + 场景 + 结果”的结构。',
  ];

  return {
    roleType,
    seniority,
    difficultyScore,
    difficultyLabel,
    summary: `${companyName} 的 ${jobTitle} 更偏向 ${roleType}，适合用 ${mustHaveSkills.slice(0, 3).join(' / ')} 作为简历和面试准备主线。`,
    mustHaveSkills,
    niceToHaveSkills,
    responsibilities,
    hiddenRequirements,
    resumePreparation: [
      `Summary 第一行直接对齐 ${jobTitle}，并放入 ${mustHaveSkills.slice(0, 3).join(' / ')}。`,
      'Experience bullet 使用“工具 + 任务 + 业务结果”结构，至少补 2 条量化成果。',
      `技能区优先展示 ${mustHaveSkills.slice(0, 5).join(' / ')}，不要把 JD 高频词埋在末尾。`,
      '准备一个最贴近 JD 的项目作为主项目，并写清数据、用户、系统或业务规模。',
    ],
    interviewPreparation: [
      `准备 90 秒版本的“为什么适合 ${jobTitle}”。`,
      `围绕 ${mustHaveSkills.slice(0, 3).join(' / ')} 各准备一个可追问项目。`,
      '准备一个跨团队沟通或需求不清晰时推进结果的 STAR 案例。',
      '把 JD 中的核心职责改写成 5 个面试追问，提前准备答案框架。',
    ],
    actionPlan: [
      {
        title: '先做岗位判断',
        detail: `确认这是 ${roleType} / ${seniority} 方向，投递前先判断经历是否能覆盖核心能力。`,
        priority: '高',
      },
      {
        title: '再做简历匹配',
        detail: `把 ${mustHaveSkills.slice(0, 4).join(' / ')} 放入 Summary、Skills 和最相关经历。`,
        priority: '高',
      },
      {
        title: '最后准备面试素材',
        detail: '围绕岗位职责准备项目深挖、行为面试和业务理解三类回答。',
        priority: '中',
      },
    ],
    source: 'heuristic',
    generatedAt: new Date().toISOString(),
    schemaVersion: JD_ANALYZER_SCHEMA_VERSION,
  };
}

function withJdAnalyzerSchema(analysis: JdAnalyzerAnalysis): JdAnalyzerAnalysis {
  return {
    ...analysis,
    schemaVersion: JD_ANALYZER_SCHEMA_VERSION,
    generatedAt: analysis.generatedAt || new Date().toISOString(),
  };
}

function withJdAnalyzerFallbackReason(analysis: JdAnalyzerAnalysis, reason: string): JdAnalyzerAnalysis {
  return {
    ...withJdAnalyzerSchema(analysis),
    source: 'heuristic',
    fallbackReason: reason,
  };
}

function normalizeJdAnalyzerActionPlan(value: unknown, fallback: JdAnalyzerAction[]) {
  const candidate = Array.isArray(value) ? value : [];
  return Array.from({ length: 3 }, (_, index) => {
    const item = candidate[index] && typeof candidate[index] === 'object'
      ? candidate[index] as Record<string, unknown>
      : {};
    const fallbackItem = fallback[index] || fallback[0] || {
      title: '准备投递',
      detail: '先补齐简历关键词，再准备面试案例。',
      priority: '中',
    };
    return {
      title: normalizeString(item.title, fallbackItem.title),
      detail: normalizeString(item.detail, fallbackItem.detail),
      priority: normalizeString(item.priority, fallbackItem.priority),
    };
  });
}

function normalizeAiJdAnalyzerAnalysis(
  candidate: Record<string, unknown>,
  fallback: JdAnalyzerAnalysis,
): JdAnalyzerAnalysis {
  const difficultyScore = normalizeScore(candidate.difficultyScore, fallback.difficultyScore, 0, 100);
  return {
    ...fallback,
    roleType: normalizeString(candidate.roleType, fallback.roleType),
    seniority: normalizeString(candidate.seniority, fallback.seniority),
    difficultyScore,
    difficultyLabel: normalizeString(candidate.difficultyLabel, getJdAnalyzerDifficultyLabel(difficultyScore)),
    summary: normalizeString(candidate.summary, fallback.summary),
    mustHaveSkills: normalizeStringList(candidate.mustHaveSkills, fallback.mustHaveSkills, 3, 10),
    niceToHaveSkills: normalizeStringList(candidate.niceToHaveSkills, fallback.niceToHaveSkills, 2, 10),
    responsibilities: normalizeStringList(candidate.responsibilities, fallback.responsibilities, 3, 6),
    hiddenRequirements: normalizeStringList(candidate.hiddenRequirements, fallback.hiddenRequirements, 3, 6),
    resumePreparation: normalizeStringList(candidate.resumePreparation, fallback.resumePreparation, 3, 6),
    interviewPreparation: normalizeStringList(candidate.interviewPreparation, fallback.interviewPreparation, 3, 6),
    actionPlan: normalizeJdAnalyzerActionPlan(candidate.actionPlan, fallback.actionPlan),
    source: 'ai',
    generatedAt: new Date().toISOString(),
    schemaVersion: JD_ANALYZER_SCHEMA_VERSION,
  };
}

async function buildJdAnalyzerAnalysis(ai: GoogleGenAI | null, payload: JdAnalyzerPayload) {
  const fallback = buildHeuristicJdAnalyzerAnalysis(payload);
  const aiEnabled = process.env.ENABLE_JD_ANALYZER_AI === 'true';
  if (!aiEnabled) return withJdAnalyzerSchema(fallback);
  if (!ai) return withJdAnalyzerFallbackReason(fallback, 'ai_not_configured');

  try {
    const prompt = `You are an expert job description analyst for international students and early-career job seekers.

Return ONLY one valid JSON object. Do not include markdown, comments, prose, or trailing commas.

Required schema:
{
  "roleType": string,
  "seniority": string,
  "difficultyScore": integer from 0 to 100,
  "difficultyLabel": string,
  "summary": string in Chinese,
  "mustHaveSkills": string array with 3 to 10 items,
  "niceToHaveSkills": string array with 2 to 10 items,
  "responsibilities": string array with 3 to 6 items,
  "hiddenRequirements": string array with 3 to 6 Chinese items,
  "resumePreparation": string array with 3 to 6 Chinese items,
  "interviewPreparation": string array with 3 to 6 Chinese items,
  "actionPlan": exactly 3 objects, each with {"title": string, "detail": string, "priority": "高" | "中" | "低"}
}

Job title: ${payload.job_title || ''}
Company: ${payload.company_name || ''}
Target region: ${payload.target_region || ''}
Job URL: ${payload.job_url || ''}

Job description:
${payload.job_description || ''}

Be specific, practical, and conservative. Focus on how the candidate should decide whether to apply and how to prepare resume and interviews.`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      }),
      getJdAnalyzerAiTimeoutMs(),
      'JD analysis timed out',
    );

    return normalizeAiJdAnalyzerAnalysis(parseAiJsonResponse(response.text || ''), fallback);
  } catch (error) {
    const fallbackReason = getResumeTailorFallbackReason(error);
    console.warn('JD Analyzer AI fallback:', fallbackReason, error);
    return withJdAnalyzerFallbackReason(fallback, fallbackReason);
  }
}

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

const questionCategoryLabels: Record<string, string> = {
  java: 'Java',
  frontend: '前端',
  algorithm: '算法',
  system: '系统设计',
  behavior: '行为面试',
  python: 'Python',
  database: '数据库',
};

let cachedMiniProgramQuestions: MiniProgramQuestion[] | null = null;

function toFiniteNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function inferQuestionCategories(query: Record<string, unknown>) {
  const text = `${query.company || ''} ${query.role || ''} ${query.position || ''} ${query.keyword || ''}`.toLowerCase();
  const categories = new Set<string>();

  if (/front|react|vue|javascript|typescript|web|前端/.test(text)) categories.add('frontend');
  if (/backend|java|spring|后端/.test(text)) categories.add('java');
  if (/data|analyst|scientist|machine|ml|ai|python|数据|算法岗/.test(text)) {
    categories.add('python');
    categories.add('database');
    categories.add('algorithm');
  }
  if (/software|sde|engineer|developer|swe|工程师|开发/.test(text)) {
    categories.add('algorithm');
    categories.add('system');
    categories.add('behavior');
  }
  if (/product|pm|manager|consult|finance|bank|analyst|产品|咨询|金融|投行/.test(text)) {
    categories.add('behavior');
  }
  if (/google|meta|facebook|microsoft|apple|bytedance|tiktok|腾讯|字节/.test(text)) {
    categories.add('algorithm');
    categories.add('system');
  }
  if (/amazon|亚马逊/.test(text)) {
    categories.add('behavior');
    categories.add('system');
  }

  return categories.size ? Array.from(categories) : ['algorithm', 'system', 'behavior'];
}

function normalizeMiniProgramQuestion(item: RawQuestion, index: number): MiniProgramQuestion {
  const category = String(item.category || 'behavior');
  const difficulty = String(item.difficulty || '中等');
  const views = toFiniteNumber(item.views);
  const title = String(item.title || item.question || `面试题 ${index + 1}`);

  return {
    id: (item.id as string | number | undefined) || index + 1,
    title,
    question: title,
    category,
    categoryName: questionCategoryLabels[category] || '综合',
    difficulty,
    answer: String(item.answer || ''),
    views,
    likes: Math.max(20 + index * 3, Math.floor(views * 0.6)),
    isFeatured: index < 16 || views >= 1800,
    isHot: views >= 1800,
    source: '小程序精选题库',
  };
}

function loadMiniProgramQuestions() {
  if (cachedMiniProgramQuestions) return cachedMiniProgramQuestions;

  const filePath = path.join(process.cwd(), 'CareerAI-backend', 'miniprogram', 'utils', 'mock-data.js');
  const source = fs.readFileSync(filePath, 'utf8');
  const sandbox = {
    module: { exports: {} as { QUESTIONS?: RawQuestion[] } },
    exports: {} as { QUESTIONS?: RawQuestion[] },
    console,
  };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(source, sandbox, { filename: filePath, timeout: 1000 });

  const rawQuestions = Array.isArray(sandbox.module.exports.QUESTIONS) ? sandbox.module.exports.QUESTIONS : [];
  cachedMiniProgramQuestions = rawQuestions.map(normalizeMiniProgramQuestion);
  return cachedMiniProgramQuestions;
}

function buildInterviewQuestionsResponse(query: Record<string, unknown>) {
  const page = Math.max(1, parseInt(String(query.page || '1'), 10) || 1);
  const pageSize = Math.min(Math.max(1, parseInt(String(query.pageSize || '12'), 10) || 12), 100);
  const category = String(query.category || '').trim();
  const difficulty = String(query.difficulty || '').trim();
  const keyword = String(query.keyword || '').trim().toLowerCase();
  const mode = String(query.mode || 'relevant');
  const focusCategories = inferQuestionCategories(query);
  const focusSet = new Set(focusCategories);
  const allQuestions = loadMiniProgramQuestions();

  let list = allQuestions.filter((question) => {
    if (category && category !== 'all' && question.category !== category) return false;
    if (difficulty && difficulty !== 'all' && question.difficulty !== difficulty) return false;
    if (!keyword) return true;
    return `${question.title} ${question.answer} ${question.categoryName}`.toLowerCase().includes(keyword);
  });

  if (mode === 'featured') {
    list = list.filter((question) => question.isFeatured || question.isHot);
  }

  const withScore = list.map((question) => ({
    ...question,
    relevanceScore:
      (focusSet.has(question.category) ? 10000 : 0) +
      (question.isFeatured ? 120 : 0) +
      (question.isHot ? 80 : 0) +
      question.views,
  }));

  if (mode === 'hot' || mode === 'featured') {
    withScore.sort((a, b) => b.views - a.views || b.relevanceScore - a.relevanceScore);
  } else {
    withScore.sort((a, b) => b.relevanceScore - a.relevanceScore || b.views - a.views);
  }

  const start = (page - 1) * pageSize;
  const paged = withScore.slice(start, start + pageSize);

  return {
    code: 0,
    message: 'success',
    data: {
      list: paged,
      total: withScore.length,
      page,
      pageSize,
      totalPages: Math.ceil(withScore.length / pageSize) || 1,
      source: 'miniprogram_question_bank',
      sourceLabel: '小程序精选题库',
      focusCategories,
      categories: Object.entries(questionCategoryLabels).map(([id, name]) => ({ id, name })),
      stats: {
        total: allQuestions.length,
        featured: allQuestions.filter((question) => question.isFeatured).length,
        hot: allQuestions.filter((question) => question.isHot).length,
      },
    },
  };
}

function getProxyTargetPath(req: express.Request) {
  const normalizePath = (value: string) =>
    value
      .split('?')[0]
      .replace(/^\/+/, '')
      .replace(/^api\/proxy\/?/, '')
      .replace(/^\/+/, '');

  const wildcardPath = typeof req.params[0] === 'string' ? req.params[0] : '';
  const pathFallback = req.path.replace(/^\/api\/proxy\/?/, '');
  return normalizePath(wildcardPath) || normalizePath(pathFallback) || normalizePath(req.originalUrl);
}

const DEFAULT_REAL_API_BASE_URL = 'https://api.zhiyincareer.com';

function getRealApiBaseUrl() {
  const explicitBase = process.env.REAL_API_BASE_URL || process.env.MINIPROGRAM_API_BASE_URL;
  if (explicitBase) return explicitBase;

  const viteBase = process.env.VITE_API_BASE_URL || '';
  const isWebsiteHost = /^https?:\/\/(www\.)?zhiyincareer\.com\/?$/i.test(viteBase.replace(/\/+$/, ''));
  return viteBase && !isWebsiteHost ? viteBase : DEFAULT_REAL_API_BASE_URL;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 4313;

  app.use(express.json({ limit: '2mb' }));

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


  app.post('/api/proxy/jd-analyzer/analyze', async (req, res) => {
    try {
      const payload = req.body as JdAnalyzerPayload;
      if (!payload.job_description) {
        return res.status(400).json({ code: 400, message: 'job_description is required' });
      }

      const analysis = await buildJdAnalyzerAnalysis(ai, payload);
      res.json({
        code: 0,
        message: 'success',
        data: analysis,
      });
    } catch (error: any) {
      console.error('JD Analyzer analyze error:', error);
      res.status(500).json({ code: 500, message: error.message || 'Failed to analyze job description' });
    }
  });

  app.post('/api/proxy/resume-tailor/parse-resume', uploadResumeFile, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ code: 400, message: 'resume file is required' });
      }

      const parsedResume = await parseResumeFile(req.file);
      res.json({
        code: 0,
        message: 'success',
        data: parsedResume,
      });
    } catch (error: any) {
      console.error('Resume Tailor parse error:', error);
      res.status(error.status || 500).json({
        code: error.status || 500,
        message: error.message || 'Failed to parse resume file',
      });
    }
  });

  app.post('/api/proxy/resume-tailor/analyze', async (req, res) => {
    try {
      const payload = req.body as ResumeTailorPayload;
      if (!payload.resume_text && !payload.resume_name) {
        return res.status(400).json({ code: 400, message: 'resume_text or resume_name is required' });
      }
      if (!payload.job_description) {
        return res.status(400).json({ code: 400, message: 'job_description is required' });
      }

      const analysis = await buildResumeTailorAnalysis(ai, payload);
      res.json({
        code: 0,
        message: 'success',
        data: analysis,
      });
    } catch (error: any) {
      console.error('Resume Tailor analyze error:', error);
      res.status(500).json({ code: 500, message: error.message || 'Failed to analyze resume' });
    }
  });

  app.post('/api/proxy/resume-tailor/export-docx', async (req, res) => {
    try {
      const buffer = await buildResumeDocxBuffer(req.body || {});
      const rawFileName = safeDownloadName(
        `${req.body?.job_title || req.body?.resume_name || 'optimized-resume'}-optimized`,
      );
      const encodedFileName = encodeURIComponent(`${rawFileName}.docx`);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${rawFileName}.docx"; filename*=UTF-8''${encodedFileName}`);
      res.setHeader('Content-Length', String(buffer.length));
      res.send(buffer);
    } catch (error: any) {
      console.error('Resume Tailor DOCX export error:', error);
      res.status(error.status || 500).json({
        code: error.status || 500,
        message: error.message || 'Failed to export DOCX',
      });
    }
  });

  app.get('/api/proxy/resume-tailor/records', (req, res) => {
    try {
      const userId = String(req.query.user_id || '').trim();
      if (!userId) {
        return res.status(400).json({ code: 400, message: 'user_id is required' });
      }

      const list = readResumeTailorRecords()
        .filter((record) => record.user_id === userId)
        .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

      res.json({
        code: 0,
        message: 'success',
        data: {
          list,
          total: list.length,
          storage: 'file',
        },
      });
    } catch (error: any) {
      console.error('Resume Tailor records load error:', error);
      res.status(500).json({ code: 500, message: error.message || 'Failed to load resume tailor records' });
    }
  });

  app.post('/api/proxy/resume-tailor/records', (req, res) => {
    try {
      const payload = req.body || {};
      const analysis = payload.analysis as ResumeTailorAnalysis | undefined;
      if (!analysis) {
        return res.status(400).json({ code: 400, message: 'analysis is required' });
      }

      const userId = String(payload.user_id || '').trim();
      if (!userId) {
        return res.status(400).json({ code: 400, message: 'user_id is required' });
      }

      const now = new Date().toISOString();
      const record: ResumeTailorRecord = {
        id: String(payload.id || Date.now()),
        user_id: userId,
        resume_name: String(payload.resume_name || 'Manual resume text'),
        job_title: String(payload.job_title || ''),
        company_name: String(payload.company_name || ''),
        job_url: String(payload.job_url || ''),
        target_region: String(payload.target_region || ''),
        current_score: Number(payload.current_score || analysis.currentScore || 0),
        optimized_score: Number(payload.optimized_score || analysis.optimizedScore || 0),
        analysis,
        created_at: String(payload.created_at || now),
        updated_at: now,
      };

      const nextRecords = [
        record,
        ...readResumeTailorRecords().filter((item) => item.id !== record.id),
      ];
      writeResumeTailorRecords(nextRecords);

      res.json({
        code: 0,
        message: 'success',
        data: record,
      });
    } catch (error: any) {
      console.error('Resume Tailor record save error:', error);
      res.status(500).json({ code: 500, message: error.message || 'Failed to save resume tailor record' });
    }
  });

  app.get('/api/proxy/applications', (req, res) => {
    try {
      const userId = getApplicationUserId(req);
      const status = String(req.query.status || '').trim();
      const records = readApplicationRecords().filter((record) => {
        if (record.user_id !== userId) return false;
        if (status && record.status !== status) return false;
        return true;
      });
      res.json(buildApplicationResponse(records));
    } catch (error: any) {
      console.error('Application records load error:', error);
      res.status(500).json({ code: 500, message: error.message || 'Failed to load application records' });
    }
  });

  app.post('/api/proxy/applications', (req, res) => {
    try {
      const userId = getApplicationUserId(req);
      const payload = req.body || {};
      const now = new Date().toISOString();
      const status = String(payload.status || 'applied');
      const existing = readApplicationRecords();
      const duplicate = existing.find((record) => (
        record.user_id === userId &&
        String(record.jobId) === String(payload.jobId || payload.job_id || '')
      ));

      const record = normalizeApplicationRecord({
        ...duplicate,
        ...payload,
        id: duplicate?.id || payload.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        user_id: userId,
        status,
        statusText: applicationStatusLabels[status] || payload.statusText || status,
        appliedAt: duplicate?.appliedAt || payload.appliedAt || now,
        createdAt: duplicate?.createdAt || now,
        updatedAt: now,
      });

      if (!record) {
        return res.status(400).json({ code: 400, message: 'invalid application record' });
      }

      const nextRecords = [
        record,
        ...existing.filter((item) => item.id !== record.id),
      ];
      writeApplicationRecords(nextRecords);
      res.json({ code: 0, message: 'success', data: record });
    } catch (error: any) {
      console.error('Application record save error:', error);
      res.status(500).json({ code: 500, message: error.message || 'Failed to save application record' });
    }
  });

  app.patch('/api/proxy/applications/:id', (req, res) => {
    try {
      const userId = getApplicationUserId(req);
      const recordId = String(req.params.id || '');
      const records = readApplicationRecords();
      const target = records.find((record) => record.user_id === userId && record.id === recordId);
      if (!target) {
        return res.status(404).json({ code: 404, message: 'application record not found' });
      }

      const status = req.body?.status ? String(req.body.status) : target.status;
      const updated = normalizeApplicationRecord({
        ...target,
        ...req.body,
        id: target.id,
        user_id: target.user_id,
        jobId: target.jobId,
        jobSnapshot: {
          ...target.jobSnapshot,
          ...(req.body?.jobSnapshot || {}),
        },
        status,
        statusText: applicationStatusLabels[status] || req.body?.statusText || target.statusText,
        updatedAt: new Date().toISOString(),
      });

      if (!updated) {
        return res.status(400).json({ code: 400, message: 'invalid application record' });
      }

      writeApplicationRecords(records.map((record) => (record.id === recordId ? updated : record)));
      res.json({ code: 0, message: 'success', data: updated });
    } catch (error: any) {
      console.error('Application record update error:', error);
      res.status(500).json({ code: 500, message: error.message || 'Failed to update application record' });
    }
  });

  app.delete('/api/proxy/applications/:id', (req, res) => {
    try {
      const userId = getApplicationUserId(req);
      const recordId = String(req.params.id || '');
      const records = readApplicationRecords();
      const nextRecords = records.filter((record) => !(record.user_id === userId && record.id === recordId));
      writeApplicationRecords(nextRecords);
      res.json({ code: 0, message: 'success', data: { id: recordId } });
    } catch (error: any) {
      console.error('Application record delete error:', error);
      res.status(500).json({ code: 500, message: error.message || 'Failed to delete application record' });
    }
  });

  // Generic Proxy endpoint for real Mini-Program API
  app.all('/api/proxy/*', async (req, res) => {
    const targetPath = getProxyTargetPath(req);
    const sendLocalProxyResponse = () => {
      if (targetPath === 'interview-questions' || targetPath === 'question-bank') {
        return res.json(buildInterviewQuestionsResponse(req.query as Record<string, unknown>));
      }
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
      const localResponse = sendLocalProxyResponse();
      if (localResponse) return;

      const REAL_API_BASE_URL = getRealApiBaseUrl();
      
      if (!REAL_API_BASE_URL) {
        const fallback = sendLocalProxyResponse();
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
      if (targetPath === 'interview-questions' || targetPath === 'question-bank') {
        return res.status(500).json({ error: 'Failed to load interview question bank', useMock: true });
      }
      const fallback = sendLocalProxyResponse();
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
