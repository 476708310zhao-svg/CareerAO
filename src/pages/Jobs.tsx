import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Bookmark, 
  BookmarkCheck, 
  Filter, 
  Building2, 
  Clock,
  ChevronDown,
  Sparkles,
  Target
} from 'lucide-react';
import { apiFetch } from '../lib/api';

import { useFavorites } from '../utils/favorites';

// 模拟数据 (在真实环境中将从 /api/jobs/search 获取)
const MOCK_JOBS = [
  { 
    id: 1, 
    title: 'Software Engineer, New Grad 2026', 
    company: 'Google', 
    logo: 'G',
    location: 'Mountain View, CA', 
    salary: '$130k - $180k', 
    type: '全职', 
    visa: '支持 H1B/OPT', 
    tags: ['C++', 'Python', 'Distributed Systems'], 
    postedAt: '2天前', 
    isFavorite: false 
  },
  { 
    id: 2, 
    title: 'Data Analyst Intern', 
    company: 'Meta', 
    logo: 'M',
    location: 'Menlo Park, CA', 
    salary: '$45 - $55 / hr', 
    type: '实习', 
    visa: '支持 CPT', 
    tags: ['SQL', 'Python', 'Tableau'], 
    postedAt: '5小时前', 
    isFavorite: true 
  },
  { 
    id: 3, 
    title: 'Product Manager', 
    company: 'ByteDance', 
    logo: 'B',
    location: 'San Jose, CA', 
    salary: '$150k - $200k', 
    type: '全职', 
    visa: '支持 H1B', 
    tags: ['B2B', 'Growth', 'Agile'], 
    postedAt: '1周前', 
    isFavorite: false 
  },
  { 
    id: 4, 
    title: 'Frontend Developer', 
    company: 'Amazon', 
    logo: 'A',
    location: 'Seattle, WA', 
    salary: '$120k - $160k', 
    type: '全职', 
    visa: '支持 H1B/OPT', 
    tags: ['React', 'TypeScript', 'AWS'], 
    postedAt: '3天前', 
    isFavorite: false 
  },
  { 
    id: 5, 
    title: 'Machine Learning Intern', 
    company: 'Apple', 
    logo: 'A',
    location: 'Cupertino, CA', 
    salary: '$50 - $60 / hr', 
    type: '实习', 
    visa: '支持 CPT', 
    tags: ['PyTorch', 'Computer Vision', 'C++'], 
    postedAt: '刚发布', 
    isFavorite: false 
  },
];

const FILTER_OPTIONS = {
  regions: ['全部', '加州 (CA)', '纽约 (NY)', '华盛顿州 (WA)', '德州 (TX)', '远程 (Remote)'],
  industries: ['全部', '科技/互联网', '金融/咨询', '医疗/生物', '新能源', '游戏'],
  types: ['全部', '全职', '实习', '兼职', 'Contractor'],
  visas: ['全部', '支持 H1B', '支持 OPT/CPT', 'E-Verify', '不限身份']
};

