import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clipboard,
  Copy,
  Download,
  FileText,
  Gauge,
  History,
  Lightbulb,
  Lock,
  RefreshCw,
  Save,
  Sparkles,
  Target,
  UploadCloud,
} from 'lucide-react';

import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { API_BASE, apiFetch } from '../lib/api';

type DimensionScore = {
  label: string;
  score: number;
  note: string;
};

type RewriteSuggestion = {
  section: string;
  original: string;
  issue: string;
  suggestion: string;
};

type TailorAnalysis = {
  currentScore: number;
  optimizedScore: number;
  level: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendedKeywords: string[];
  dimensions: DimensionScore[];
  gaps: string[];
  strengths: string[];
  suggestions: RewriteSuggestion[];
  optimizedResume: string;
  source?: 'ai' | 'heuristic';
  generatedAt?: string;
  fallbackReason?: string;
  schemaVersion?: string;
};
type TailorRecord = {
  id: string;
  user_id: string;
  resume_name: string;
  job_title: string;
  company_name: string;
  job_url: string;
  target_region: string;
  current_score: number;
  optimized_score: number;
  analysis: TailorAnalysis;
  created_at: string;
  updated_at?: string;
};

const SAMPLE_RESUME = `Data Analyst with 2 years of experience building dashboards and reporting workflows.
Built SQL dashboards for weekly user growth reporting and automated Excel reports.
Worked with product managers to analyze user behavior and improve retention insights.
Projects include churn analysis, KPI dashboard, and customer segmentation.`;

const SAMPLE_JD = `We are hiring a Data Analyst to build SQL and Python data pipelines, design dashboards, partner with stakeholders, and turn product data into business recommendations. Preferred experience includes AWS, Docker, Tableau, machine learning basics, and strong communication skills.`;

