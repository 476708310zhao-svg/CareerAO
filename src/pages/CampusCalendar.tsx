import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Building2, 
  Clock, 
  Bell, 
  ChevronRight, 
  ExternalLink,
  Briefcase,
  Search,
  Link as LinkIcon,
  Bookmark,
  LayoutGrid,
  List
} from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useToast } from '../contexts/ToastContext';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function CampusCalendar() {
  const { showToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterRole, setFilterRole] = useState('All');
  const [filterGradYear, setFilterGradYear] = useState('All');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  const regions = ['All', 'North America', 'Mainland China', 'APAC', 'EMEA'];
  const types = ['All', 'Full-time (秋招)', 'Full-time (春招)', 'Internship (暑期)'];
  const roles = ['All', 'SDE / Tech', 'Data / AI', 'PM / Operations', 'Finance / Quant'];
  const gradYears = ['All', '2025届', '2026届', '2027届'];

  useEffect(() => {
    const fetchCampusData = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filterRegion !== 'All') queryParams.append('region', filterRegion);
        if (filterType !== 'All') queryParams.append('recruit_type', filterType);
        if (filterRole !== 'All') queryParams.append('industry', filterRole);
        if (filterGradYear !== 'All') {
          // Send pure numbers, e.g. "2026" instead of "2026届"
          queryParams.append('grad_year', filterGradYear.replace('届', ''));
        }
        // Backend pagination is 0-indexed
        queryParams.append('page', (currentPage - 1).toString());
        queryParams.append('pageSize', '10');

        const result = await apiFetch(`/api/proxy/campus?${queryParams.toString()}`);
        
        let fetchedEvents = [];
        if (result.data?.list) {
          fetchedEvents = result.data.list;
        } else if (result.data) {
          fetchedEvents = result.data;
        } else if (Array.isArray(result)) {
          fetchedEvents = result;
        }

        // Map backend fields to frontend expected fields
        const mappedEvents = fetchedEvents.map((evt: any) => ({
          ...evt,
          title: evt.positionName || evt.title,
          type: evt.recruitType || evt.type,
          role: evt.industry || evt.role,
          location: Array.isArray(evt.locations) ? evt.locations.join(' / ') : (evt.locations || evt.location),
          day: evt.startDate ? new Date(evt.startDate).toLocaleDateString((typeof navigator !== 'undefined' && navigator.language) || 'zh-CN', { month: 'short', day: 'numeric' }) : evt.day,
          date: evt.deadlineDate === '尽快投递' ? '尽快投递' : (evt.deadlineDate || evt.date || '即将开启'),
          gradYear: evt.gradYear ? (String(evt.gradYear).includes('届') ? evt.gradYear : `${evt.gradYear}届`) : evt.gradYear,
        }));

        setEvents(mappedEvents);
        if (result.data?.total) {
          setTotalPages(Math.ceil(result.data.total / 10));
        }
      } catch (error) {
        console.error("Failed to fetch campus data", error);
        showToast('获取校招数据失败', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampusData();
  }, [filterRegion, filterType, filterRole, filterGradYear, currentPage]);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('投递链接已复制到剪贴板！', 'success');
  };

  const handleApply = (url: string) => {
    window.open(url, '_blank');
  };

  const handleBookmark = () => {
    showToast('已收藏该校招职位！', 'success');
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex flex-col">
      <SEO
        title="校招日历 (Campus Hiring)"
        description="全球名企校招动态实时追踪。网申开启、绝密提前批、截止日期一网打尽。一键跳转投递，不错过任何抢手职位。"
        keywords="校招日历, 实习日历, 提前批, 校招网申, 面试时间"
        canonical="https://www.zhiyincareer.com/campus-calendar"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        
        {/* Header Section */}
        <div className="bg-deep rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange-500/20 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/10">
                <CalendarIcon className="w-4 h-4 text-orange-400" />
                <span>实时追踪全球名企校招动态</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                校招日历 (Campus Hiring)
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                网申开启、绝密提前批、截止日期一网打尽。筛选适合你的岗位，一键跳转投递或订阅日历提醒。
              </p>
              
              <Link 
                to="/campus-calendar/table" 
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-base font-bold text-white transition-all border border-white/20 group"
              >
                <List className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                <span>校招日历表</span>
              </Link>
            </div>
            
            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shrink-0 w-full md:w-64">
              <div className="text-gray-300 text-sm mb-4">今日校招动态</div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">新增网申开启</span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-sm font-bold">+12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">即将截止 (48h)</span>
                  <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-sm font-bold">5 个</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Main Content: Campus Hiring List */}
            <div className="lg:col-span-2 flex flex-col">
              
              {/* Comprehensive Filters */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 relative overflow-visible z-20">
                 {/* Search */}
                 <div className="relative mb-5">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder="搜索公司名称或岗位 (e.g. Google, Data Scientist)..." 
                     value={searchQuery} 
                     onChange={e=>setSearchQuery(e.target.value)} 
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium text-gray-900" 
                   />
                 </div>
                 
                 {/* Dropdown Filters */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">地区 Region</label>
                      <div className="relative">
                        <select value={filterRegion} onChange={(e)=>setFilterRegion(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-primary appearance-none pr-8">
                          {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronRight className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">类型 Type</label>
                      <div className="relative">
                        <select value={filterType} onChange={(e)=>setFilterType(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-primary appearance-none pr-8">
                          {types.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronRight className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">岗位 Role</label>
                      <div className="relative">
                        <select value={filterRole} onChange={(e)=>setFilterRole(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-primary appearance-none pr-8">
                          {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronRight className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">届次 Grad Year</label>
                      <div className="relative">
                        <select value={filterGradYear} onChange={(e)=>setFilterGradYear(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-primary appearance-none pr-8">
                          {gradYears.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <ChevronRight className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
                      </div>
                    </div>
                 </div>
              </div>

              {/* Event List */}
              <div className="space-y-4 flex-1 z-10">
                 {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
                      <p className="font-medium">加载校招职位中...</p>
                    </div>
                 ) : (
                  events.map((event) => (
                    <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5">
                      {/* Left Date Block */}
                      <div className="w-full md:w-32 bg-blue-50/50 rounded-xl flex flex-col items-center justify-center p-4:md:p-0 py-4 shrink-0 border border-blue-100/50">
                         <span className="text-xl font-bold text-blue-700 leading-none">{event.day}</span>
                         <span className={`text-[11px] font-bold mt-2 text-center w-full px-2 ${event.status === 'closing-soon' ? 'text-red-600 bg-red-100 py-1 rounded shadow-sm' : 'text-blue-500'}`}>
                           {event.date}
                         </span>
                      </div>
                      
                      {/* Center Info */}
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
               
                      {/* Right Actions */}
                      <div className="flex md:flex-col items-center justify-center gap-3 shrink-0 md:w-36 md:border-l border-gray-100 md:pl-5">
                          <button onClick={() => handleApply(event.applyUrl)} className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center shadow-lg shadow-black/10 hover:-translate-y-0.5">
                            去网申 <ExternalLink className="w-4 h-4 ml-1.5" />
                          </button>
                          <div className="flex w-full gap-2">
                            <button onClick={() => handleCopyLink(event.applyUrl)} className="flex-1 justify-center bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-medium transition-colors flex items-center" title="复制投递链接">
                              <LinkIcon className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleBookmark()} className="flex-1 justify-center bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-200 hover:text-amber-600 text-gray-600 py-2 rounded-xl text-sm font-medium transition-colors flex items-center" title="收藏职位">
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                      </div>
                   </div>
                  ))
                 )}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm z-10 w-full shrink-0">
                 <span className="text-sm text-gray-500 font-medium">第 {currentPage} 页，共 {totalPages} 页</span>
                 <div className="flex space-x-2">
                    <button 
                       disabled={currentPage === 1}
                       onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                       className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                       上一页
                    </button>
                    <button 
                       disabled={currentPage === totalPages}
                       onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                       className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                       下一页
                    </button>
                 </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              
              {/* My Tracked Events */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                  <span>我的提醒与收藏</span>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">3 个提醒</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-3 py-1">
                    <div className="text-xs text-red-500 font-bold mb-0.5">明天截止</div>
                    <div className="font-medium text-sm text-gray-900">Meta New Grad 网申</div>
                  </div>
                  <div className="border-l-4 border-primary pl-3 py-1">
                    <div className="text-xs text-primary font-bold mb-0.5 flex items-center"><Clock className="w-3 h-3 mr-1" />本月末开启</div>
                    <div className="font-medium text-sm text-gray-900">J.P. Morgan Quantitative Finance</div>
                  </div>
                  <div className="border-l-4 border-emerald-500 pl-3 py-1">
                    <div className="text-xs text-emerald-500 font-bold mb-0.5 flex items-center"><Bookmark className="w-3 h-3 mr-1" /> 已收藏</div>
                    <div className="font-medium text-sm text-gray-900">Apple Hardware Engineering Intern</div>
                  </div>
                </div>
                
                <button className="w-full mt-5 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center group">
                  <Bell className="w-4 h-4 mr-2 text-gray-400 group-hover:text-amber-500 transition-colors" />
                  配置微信截止提醒
                </button>
              </div>

              {/* Hiring Trends */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-blue-100">
                <div className="flex items-center mb-4">
                  <Briefcase className="w-5 h-5 text-indigo-500 mr-2" />
                  <h3 className="font-bold text-indigo-900">求职节奏指导</h3>
                </div>
                <p className="text-sm text-indigo-800/80 mb-4 leading-relaxed">
                  科技大厂全职校招 (New Grad) 通常仅向毕业半年内的学生开放。暑期实习 (Summer Intern) 普遍会在前一年 8 月就开始滚动招募。
                </p>
                <div className="bg-white/60 p-4 rounded-xl space-y-3">
                   <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-gray-700">2026届 全职</span>
                      <span className="text-indigo-600 font-medium">立刻投递</span>
                   </div>
                   <div className="w-full bg-gray-200 h-px"></div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-gray-700">2027届 暑期实习</span>
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
