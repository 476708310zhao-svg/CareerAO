import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  MapPin,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  Filter,
  Building2,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useFavorites } from '../utils/favorites';

const FILTER_OPTIONS = {
  regions: ['全部', '中国', '美国', '香港', '新加坡', '英国', '其他'],
  industries: ['全部', '互联网', '金融', '新能源', '咨询', '国央企', '通信/硬件'],
  types: ['全部', '全职', '实习', '兼职'],
};

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
  requirements: string[];
  visaSponsored: boolean;
  postedAt: string;
  viewCount: number;
  applyCount: number;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  return `${Math.floor(diffDays / 30)}个月前`;
}

export default function Jobs() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;

  const [filters, setFilters] = useState({
    region: '全部',
    industry: '全部',
    type: '全部',
  });

  const { isFavorite, toggleFavorite } = useFavorites();

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (searchQuery) params.set('keyword', searchQuery);
      if (filters.region !== '全部') params.set('region', filters.region);
      if (filters.industry !== '全部') params.set('industry', filters.industry);
      if (filters.type !== '全部') params.set('jobType', filters.type);

      const res = await apiFetch(`/api/proxy/jobs?${params}`);
      if (res.code === 0 && res.data) {
        setJobs(res.data.list || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filters]);

  const handleSearch = () => setSearchQuery(inputValue);

  const visiblePages = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
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
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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
                      <button
                        key={opt}
                        onClick={() => setFilters(f => ({ ...f, type: opt }))}
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
                  <h3 className="text-sm font-medium text-gray-900">地区</h3>
                  <select
                    value={filters.region}
                    onChange={(e) => setFilters(f => ({ ...f, region: e.target.value }))}
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
                    onChange={(e) => setFilters(f => ({ ...f, industry: e.target.value }))}
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
            <div className="mb-4">
              <p className="text-gray-500 text-sm">
                共找到 <span className="font-bold text-deep">{total}</span> 个职位
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl" />
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                          {job.companyLogo ? (
                            <img src={job.companyLogo} alt={job.company} className="w-8 h-8 object-contain" />
                          ) : (
                            <span className="text-xl font-bold text-primary">{job.company?.charAt(0) || '?'}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-deep group-hover:text-primary transition-colors mb-1">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center text-gray-500 text-sm mb-3 gap-x-4 gap-y-1">
                            <span className="flex items-center">
                              <Building2 className="w-4 h-4 mr-1" />
                              {job.company}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            {job.salary && (
                              <span className="flex items-center text-green-600 font-medium">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {job.salary}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                              {job.jobType}
                            </span>
                            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                              {job.industry}
                            </span>
                            {job.visaSponsored && (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                                支持签证
                              </span>
                            )}
                            {(job.requirements || []).slice(0, 2).map((req, i) => (
                              <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between h-full space-y-4 ml-4 shrink-0">
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
                          {formatDate(job.postedAt)}
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

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {visiblePages().map((p, i) =>
                  p === '...' ? (
                    <span key={`e${i}`} className="px-2 text-gray-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? 'bg-primary text-white shadow-sm'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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
