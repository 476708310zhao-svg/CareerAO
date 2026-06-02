import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  FileEdit,
  FileText,
  Filter,
  HelpCircle,
  LineChart,
  MapPinned,
  Newspaper,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';

import FeatureShowcase from '../components/FeatureShowcase';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';

type RecommendedJob = {
  id: number | string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  salary: string;
  type: string;
  matchScore: number;
};

type ResourceModule = {
  key: string;
  title: string;
  endpoint: string;
  description: string;
};

const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '职引',
    url: 'https://www.zhiyincareer.com/',
    logo: 'https://www.zhiyincareer.com/favicon.svg',
    description: '面向留学生的一站式求职平台，提供职位搜索、AI 面试、校招日历、薪资查询、简历优化和求职规划。',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '职引',
    url: 'https://www.zhiyincareer.com/',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.zhiyincareer.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },
];

const features = [
  {
    icon: <Send className="w-6 h-6 text-blue-600" />,
    bg: 'bg-blue-50',
    title: '网申助手',
    description: '根据岗位 JD 生成网申回答、岗位匹配度分析和投递建议。',
  },
  {
    icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
    bg: 'bg-indigo-50',
    title: '笔经面经',
    description: '按公司、岗位和轮次整理真实面试经验，沉淀高频考点。',
  },
  {
    icon: <Bot className="w-6 h-6 text-purple-600" />,
    bg: 'bg-purple-50',
    title: 'AI 面试',
    description: '模拟行为面、技术面和 Case 面，给出追问、评分和改进建议。',
  },
  {
    icon: <LineChart className="w-6 h-6 text-emerald-600" />,
    bg: 'bg-emerald-50',
    title: '薪资查询',
    description: '结合岗位、地区和经验查看薪资区间，辅助 Offer 判断。',
  },
  {
    icon: <FileEdit className="w-6 h-6 text-amber-600" />,
    bg: 'bg-amber-50',
    title: '简历优化',
    description: '按目标岗位优化简历表达，输出可直接替换的改写建议。',
  },
  {
    icon: <Target className="w-6 h-6 text-rose-600" />,
    bg: 'bg-rose-50',
    title: '求职规划',
    description: '生成 3 / 6 / 12 个月行动路线，覆盖技能、项目、简历和面试。',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-cyan-600" />,
    bg: 'bg-cyan-50',
    title: '机构测评',
    description: '整理求职机构评价、风险提示和服务对比，降低信息差。',
  },
  {
    icon: <Calendar className="w-6 h-6 text-orange-600" />,
    bg: 'bg-orange-50',
    title: '校招日历',
    description: '追踪秋招、春招、暑期实习和网申截止时间。',
  },
];

const fallbackJobs: RecommendedJob[] = [
  {
    id: 1,
    title: 'Software Engineer, New Grad 2026',
    company: 'Google',
    logo: 'https://cdn.brandfetch.io/google.com/w/128/h/128/theme/light/icon',
    location: 'Mountain View, CA',
    salary: '$130k - $180k',
    type: '全职',
    matchScore: 98,
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'ByteDance',
    logo: 'https://cdn.brandfetch.io/bytedance.com/w/128/h/128/theme/light/icon',
    location: 'San Jose, CA',
    salary: '$150k - $200k',
    type: '全职',
    matchScore: 92,
  },
  {
    id: 4,
    title: 'Frontend Developer',
    company: 'Amazon',
    logo: 'https://cdn.brandfetch.io/amazon.com/w/128/h/128/theme/light/icon',
    location: 'Seattle, WA',
    salary: '$120k - $160k',
    type: '全职',
    matchScore: 88,
  },
];

const fallbackResources: ResourceModule[] = [
  { key: 'blog', title: '求职干货博客', endpoint: '/api/news?tab=tip', description: '简历、投递、面试和求职方法论' },
  { key: 'news', title: '求职资讯', endpoint: '/api/news?tab=all', description: '行业动态、招聘趋势和政策变化' },
  { key: 'experiences', title: '大厂面经库', endpoint: '/api/experiences', description: '公司、岗位、轮次维度的面试复盘' },
  { key: 'visa', title: '签证政策解读', endpoint: '/api/content/visa-policies', description: 'OPT、H-1B、Graduate Route 等官方政策入口' },
  { key: 'help', title: '帮助中心', endpoint: '/api/content/help-center', description: '产品使用、账号权限和反馈说明' },
];

