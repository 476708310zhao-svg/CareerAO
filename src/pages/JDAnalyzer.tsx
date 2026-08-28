import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clipboard,
  Copy,
  FileText,
  Gauge,
  Lightbulb,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
} from 'lucide-react';

import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

type JdAction = {
  title: string;
  detail: string;
  priority: string;
};

type JdAnalysis = {
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
  actionPlan: JdAction[];
  source?: 'ai' | 'heuristic';
  generatedAt?: string;
  fallbackReason?: string;
  schemaVersion?: string;
};

const STORAGE_KEY = 'zhiyin_jd_analyzer_workspace';

const SAMPLE_JD = `About the role
CloudWorks is hiring a Data Analyst to partner with product, marketing, and operations teams. You will build SQL dashboards, analyze product funnels, define success metrics, and translate user behavior into business recommendations.

Responsibilities
- Build automated dashboards in SQL and Tableau.
- Partner with stakeholders to define KPIs and diagnose retention issues.
- Present insights to product leaders and recommend experiments.
- Work with data engineers to improve data quality.

Requirements
- Strong SQL and Python skills.
- Experience with product analytics, A/B testing, and dashboarding.
- Clear communication and ownership in ambiguous business problems.
- Nice to have: AWS, Docker, machine learning basics.`;

const sampleAnalysis: JdAnalysis = {
  roleType: 'Data Analytics',
  seniority: 'New Grad / Entry',
  difficultyScore: 72,
  difficultyLabel: '中高',
  summary: '这个岗位是偏业务协作的数据分析岗，简历和面试都要围绕 SQL、Python、Dashboard、Product Analytics 和 Stakeholder Communication 展开。',
  mustHaveSkills: ['SQL', 'Python', 'Dashboard', 'Product Analytics', 'Stakeholder Communication'],
  niceToHaveSkills: ['AWS', 'Docker', 'Machine Learning', 'A/B Testing'],
  responsibilities: [
    'Build automated dashboards in SQL and Tableau.',
    'Partner with stakeholders to define KPIs and diagnose retention issues.',
    'Present insights to product leaders and recommend experiments.',
  ],
  hiddenRequirements: [
    '岗位不只是写 SQL，还要求能把分析结果讲给产品和业务团队。',
    'JD 多次出现指标、漏斗、留存，简历需要体现业务指标意识。',
    'Ambiguous business problems 暗示面试会追问主动推进和需求澄清案例。',
  ],
  resumePreparation: [
    'Summary 第一行直接写 Data Analyst，并放入 SQL / Python / Product Analytics。',
    '经历 bullet 用“工具 + 指标 + 业务结果”的结构重写。',
    '技能区把 SQL、Python、Tableau、A/B Testing 放在靠前位置。',
  ],
  interviewPreparation: [
    '准备一个从业务问题到 dashboard 落地的项目深挖。',
    '准备一个 retention 或 funnel analysis 的指标拆解案例。',
    '准备一个和 PM / stakeholder 协作澄清需求的 STAR 故事。',
  ],
  actionPlan: [
    {
      title: '判断岗位主线',
      detail: '这是产品数据分析岗，投递材料要围绕业务指标和跨团队沟通。',
      priority: '高',
    },
    {
      title: '改简历关键词',
      detail: '把 SQL、Python、Dashboard、Product Analytics 放入 Summary、Skills 和项目 bullet。',
      priority: '高',
    },
    {
      title: '准备面试案例',
      detail: '提前准备 dashboard、A/B test、stakeholder 沟通三类可追问案例。',
      priority: '中',
    },
  ],
  source: 'heuristic',
  schemaVersion: 'jd-analyzer-v1',
};

function scoreColor(score: number) {
  if (score >= 80) return 'text-red-600';
  if (score >= 65) return 'text-amber-600';
  if (score >= 45) return 'text-blue-600';
  return 'text-emerald-600';
}

function listText(items: string[]) {
  return items.filter(Boolean).map((item) => `- ${item}`).join('\n');
}

