import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Bot, Briefcase, Building2, ChevronRight, Globe, MapPin, MessageSquare, Search, Star, TrendingUp, Users } from 'lucide-react';

import SEO from '../components/SEO';
import { apiFetch } from '../lib/api';

type CompanyDetailData = {
  id: string | number;
  name: string;
  logo?: string;
  logoUrl?: string;
  industry?: string;
  headquarters?: string;
  websiteUrl?: string;
  size?: string;
  description?: string;
  jobCount?: number;
  experienceCount?: number;
  salaryCount?: number;
  jobs?: any[];
  experiences?: any[];
  salaries?: any[];
};

const fallbackCompany: CompanyDetailData = {
  id: 'fallback',
  name: 'Company',
  industry: '科技/互联网',
  headquarters: 'Global',
  websiteUrl: 'https://www.zhiyincareer.com/jobs',
  size: '信息待补充',
  description: '公司信息正在同步中。你可以先查看相关职位、面经和薪资样例。',
  jobs: [],
  experiences: [],
  salaries: [],
};

const normalizeUrl = (url?: string) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
};

const normalizeCompany = (data: any): CompanyDetailData => ({
  ...fallbackCompany,
  ...data,
  id: data?.id || data?.companyId || data?.name || fallbackCompany.id,
  name: data?.displayName || data?.name || data?.nameEn || fallbackCompany.name,
  logoUrl: data?.logoUrl || data?.logo || data?.companyLogo,
  industry: data?.industry || data?.industryL1 || fallbackCompany.industry,
  headquarters: data?.headquarters || data?.hqCity || data?.hqCountry || data?.location || fallbackCompany.headquarters,
  websiteUrl: data?.websiteUrl || data?.website || data?.url,
  description: data?.description || data?.intro || data?.summary || fallbackCompany.description,
  jobs: Array.isArray(data?.jobs) ? data.jobs : [],
  experiences: Array.isArray(data?.experiences) ? data.experiences : [],
  salaries: Array.isArray(data?.salaries) ? data.salaries : [],
});

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<CompanyDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'jobs' | 'experiences' | 'salaries'>('about');

  useEffect(() => {
    let cancelled = false;
    const fetchCompany = async () => {
      setIsLoading(true);
      try {
        if (!id) throw new Error('Missing company id');
        const response = await apiFetch(`/api/proxy/companies/${id}`);
        const baseCompany = normalizeCompany(response.data || fallbackCompany);
        const keyword = baseCompany.name === fallbackCompany.name ? String(id) : baseCompany.name;
        const [jobsResult, experiencesResult, salariesResult] = await Promise.allSettled([
          apiFetch(`/api/proxy/jobs?keyword=${encodeURIComponent(keyword)}&page=1&pageSize=6`),
          apiFetch(`/api/proxy/experiences?keyword=${encodeURIComponent(keyword)}&page=1&pageSize=6`),
          apiFetch(`/api/proxy/salaries?company=${encodeURIComponent(keyword)}&page=1&pageSize=6`),
        ]);
        if (!cancelled) {
          setCompany({
            ...baseCompany,
            jobs: baseCompany.jobs?.length ? baseCompany.jobs : jobsResult.status === 'fulfilled' ? jobsResult.value.data?.list || [] : [],
            experiences: baseCompany.experiences?.length ? baseCompany.experiences : experiencesResult.status === 'fulfilled' ? experiencesResult.value.data?.list || [] : [],
            salaries: baseCompany.salaries?.length ? baseCompany.salaries : salariesResult.status === 'fulfilled' ? salariesResult.value.data?.list || [] : [],
          });
        }
      } catch (error) {
        console.warn('Company detail fallback:', error);
        if (!cancelled) setCompany(normalizeCompany(fallbackCompany));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchCompany();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-24 pb-12 bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </main>
    );
  }

  if (!company) {
    return <main className="min-h-screen pt-24 text-center">未找到公司信息</main>;
  }

  const website = normalizeUrl(company.websiteUrl);
  const jobs = company.jobs || [];
  const experiences = company.experiences || [];
  const salaries = company.salaries || [];
  const companyQuery = encodeURIComponent(company.name);

  const startCompanyInterview = () => {
    navigate('/ai-interview', {
      state: {
        company: company.name,
        role: jobs[0]?.title || jobs[0]?.jobTitle || 'Software Engineer',
        jd: `${company.name} 公司背景：${company.description || ''}\n目标岗位：${jobs[0]?.title || jobs[0]?.jobTitle || '通用岗位'}\n请围绕公司业务、岗位要求和常见行为面试进行模拟。`,
      },
    });
  };

  return (
    <main className="min-h-screen pt-24 pb-12 bg-gray-50">
      <SEO
        title={`${company.name} 公司详情`}
        description={`查看 ${company.name} 的公司介绍、在招职位、面经和薪资参考。`}
        canonical={`https://www.zhiyincareer.com/companies/${id || ''}`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border border-primary/10">
              {company.logoUrl || company.logo ? (
                <img src={company.logoUrl || company.logo} alt={company.name} className="w-full h-full object-contain p-3" />
              ) : (
                <span className="text-4xl font-bold text-primary">{company.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-gray-900 mb-2">{company.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center"><Building2 className="w-4 h-4 mr-1" /> {company.industry || '行业待补充'}</span>
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {company.headquarters || '地点待补充'}</span>
                <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {company.size || '规模待补充'}</span>
                <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-400" /> 数据已接入</span>
              </div>
              {website && (
                <a href={website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:text-primary-hover text-sm font-medium">
                  <Globe className="w-4 h-4 mr-1" /> 访问官网
                </a>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to={`/jobs?keyword=${companyQuery}`} className="inline-flex items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
                  <Briefcase className="mr-2 h-4 w-4" />
                  查看相关职位
                </Link>
                <button onClick={startCompanyInterview} className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary/40 hover:text-primary">
                  <Bot className="mr-2 h-4 w-4" />
                  公司模拟面试
                </button>
                <Link to={`/search?q=${companyQuery}`} className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary/40 hover:text-primary">
                  <Search className="mr-2 h-4 w-4" />
                  全站搜索
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
              {[
                ['职位', company.jobCount ?? jobs.length, Briefcase],
                ['面经', company.experienceCount ?? experiences.length, MessageSquare],
                ['薪资', company.salaryCount ?? salaries.length, TrendingUp],
              ].map(([label, value, Icon]) => (
                <div key={label as string} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-center min-w-20">
                  {React.createElement(Icon as typeof Briefcase, { className: 'w-4 h-4 mx-auto mb-1 text-primary' })}
                  <div className="text-lg font-black text-gray-900">{value as number}</div>
                  <div className="text-xs text-gray-500">{label as string}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {[
              ['about', '公司介绍'],
              ['jobs', `在招职位 (${jobs.length})`],
              ['experiences', `笔经面经 (${experiences.length})`],
              ['salaries', `薪资参考 (${salaries.length})`],
            ].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`flex-1 min-w-32 py-4 text-sm font-medium text-center transition-colors ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'about' && (
              <div className="max-w-3xl text-gray-600">
                <h2 className="text-lg font-bold text-gray-900 mb-4">关于 {company.name}</h2>
                <p className="leading-relaxed">{company.description || '暂无公司介绍。'}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ['职位机会', `${company.name} 当前聚合 ${jobs.length} 个岗位线索`],
                    ['面试准备', experiences.length ? '可结合真实面经准备轮次问题' : '暂无面经时可先用 AI 生成模拟题'],
                    ['薪资参考', salaries.length ? '已聚合薪资样本用于谈薪参考' : '可前往薪资查询页按岗位检索'],
                  ].map(([title, desc]) => (
                    <div key={title} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="font-bold text-gray-900">{title}</div>
                      <p className="mt-1 text-sm leading-6 text-gray-500">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="space-y-4">
                {jobs.map((job: any) => (
                  <Link key={job.id || job.jobId} to={`/jobs/${job.id || job.jobId}`} className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-100">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{job.title || job.jobTitle || '职位'}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {job.location || job.jobCity || '地点待定'}</span>
                          <span className="flex items-center"><Briefcase className="w-3.5 h-3.5 mr-1" /> {job.type || job.jobType || '职位类型待定'}</span>
                        </div>
                      </div>
                      <span className="text-primary flex items-center text-sm font-medium whitespace-nowrap">
                        查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </Link>
                ))}
                {!jobs.length && (
                  <div className="text-center text-gray-500 py-8">
                    <Briefcase className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                    <p>暂无在招职位</p>
                    <Link to={`/jobs?keyword=${companyQuery}`} className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">去职位页继续搜索</Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'experiences' && (
              <div className="space-y-4">
                {experiences.map((experience: any) => (
                  <Link key={experience.id} to="/interview-experiences" className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-2">{experience.title || `${experience.position || ''} 面经`}</h3>
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        {[experience.position, experience.round, experience.type].filter(Boolean).map((tag: string) => (
                          <span key={tag} className="px-2 py-1 bg-white rounded-md text-xs font-medium text-gray-600 border border-gray-200">{tag}</span>
                        ))}
                      </div>
                      <span>{experience.createdAt ? new Date(experience.createdAt).toLocaleDateString() : '近期'}</span>
                    </div>
                  </Link>
                ))}
                {!experiences.length && (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                    <p>暂无面经分享</p>
                    <button onClick={startCompanyInterview} className="mt-3 text-sm font-semibold text-primary hover:underline">先用 AI 生成公司模拟面试</button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'salaries' && (
              <div className="space-y-4">
                {salaries.map((salary: any, index: number) => (
                  <div key={`${salary.position}-${index}`} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{salary.position || '岗位'}</h3>
                      <p className="text-sm text-gray-500 mt-1">{salary.samples || 0} 条样本 · {salary.currency || ''}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-primary">{salary.avgSalary ? Number(salary.avgSalary).toLocaleString() : 'N/A'}</div>
                      <div className="text-xs text-gray-500">{salary.range || '区间待补充'}</div>
                    </div>
                  </div>
                ))}
                {!salaries.length && (
                  <div className="text-center text-gray-500 py-8">
                    <TrendingUp className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                    <p>暂无薪资样本</p>
                    <Link to={`/salary-insights?company=${companyQuery}`} className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">去薪资查询页检索</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
