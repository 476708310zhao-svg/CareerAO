import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clipboard,
  Download,
  FileText,
  History,
  Loader2,
  Printer,
  Save,
  Sparkles,
  Target,
  Trash2,
  UploadCloud,
  Wand2,
} from 'lucide-react';

import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';
import { API_BASE, apiFetch } from '../lib/api';

type ResumeTailorReport = {
  schemaVersion?: string;
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

type SavedRecord = {
  id: string;
  resumeName: string;
  jobTitle: string;
  companyName: string;
  targetRegion: string;
  resumeText: string;
  jobDescription: string;
  report: ResumeTailorReport;
  createdAt: string;
};

const STORAGE_KEY = 'zhiyin_resume_tailor_records_v1';

const sampleResume = `Data Analyst with 3 years of experience building SQL dashboards and reporting automation for operations teams.

- Built executive KPI dashboards in Tableau and SQL, reducing weekly reporting time by 60%.
- Partnered with product and finance stakeholders to define metrics, investigate funnel changes, and present insights.
- Automated data quality checks in Python and improved recurring analysis reliability across multiple business units.`;

const sampleJd = `We are hiring a Data Analyst to support growth and product analytics. The role requires strong SQL, Python, dashboarding, stakeholder communication, experimentation, data visualization, and the ability to translate business questions into insights. Experience with Tableau, A/B testing, product metrics, and cloud data warehouses is preferred.`;

const scoreTone = (score: number) => {
  if (score >= 82) return 'text-emerald-600';
  if (score >= 65) return 'text-blue-600';
  return 'text-amber-600';
};

const sourceLabel = (report: ResumeTailorReport) => {
  if (report.source === 'ai') return 'AI 深度分析';
  if (report.fallbackReason === 'ai_not_configured') return '基础规则分析 · AI 未配置';
  if (report.fallbackReason && report.fallbackReason !== 'ai_disabled') return '基础规则分析 · AI 已回退';
  return '基础规则分析';
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

const safeFileName = (value: string) =>
  (value || 'resume-tailor')
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .slice(0, 80);

export default function ResumeTailor() {
  const { showToast } = useToast();
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [targetRegion, setTargetRegion] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [report, setReport] = useState<ResumeTailorReport | null>(null);
  const [records, setRecords] = useState<SavedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parseError, setParseError] = useState('');

  const canAnalyze = resumeText.trim().length >= 80 && jobDescription.trim().length >= 80 && !isLoading && !isParsingResume;
  const scoreDelta = useMemo(() => (report ? Math.max(0, report.optimizedScore - report.currentScore) : 0), [report]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setRecords(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const persistRecords = (nextRecords: SavedRecord[]) => {
    const limited = nextRecords.slice(0, 8);
    setRecords(limited);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  };

  const loadSample = () => {
    setResumeText(sampleResume);
    setJobDescription(sampleJd);
    setJobTitle('Data Analyst');
    setCompanyName('GrowthWorks');
    setTargetRegion('US');
    setResumeName('sample-resume.txt');
    setReport(null);
    setParseError('');
  };

  const parseResumeFile = async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);

    setIsParsingResume(true);
    setParseError('');
    try {
      const response = await fetch(`${API_BASE}/api/proxy/resume-tailor/parse-resume`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '解析失败，请换一个文件或手动粘贴简历正文');

      const parsed = data as ParsedResumeFile;
      setResumeText(parsed.resume_text);
      setResumeName(parsed.resume_name);
      setReport(null);
      showToast(`已解析 ${parsed.file_type.toUpperCase()} 简历，共 ${parsed.char_count} 字符`);
    } catch (error: any) {
      const message = error.message || '解析失败，请换一个文件或手动粘贴简历正文';
      setParseError(message);
      showToast(message, 'error');
    } finally {
      setIsParsingResume(false);
    }
  };

  const analyze = async () => {
    if (!canAnalyze) {
      showToast('请至少填写 80 字以上的简历和 JD 内容', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiFetch('/api/proxy/resume-tailor/analyze', {
        method: 'POST',
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
          job_title: jobTitle,
          company_name: companyName,
          target_region: targetRegion,
        }),
      });
      setReport(data);
      showToast('ATS 匹配报告已生成');
    } catch (error: any) {
      showToast(error.message || '生成失败，请稍后重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyOptimizedResume = async () => {
    if (!report?.optimizedResume) return;
    await navigator.clipboard.writeText(report.optimizedResume);
    showToast('优化版简历已复制');
  };

  const saveRecord = () => {
    if (!report) {
      showToast('请先生成报告再保存版本', 'info');
      return;
    }

    const record: SavedRecord = {
      id: `${Date.now()}`,
      resumeName: resumeName || '手动粘贴简历',
      jobTitle: jobTitle || '目标岗位',
      companyName,
      targetRegion,
      resumeText,
      jobDescription,
      report,
      createdAt: new Date().toISOString(),
    };

    persistRecords([record, ...records.filter((item) => item.id !== record.id)]);
    showToast('版本已保存到本地历史');
  };

  const restoreRecord = (record: SavedRecord) => {
    setResumeName(record.resumeName);
    setJobTitle(record.jobTitle);
    setCompanyName(record.companyName);
    setTargetRegion(record.targetRegion);
    setResumeText(record.resumeText);
    setJobDescription(record.jobDescription);
    setReport(record.report);
    setParseError('');
    showToast('已恢复历史版本');
  };

  const deleteRecord = (id: string) => {
    persistRecords(records.filter((record) => record.id !== id));
    showToast('历史版本已删除');
  };

  const downloadOptimizedResume = () => {
    if (!report?.optimizedResume) return;
    const blob = new Blob([report.optimizedResume], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeFileName(`${companyName || 'company'}-${jobTitle || 'resume'}`)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printOptimizedResume = () => {
    if (!report?.optimizedResume) return;
    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
      showToast('浏览器阻止了打印窗口，请允许弹窗后重试', 'error');
      return;
    }

    const escaped = report.optimizedResume
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    printWindow.document.write(`
      <html>
        <head>
          <title>${jobTitle || 'Optimized Resume'}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.55; padding: 40px; color: #111827; }
            h1 { font-size: 20px; margin-bottom: 8px; }
            .meta { color: #6b7280; font-size: 12px; margin-bottom: 24px; }
            pre { white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 13px; }
          </style>
        </head>
        <body>
          <h1>${jobTitle || 'Optimized Resume'}</h1>
          <div class="meta">${companyName || 'Target Company'} · ATS ${report.currentScore} -> ${report.optimizedScore}</div>
          <pre>${escaped}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      <SEO
        title="AI 简历优化"
        description="职引 AI 简历优化支持上传 TXT、PDF、DOCX 简历，结合目标 JD 生成 ATS 匹配分、关键词缺口、优化建议和英文简历草稿。"
        keywords="AI简历优化,ATS匹配,简历改写,JD匹配,留学生求职"
        canonical="https://www.zhiyincareer.com/resume-tailor"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Resume Tailor
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              把简历改到更匹配目标岗位
            </h1>
            <p className="text-gray-600 max-w-2xl leading-relaxed">
              上传或粘贴简历，再粘贴目标 JD，生成 ATS 匹配分、关键词缺口、Gap Analysis、优化建议和可导出的英文简历草稿。
            </p>
          </div>
          <button
            onClick={loadSample}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            载入示例
          </button>
        </section>

        <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-6 items-start">
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">目标岗位</span>
                <input
                  value={jobTitle}
                  onChange={(event) => setJobTitle(event.target.value)}
                  placeholder="Data Analyst"
                  className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">目标公司</span>
                <input
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="GrowthWorks"
                  className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </label>
            </div>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">目标地区</span>
              <input
                value={targetRegion}
                onChange={(event) => setTargetRegion(event.target.value)}
                placeholder="US / Canada / Singapore"
                className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </label>

            <div className="mb-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-sm font-medium text-gray-700">上传简历文件</span>
                {resumeName && <span className="text-xs text-gray-500 truncate max-w-[220px]">{resumeName}</span>}
              </div>
              <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-5 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                {isParsingResume ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
                ) : (
                  <UploadCloud className="w-6 h-6 text-primary mb-2" />
                )}
                <span className="text-sm font-medium text-deep">
                  {isParsingResume ? '正在解析简历文件' : '上传 TXT / PDF / DOCX 简历'}
                </span>
                <span className="text-xs text-gray-500 mt-1">文件大小不超过 5MB，解析成功后会自动回填正文</span>
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  className="hidden"
                  disabled={isParsingResume}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void parseResumeFile(file);
                    event.currentTarget.value = '';
                  }}
                />
              </label>
              {parseError && <p className="text-xs text-red-600 mt-2">{parseError}</p>}
            </div>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">简历正文</span>
              <textarea
                value={resumeText}
                onChange={(event) => {
                  setResumeText(event.target.value);
                  if (parseError) setParseError('');
                }}
                placeholder="粘贴英文简历正文、项目经历或 bullet points"
                className="mt-2 w-full min-h-[220px] rounded-xl border border-gray-200 p-4 text-sm leading-6 outline-none resize-y focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Job Description</span>
              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="粘贴目标岗位 JD"
                className="mt-2 w-full min-h-[220px] rounded-xl border border-gray-200 p-4 text-sm leading-6 outline-none resize-y focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </label>

            <button
              onClick={analyze}
              disabled={!canAnalyze}
              className="mt-5 w-full inline-flex items-center justify-center h-12 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Wand2 className="w-5 h-5 mr-2" />}
              生成 ATS 匹配报告
            </button>
          </section>

          <section className="space-y-5">
            {!report ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-deep mb-2">等待生成匹配报告</h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  报告会展示当前匹配分、优化后预估分、关键词覆盖和可直接复制的英文简历改写方向。
                </p>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">报告来源：{sourceLabel(report)}</p>
                      {report.fallbackReason && report.fallbackReason !== 'ai_disabled' && (
                        <p className="text-xs text-amber-600 mb-1">fallback: {report.fallbackReason}</p>
                      )}
                      <h2 className="text-2xl font-bold text-deep">{report.level}</h2>
                    </div>
                    <div className="flex items-center gap-5">
                      <div>
                        <div className={`text-4xl font-bold ${scoreTone(report.currentScore)}`}>{report.currentScore}</div>
                        <div className="text-xs text-gray-500">当前分</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300" />
                      <div>
                        <div className="text-4xl font-bold text-emerald-600">{report.optimizedScore}</div>
                        <div className="text-xs text-gray-500">优化后 +{scoreDelta}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {report.dimensions.map((item) => (
                      <div key={item.name}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-gray-700">{item.name}</span>
                          <span className="text-gray-500">{item.score}</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${item.score}%` }} />
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-5">
                  <KeywordPanel title="已匹配关键词" tone="green" icon={<CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" />} items={report.matchedKeywords} emptyText="待补充" />
                  <KeywordPanel title="建议补强关键词" tone="amber" icon={<Briefcase className="w-5 h-5 text-amber-500 mr-2" />} items={report.missingKeywords} emptyText="暂无明显缺口" />
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-bold text-deep mb-4">Gap Analysis</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <BulletList title="优势" items={report.strengths} color="bg-emerald-500" />
                    <BulletList title="缺口" items={report.gaps} color="bg-amber-500" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-bold text-deep mb-4">优化建议</h3>
                  <div className="space-y-3">
                    {report.suggestions.map((item, index) => (
                      <div key={item} className="flex gap-3 text-sm text-gray-700">
                        <span className="w-6 h-6 rounded-full bg-blue-50 text-primary flex items-center justify-center text-xs font-bold shrink-0">{index + 1}</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h3 className="font-bold text-deep">优化版英文简历草稿</h3>
                    <div className="flex flex-wrap gap-2">
                      <ActionButton onClick={copyOptimizedResume} icon={<Clipboard className="w-4 h-4" />} label="复制" />
                      <ActionButton onClick={downloadOptimizedResume} icon={<Download className="w-4 h-4" />} label="下载 TXT" />
                      <ActionButton onClick={printOptimizedResume} icon={<Printer className="w-4 h-4" />} label="打印 PDF" />
                      <ActionButton onClick={saveRecord} icon={<Save className="w-4 h-4" />} label="保存版本" />
                    </div>
                  </div>
                  <pre className="whitespace-pre-wrap rounded-xl bg-gray-950 text-gray-100 text-sm leading-6 p-4 overflow-auto max-h-[420px]">
                    {report.optimizedResume}
                  </pre>
                </div>
              </>
            )}

            {records.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-deep mb-4 flex items-center">
                  <History className="w-5 h-5 mr-2 text-primary" />
                  本地历史版本
                </h3>
                <div className="space-y-3">
                  {records.map((record) => (
                    <div key={record.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3">
                      <button onClick={() => restoreRecord(record)} className="min-w-0 flex-1 text-left">
                        <p className="font-medium text-sm text-gray-900 truncate">{record.jobTitle} {record.companyName ? `· ${record.companyName}` : ''}</p>
                        <p className="text-xs text-gray-500 mt-1">ATS {record.report.currentScore} / {record.report.optimizedScore} · {formatDate(record.createdAt)}</p>
                      </button>
                      <button onClick={() => deleteRecord(record.id)} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function KeywordPanel({
  title,
  tone,
  icon,
  items,
  emptyText,
}: {
  title: string;
  tone: 'green' | 'amber';
  icon: React.ReactNode;
  items: string[];
  emptyText: string;
}) {
  const colorClass = tone === 'green' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700';
  const content = items.length ? items : [emptyText];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-deep mb-4 flex items-center">
        {icon}
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {content.map((keyword) => (
          <span key={keyword} className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

function BulletList({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{title}</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-gray-600 flex">
            <span className={`w-1.5 h-1.5 rounded-full ${color} mt-2 mr-2 shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActionButton({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
    >
      {icon}
      {label}
    </button>
  );
}
