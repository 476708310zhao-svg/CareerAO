import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Bookmark,
  BookmarkCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Filter,
  MapPin,
  RotateCcw,
  Search,
} from 'lucide-react';

import SEO from '../components/SEO';
import { apiFetch } from '../lib/api';
import { useFavorites } from '../utils/favorites';

const FILTER_OPTIONS = {
  regions: ['全部', '中国', '美国', '香港', '新加坡', '英国', '其他'],
  industries: ['全部', '互联网', '金融', '新能源', '咨询', '国央企', '通信/硬件'],
  types: ['全部', '全职', '实习', '兼职'],
};

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
  requirements: string[];
  visaSponsored: boolean;
  postedAt: string;
  viewCount: number;
  applyCount: number;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays <= 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays} 天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
  return `${Math.floor(diffDays / 30)} 个月前`;
}

const Jobs = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ region: '全部', industry: '全部', type: '全部' });
  const { isFavorite, toggleFavorite } = useFavorites();

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
      if (searchQuery) params.set('keyword', searchQuery);
      if (filters.region !== '全部') params.set('region', filters.region);
      if (filters.industry !== '全部') params.set('industry', filters.industry);
      if (filters.type !== '全部') params.set('jobType', filters.type);

      const res = await apiFetch(`/api/proxy/jobs?${params}`);
      if (res.code === 0 && res.data) {
        setJobs(res.data.list || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setJobs([]);
        setTotal(0);
        setTotalPages(1);
        setErrorMessage(res.message || '职位数据暂时不可用，请稍后再试。');
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setJobs([]);
      setTotal(0);
      setTotalPages(1);
      setErrorMessage('网络连接不稳定，职位列表加载失败。');
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filters]);

  const submitSearch = () => {
    setSearchQuery(inputValue.trim());
  };

  const resetFilters = () => {
    setInputValue('');
    setSearchQuery('');
    setFilters({ region: '全部', industry: '全部', type: '全部' });
    setPage(1);
  };

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
    <>
      <SEO
        title="职位搜索"
        description="职引职位搜索聚合海内外校招、社招和实习岗位，支持地区、行业、岗位类型和签证友好度筛选，帮助留学生更快找到合适机会。"
        keywords="留学生求职,海归招聘,校招职位,实习招聘,签证担保,互联网招聘,金融招聘,咨询招聘"
        canonical="https://www.zhiyincareer.com/jobs"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: '职位搜索',
          url: 'https://www.zhiyincareer.com/jobs',
          description: '面向留学生的职位搜索与岗位筛选页面。',
        }}
      />
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-primary mb-2">Job Search</p>
                <h1 className="text-3xl md:text-4xl font-black text-deep">职位搜索</h1>
                <p className="text-gray-500 mt-3 max-w-2xl">
                  按地区、行业和岗位类型筛选机会，优先找到更适合留学生投递的职位。
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:text-primary hover:border-primary/30 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                重置筛选
              </button>
            </div>

            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center gap-2">
              <div className="w-full flex-1 flex items-center pl-4">
                <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="搜索职位、公司或关键词..."
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && submitSearch()}
                  className="w-full h-12 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
              <button
                onClick={submitSearch}
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm"
              >
                搜索
              </button>
            </div>
          </section>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-1/4 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-24">
                <div className="flex items-center mb-6">
                  <Filter className="w-5 h-5 text-primary mr-2" />
                  <h2 className="text-lg font-bold text-deep">高级筛选</h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900">工作类型</h3>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_OPTIONS.types.map((option) => (
                        <button
                          key={option}
                          onClick={() => setFilters((current) => ({ ...current, type: option }))}
                          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            filters.type === option
                              ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="space-y-3 block">
                    <span className="text-sm font-medium text-gray-900">地区</span>
                    <select
                      value={filters.region}
                      onChange={(event) => setFilters((current) => ({ ...current, region: event.target.value }))}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    >
                      {FILTER_OPTIONS.regions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-3 block">
                    <span className="text-sm font-medium text-gray-900">行业</span>
                    <select
                      value={filters.industry}
                      onChange={(event) => setFilters((current) => ({ ...current, industry: event.target.value }))}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    >
                      {FILTER_OPTIONS.industries.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </aside>

            <section className="w-full lg:w-3/4">
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-gray-500 text-sm">
                  共找到 <span className="font-bold text-deep">{total}</span> 个职位
                </p>
                {(searchQuery || filters.region !== '全部' || filters.industry !== '全部' || filters.type !== '全部') && (
                  <p className="text-xs text-gray-400">
                    当前筛选：{[searchQuery, filters.region, filters.industry, filters.type].filter((item) => item && item !== '全部').join(' / ') || '全部'}
                  </p>
                )}
              </div>

              {errorMessage && !isLoading && (
                <div className="mb-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-sm font-medium">{errorMessage}</span>
                  <button onClick={fetchJobs} className="text-sm font-bold text-red-700 hover:text-red-800">
                    重新加载
                  </button>
                </div>
              )}

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                        <div className="flex-1 space-y-3">
                          <div className="h-5 bg-gray-200 rounded w-1/3" />
                          <div className="h-4 bg-gray-200 rounded w-1/4" />
                          <div className="flex gap-2">
                            <div className="h-6 bg-gray-200 rounded w-16" />
                            <div className="h-6 bg-gray-200 rounded w-20" />
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
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start space-x-4 min-w-0">
                          <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                            {job.companyLogo ? (
                              <img src={job.companyLogo} alt={job.company} className="w-8 h-8 object-contain" />
                            ) : (
                              <span className="text-xl font-bold text-primary">{job.company?.charAt(0) || '?'}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg font-bold text-deep group-hover:text-primary transition-colors mb-1 line-clamp-2">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center text-gray-500 text-sm mb-3 gap-x-4 gap-y-1">
                              <span className="flex items-center"><Building2 className="w-4 h-4 mr-1" />{job.company}</span>
                              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{job.location}</span>
                              {job.salary && (
                                <span className="flex items-center text-green-600 font-medium">
                                  <DollarSign className="w-4 h-4 mr-1" />{job.salary}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {job.jobType && <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">{job.jobType}</span>}
                              {job.industry && <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">{job.industry}</span>}
                              {job.visaSponsored && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">支持签证</span>}
                              {(job.requirements || []).slice(0, 2).map((requirement) => (
                                <span key={requirement} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                                  {requirement}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-4 shrink-0">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleFavorite(job.id, { title: job.title, subtitle: job.company });
                            }}
                            className={`p-2 rounded-full transition-colors ${
                              isFavorite(job.id)
                                ? 'text-primary bg-primary/10'
                                : 'text-gray-400 hover:text-primary hover:bg-gray-50'
                            }`}
                            aria-label={isFavorite(job.id) ? '取消收藏' : '收藏职位'}
                          >
                            {isFavorite(job.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                          </button>
                          <span className="hidden sm:flex items-center text-xs text-gray-400">
                            <Clock className="w-3 h-3 mr-1" />{formatDate(job.postedAt)}
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
                      <h3 className="text-lg font-medium text-deep mb-2">暂未找到相关职位</h3>
                      <p className="text-gray-500 text-sm mb-6">可以调整关键词，或放宽地区、行业和岗位类型筛选。</p>
                      <button
                        onClick={resetFilters}
                        className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors"
                      >
                        清空筛选
                      </button>
                    </div>
                  )}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                    className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="上一页"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {visiblePages().map((item, index) =>
                    item === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          page === item ? 'bg-primary text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="下一页"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Jobs;