const keywordBank = [
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

const fallbackKeywords = [
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

const stopWords = new Set([
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

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const titleCase = (value: string) =>
  value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const includesAlias = (text: string, label: string) => {
  const lower = text.toLowerCase();
  const keyword = keywordBank.find((item) => item.label === label);
  const aliases = keyword?.aliases || [label.toLowerCase()];
  return aliases.some((alias) => lower.includes(alias.toLowerCase()));
};

const extractKeywords = (text: string) => {
  const lower = text.toLowerCase();
  const bankMatches = keywordBank
    .filter((item) => item.aliases.some((alias) => lower.includes(alias.toLowerCase())))
    .map((item) => item.label);

  const words = Array.from(text.matchAll(/[A-Za-z][A-Za-z+#.-]{2,}/g), (match) => match[0]);
  const counts: Record<string, number> = {};
  words.forEach((word) => {
    const normalized = word.toLowerCase();
    if (stopWords.has(normalized)) return;
    counts[normalized] = (counts[normalized] || 0) + 1;
  });

  const fallbackMatches = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word]) => titleCase(word));

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
};

const getLevel = (score: number) => {
  if (score >= 88) return '很高';
  if (score >= 74) return '高';
  if (score >= 58) return '中';
  return '低';
};

const buildAnalysis = (
  rawResumeText: string,
  rawJobDescription: string,
  jobTitle = 'Data Analyst',
  companyName = 'Target Company',
): TailorAnalysis => {
  const resumeText = rawResumeText.trim() || 'Uploaded resume file';
  const jobDescription = rawJobDescription.trim() || SAMPLE_JD;
  const jdKeywords = extractKeywords(jobDescription);
  const coreKeywords = jdKeywords.length ? jdKeywords : fallbackKeywords;
  const matchedKeywords = coreKeywords.filter((keyword) => includesAlias(resumeText, keyword));
  const missingKeywords = coreKeywords.filter((keyword) => !includesAlias(resumeText, keyword)).slice(0, 8);
  const matchRatio = matchedKeywords.length / Math.max(coreKeywords.length, 1);
  const hasMetrics = /\d+%|\$|reduced|increased|improved|saved|grew|automated/i.test(resumeText);
  const hasProjects = /project|built|launched|implemented|designed|developed/i.test(resumeText);
  const hasLeadership = /stakeholder|cross-functional|led|partnered|managed|communicat/i.test(resumeText);
  const currentScore = clamp(Math.round(45 + matchRatio * 34 + (hasMetrics ? 8 : 0) + (hasProjects ? 5 : 0) + (hasLeadership ? 4 : 0)), 46, 88);
  const optimizedScore = clamp(currentScore + 14 + Math.min(missingKeywords.length * 2, 10), currentScore + 6, 96);

  const dimensions: DimensionScore[] = [
    {
      label: '技能关键词匹配',
      score: clamp(Math.round(42 + matchRatio * 54), 35, 96),
      note: `${matchedKeywords.length}/${coreKeywords.length} 个核心关键词已出现`,
    },
    {
      label: '工作经验匹配',
      score: clamp(hasLeadership ? currentScore + 3 : currentScore - 7, 38, 94),
      note: hasLeadership ? '已体现跨团队协作或业务沟通' : '建议补充业务合作与职责边界',
    },
    {
      label: '项目经历匹配',
      score: clamp(hasProjects ? currentScore + 4 : currentScore - 10, 36, 94),
      note: hasProjects ? '项目描述可继续绑定 JD 关键词' : '需要补充与岗位职责相关的项目',
    },
    {
      label: '行业关键词匹配',
      score: clamp(Math.round(48 + matchRatio * 40), 40, 92),
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
  ];

  const recommendedKeywords = Array.from(new Set([...missingKeywords, ...coreKeywords.slice(0, 5)])).slice(0, 8);

  return {
    currentScore,
    optimizedScore,
    level: getLevel(currentScore),
    matchedKeywords,
    missingKeywords,
    recommendedKeywords,
    dimensions,
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
  };
};

const scoreColor = (score: number) => {
  if (score >= 85) return 'text-emerald-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 55) return 'text-amber-600';
  return 'text-rose-600';
};

const ProgressBar = ({ value }: { value: number }) => (
  <div className="h-2 w-full rounded-full bg-gray-100">
    <div className="h-2 rounded-full bg-primary" style={{ width: `${clamp(value, 0, 100)}%` }} />
  </div>
);

const KeywordTag = ({ children, tone = 'blue' }: { children: React.ReactNode; tone?: 'blue' | 'green' | 'amber' }) => {
  const toneClass = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    green: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-700',
  }[tone];

  return <span className={`rounded-md border px-2.5 py-1 text-xs font-bold ${toneClass}`}>{children}</span>;
};

const getLocalRecordKey = (userId: string) => `resume_tailor_records:${userId}`;

const readLocalRecords = (key: string): TailorRecord[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalRecords = (key: string, records: TailorRecord[]) => {
  localStorage.setItem(key, JSON.stringify(records.slice(0, 30)));
};

const formatRecordDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '刚刚';
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const MAX_RESUME_FILE_BYTES = 5 * 1024 * 1024;

const sanitizeFileName = (value: string) => {
  const cleaned = value
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5_-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
  return cleaned || 'optimized-resume';
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export default function ResumeTailor() {
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const { showToast } = useToast();
  const [resumeName, setResumeName] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('Data Analyst');
  const [companyName, setCompanyName] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [targetRegion, setTargetRegion] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<'PDF' | 'DOCX' | null>(null);
  const [analysis, setAnalysis] = useState<TailorAnalysis | null>(null);
  const [historyRecords, setHistoryRecords] = useState<TailorRecord[]>([]);

  const currentUserId = useMemo(() => String(user?.id || user?.email || ''), [user?.id, user?.email]);
  const localRecordKey = useMemo(
    () => (currentUserId ? getLocalRecordKey(currentUserId) : 'resume_tailor_records'),
    [currentUserId],
  );
  const demoAnalysis = useMemo(() => buildAnalysis(SAMPLE_RESUME, SAMPLE_JD, 'Data Analyst', 'CloudWorks'), []);
  const displayAnalysis = analysis || demoAnalysis;
  const scoreLift = displayAnalysis.optimizedScore - displayAnalysis.currentScore;
  const reportSourceLabel = displayAnalysis.source === 'ai' ? 'AI 深度分析' : '基础分析';
  const reportSourceDescription = displayAnalysis.source === 'ai'
    ? '已通过结构化 JSON 校验'
    : displayAnalysis.fallbackReason
      ? 'AI 暂不可用，已自动切换基础分析'
      : '基于本地规则生成';

  useEffect(() => {
    const draft = sessionStorage.getItem('resumeTailorDraft');
    if (!draft) return;
    try {
      const parsed = JSON.parse(draft);
      if (parsed.resumeName) setResumeName(parsed.resumeName);
      if (parsed.jobDescription) setJobDescription(parsed.jobDescription);
      if (parsed.jobTitle) setJobTitle(parsed.jobTitle);
      if (parsed.companyName) setCompanyName(parsed.companyName);
      if (parsed.targetRegion) setTargetRegion(parsed.targetRegion);
      if (parsed.jobUrl) setJobUrl(parsed.jobUrl);
    } catch {
      sessionStorage.removeItem('resumeTailorDraft');
    }
  }, []);
  useEffect(() => {
    if (!isAuthenticated || !currentUserId) {
      setHistoryRecords([]);
      return;
    }

    let isMounted = true;
    setIsLoadingHistory(true);
    apiFetch(`/api/proxy/resume-tailor/records?user_id=${encodeURIComponent(currentUserId)}`)
      .then((response) => {
        if (!isMounted) return;
        const records = Array.isArray(response.data?.list) ? response.data.list : [];
        setHistoryRecords(records);
        writeLocalRecords(localRecordKey, records);
      })
      .catch((error) => {
        console.warn('Resume Tailor history fallback:', error);
        if (isMounted) setHistoryRecords(readLocalRecords(localRecordKey));
      })
      .finally(() => {
        if (isMounted) setIsLoadingHistory(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUserId, isAuthenticated, localRecordKey]);

  const handleFileChange = async (file?: File) => {
    if (!file) return;
    const fileName = file.name.toLowerCase();

    if (file.size > MAX_RESUME_FILE_BYTES) {
      showToast('简历文件不能超过 5MB', 'info');
      return;
    }

    if (!/\.(pdf|docx|txt)$/i.test(file.name)) {
      showToast('请上传 PDF、DOCX 或 TXT 简历文件', 'info');
      return;
    }

    setResumeName(file.name);
    setIsParsingResume(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${API_BASE}/api/proxy/resume-tailor/parse-resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let message = '简历解析失败，请手动粘贴正文';
        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch {
          // Keep fallback message.
        }
        throw new Error(message);
      }

      const parsed = await response.json();
      const parsedText = String(parsed.data?.resume_text || '').trim();
      if (!parsedText) {
        throw new Error('未识别到可用正文，请手动粘贴简历文本');
      }

      setResumeText(parsedText);
      setAnalysis(null);
      showToast(`已解析 ${parsed.data?.file_type?.toUpperCase() || '简历'}，正文已填入`, 'success');
    } catch (error: any) {
      console.warn('Resume file parse failed:', error);
      if (file.type === 'text/plain' || fileName.endsWith('.txt')) {
        try {
          setResumeText(await file.text());
          setAnalysis(null);
          showToast('TXT 已在本地读取，正文已填入', 'info');
          return;
        } catch {
          // Fall through to the generic message.
        }
      }

      if (!resumeText.trim()) setResumeText('');
      showToast(error?.message || '简历解析失败，请手动粘贴正文', 'info');
    } finally {
      setIsParsingResume(false);
    }
  };

  const runAnalysis = async () => {
    if (!resumeText.trim() && !resumeName) {
      showToast('请先上传简历或粘贴简历文本', 'info');
      return;
    }
    if (!jobDescription.trim()) {
      showToast('请先粘贴目标岗位 JD', 'info');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await apiFetch('/api/proxy/resume-tailor/analyze', {
        method: 'POST',
        body: JSON.stringify({
          resume_text: resumeText,
          resume_name: resumeName,
          job_title: jobTitle,
          company_name: companyName,
          job_description: jobDescription,
          job_url: jobUrl,
          target_region: targetRegion,
          user_id: user?.id || user?.email,
        }),
      });
      setAnalysis(response.data);
      setIsAnalyzing(false);
      showToast(response.data?.source === 'ai' ? 'AI 匹配分析已生成' : 'ATS 匹配分析已生成', 'success');
    } catch (error) {
      console.warn('Resume Tailor API fallback:', error);
      setAnalysis(buildAnalysis(resumeText || resumeName, jobDescription, jobTitle, companyName || 'Target Company'));
      setIsAnalyzing(false);
      showToast('已使用本地分析生成基础报告', 'info');
    }
  };

  const loadExample = () => {
    setResumeName('sample-data-analyst-resume.txt');
    setResumeText(SAMPLE_RESUME);
    setJobTitle('Data Analyst');
    setCompanyName('CloudWorks');
    setTargetRegion('United States');
    setJobDescription(SAMPLE_JD);
    setAnalysis(buildAnalysis(SAMPLE_RESUME, SAMPLE_JD, 'Data Analyst', 'CloudWorks'));
  };

  const ensureLogin = (action: string) => {
    if (isAuthenticated) return true;
    showToast(`${action}需要登录后继续`, 'info');
    openAuthModal('login');
    return false;
  };

  const saveRecord = async () => {
    if (!ensureLogin('保存分析记录')) return;
    if (!analysis) {
      showToast('请先生成分析报告再保存', 'info');
      return;
    }
    if (!currentUserId) {
      showToast('登录信息同步中，请稍后再试', 'info');
      return;
    }

    const now = new Date().toISOString();
    const nextRecord: TailorRecord = {
      id: String(Date.now()),
      user_id: currentUserId,
      resume_name: resumeName || 'Manual resume text',
      job_title: jobTitle,
      company_name: companyName,
      job_url: jobUrl,
      target_region: targetRegion,
      current_score: analysis.currentScore,
      optimized_score: analysis.optimizedScore,
      analysis,
      created_at: now,
      updated_at: now,
    };

    try {
      const response = await apiFetch('/api/proxy/resume-tailor/records', {
        method: 'POST',
        body: JSON.stringify(nextRecord),
      });
      const savedRecord = (response.data || nextRecord) as TailorRecord;
      const nextRecords = [savedRecord, ...historyRecords.filter((record) => record.id !== savedRecord.id)].slice(0, 30);
      setHistoryRecords(nextRecords);
      writeLocalRecords(localRecordKey, nextRecords);
      showToast('分析记录已保存', 'success');
    } catch (error) {
      console.warn('Resume Tailor record local fallback:', error);
      const nextRecords = [nextRecord, ...readLocalRecords(localRecordKey)].slice(0, 30);
      setHistoryRecords(nextRecords);
      writeLocalRecords(localRecordKey, nextRecords);
      showToast('已保存到本地记录', 'info');
    }
  };

  const loadSavedRecord = (record: TailorRecord) => {
    setResumeName(record.resume_name || 'Saved resume analysis');
    setJobTitle(record.job_title || 'Data Analyst');
    setCompanyName(record.company_name || '');
    setJobUrl(record.job_url || '');
    setTargetRegion(record.target_region || '');
    setAnalysis(record.analysis);
    showToast('已载入历史分析', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyResume = async () => {
    await navigator.clipboard.writeText(displayAnalysis.optimizedResume);
    showToast('优化版简历已复制', 'success');
  };

  const exportPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('浏览器阻止了打印窗口，请允许弹窗后重试', 'info');
      return;
    }

    const title = jobTitle || 'Optimized Resume';
    const subtitleParts = [
      companyName,
      displayAnalysis.currentScore && displayAnalysis.optimizedScore
        ? `ATS ${displayAnalysis.currentScore} -> ${displayAnalysis.optimizedScore}`
        : '',
    ].filter(Boolean);
    const body = escapeHtml(displayAnalysis.optimizedResume).replace(/\n/g, '<br />');

    printWindow.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page { margin: 18mm; }
      body {
        color: #111827;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 11pt;
        line-height: 1.5;
      }
      h1 {
        font-size: 20pt;
        margin: 0 0 6px;
      }
      .meta {
        border-bottom: 1px solid #e5e7eb;
        color: #64748b;
        font-size: 9pt;
        margin-bottom: 18px;
        padding-bottom: 10px;
      }
      .resume {
        white-space: normal;
      }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <div class="meta">${escapeHtml(subtitleParts.join(' | ') || 'Generated by Zhiyin AI Resume Tailor')}</div>
    <div class="resume">${body}</div>
    <script>
      window.onload = () => {
        window.focus();
        window.print();
      };
    </script>
  </body>
</html>`);
    printWindow.document.close();
    showToast('已打开打印视图，可保存为 PDF', 'success');
  };

  const exportDocx = async () => {
    setExportingFormat('DOCX');
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/api/proxy/resume-tailor/export-docx`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          optimized_resume: displayAnalysis.optimizedResume,
          resume_name: resumeName,
          job_title: jobTitle,
          company_name: companyName,
          current_score: displayAnalysis.currentScore,
          optimized_score: displayAnalysis.optimizedScore,
        }),
      });

      if (!response.ok) {
        let message = 'DOCX 导出失败，请稍后重试';
        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch {
          // Keep fallback message.
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const fileName = `${sanitizeFileName(`${jobTitle || resumeName || 'optimized-resume'}-optimized`)}.docx`;
      downloadBlob(blob, fileName);
      showToast('DOCX 已开始下载', 'success');
    } catch (error: any) {
      console.warn('Resume Tailor DOCX export failed:', error);
      showToast(error?.message || 'DOCX 导出失败，请稍后重试', 'info');
    } finally {
      setExportingFormat(null);
    }
  };

  const exportResult = async (format: 'PDF' | 'DOCX') => {
    if (!ensureLogin(`导出 ${format}`)) return;
    if (!analysis) {
      showToast('请先生成分析报告再导出', 'info');
      return;
    }

    if (format === 'PDF') {
      exportPdf();
      return;
    }

    await exportDocx();
  };

  return (
    <main className="zy-page-shell min-h-screen bg-white pt-28">
      <SEO
        title="AI Resume Tailor"
        description="上传简历并粘贴 JD，生成 ATS 匹配分、岗位关键词、差距分析、优化建议和定制版英文简历。"
        keywords="AI简历优化,ATS评分,JD匹配,Resume Tailor,简历改写"
        canonical="https://www.zhiyincareer.com/resume-tailor"
      />

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-black text-primary">
                <Sparkles className="mr-2 h-4 w-4" />
                AI Resume Tailor
              </div>
              <h1 className="zy-page-title mt-4 max-w-4xl text-3xl sm:text-5xl">
                针对一个具体岗位，自动定制一版更匹配的简历
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
                上传简历、粘贴 JD，立即查看 ATS 分数、关键词缺口、简历问题和可复制的英文改写版本。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['上传简历', '粘贴 JD', 'AI 分析', 'ATS 评分', '优化建议', '生成简历'].map((step, index) => (
                <span key={step} className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600">
                  {index + 1}. {step}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:px-8">
        <aside className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-gray-950">输入材料</h2>
                <p className="mt-1 text-sm text-gray-500">免费体验基础分析</p>
              </div>
              <button
                type="button"
                onClick={loadExample}
                className="inline-flex items-center rounded-md border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-primary/30 hover:text-primary"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                示例
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-gray-800">简历文件</span>
                <span
                  className={`mt-2 flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-center transition hover:border-primary/40 hover:bg-blue-50/40 ${
                    isParsingResume ? 'cursor-wait opacity-80' : 'cursor-pointer'
                  }`}
                >
                  <UploadCloud className={`h-8 w-8 text-primary ${isParsingResume ? 'animate-pulse' : ''}`} />
                  <span className="mt-2 text-sm font-bold text-gray-900">
                    {isParsingResume ? '正在解析简历...' : resumeName || 'PDF / DOCX / TXT'}
                  </span>
                  <span className="mt-1 text-xs text-gray-500">上传后自动提取正文，最多 5MB</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    disabled={isParsingResume}
                    className="sr-only"
                    onChange={(event) => handleFileChange(event.target.files?.[0])}
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-gray-800">或粘贴简历文本</span>
                <textarea
                  value={resumeText}
                  onChange={(event) => setResumeText(event.target.value)}
                  rows={6}
                  className="mt-2 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="粘贴 Summary、Experience、Projects 等内容..."
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-bold text-gray-800">岗位</span>
                  <input
                    value={jobTitle}
                    onChange={(event) => setJobTitle(event.target.value)}
                    className="mt-2 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                    placeholder="Data Analyst"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-gray-800">公司</span>
                  <input
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    className="mt-2 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                    placeholder="Company"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-gray-800">Job Description</span>
                <textarea
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  rows={9}
                  className="mt-2 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="粘贴完整 JD，包含职责、要求、技能和加分项..."
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={targetRegion}
                  onChange={(event) => setTargetRegion(event.target.value)}
                  className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="目标地区"
                />
                <input
                  value={jobUrl}
                  onChange={(event) => setJobUrl(event.target.value)}
                  className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="岗位链接"
                />
              </div>

              <button
                type="button"
                onClick={runAnalysis}
                disabled={isAnalyzing || isParsingResume}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-black text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isParsingResume ? '简历解析中...' : isAnalyzing ? '分析中...' : '生成 ATS 匹配报告'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                未登录可查看基础分析。保存历史、PDF / DOCX 导出和完整改写需要登录。
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <h2 className="text-base font-black text-gray-950">历史分析记录</h2>
              </div>
              {isAuthenticated && historyRecords.length > 0 && (
                <span className="text-xs font-bold text-gray-400">{historyRecords.length}</span>
              )}
            </div>

            {!isAuthenticated ? (
              <p className="mt-3 text-sm leading-6 text-gray-500">登录后可查看已保存的 ATS 分析记录。</p>
            ) : isLoadingHistory ? (
              <p className="mt-3 text-sm leading-6 text-gray-500">正在加载历史记录...</p>
            ) : historyRecords.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-gray-500">暂无历史记录。生成报告后点击保存即可留档。</p>
            ) : (
              <div className="mt-4 space-y-2">
                {historyRecords.slice(0, 5).map((record) => (
                  <button
                    key={record.id}
                    type="button"
                    onClick={() => loadSavedRecord(record)}
                    className="w-full rounded-lg border border-gray-100 bg-gray-50 p-3 text-left transition hover:border-primary/30 hover:bg-blue-50/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-gray-900">
                          {record.job_title || 'Untitled role'}
                        </p>
                        <p className="mt-1 truncate text-xs font-bold text-gray-500">
                          {record.company_name || record.resume_name || 'Saved analysis'}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-md bg-white px-2 py-1 text-xs font-black text-primary">
                        {record.current_score}{' -> '}{record.optimized_score}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs font-bold text-gray-400">
                      <span>{formatRecordDate(record.created_at)}</span>
                      <span>+{Math.max(0, record.optimized_score - record.current_score)} 分</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-gray-400">报告来源</p>
              <p className="mt-1 text-sm font-black text-gray-950">{reportSourceLabel}</p>
            </div>
            <div className={`inline-flex w-fit items-center rounded-md px-3 py-1 text-xs font-bold ${
              displayAnalysis.source === 'ai'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}>
              {reportSourceDescription}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">当前匹配分</span>
                <Gauge className="h-5 w-5 text-primary" />
              </div>
              <div className={`mt-4 text-5xl font-black ${scoreColor(displayAnalysis.currentScore)}`}>
                {displayAnalysis.currentScore}
                <span className="text-xl text-gray-400">/100</span>
              </div>
              <p className="mt-3 text-sm font-bold text-gray-700">匹配等级：{displayAnalysis.level}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">优化后预计</span>
                <Target className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="mt-4 text-5xl font-black text-emerald-600">
                {displayAnalysis.optimizedScore}
                <span className="text-xl text-gray-400">/100</span>
              </div>
              <p className="mt-3 text-sm font-bold text-emerald-700">预计提升 +{scoreLift}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">下一步</span>
                <Lightbulb className="h-5 w-5 text-amber-500" />
              </div>
              <p className="mt-4 text-lg font-black leading-7 text-gray-950">
                先补齐缺失关键词，再把经历改成工具 + 场景 + 结果。
              </p>
              <button
                type="button"
                onClick={saveRecord}
                className="mt-4 inline-flex h-10 items-center rounded-lg border border-gray-200 px-4 text-sm font-bold text-gray-800 transition hover:border-primary/30 hover:text-primary"
              >
                <Save className="mr-2 h-4 w-4" />
                保存记录
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-950">ATS 评分维度</h2>
                <p className="mt-1 text-sm text-gray-500">按技能、经验、项目、格式和量化表达拆解</p>
              </div>
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {displayAnalysis.dimensions.map((dimension) => (
                <div key={dimension.label} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-black text-gray-900">{dimension.label}</span>
                    <span className="text-sm font-black text-primary">{dimension.score}</span>
                  </div>
                  <ProgressBar value={dimension.score} />
                  <p className="mt-2 text-xs leading-5 text-gray-500">{dimension.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-black text-gray-950">岗位核心关键词</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {displayAnalysis.matchedKeywords.map((keyword) => (
                  <KeywordTag key={keyword} tone="green">{keyword}</KeywordTag>
                ))}
                {!displayAnalysis.matchedKeywords.length && <p className="text-sm text-gray-500">点击示例或生成报告后显示已匹配关键词。</p>}
              </div>
              <h3 className="mt-6 text-sm font-black text-gray-900">建议补充</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {displayAnalysis.recommendedKeywords.map((keyword) => (
                  <KeywordTag key={keyword}>{keyword}</KeywordTag>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                <h2 className="text-xl font-black text-gray-950">缺失关键词</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {displayAnalysis.missingKeywords.map((keyword) => (
                  <KeywordTag key={keyword} tone="amber">{keyword}</KeywordTag>
                ))}
              </div>
              <p className="mt-5 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                在项目经历中加入与 {displayAnalysis.missingKeywords.slice(0, 3).join('、') || '岗位职责'} 相关的表达，并补充业务场景和量化结果。
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-black text-gray-950">Resume Gap Analysis</h2>
              </div>
              <div className="mt-5 space-y-3">
                {displayAnalysis.gaps.map((gap) => (
                  <div key={gap} className="flex gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                    <p className="text-sm leading-6 text-gray-700">{gap}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-black text-gray-950">已匹配内容</h2>
              </div>
              <div className="mt-5 space-y-3">
                {displayAnalysis.strengths.map((strength) => (
                  <div key={strength} className="flex gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <p className="text-sm leading-6 text-emerald-900">{strength}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-black text-gray-950">简历优化建议</h2>
            </div>
            <div className="mt-5 space-y-4">
              {displayAnalysis.suggestions.map((suggestion) => (
                <div key={suggestion.section} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="mb-3 text-sm font-black text-primary">{suggestion.section}</div>
                  <div className="grid gap-3 lg:grid-cols-3">
                    <div>
                      <div className="text-xs font-black uppercase text-gray-400">原文</div>
                      <p className="mt-1 text-sm leading-6 text-gray-700">{suggestion.original}</p>
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-gray-400">问题</div>
                      <p className="mt-1 text-sm leading-6 text-amber-800">{suggestion.issue}</p>
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-gray-400">建议</div>
                      <p className="mt-1 text-sm leading-6 text-emerald-800">{suggestion.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-black text-gray-950">优化版英文简历</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={copyResume} className="inline-flex h-10 items-center rounded-lg border border-gray-200 px-3 text-sm font-bold text-gray-800 transition hover:border-primary/30 hover:text-primary">
                  <Copy className="mr-2 h-4 w-4" />
                  复制
                </button>
                <button
                  type="button"
                  onClick={() => exportResult('PDF')}
                  disabled={Boolean(exportingFormat)}
                  className="inline-flex h-10 items-center rounded-lg border border-gray-200 px-3 text-sm font-bold text-gray-800 transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => exportResult('DOCX')}
                  disabled={Boolean(exportingFormat)}
                  className="inline-flex h-10 items-center rounded-lg border border-gray-200 px-3 text-sm font-bold text-gray-800 transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {exportingFormat === 'DOCX' ? '导出中...' : 'DOCX'}
                </button>
              </div>
            </div>
            <pre className="mt-5 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-lg border border-gray-100 bg-gray-950 p-5 text-sm leading-7 text-gray-100">
              {displayAnalysis.optimizedResume}
            </pre>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveRecord}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-gray-950 px-5 text-sm font-black text-white transition hover:bg-black"
              >
                保存本次分析
                <Save className="ml-2 h-4 w-4" />
              </button>
              <Link
                to="/ai-interview"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-200 bg-white px-5 text-sm font-black text-gray-900 transition hover:border-primary/30 hover:text-primary"
              >
                继续模拟面试
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
