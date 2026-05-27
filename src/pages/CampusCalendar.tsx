import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  Calendar as CalendarIcon,
  ChevronRight,
  Clock,
  ExternalLink,
  Link as LinkIcon,
  List,
  MapPin,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';
import { useCampusFavorites } from '../utils/favorites';

type CampusEvent = {
  id: number | string;
  company: string;
  title: string;
  type: string;
  role: string;
  location: string;
  day: string;
  date: string;
  gradYear: string;
  applyUrl?: string;
  status?: string;
  deadlineDate?: string;
};

const regions = ['全部', 'North America', 'Mainland China', 'APAC', 'EMEA'];
const types = ['全部', '秋招', '春招', '暑期实习'];
const roles = ['全部', 'SDE / Tech', 'Data / AI', 'PM / Operations', 'Finance / Quant'];
const gradYears = ['全部', '2025届', '2026届', '2027届'];

const formatDate = (value?: string) => {
  if (!value) return '即将开启';
  if (value === '尽快投递') return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
};

const normalizeEvent = (event: any): CampusEvent => {
  const deadline = event.deadlineDate || event.date;
  return {
    ...event,
    id: event.id,
    company: event.company || '公司待同步',
    title: event.positionName || event.title || '岗位待同步',
    type: event.recruitType || event.type || '校招',
    role: event.industry || event.role || '综合岗位',
    location: Array.isArray(event.locations) ? event.locations.join(' / ') : (event.locations || event.location || '地点待同步'),
    day: formatDate(event.startDate || event.day),
    date: formatDate(deadline),
    gradYear: event.gradYear ? `${event.gradYear}届` : '届别不限',
    applyUrl: event.applyUrl || event.url || '',
    status: event.status || '',
    deadlineDate: deadline || '',
  };
};