const resourceLinks: Record<string, string> = {
  blog: '/blog',
  news: '/news',
  experiences: '/interview-experiences',
  visa: '/visa-policies',
  help: '/help-center',
};

const resourceIcons: Record<string, React.ReactNode> = {
  blog: <BookOpen className="h-5 w-5" />,
  news: <Newspaper className="h-5 w-5" />,
  experiences: <FileText className="h-5 w-5" />,
  visa: <ShieldCheck className="h-5 w-5" />,
  help: <HelpCircle className="h-5 w-5" />,
};

const HeroPreview = () => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.15 }}
    className="relative w-full max-w-5xl mx-auto mt-14 rounded-2xl border border-gray-200 bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] overflow-hidden"
  >
    <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-2 bg-gray-50">
      <div className="w-3 h-3 rounded-full bg-red-400" />
      <div className="w-3 h-3 rounded-full bg-amber-400" />
      <div className="w-3 h-3 rounded-full bg-green-400" />
      <div className="ml-4 flex-1 max-w-sm h-7 rounded-md bg-white border border-gray-200 text-xs text-gray-500 flex items-center justify-center">
        zhiyincareer.com/jobs
      </div>
    </div>
    <div className="grid md:grid-cols-[0.9fr_1.1fr] h-[420px] bg-white">
      <div className="border-r border-gray-100 p-5 bg-gray-50/70 overflow-hidden">
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <div className="h-10 pl-10 pr-3 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-400 flex items-center">
            搜索职位、公司、关键词
          </div>
        </div>
        <div className="flex gap-2 mb-5 overflow-hidden">
          <span className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-full whitespace-nowrap">New York</span>
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs rounded-full whitespace-nowrap font-bold">
            支持 H-1B
          </span>
        </div>
        <div className="space-y-3">
          {['Frontend Engineer', 'Full Stack Developer', 'Data Scientist'].map((title, index) => (
            <div key={title} className={`p-4 rounded-xl border bg-white ${index === 0 ? 'border-primary ring-1 ring-primary/20' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="font-bold text-sm text-gray-900">{title}</div>
                <div className="text-[10px] text-gray-400">1d ago</div>
              </div>
              <div className="text-xs text-gray-500 mb-3">TechFlow Inc. · New York, NY</div>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 text-[10px] rounded font-bold">OPT</span>
                <span className="px-2 py-0.5 bg-blue-50 text-primary border border-blue-100 text-[10px] rounded font-bold">H-1B</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden md:flex flex-col p-6 overflow-hidden">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center text-xl font-black">T</div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Frontend Engineer, React</h2>
              <p className="text-sm text-gray-500 mt-1">TechFlow Inc. · New York, NY · Hybrid</p>
            </div>
          </div>
          <button className="h-9 px-4 bg-gray-900 text-white rounded-lg text-sm font-bold">一键投递</button>
        </div>
        <div className="flex gap-6 border-b border-gray-100 mb-6">
          <span className="pb-2 text-sm font-bold text-gray-900 border-b-2 border-gray-900">职位详情</span>
          <span className="pb-2 text-sm text-gray-500">公司信息</span>
          <span className="pb-2 text-sm text-gray-500">薪资洞察</span>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">岗位亮点</h3>
            <div className="space-y-2.5">
              <div className="h-3 w-full bg-gray-100 rounded-full" />
              <div className="h-3 w-[92%] bg-gray-100 rounded-full" />
              <div className="h-3 w-[78%] bg-gray-100 rounded-full" />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-indigo-900">AI 面试准备</div>
              <div className="text-xs text-indigo-600 mt-1">基于岗位生成高频面试题和回答建议</div>
            </div>
            <Bot className="w-6 h-6 text-indigo-600 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const Hero = () => (
  <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="relative z-10">
      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium mb-8 shadow-sm">
        <span className="flex h-2.5 w-2.5 rounded-full bg-primary mr-2.5 animate-pulse" />
        留学生求职全流程工具箱已上线
        <ArrowRight className="ml-2 w-4 h-4 text-gray-400" />
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8 leading-[1.1]">
        留学生求职，
        <br className="hidden sm:block" />
        <span className="text-primary">从准备到投递一站完成</span>
      </h1>

      <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
        职位搜索、网申助手、笔经面经、AI 模拟面试、薪资查询、简历优化、校招日历和求职规划，帮你把复杂流程拆成清晰行动。
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/jobs" className="group w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-xl text-base font-bold transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] flex items-center justify-center">
          开始搜索职位
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link to="/ai-interview" className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900 rounded-xl text-base font-bold transition-all flex items-center justify-center shadow-sm">
          体验 AI 模拟面试
          <Bot className="ml-2 w-5 h-5 text-gray-400" />
        </Link>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium">
        <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-gray-400 mr-2" />真实职位数据</div>
        <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-gray-400 mr-2" />留学生专属筛选</div>
        <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-gray-400 mr-2" />全流程 AI 辅助</div>
      </div>
    </motion.div>

    <HeroPreview />
  </section>
);

const JobSearchIntro = () => (
  <section className="py-20 bg-white border-t border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
            <Search className="w-4 h-4 mr-2" />
            海量名企岗位
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-deep mb-6 leading-tight">
            公司与职位精准搜索，
            <br />
            <span className="text-primary">发现你的下一次机会</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            聚合海内外名企、独角兽和成长型公司的招聘信息，支持按地区、行业、岗位类型和签证友好度筛选，让投递更有方向。
          </p>

          <div className="space-y-6 mb-8">
            {[
              {
                title: '真实岗位数据',
                desc: '同步公开职位源和后端职位库，减少重复搜索成本。',
                Icon: Briefcase,
                color: 'text-blue-600',
                bg: 'bg-blue-50',
              },
              {
                title: '留学生专属筛选',
                desc: '快速定位支持 OPT、CPT、H-1B 或 E-Verify 的目标公司。',
                Icon: Filter,
                color: 'text-indigo-600',
                bg: 'bg-indigo-50',
              },
              {
                title: '公司信息联动',
                desc: '结合面经、薪资和机构测评，帮助你判断岗位质量。',
                Icon: Building2,
                color: 'text-purple-600',
                bg: 'bg-purple-50',
              },
            ].map(({ title, desc, Icon, color, bg }) => (
              <div key={title} className="flex items-start">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-1`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-deep">{title}</h4>
                  <p className="text-base text-gray-500 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/jobs" className="inline-flex items-center justify-center px-6 py-3 bg-deep text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm">
            立即搜索职位
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="rounded-2xl bg-gray-50 border border-gray-200 p-3 shadow-xl">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center space-x-3">
              <div className="flex-1 bg-gray-50 rounded-lg h-10 flex items-center px-3">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-400">Software Engineer</span>
              </div>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Filter className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="p-4 border-b border-gray-50 flex gap-2 overflow-hidden">
              <div className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full font-medium border border-primary/20 whitespace-nowrap">支持 H-1B</div>
              <div className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200 whitespace-nowrap">全职</div>
              <div className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200 whitespace-nowrap">加州</div>
            </div>
            <div className="p-4 space-y-3">
              {['Frontend Engineer', 'Data Analyst Intern', 'Product Manager'].map((title) => (
                <div key={title} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-gray-900 mb-1">{title}</div>
                    <div className="text-xs text-gray-500 mb-2">San Jose, CA · 支持 OPT</div>
                    <div className="flex space-x-2">
                      <div className="h-5 px-2 bg-green-50 text-green-600 rounded text-[11px] flex items-center">Visa friendly</div>
                      <div className="h-5 px-2 bg-blue-50 text-primary rounded text-[11px] flex items-center">New grad</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const RecommendedJobs = () => {
  const [jobs, setJobs] = useState<RecommendedJob[]>(fallbackJobs);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await apiFetch('/api/proxy/jobs/recommend/list');
        const list: any[] = res.code === 0 && res.data ? res.data : [];
        const normalizedJobs = list.slice(0, 3).map((job: any, index: number) => ({
          id: job.id,
          title: job.title || '',
          company: job.company || '',
          logo: job.logo || job.companyLogo || '',
          location: job.location || '',
          salary: job.salary || '',
          type: job.jobType || '全职',
          matchScore: 96 - index * 4,
        }));
        if (normalizedJobs.length > 0) setJobs(normalizedJobs);
      } catch (error) {
        console.error('Failed to fetch recommended jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5 mb-12">
          <div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-5 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              为你推荐
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">智能职位推荐</h2>
            <p className="text-gray-500 mt-3 text-lg font-medium">基于求职意向和岗位热度，优先展示值得关注的机会。</p>
          </div>
          <Link to="/jobs" className="hidden sm:flex items-center text-primary hover:text-primary-hover font-bold transition-colors">
            查看更多
            <ArrowRight className="w-5 h-5 ml-1.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-[220px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <Link key={job.id} to={`/jobs/${encodeURIComponent(String(job.id))}`} className="block bg-white rounded-2xl p-7 border border-gray-100 shadow-[0_5px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-bl-2xl text-xs font-black shadow-sm">
                  匹配度 {job.matchScore}%
                </div>
                <div className="flex items-start space-x-5 mb-5">
                  <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-2xl font-black text-gray-400 shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                    {job.logo ? (
                      <>
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-full h-full object-contain p-2 bg-white rounded-2xl"
                          referrerPolicy="no-referrer"
                          onError={(event) => {
                            const target = event.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <span className="hidden">{job.company.charAt(0)}</span>
                      </>
                    ) : (
                      job.company.charAt(0)
                    )}
                  </div>
                  <div className="pt-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                    <p className="text-[15px] font-medium text-gray-500 mt-1 truncate">{job.company}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2.5 mb-6">
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-100">{job.location}</span>
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-100">{job.type}</span>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-gray-50">
                  <span className="text-primary font-black text-base tracking-tight">{job.salary || '薪资面议'}</span>
                  <span className="text-xs font-bold text-gray-400">刚刚推荐</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const ResourceCenter = () => {
  const [resources, setResources] = useState<ResourceModule[]>(fallbackResources);
  const [updatedAt, setUpdatedAt] = useState('持续更新');

  useEffect(() => {
    const loadResources = async () => {
      try {
        const response = await apiFetch('/api/proxy/content/resource-summary');
        const data = response.data || {};
        if (Array.isArray(data.modules) && data.modules.length) setResources(data.modules);
        if (data.updatedAt) setUpdatedAt(new Date(data.updatedAt).toLocaleDateString('zh-CN'));
      } catch (error) {
        console.warn('Resource summary fallback:', error);
      }
    };
    loadResources();
  }, []);

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-5">
              <MapPinned className="w-4 h-4 mr-2" />
              资源中心
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">把资讯、面经和政策放到同一个入口</h2>
            <p className="text-gray-500 mt-3 text-lg">后端内容接口已接入，页面会持续聚合求职干货、行业资讯、面经和签证政策。</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            最近更新：{updatedAt}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {resources.map((resource) => (
            <Link key={resource.key} to={resourceLinks[resource.key] || '/blog'} className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 hover:border-primary/30 hover:bg-white hover:shadow-sm transition-all">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary border border-gray-100 group-hover:bg-primary group-hover:text-white transition-colors">
                {resourceIcons[resource.key] || <BookOpen className="h-5 w-5" />}
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{resource.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">{resource.description}</p>
              <div className="mt-4 inline-flex items-center text-xs font-bold text-primary">
                查看内容
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = () => (
  <section id="features" className="py-20 bg-white border-t border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-deep mb-4">为留学生设计的核心功能</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">把职位信息、准备工具和求职节奏放到同一个工作台里，减少信息差，提高行动效率。</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-6`}>{feature.icon}</div>
            <h3 className="text-xl font-bold text-deep mb-3">{feature.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CTA = ({ onOpenAuth }: { onOpenAuth: (mode: 'login' | 'register') => void }) => (
  <section className="py-24 bg-gray-900 border-t border-gray-800">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
          准备好拿到你的 Dream Offer 了吗？
        </h2>
        <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          从岗位搜索到面试准备，职引把每一步拆成可执行的任务。现在注册，开始建立你的求职节奏。
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button onClick={() => onOpenAuth('register')} className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-xl text-lg font-bold transition-all shadow-[0_0_40px_rgba(255,255,255,0.18)] flex items-center justify-center">
            免费注册账号
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <button onClick={() => onOpenAuth('login')} className="w-full sm:w-auto px-8 py-4 bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 hover:border-gray-600 rounded-xl text-lg font-bold transition-colors flex items-center justify-center">
            登录继续使用
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default function Home() {
  const { openAuthModal } = useAuth();

  return (
    <main>
      <SEO
        title="留学生一站式求职平台"
        description="职引为留学生提供职位搜索、网申助手、笔经面经、AI 模拟面试、薪资查询、简历优化、校招日历和求职规划，覆盖从准备到投递的完整求职流程。"
        keywords="留学生求职,海外求职,校招日历,AI模拟面试,薪资查询,网申助手"
        canonical="https://www.zhiyincareer.com/"
        jsonLd={homeJsonLd}
      />
      <Hero />
      <JobSearchIntro />
      <RecommendedJobs />
      <ResourceCenter />
      <Features />
      <FeatureShowcase />
      <CTA onOpenAuth={openAuthModal} />
    </main>
  );
}