export default function JDAnalyzer() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [jobTitle, setJobTitle] = useState('Data Analyst');
  const [companyName, setCompanyName] = useState('');
  const [targetRegion, setTargetRegion] = useState('United States');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<JdAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const displayAnalysis = analysis || sampleAnalysis;
  const sourceLabel = displayAnalysis.source === 'ai' ? 'AI 深度解析' : '基础解析';
  const sourceDescription = displayAnalysis.source === 'ai'
    ? '已通过结构化 JSON 校验'
    : displayAnalysis.fallbackReason
      ? 'AI 暂不可用，已自动切换基础解析'
      : '基于规则分析生成';

  const reportText = useMemo(() => [
    `岗位：${companyName ? `${companyName} - ` : ''}${jobTitle || 'Target Role'}`,
    `岗位类型：${displayAnalysis.roleType}`,
    `层级：${displayAnalysis.seniority}`,
    `难度：${displayAnalysis.difficultyLabel} (${displayAnalysis.difficultyScore}/100)`,
    '',
    `摘要：${displayAnalysis.summary}`,
    '',
    '必备技能：',
    listText(displayAnalysis.mustHaveSkills),
    '',
    '隐藏要求：',
    listText(displayAnalysis.hiddenRequirements),
    '',
    '简历准备：',
    listText(displayAnalysis.resumePreparation),
    '',
    '面试准备：',
    listText(displayAnalysis.interviewPreparation),
  ].join('\n'), [companyName, displayAnalysis, jobTitle]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setJobTitle(parsed.jobTitle || 'Data Analyst');
      setCompanyName(parsed.companyName || '');
      setTargetRegion(parsed.targetRegion || 'United States');
      setJobUrl(parsed.jobUrl || '');
      setJobDescription(parsed.jobDescription || '');
      setAnalysis(parsed.analysis || null);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      jobTitle,
      companyName,
      targetRegion,
      jobUrl,
      jobDescription,
      analysis,
    }));
  }, [analysis, companyName, jobDescription, jobTitle, jobUrl, targetRegion]);

  const loadExample = () => {
    setJobTitle('Data Analyst');
    setCompanyName('CloudWorks');
    setTargetRegion('United States');
    setJobUrl('');
    setJobDescription(SAMPLE_JD);
    setAnalysis(sampleAnalysis);
    showToast('已载入示例 JD', 'success');
  };

  const reset = () => {
    setJobTitle('Data Analyst');
    setCompanyName('');
    setTargetRegion('United States');
    setJobUrl('');
    setJobDescription('');
    setAnalysis(null);
    localStorage.removeItem(STORAGE_KEY);
    showToast('已清空 JD 分析工作区', 'success');
  };

  const runAnalysis = async () => {
    if (!jobDescription.trim()) {
      showToast('请先粘贴目标岗位 JD', 'info');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await apiFetch('/api/proxy/jd-analyzer/analyze', {
        method: 'POST',
        body: JSON.stringify({
          job_description: jobDescription,
          job_title: jobTitle,
          company_name: companyName,
          job_url: jobUrl,
          target_region: targetRegion,
        }),
      });
      setAnalysis(response.data);
      showToast(response.data?.source === 'ai' ? 'AI 岗位解析已生成' : '岗位基础解析已生成', 'success');
    } catch (error: any) {
      console.warn('JD Analyzer fallback:', error);
      setAnalysis(sampleAnalysis);
      showToast(error?.message || '岗位解析失败，已显示示例结构', 'info');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyReport = async () => {
    await navigator.clipboard.writeText(reportText);
    showToast('岗位分析报告已复制', 'success');
  };

  const openResumeTailor = () => {
    sessionStorage.setItem('resumeTailorDraft', JSON.stringify({
      jobTitle,
      companyName,
      targetRegion,
      jobUrl,
      jobDescription,
    }));
    navigate('/resume-tailor');
  };

  const saveToApplicationTracker = () => {
    sessionStorage.setItem('applicationTrackerDraft', JSON.stringify({
      jobTitle,
      companyName,
      targetRegion,
      jobUrl,
      jobDescription,
      analysisSummary: displayAnalysis.summary,
      status: 'saved',
      source: 'jd-analyzer',
    }));
    navigate('/application-tracker');
  };

  return (
    <main className="zy-page-shell min-h-screen bg-white pt-28">
      <SEO
        title="JD Analyzer"
        description="粘贴目标岗位 JD，快速解析岗位类型、难度、核心技能、隐藏要求、简历准备和面试准备建议。"
        keywords="JD解析,岗位分析,AI求职,简历匹配,面试准备"
        canonical="https://www.zhiyincareer.com/jd-analyzer"
      />

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-black text-primary">
                <Sparkles className="mr-2 h-4 w-4" />
                JD Analyzer
              </div>
              <h1 className="zy-page-title mt-4 max-w-4xl text-3xl sm:text-5xl">
                先看懂岗位，再决定怎么投
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
                粘贴 JD 后拆解岗位类型、难度、必备技能和隐藏要求，并把分析结果带到简历匹配流程。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['粘贴 JD', '解析要求', '准备简历', '准备面试'].map((step, index) => (
                <span key={step} className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600">
                  {index + 1}. {step}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[400px_minmax(0,1fr)] lg:px-8">
        <aside className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-gray-950">岗位材料</h2>
                <p className="mt-1 text-sm text-gray-500">用于生成岗位判断和准备建议</p>
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

              <label className="block">
                <span className="text-sm font-bold text-gray-800">Job Description</span>
                <textarea
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  rows={14}
                  className="mt-2 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="粘贴完整 JD，包含职责、要求、技能和加分项..."
                />
              </label>

              <button
                type="button"
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-black text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    解析中...
                  </>
                ) : (
                  <>
                    生成岗位解析
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>

              {(jobDescription || analysis) && (
                <button
                  type="button"
                  onClick={reset}
                  className="flex h-10 w-full items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-bold text-gray-700 transition hover:border-primary/30 hover:text-primary"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  重新开始
                </button>
              )}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-gray-400">解析来源</p>
              <p className="mt-1 text-sm font-black text-gray-950">{sourceLabel}</p>
            </div>
            <div className={`inline-flex w-fit items-center rounded-md px-3 py-1 text-xs font-bold ${
              displayAnalysis.source === 'ai'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}>
              {sourceDescription}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">岗位类型</span>
                <BriefcaseBusiness className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 text-2xl font-black text-gray-950">{displayAnalysis.roleType}</p>
              <p className="mt-2 text-sm font-bold text-gray-500">{displayAnalysis.seniority}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">岗位难度</span>
                <Gauge className="h-5 w-5 text-amber-500" />
              </div>
              <div className={`mt-4 text-5xl font-black ${scoreColor(displayAnalysis.difficultyScore)}`}>
                {displayAnalysis.difficultyScore}
                <span className="text-xl text-gray-400">/100</span>
              </div>
              <p className="mt-3 text-sm font-bold text-gray-700">难度等级：{displayAnalysis.difficultyLabel}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">下一步</span>
                <Target className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="mt-4 text-lg font-black leading-7 text-gray-950">
                先把核心技能放进简历，再围绕隐藏要求准备面试案例。
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <h2 className="text-xl font-black text-gray-950">岗位判断</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">{displayAnalysis.summary}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center text-xl font-black text-gray-950">
                <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-600" />
                必备技能
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {displayAnalysis.mustHaveSkills.map((skill) => (
                  <span key={skill} className="rounded-md bg-blue-50 px-3 py-1 text-sm font-bold text-primary">
                    {skill}
                  </span>
                ))}
              </div>

              <h3 className="mt-6 text-sm font-black text-gray-500">加分项</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {displayAnalysis.niceToHaveSkills.map((skill) => (
                  <span key={skill} className="rounded-md bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center text-xl font-black text-gray-950">
                <ShieldAlert className="mr-2 h-5 w-5 text-amber-500" />
                隐藏要求
              </h2>
              <div className="mt-4 space-y-3">
                {displayAnalysis.hiddenRequirements.map((item) => (
                  <div key={item} className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-bold leading-6 text-amber-900">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center text-xl font-black text-gray-950">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                简历准备
              </h2>
              <div className="mt-4 space-y-3">
                {displayAnalysis.resumePreparation.map((item) => (
                  <div key={item} className="flex gap-3 rounded-lg bg-gray-50 px-3 py-2 text-sm leading-6 text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center text-xl font-black text-gray-950">
                <BarChart3 className="mr-2 h-5 w-5 text-indigo-600" />
                面试准备
              </h2>
              <div className="mt-4 space-y-3">
                {displayAnalysis.interviewPreparation.map((item) => (
                  <div key={item} className="flex gap-3 rounded-lg bg-gray-50 px-3 py-2 text-sm leading-6 text-gray-700">
                    <Clipboard className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-gray-950">行动顺序</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {displayAnalysis.actionPlan.map((item) => (
                <div key={item.title} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-black text-gray-950">{item.title}</h3>
                    <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-primary">{item.priority}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openResumeTailor}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-black text-white transition hover:bg-primary-hover"
              >
                用我的简历匹配这个岗位
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={saveToApplicationTracker}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-200 px-5 text-sm font-bold text-gray-800 transition hover:border-primary/30 hover:text-primary"
              >
                <BriefcaseBusiness className="mr-2 h-4 w-4" />
                保存到投递追踪
              </button>
              <button
                type="button"
                onClick={copyReport}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-200 px-5 text-sm font-bold text-gray-800 transition hover:border-primary/30 hover:text-primary"
              >
                <Copy className="mr-2 h-4 w-4" />
                复制报告
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
