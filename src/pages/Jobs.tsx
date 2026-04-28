import React, { useState, useEffect, useCallback } from 'react';
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
  Sparkles,
  Target,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useFavorites } from '../utils/favorites';

const PAGE_SIZE = 10;

interface Job {
  id: number;
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
}

const FILTER_OPTIONS = {
  regions:   ['全部', '中国', '美国', '英国'],
  industries: ['全部', '互联网', '金融', '咨询'],
  types:     ['全部', '全职', '实习'],
};

export default function Jobs() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput]   = useState('');
  const [searchQuery, setSearchQuery]   = useState('');
  const [jobs, setJobs]                 = useState<Job[]>([]);
  const [total, setTotal]               = useState(0);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [isLoading, setIsLoading]       = useState(false);
  const [activeTab, setActiveTab]       = useState<'all' | 'recommended'>('all');

  const [filters, setFilters] = useState({
    region:   '全部',
    industry: '全部',
    type:     '全部',
    visa:     false,
  });

  const { isFavorite, toggleFavorite } = useFavorites();

  const fetchJobs = useCallback(async (currentPage: number) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(currentPage), pageSize: String(PAGE_SIZE) });
      if (searchQuery)             params.set('keyword',  searchQuery);
      if (filters.region   !== '全部') params.set('region',   filters.region);
      if (filters.industry !== '全部') params.set('industry', filters.industry);
      if (filters.type     !== '全部') params.set('jobType',  filters.type);
      if (filters.visa)              params.set('visaSponsored', 'true');

      const endpoint = activeTab === 'recommended'
        ? `/api/proxy/jobs/recommend/list`
        : `/api/proxy/jobs?${params}`;

      const res = await apiFetch(endpoint);
      if (res?.code !== 0) throw new Error(res?.message || 'API error');

      if (activeTab === 'recommended') {
        setJobs(res.data || []);
        setTotal(res.data?.length || 0);
        setTotalPages(1);
      } else {
        setJobs(res.data?.list || []);
        setTotal(res.data?.total || 0);
        setTotalPages(res.data?.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setJobs([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filters, activeTab]);

  useEffect(() => {
    setPage(1);
    fetchJobs(1);
  }, [fetchJobs]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchJobs(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logoChar = (job: Job) =>
    job.companyLogo
      ? <img src={job.companyLogo} alt={job.company} className="w-10 h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
      : <span className="text-xl font-bold text-primary">{job.company[0]}</span>;

  const relativeTime = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7)  return `${days}天前`;
    if (days < 30) return `${Math.floor(days/7)}周前`;
    return `${Math.floor(days/30)}个月前`;
  };

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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-12 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm"
            >
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
                      <button key={opt} onClick={() => setFilters(f => ({ ...f, type: opt }))}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors border ${filters.type === opt ? 'bg-primary/10 text-primary font-medium border-primary/20' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">地区</h3>
                  <div className="flex flex-wrap gap-2">
                    {FILTER_OPTIONS.regions.map(opt => (
                      <button key={opt} onClick={() => setFilters(f => ({ ...f, region: opt }))}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors border ${filters.region === opt ? 'bg-primary/10 text-primary font-medium border-primary/20' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">行业</h3>
                  <div className="flex flex-wrap gap-2">
                    {FILTER_OPTIONS.industries.map(opt => (
                      <button key={opt} onClick={() => setFilters(f => ({ ...f, industry: opt }))}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors border ${filters.industry === opt ? 'bg-primary/10 text-primary font-medium border-primary/20' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="visa"
                    checked={filters.visa}
                    onChange={(e) => setFilters(f => ({ ...f, visa: e.target.checked }))}
                    className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                  />
                  <label htmlFor="visa" className="text-sm text-gray-700 cursor-pointer">仅显示支持签证职位</label>
                </div>
              </div>
            </div>
          </div>

          {/* Job List */}
          <div className="w-full lg:w-3/4">
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6 w-full sm:w-fit">
              <button onClick={() => setActiveTab('all')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white text-deep shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                全部职位
              </button>
              <button onClick={() => setActiveTab('recommended')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${activeTab === 'recommended' ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'text-gray-500 hover:text-gray-900'}`}>
                <Sparkles className={`w-4 h-4 mr-1.5 ${activeTab === 'recommended' ? 'text-amber-300' : 'text-gray-400'}`} />
                推荐职位
              </button>
            </div>

            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-500 text-sm">
                共找到 <span className="font-bold text-deep">{total}</span> 个职位
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="flex gap-2 pt-2">
                          <div className="h-6 bg-gray-200 rounded-full w-16" />
                          <div className="h-6 bg-gray-200 rounded-full w-20" />
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
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start space-x-4 min-w-0">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                          {logoChar(job)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-deep group-hover:text-primary transition-colors truncate mb-1">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center text-gray-500 text-sm mb-3 gap-x-4 gap-y-1">
                            <span className="flex items-center">
                              <Building2 className="w-4 h-4 mr-1 shrink-0" />{job.company}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1 shrink-0" />{job.location}
                            </span>
                            <span className="flex items-center text-green-600 font-medium">
                              <DollarSign className="w-4 h-4 mr-1 shrink-0" />{job.salary}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">{job.jobType}</span>
                            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">{job.industry}</span>
                            {job.visaSponsored && (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">签证支持</span>
                            )}
                            {job.requirements?.slice(0, 2).map(req => (
                              <span key={req} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs truncate max-w-[160px]">{req}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between shrink-0 space-y-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(job.id); }}
                          className={`p-2 rounded-full transition-colors ${isFavorite(job.id) ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-primary hover:bg-gray-50'}`}
                        >
                          {isFavorite(job.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                        <span className="flex items-center text-xs text-gray-400 whitespace-nowrap">
                          <Clock className="w-3 h-3 mr-1" />{relativeTime(job.postedAt)}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page + i - 2;
                  if (p < 1 || p > totalPages) return null;
                  return (
                    <button key={p} onClick={() => handlePageChange(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
