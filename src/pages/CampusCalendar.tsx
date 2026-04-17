import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Building2, 
  Clock, 
  Bell, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { apiFetch } from '../lib/api';

export default function CampusCalendar() {
  const [activeMonth, setActiveMonth] = useState('2026年9月');
  const [activeRegion, setActiveRegion] = useState('North America');
  
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  const regions = ['North America', 'APAC', 'EMEA'];
  const months = ['2026年7月', '2026年8月', '2026年9月', '2026年10月', '2026年11月'];

  useEffect(() => {
    const fetchCampusData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          region: activeRegion === 'North America' ? '北美' : activeRegion,
          page: '1',
          pageSize: '20'
        }).toString();
        const response = await apiFetch(`/api/proxy/campus?${params}`);
        
        if (!response.useMock && response.data && response.data.list) {
          const mappedEvents = response.data.list.map((item: any) => {
            const startDate = new Date(item.startDate);
            return {
              id: item.id,
              date: `${startDate.getMonth() + 1}月${startDate.getDate()}日`,
              day: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][startDate.getDay()],
              company: item.company,
              title: item.positionName,
              type: item.recruitType,
              location: item.region,
              status: 'upcoming', // Could be derived from dates
              urgency: 'medium',
              applyUrl: item.applyUrl
            };
          });
          setEvents(mappedEvents);
        } else {
          // Fallback to mock data
          setEvents([
            { id: 1, date: '9月15日', day: '周二', company: 'Google', title: '2027 Software Engineering Intern (Summer) 申请开启', type: 'Application Open', location: 'US / Canada', status: 'upcoming', urgency: 'high' },
            { id: 2, date: '9月18日', day: '周五', company: 'Meta', title: 'New Grad 2026 提前批网申截止', type: 'Deadline', location: 'US', status: 'closing-soon', urgency: 'critical' },
            { id: 3, date: '9月22日', day: '周二', company: 'J.P. Morgan', title: 'Quantitative Finance Campus Recruiting Event', type: 'Career Fair / Event', location: 'Virtual', status: 'upcoming', urgency: 'medium' },
            { id: 4, date: '9月25日', day: '周五', company: 'Amazon', title: 'SDE Full-Time 2026 OA (Online Assessment) 发放高峰期', type: 'Assessment', location: 'Global', status: 'upcoming', urgency: 'high' },
            { id: 5, date: '9月30日', day: '周三', company: 'Apple', title: 'Hardware Engineering Intern 简历投递截止', type: 'Deadline', location: 'Cupertino, CA', status: 'upcoming', urgency: 'medium' }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch campus data:', error);
        setEvents([
          { id: 1, date: '9月15日', day: '周二', company: 'Google', title: '2027 Software Engineering Intern (Summer) 申请开启', type: 'Application Open', location: 'US / Canada', status: 'upcoming', urgency: 'high' },
          { id: 2, date: '9月18日', day: '周五', company: 'Meta', title: 'New Grad 2026 提前批网申截止', type: 'Deadline', location: 'US', status: 'closing-soon', urgency: 'critical' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampusData();
  }, [activeRegion, activeMonth]);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-deep rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange-500/20 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/10">
                <CalendarIcon className="w-4 h-4 text-orange-400" />
                <span>实时追踪全球名企校招动态</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                2026-2027 校招日历 (Campus Calendar)
              </h1>
              <p className="text-gray-300 text-lg mb-8">
                网申开启、截止日期、宣讲会、OA 发放时间一网打尽。支持一键订阅至 Google/Apple Calendar，不错过任何一个拿 Offer 的机会。
              </p>

              <div className="flex flex-wrap gap-3">
                <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center shadow-sm">
                  <Bell className="w-4 h-4 mr-2" />
                  订阅日历提醒
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  自定义筛选
                </button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shrink-0 w-full md:w-64">
              <div className="text-gray-300 text-sm mb-4">本月关键节点</div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">网申开启</span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-sm font-bold">12 家</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">即将截止</span>
                  <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-sm font-bold">5 家</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: Calendar List */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Controls */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
                {regions.map(region => (
                  <button
                    key={region}
                    onClick={() => setActiveRegion(region)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeRegion === region 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-bold text-gray-900 min-w-[80px] text-center">{activeMonth}</span>
                <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Event List */}
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl p-0 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col md:flex-row">
                  {/* Date Column */}
                  <div className="bg-gray-50 md:w-32 p-4 flex md:flex-col items-center md:justify-center border-b md:border-b-0 md:border-r border-gray-100 shrink-0">
                    <div className="text-sm text-gray-500 font-medium mr-2 md:mr-0 md:mb-1">{event.day}</div>
                    <div className="text-xl md:text-2xl font-bold text-deep">{event.date}</div>
                  </div>
                  
                  {/* Content Column */}
                  <div className="p-5 flex-1 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          event.type === 'Deadline' ? 'bg-red-50 text-red-600' :
                          event.type === 'Application Open' ? 'bg-green-50 text-green-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {event.type}
                        </span>
                        {event.status === 'closing-soon' && (
                          <span className="flex items-center text-xs font-bold text-red-500">
                            <AlertCircle className="w-3.5 h-3.5 mr-1" />
                            即将截止
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-gray-400" />
                      {event.company}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{event.title}</p>
                    
                    <div className="flex items-center space-x-3 mt-auto">
                      <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                        查看详情
                      </button>
                      <button className="bg-white border border-gray-200 hover:border-primary hover:text-primary text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                        <Bell className="w-4 h-4 mr-1.5" />
                        提醒我
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* My Tracked Events */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span>我的追踪 (Tracked)</span>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">3 个提醒</span>
              </h3>
              
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-3 py-1">
                  <div className="text-xs text-red-500 font-bold mb-0.5">明天截止</div>
                  <div className="font-medium text-sm text-gray-900">Meta New Grad 网申</div>
                </div>
                <div className="border-l-4 border-primary pl-3 py-1">
                  <div className="text-xs text-primary font-bold mb-0.5">下周二</div>
                  <div className="font-medium text-sm text-gray-900">J.P. Morgan 宣讲会</div>
                </div>
                <div className="border-l-4 border-blue-500 pl-3 py-1">
                  <div className="text-xs text-blue-500 font-bold mb-0.5">9月30日</div>
                  <div className="font-medium text-sm text-gray-900">Apple Intern 投递</div>
                </div>
              </div>
              
              <button className="w-full mt-5 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                导出至 Google Calendar
              </button>
            </div>

            {/* Hiring Trends */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 shadow-sm border border-orange-100">
              <div className="flex items-center mb-4">
                <Briefcase className="w-5 h-5 text-orange-500 mr-2" />
                <h3 className="font-bold text-orange-900">秋招趋势洞察</h3>
              </div>
              <p className="text-sm text-orange-800/80 mb-4 leading-relaxed">
                今年北美科技大厂秋招普遍提前 2-3 周开启。建议在 9 月中旬前完成简历打磨并开始海投。金融行业 (IB/Quant) 的招聘节奏比科技行业更早，请密切关注。
              </p>
              <ul className="space-y-2 text-sm text-orange-900 font-medium">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span>
                  Tech 行业: 8月下旬 - 10月
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span>
                  Finance 行业: 7月 - 9月
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span>
                  Consulting: 8月 - 9月中旬
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