export default function Jobs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [isLoading, setIsLoading] = useState(false);
  
  // 筛选状态
  const [filters, setFilters] = useState({
    region: '全部',
    industry: '全部',
    type: '全部',
    visa: '全部'
  });
  const [activeTab, setActiveTab] = useState<'all' | 'recommended'>('all');

  const { isFavorite, toggleFavorite } = useFavorites();

  // 模拟从后端获取数据
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        // 构建查询参数
        const queryParams = new URLSearchParams({ 
          keyword: searchQuery,
          region: filters.region !== '全部' ? filters.region : '',
          jobType: filters.type !== '全部' ? filters.type : '', // 根据文档，参数名为 jobType
          industry: filters.industry !== '全部' ? filters.industry : '',
          visa: filters.visa !== '全部' ? filters.visa : '',
          page: '1',
          pageSize: '10'
        }).toString();

        // 模拟延时
        await new Promise(resolve => setTimeout(resolve, 600));
        
        let filtered = MOCK_JOBS.map(job => ({
          ...job,
          // 模拟 AI 匹配度分数和难度
          matchScore: Math.floor(Math.random() * 40) + 60, // 60-99
          difficulty: ['简单', '中等', '困难'][Math.floor(Math.random() * 3)]
        }));
        
        if (activeTab === 'recommended') {
          // AI 推荐模式，按匹配度排序，忽略部分基础过滤以展示 AI 效果
          filtered = filtered.sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);
        } else {
          if (searchQuery) {
            filtered = filtered.filter(job => 
              job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
              job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) // 增强的关键词搜索
            );
          }
          if (filters.type !== '全部') {
            filtered = filtered.filter(job => job.type === filters.type);
          }
          if (filters.region !== '全部') {
            filtered = filtered.filter(job => job.location.includes(filters.region.split(' ')[0]));
          }
        }
        
        setJobs(filtered as any);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery, filters, activeTab]);

  const FilterSelect = ({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (val: string) => void }) => (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-500 whitespace-nowrap">{label}：</span>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              value === opt 
                ? 'bg-primary text-white font-medium shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-deep mb-6">职位搜索</h1>
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center gap-2">
            <div className="w-full flex-1 flex items-center pl-4">
              <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="搜索职位、公司或关键词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
              />
            </div>
            <button className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm">
              搜索
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center mb-6">
                <Filter className="w-5 h-5 text-primary mr-2" />
                <h2 className="text-lg font-bold text-deep">高级筛选</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">工作类型</h3>
                  <div className="flex flex-wrap gap-2">
                    {FILTER_OPTIONS.types.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setFilters({ ...filters, type: opt })}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          filters.type === opt 
                            ? 'bg-primary/10 text-primary font-medium border border-primary/20' 
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">签证支持</h3>
                  <div className="flex flex-wrap gap-2">
                    {FILTER_OPTIONS.visas.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setFilters({ ...filters, visa: opt })}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          filters.visa === opt 
                            ? 'bg-primary/10 text-primary font-medium border border-primary/20' 
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">地区</h3>
                  <select 
                    value={filters.region}
                    onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    {FILTER_OPTIONS.regions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">行业</h3>
                  <select 
                    value={filters.industry}
                    onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    {FILTER_OPTIONS.industries.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Job List */}
          <div className="w-full lg:w-3/4">
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6 w-full sm:w-fit">
              <button 
                onClick={() => setActiveTab('all')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white text-deep shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                全部职位
              </button>
              <button 
                onClick={() => setActiveTab('recommended')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${activeTab === 'recommended' ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Sparkles className={`w-4 h-4 mr-1.5 ${activeTab === 'recommended' ? 'text-amber-300' : 'text-gray-400'}`} />
                AI 智能匹配
              </button>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-gray-500 text-sm">
                找到 <span className="font-bold text-deep">{jobs.length}</span> 个{activeTab === 'recommended' ? '高匹配度' : '相关'}职位
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>排序方式:</span>
                <select className="bg-transparent font-medium text-deep outline-none cursor-pointer">
                  {activeTab === 'recommended' ? (
                    <option>匹配度最高</option>
                  ) : (
                    <>
                      <option>最新发布</option>
                      <option>薪资最高</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="flex gap-2 pt-2">
                          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-xl font-bold text-primary shrink-0">
                          {job.logo}
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-lg font-bold text-deep group-hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                            {activeTab === 'recommended' && job.matchScore && (
                              <div className="flex items-center bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-indigo-100">
                                <Sparkles className="w-3 h-3 mr-1" />
                                匹配度 {job.matchScore}%
                              </div>
                            )}
                            {job.difficulty && (
                              <div className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                job.difficulty === '困难' ? 'bg-red-50 text-red-600 border-red-100' :
                                job.difficulty === '中等' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                              }`}>
                                <Target className="w-3 h-3 mr-1" />
                                难度 {job.difficulty}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center text-gray-500 text-sm mb-3 space-x-4">
                            <span className="flex items-center">
                              <Building2 className="w-4 h-4 mr-1" />
                              {job.company}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center text-green-600 font-medium">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {job.salary}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                              {job.type}
                            </span>
                            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                              {job.visa}
                            </span>
                            {job.tags.map(tag => (
                              <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between h-full space-y-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(job.id);
                          }}
                          className={`p-2 rounded-full transition-colors ${
                            isFavorite(job.id) 
                              ? 'text-primary bg-primary/10' 
                              : 'text-gray-400 hover:text-primary hover:bg-gray-50'
                          }`}
                        >
                          {isFavorite(job.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                        <span className="flex items-center text-xs text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {job.postedAt}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {jobs.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-deep mb-2">未找到相关职位</h3>
                    <p className="text-gray-500 text-sm">尝试调整搜索关键词或放宽筛选条件</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Pagination placeholder */}
            {jobs.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">上一页</button>
                  <button className="w-10 h-10 bg-primary text-white rounded-lg text-sm font-medium shadow-sm">1</button>
                  <button className="w-10 h-10 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">2</button>
                  <button className="w-10 h-10 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">3</button>
                  <span className="text-gray-400">...</span>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">下一页</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