export default function CampusCalendar() {
  const { showToast } = useToast();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { favorites: campusFavorites, isFavorite, toggleFavorite } = useCampusFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('全部');
  const [filterType, setFilterType] = useState('全部');
  const [filterRole, setFilterRole] = useState('全部');
  const [filterGradYear, setFilterGradYear] = useState('全部');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<CampusEvent[]>([]);

  useEffect(() => {
    const fetchCampusData = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery.trim()) queryParams.append('keyword', searchQuery.trim());
        if (filterRegion !== '全部') queryParams.append('region', filterRegion);
        if (filterType !== '全部') queryParams.append('recruit_type', filterType);
        if (filterRole !== '全部') queryParams.append('industry', filterRole);
        if (filterGradYear !== '全部') queryParams.append('grad_year', filterGradYear.replace('届', ''));
        queryParams.append('page', (currentPage - 1).toString());
        queryParams.append('pageSize', '10');

        const result = await apiFetch(`/api/proxy/campus?${queryParams.toString()}`);
        const fetchedEvents = result.data?.list || result.data || [];
        setEvents(Array.isArray(fetchedEvents) ? fetchedEvents.map(normalizeEvent) : []);
        setTotalPages(Math.max(1, Math.ceil((result.data?.total || fetchedEvents.length || 0) / 10)));
      } catch (error) {
        console.error('Failed to fetch campus data:', error);
        showToast('获取校招数据失败，请稍后重试', 'error');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = window.setTimeout(fetchCampusData, 250);
    return () => window.clearTimeout(timer);
  }, [searchQuery, filterRegion, filterType, filterRole, filterGradYear, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterRegion, filterType, filterRole, filterGradYear]);

  const stats = useMemo(() => ({
    openCount: events.length,
    closingSoon: events.filter((event) => event.date.includes('天') || event.status === 'closing-soon').length,
  }), [events]);

  const handleCopyLink = async (url?: string) => {
    if (!url) {
      showToast('暂无可复制的投递链接', 'info');
      return;
    }
    await navigator.clipboard.writeText(url);
    showToast('投递链接已复制到剪贴板', 'success');
  };

  const handleApply = (url?: string) => {
    if (!url) {
      showToast('该岗位暂未同步官网链接', 'info');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleBookmark = (event: CampusEvent) => {
    const nextIsFavorite = !isFavorite(event.id);
    toggleFavorite(event.id, {
      title: `${event.company} · ${event.title}`,
      subtitle: `${event.type} / ${event.location} / 截止 ${event.date}`,
    });
    showToast(nextIsFavorite ? '已收藏到校招机会' : '已取消收藏', 'success');
  };

  const handleSubscribe = async (event: CampusEvent) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      showToast('登录后可以同步截止提醒到消息中心', 'info');
      return;
    }

    try {
      await apiFetch('/api/proxy/notify/campus-subscribe', {
        method: 'POST',
        body: JSON.stringify({
          campusId: event.id,
          company: event.company,
          deadlineDate: event.deadlineDate || event.date,
          positionName: event.title,
        }),
      });
      showToast('已创建截止提醒，可在消息中心查看', 'success');
    } catch (error: any) {
      console.warn('Failed to subscribe campus reminder:', error);
      showToast(error?.message || '提醒创建失败，请稍后重试', 'error');
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex flex-col">
      <SEO
        title="校招日历"
        description="全球名企校招动态实时追踪。网申开启、提前批、截止日期和官方申请入口一站查看。"
        keywords="校招日历,实习日历,提前批,校招网申,面试时间"
        canonical="https://www.zhiyincareer.com/campus-calendar"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        <div className="bg-deep rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/10">
                <CalendarIcon className="w-4 h-4 text-orange-400" />
                <span>实时追踪全球名企校招动态</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">校招日历</h1>
              <p className="text-gray-300 text-lg mb-6">
                网申开启、提前批、截止日期和官方入口一站查看。筛选适合你的岗位，不错过关键投递窗口。
              </p>
              <Link to="/campus-calendar/table" className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-base font-bold text-white transition-all border border-white/20 group">
                <List className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                <span>查看表格视图</span>
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shrink-0 w-full md:w-64">
              <div className="text-gray-300 text-sm mb-4">当前筛选结果</div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">开放岗位</span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-sm font-bold">{stats.openCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">即将截止</span>
                  <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-sm font-bold">{stats.closingSoon}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 flex flex-col">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 relative overflow-visible z-20">
              <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索公司名称或岗位，例如 Google、Data Scientist..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  ['地区', filterRegion, setFilterRegion, regions],
                  ['类型', filterType, setFilterType, types],
                  ['岗位', filterRole, setFilterRole, roles],
                  ['届别', filterGradYear, setFilterGradYear, gradYears],
                ].map(([label, value, setter, options]) => (
                  <div key={label as string}>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{label as string}</label>
                    <div className="relative">
                      <select value={value as string} onChange={(event) => (setter as React.Dispatch<React.SetStateAction<string>>)(event.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-primary appearance-none pr-8">
                        {(options as string[]).map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                      <ChevronRight className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 flex-1 z-10">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4" />
                  <p className="font-medium">正在加载校招职位...</p>
                </div>
              ) : events.length ? (
                events.map((event) => (
                  <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-32 bg-blue-50/50 rounded-xl flex flex-col items-center justify-center py-4 shrink-0 border border-blue-100/50">
                      <span className="text-xl font-bold text-blue-700 leading-none">{event.day}</span>
                      <span className={`text-[11px] font-bold mt-2 text-center w-full px-2 ${event.status === 'closing-soon' ? 'text-red-600 bg-red-100 py-1 rounded shadow-sm' : 'text-blue-500'}`}>
                        {event.date}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center flex-wrap gap-y-1">
                        <Building2 className="w-4 h-4 mr-1.5 text-gray-400" />
                        <span className="mr-2">{event.company}</span>
                        <span className="hidden md:inline mx-2 text-gray-300">|</span>
                        <span className="text-[17px] text-gray-800 break-words">{event.title}</span>
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2 mb-3">
                        <span className="bg-gray-100 border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded text-xs font-semibold">{event.type}</span>
                        <span className="bg-gray-100 border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded text-xs font-semibold">{event.role}</span>
                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded text-xs font-bold">{event.gradYear}</span>
                        <span className="flex items-center text-gray-500 text-xs font-medium ml-1">
                          <MapPin className="w-3.5 h-3.5 mr-1" /> {event.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center justify-center gap-3 shrink-0 md:w-36 md:border-l border-gray-100 md:pl-5">
                      <button onClick={() => handleApply(event.applyUrl)} className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center shadow-lg shadow-black/10 hover:-translate-y-0.5">
                        去网申 <ExternalLink className="w-4 h-4 ml-1.5" />
                      </button>
                      <div className="flex w-full gap-2">
                        <button onClick={() => handleCopyLink(event.applyUrl)} className="flex-1 justify-center bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-medium transition-colors flex items-center" title="复制投递链接">
                          <LinkIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleBookmark(event)} className={`flex-1 justify-center border py-2 rounded-xl text-sm font-medium transition-colors flex items-center ${isFavorite(event.id) ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white hover:bg-amber-50 border-gray-200 hover:border-amber-200 hover:text-amber-600 text-gray-600'}`} title={isFavorite(event.id) ? '取消收藏' : '收藏校招机会'}>
                          <Bookmark className={`w-4 h-4 ${isFavorite(event.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button onClick={() => handleSubscribe(event)} className="flex-1 justify-center bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 hover:text-blue-600 text-gray-600 py-2 rounded-xl text-sm font-medium transition-colors flex items-center" title="创建截止提醒">
                          <Bell className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                  <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-lg font-bold text-gray-900 mb-2">暂无匹配的校招职位</h2>
                  <p className="text-gray-500">可以换一个关键词或放宽筛选条件。</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm z-10 w-full shrink-0">
              <span className="text-sm text-gray-500 font-medium">第 {currentPage} 页，共 {totalPages} 页</span>
              <div className="flex space-x-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                  上一页
                </button>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                  下一页
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span>我的提醒与收藏</span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">已接入</span>
              </h3>
              <p className="text-sm text-gray-500 leading-6">点亮收藏会同步到账号；创建截止提醒后，会在消息中心生成一条校招提醒记录。</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                  <Bookmark className="w-4 h-4 text-amber-600 mb-2" />
                  <p className="text-2xl font-black text-gray-900">{campusFavorites.length}</p>
                  <p className="text-xs font-bold text-gray-500 mt-1">已收藏机会</p>
                </div>
                <Link to="/messages" className="rounded-xl bg-blue-50 border border-blue-100 p-4 hover:bg-blue-100 transition-colors">
                  <Clock className="w-4 h-4 text-blue-600 mb-2" />
                  <p className="text-sm font-black text-gray-900">消息中心</p>
                  <p className="text-xs font-bold text-gray-500 mt-2">查看提醒</p>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-blue-100">
              <div className="flex items-center mb-4">
                <Briefcase className="w-5 h-5 text-indigo-500 mr-2" />
                <h3 className="font-bold text-indigo-900">求职节奏指导</h3>
              </div>
              <p className="text-sm text-indigo-800/80 mb-4 leading-relaxed">
                科技大厂 New Grad 通常面向毕业前后半年的同学开放；暑期实习会更早启动，建议提前准备简历、面经和网申材料。
              </p>
              <div className="bg-white/60 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-gray-700">2026届全职</span>
                  <span className="text-indigo-600 font-medium">立刻投递</span>
                </div>
                <div className="w-full bg-gray-200 h-px" />
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-gray-700">2027届暑期实习</span>
                  <span className="text-indigo-600 font-medium">黄金窗口期</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
