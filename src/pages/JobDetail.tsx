import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Share2,
  Sparkles,
} from 'lucide-react';

import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';
import { useFavorites } from '../utils/favorites';

type JobDetailData = {
  id: number;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary?: string;
  jobType?: string;
  industry?: string;
  requirements?: string[];
  visaSponsored?: boolean;
  postedAt?: string;
  description?: string;
  applyUrl?: string;
};

const fallbackAnalysis = {
  score: 84,
  matched: ['React', 'TypeScript', '项目协作', '英文沟通'],
  gaps: ['系统设计', '云服务经验', '复杂业务指标量化'],
  suggestions: [
    '简历中优先突出和岗位 JD 对应的技术栈，尤其是可量化的性能优化、业务增长或工程效率指标。',
    '面试前准备 2 个 STAR 案例，覆盖跨团队协作、处理不确定需求和技术难点拆解。',
    '如果岗位提到云平台或分布式系统，可以提前准备一个小型架构设计案例作为补充。',
  ],
};

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const normalizeJob = (data: any): JobDetailData => ({
  id: Number(data.id),
  title: data.title || '',
  company: data.company || '',
  companyLogo: data.companyLogo || data.logo || '',
  location: data.location || '',
  salary: data.salary || '',
  jobType: data.jobType || data.type || '全职',
  industry: data.industry || '',
  requirements: data.requirements || data.tags || [],
  visaSponsored: Boolean(data.visaSponsored),
  postedAt: data.postedAt || '',
  description: data.description || '',
  applyUrl: data.applyUrl || data.url || '',
});

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [job, setJob] = useState<JobDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchJob = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');
      try {
        const response = await apiFetch(`/api/proxy/jobs/${id}`);
        if (!cancelled && response.code === 0 && response.data) {
          setJob(normalizeJob(response.data));
        } else if (!cancelled) {
          setErrorMessage(response.message || '职位数据暂时不可用。');
        }
      } catch (error) {
        console.error('Failed to fetch job:', error);
        if (!cancelled) setErrorMessage('职位详情加载失败，请稍后重试。');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchJob();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const plainDescription = useMemo(() => stripHtml(job?.description).slice(0, 600), [job?.description]);

  const jsonLd = job
    ? {
        '@context': 'https://schema.org/',
        '@type': 'JobPosting',
        title: job.title,
        description: plainDescription || `${job.company} 正在招聘 ${job.title}`,
        datePosted: job.postedAt || undefined,
        hiringOrganization: {
          '@type': 'Organization',
          name: job.company,
          ...(job.companyLogo?.startsWith('http') ? { logo: job.companyLogo } : {}),
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.location,
          },
        },
        employmentType: job.jobType === '实习' ? 'INTERN' : job.jobType === '兼职' ? 'PART_TIME' : 'FULL_TIME',
        industry: job.industry,
        url: `https://www.zhiyincareer.com/jobs/${job.id}`,
      }
    : undefined;

  const startInterview = () => {
    if (!job) return;
    navigate('/ai-interview', {
      state: {
        role: job.title,
        company: job.company,
        jd: job.description,
      },
    });
  };

  const optimizeResume = () => {
    if (!job) return;
    navigate('/my-resume/new', {
      state: {
        role: job.title,
        jd: job.description || `${job.company} ${job.title} ${job.location}`,
      },
    });
  };

  const shareJob = async () => {
    if (!job) return;
    const shareUrl = `https://www.zhiyincareer.com/jobs/${job.id}`;
    const shareText = `${job.company} 正在招聘 ${job.title}：${shareUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: `${job.title} - ${job.company}`, text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareText);
        showToast('职位链接已复制', 'success');
      }
    } catch (error) {
      if ((error as Error)?.name !== 'AbortError') {
        await navigator.clipboard.writeText(shareText).catch(() => undefined);
        showToast('职位链接已复制', 'success');
      }
    }
  };

  const trackApplicationAndOpen = async () => {
    if (!job?.applyUrl) return;
    if (!isAuthenticated) {
      openAuthModal('login');
      showToast('请先登录，再记录投递进度。', 'info');
      return;
    }

    setIsApplying(true);
    try {
      await apiFetch('/api/proxy/applications', {
        method: 'POST',
        body: JSON.stringify({
          jobId: job.id,
          jobSnapshot: {
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            applyUrl: job.applyUrl,
          },
        }),
      });
      showToast('已记录投递，正在打开官网。', 'success');
    } catch (error) {
      console.warn('Failed to create application record:', error);
      showToast(error instanceof Error ? error.message : '投递记录保存失败，仍会打开官网。', 'error');
    } finally {
      setIsApplying(false);
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-24 pb-16 bg-gray-50 flex items-center justify-center">
        <div className="text-sm font-medium text-gray-500">职位详情加载中...</div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen pt-24 pb-16 bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center max-w-md">
          <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">职位不存在或已下线</h1>
          <p className="text-gray-500 text-sm mb-6">{errorMessage || '可以返回职位列表继续查看其他机会。'}</p>
          <Link to="/jobs" className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold">
            返回职位列表
          </Link>
        </div>
      </main>
    );
  }

  const metaTitle = `${job.title} - ${job.company}${job.location ? ` | ${job.location}` : ''}`;
  const metaDescription = `${job.company} 正在招聘 ${job.title}${job.location ? `，地点：${job.location}` : ''}${job.salary ? `，薪资：${job.salary}` : ''}。职引为留学生整理职位详情、投递入口和面试准备建议。`;
  const jobId = Number(job.id);

  return (
    <>
      <SEO
        title={metaTitle}
        description={metaDescription}
        keywords={`${job.title},${job.company},${job.location},留学生求职,海归招聘,校招职位`}
        canonical={`https://www.zhiyincareer.com/jobs/${job.id}`}
        jsonLd={jsonLd}
      />
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary transition-colors mb-6 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回上一页
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-6">
                  <div className="flex items-start gap-5 min-w-0">
                    <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary shrink-0 overflow-hidden">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.company} className="w-12 h-12 object-contain" />
                      ) : (
                        job.company.charAt(0) || '?'
                      )}
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-2xl sm:text-3xl font-black text-deep mb-2">{job.title}</h1>
                      <div className="flex flex-wrap items-center text-gray-600 text-sm gap-4">
                        <span className="flex items-center font-medium text-gray-900"><Building2 className="w-4 h-4 mr-1.5 text-gray-400" />{job.company}</span>
                        {job.location && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-gray-400" />{job.location}</span>}
                        {job.salary && <span className="font-bold text-green-600">{job.salary}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={shareJob} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors" aria-label="分享职位">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleFavorite(jobId, { title: job.title, subtitle: job.company })}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isFavorite(jobId) ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-500 hover:text-primary hover:bg-primary/10'
                      }`}
                      aria-label={isFavorite(jobId) ? '取消收藏' : '收藏职位'}
                    >
                      {isFavorite(jobId) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.jobType && <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{job.jobType}</span>}
                  {job.industry && <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">{job.industry}</span>}
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                    {job.visaSponsored ? '支持签证' : '身份要求以官网为准'}
                  </span>
                  {job.postedAt && <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm flex items-center"><Clock className="w-4 h-4 mr-1.5" />{job.postedAt}</span>}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={trackApplicationAndOpen}
                    disabled={!job.applyUrl || isApplying}
                    className={`flex-1 py-3 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center ${
                      job.applyUrl ? 'bg-primary hover:bg-primary-hover text-white disabled:bg-primary/60' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isApplying ? '正在记录投递...' : '记录投递并打开官网'}
                    <ExternalLink className="w-4 h-4 ml-2 opacity-80" />
                  </button>
                  <button onClick={startInterview} className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 py-3 rounded-xl font-bold transition-colors flex items-center justify-center">
                    <Bot className="w-5 h-5 mr-2" />
                    用此 JD 模拟面试
                  </button>
                  <button onClick={optimizeResume} className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-3 rounded-xl font-bold transition-colors flex items-center justify-center">
                    <Sparkles className="w-5 h-5 mr-2 text-primary" />
                    用此 JD 优化简历
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-deep mb-6">职位描述</h2>
                {job.description ? (
                  <div className="prose prose-gray max-w-none prose-li:text-gray-600 prose-p:text-gray-600" dangerouslySetInnerHTML={{ __html: job.description }} />
                ) : (
                  <p className="text-gray-500">该职位暂未提供详细 JD，请以前往官网后的信息为准。</p>
                )}
              </div>
            </section>

            <aside className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-deep flex items-center mb-3">
                  <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
                  AI JD 匹配分析
                </h3>
                <p className="text-sm text-gray-500 mb-5">提取岗位要求，生成简历优化和面试准备建议。</p>
                {!showAnalysis ? (
                  <button onClick={() => setShowAnalysis(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors">
                    一键分析匹配度
                  </button>
                ) : (
                  <div className="space-y-5">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">简历匹配度</span>
                      <span className="text-3xl font-black text-primary">{fallbackAnalysis.score}%</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2">匹配优势</h4>
                      <div className="flex flex-wrap gap-2">
                        {fallbackAnalysis.matched.map((skill) => (
                          <span key={skill} className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2">建议补强</h4>
                      <div className="flex flex-wrap gap-2">
                        {fallbackAnalysis.gaps.map((skill) => (
                          <span key={skill} className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {fallbackAnalysis.suggestions.map((item) => (
                        <li key={item} className="text-sm text-gray-600 leading-relaxed flex">
                          <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="grid grid-cols-1 gap-2">
                      <button onClick={optimizeResume} className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-sm font-bold transition-colors">
                        按该 JD 优化简历
                      </button>
                      <button onClick={startInterview} className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 py-2.5 rounded-xl text-sm font-bold transition-colors">
                        进入模拟面试
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-deep mb-4">公司信息</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-xl font-bold text-primary shrink-0 overflow-hidden">
                    {job.companyLogo ? <img src={job.companyLogo} alt={job.company} className="w-9 h-9 object-contain" /> : job.company.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{job.company}</div>
                    <Link to={`/search?q=${encodeURIComponent(job.company)}`} className="text-sm text-primary hover:underline">查看相关内容</Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 mb-1">行业</div>
                    <div className="font-medium text-gray-900">{job.industry || '待补充'}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 mb-1">地点</div>
                    <div className="font-medium text-gray-900">{job.location || '待补充'}</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
