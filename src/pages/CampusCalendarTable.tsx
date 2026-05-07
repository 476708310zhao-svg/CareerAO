import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Search,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useToast } from '../contexts/ToastContext';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function CampusCalendarTable() {
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
        if (filterGradYear !== 'All') queryParams.append('grad_year', filterGradYear.replace('届', ''));
        queryParams.append('page', (currentPage - 1).toString());
        queryParams.append('pageSize', '20');

        const result = await apiFetch(`/api/campus?${queryParams.toString()}`);
        
        let fetchedEvents = [];
        if (result.data?.list) {
          fetchedEvents = result.data.list;
        } else if (result.data) {
          fetchedEvents = result.data;
        } else if (Array.isArray(result)) {
          fetchedEvents = result;
        }

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
          setTotalPages(Math.ceil(result.data.total / 20));
        }
      } catch (error) {
        showToast('获取校招数据失败', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampusData();
  }, [filterRegion, filterType, filterRole, filterGradYear, currentPage]);

  const handleApply = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="pt-24 pb-8 min-h-screen bg-gray-50 flex flex-col">
      <SEO 
        title="校招日历表 (Campus Hiring Table)" 
        description="校招职位表格视图。筛选适合你的岗位，一键跳转投递。" 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        
        <div className="flex items-center mb-6">
          <Link to="/campus-calendar" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="font-medium text-sm">返回卡片视图</span>
          </Link>
          <div className="h-4 w-px bg-gray-300 mx-4"></div>
          <h1 className="text-xl font-bold text-gray-900">校招日历表</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
          
          {/* Filters Bar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜索公司、岗位..." 
                value={searchQuery} 
                onChange={e=>setSearchQuery(e.target.value)} 
                className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium text-gray-900" 
              />
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-1 select-none">
              <select value={filterRegion} onChange={(e)=>setFilterRegion(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-primary shrink-0">
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={filterType} onChange={(e)=>setFilterType(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-primary shrink-0">
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={filterRole} onChange={(e)=>setFilterRole(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-primary shrink-0">
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={filterGradYear} onChange={(e)=>setFilterGradYear(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-primary shrink-0">
                {gradYears.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto relative min-h-[400px]">
            {isLoading ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-white/50 backdrop-blur-sm z-10">
                 <div className="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin mb-3"></div>
                 <p className="font-medium text-sm">加载数据中...</p>
               </div>
            ) : null}
            
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-600 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-5 py-3.5 font-bold">公司 Company</th>
                  <th className="px-5 py-3.5 font-bold">岗位名称 Role</th>
                  <th className="px-5 py-3.5 font-bold">招聘类型 Type</th>
                  <th className="px-5 py-3.5 font-bold">面向届次 Grad Year</th>
                  <th className="px-5 py-3.5 font-bold">工作地区 Location</th>
                  <th className="px-5 py-3.5 font-bold">开启日期 Date</th>
                  <th className="px-5 py-3.5 font-bold text-center">操作 Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {events.map((event, i) => (
                  <tr key={event.id || i} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="font-bold text-gray-900">{event.company}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-gray-800 break-words line-clamp-1 max-w-[200px]" title={event.title}>{event.title}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-gray-100 border border-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-semibold">{event.type}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">{event.gradYear}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center text-gray-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" /> 
                        <span className="truncate max-w-[150px]" title={event.location}>{event.location}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-blue-700">{event.day}</span>
                        <span className={`text-[10px] uppercase font-bold mt-0.5 ${event.status === 'closing-soon' ? 'text-red-500' : 'text-gray-500'}`}>
                          {event.date}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => handleApply(event.applyUrl)} className="text-primary hover:text-white border border-primary hover:bg-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center">
                        网申 <ExternalLink className="w-3 h-3 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!isLoading && events.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                      没有找到符合条件的职位
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="border-t border-gray-200 bg-white p-4 flex items-center justify-between shrink-0">
             <span className="text-sm text-gray-500 font-medium">共 {totalPages} 页，当前第 {currentPage} 页</span>
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
      </div>
    </div>
  );
}
