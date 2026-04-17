import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Filter,
  ChevronDown,
  Award,
  Clock,
  Table as TableIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { apiFetch } from '../lib/api';

export default function SalaryInsights() {
  const [company, setCompany] = useState('Google');
  const [role, setRole] = useState('Software Engineer');
  const [location, setLocation] = useState('San Francisco, CA');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(1); // Default to L4 (index 1)
  
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);
  const [recentOffers, setRecentOffers] = useState<any[]>([]);

  // Numeric data for Recharts (Mock data for levels as API doesn't provide level breakdown directly yet)
  const levelData = [
    { level: 'L3', title: 'Entry Level', tc: 195, base: 135, stock: 40, bonus: 20 },
    { level: 'L4', title: 'Mid Level', tc: 285, base: 170, stock: 85, bonus: 30 },
    { level: 'L5', title: 'Senior', tc: 390, base: 210, stock: 140, bonus: 40 },
    { level: 'L6', title: 'Staff', tc: 540, base: 250, stock: 230, bonus: 60 },
    { level: 'L7', title: 'Senior Staff', tc: 750, base: 290, stock: 380, bonus: 80 },
  ];

  const selectedData = levelData[selectedLevelIndex];

  // Calculate percentages for the progress bars
  const basePct = Math.round((selectedData.base / selectedData.tc) * 100);
  const stockPct = Math.round((selectedData.stock / selectedData.tc) * 100);
  const bonusPct = Math.round((selectedData.bonus / selectedData.tc) * 100);

  useEffect(() => {
    const fetchSalaryData = async () => {
      setIsLoading(true);
      try {
        // Fetch Statistics
        const statsParams = new URLSearchParams({
          position: role,
          company: company,
          region: location
        }).toString();
        const statsResponse = await apiFetch(`/api/proxy/salaries/statistics?${statsParams}`);
        if (!statsResponse.useMock && statsResponse.data) {
          setStatistics(statsResponse.data);
        }

        // Fetch Recent Offers (List)
        const listParams = new URLSearchParams({
          position: role,
          company: company,
          region: location,
          page: '1',
          pageSize: '10'
        }).toString();
        const listResponse = await apiFetch(`/api/proxy/salaries?${listParams}`);
        
        if (!listResponse.useMock && listResponse.data && listResponse.data.list) {
          const mappedOffers = listResponse.data.list.map((item: any) => ({
            company: item.company,
            role: item.position,
            level: 'N/A', // API doesn't return level currently
            location: item.location,
            tc: `$${item.totalCompensation.toLocaleString()}`,
            yoe: `${item.yearsOfExperience} yrs`,
            date: new Date(item.createdAt).toLocaleDateString()
          }));
          setRecentOffers(mappedOffers);
        } else {
          // Fallback to mock data
          setRecentOffers([
            { company: 'Google', role: 'SWE', level: 'L4', location: 'San Francisco, CA', tc: '$290,000', yoe: '3 yrs', date: '2天前' },
            { company: 'Meta', role: 'SWE', level: 'E4', location: 'Menlo Park, CA', tc: '$310,000', yoe: '4 yrs', date: '3天前' },
            { company: 'Amazon', role: 'SDE II', level: 'L5', location: 'Seattle, WA', tc: '$275,000', yoe: '3.5 yrs', date: '1周前' },
            { company: 'Apple', role: 'ICT3', level: 'ICT3', location: 'Cupertino, CA', tc: '$260,000', yoe: '2 yrs', date: '1周前' },
            { company: 'TikTok', role: 'Backend Dev', level: '2-1', location: 'San Jose, CA', tc: '$285,000', yoe: '3 yrs', date: '2周前' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch salary data:', error);
        // Fallback to mock data
        setRecentOffers([
          { company: 'Google', role: 'SWE', level: 'L4', location: 'San Francisco, CA', tc: '$290,000', yoe: '3 yrs', date: '2天前' },
          { company: 'Meta', role: 'SWE', level: 'E4', location: 'Menlo Park, CA', tc: '$310,000', yoe: '4 yrs', date: '3天前' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalaryData();
  }, [company, role, location]);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="bg-deep rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              全球科技公司薪资揭秘
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl">
              打破薪资信息差。探索各大厂不同职级、不同地区的真实薪资构成（Base, Stock, Bonus），助你拿到更好的 Offer。
            </p>

            <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-lg max-w-5xl">
              <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-colors">
                <Building2 className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input 
                  type="text" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="公司 (e.g. Google)" 
                  className="bg-transparent border-none outline-none w-full text-gray-900 placeholder-gray-400"
                />
              </div>
              <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-colors">
                <Briefcase className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="岗位 (e.g. Software Engineer)" 
                  className="bg-transparent border-none outline-none w-full text-gray-900 placeholder-gray-400"
                />
              </div>
              <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-colors">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="地区 (e.g. San Francisco)" 
                  className="bg-transparent border-none outline-none w-full text-gray-900 placeholder-gray-400"
                />
              </div>
              <button className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center justify-center shrink-0">
                <Search className="w-5 h-5 mr-2" />
                搜索薪资
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview Cards */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-deep flex items-center">
                    {company} <span className="text-gray-400 mx-2">|</span> {role}
                  </h2>
                  <p className="text-gray-500 mt-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" /> {location} 
                    {statistics ? ` • 样本数: ${statistics.count}` : ` • ${selectedData.level} (${selectedData.title})`}
                  </p>
                </div>
                <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  高置信度
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/10">
                  <div className="text-primary font-medium mb-1 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Total Compensation
                  </div>
                  <div className="text-4xl font-bold text-deep mb-2">
                    ${statistics ? (statistics.avgTotal / 1000).toFixed(0) : selectedData.tc}k
                  </div>
                  <div className="text-sm text-gray-500">平均总包 (TC)</div>
                </div>
                
                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
                    <div className="text-gray-500 text-sm mb-1">Base Salary</div>
                    <div className="text-xl font-bold text-deep">
                      ${statistics ? (statistics.avgBase / 1000).toFixed(0) : selectedData.base}k
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
                      <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${statistics ? Math.round((statistics.avgBase / statistics.avgTotal) * 100) : basePct}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
                    <div className="text-gray-500 text-sm mb-1">Stock (/yr)</div>
                    <div className="text-xl font-bold text-deep">
                      ${statistics ? (statistics.avgStock / 1000).toFixed(0) : selectedData.stock}k
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
                      <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${statistics ? Math.round((statistics.avgStock / statistics.avgTotal) * 100) : stockPct}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
                    <div className="text-gray-500 text-sm mb-1">Bonus</div>
                    <div className="text-xl font-bold text-deep">
                      ${statistics ? (statistics.avgBonus / 1000).toFixed(0) : selectedData.bonus}k
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
                      <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${statistics ? Math.round((statistics.avgBonus / statistics.avgTotal) * 100) : bonusPct}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Level Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-deep flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                    职级薪资对比 (Level Breakdown)
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">点击图表柱子或表格行查看详细薪资构成</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setViewMode('chart')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center ${viewMode === 'chart' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <BarChart3 className="w-4 h-4 mr-1.5" />
                      图表
                    </button>
                    <button 
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center ${viewMode === 'table' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <TableIcon className="w-4 h-4 mr-1.5" />
                      表格
                    </button>
                  </div>
                  <button className="text-gray-500 hover:text-primary flex items-center text-sm font-medium transition-colors">
                    <Filter className="w-4 h-4 mr-1" />
                    筛选
                  </button>
                </div>
              </div>

              {viewMode === 'chart' ? (
                <div className="h-[400px] w-full mt-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={levelData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      onClick={(state) => {
                        if (state && state.activeTooltipIndex !== undefined) {
                          setSelectedLevelIndex(state.activeTooltipIndex);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis 
                        dataKey="level" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6b7280', fontSize: 12 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6b7280', fontSize: 12 }} 
                        tickFormatter={(value) => `$${value}k`}
                        dx={-10}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f9fafb' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value: number, name: string) => [`$${value}k`, name]}
                        labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                      <Bar dataKey="base" name="Base Salary" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} maxBarSize={60} />
                      <Bar dataKey="stock" name="Stock (/yr)" stackId="a" fill="#a855f7" maxBarSize={60} />
                      <Bar dataKey="bonus" name="Bonus" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500 text-sm">
                        <th className="pb-3 font-medium px-4">Level</th>
                        <th className="pb-3 font-medium px-4">Total Comp</th>
                        <th className="pb-3 font-medium px-4">Base</th>
                        <th className="pb-3 font-medium px-4">Stock (/yr)</th>
                        <th className="pb-3 font-medium px-4">Bonus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {levelData.map((data, index) => (
                        <tr 
                          key={index} 
                          onClick={() => setSelectedLevelIndex(index)}
                          className={`border-b border-gray-50 last:border-none transition-colors cursor-pointer ${selectedLevelIndex === index ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
                        >
                          <td className="py-4 px-4">
                            <div className="font-bold text-deep">{data.level}</div>
                            <div className="text-xs text-gray-500">{data.title}</div>
                          </td>
                          <td className="py-4 px-4 font-bold text-deep">${data.tc}k</td>
                          <td className="py-4 px-4 text-gray-600">${data.base}k</td>
                          <td className="py-4 px-4 text-gray-600">${data.stock}k</td>
                          <td className="py-4 px-4 text-gray-600">${data.bonus}k</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Submit Salary CTA */}
            <div className="bg-gradient-to-br from-deep to-gray-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <Award className="w-8 h-8 text-primary mb-4 relative z-10" />
              <h3 className="text-lg font-bold mb-2 relative z-10">贡献你的薪资数据</h3>
              <p className="text-gray-300 text-sm mb-6 relative z-10">
                匿名分享你的 Offer 信息，帮助更多留学生打破信息差，获取更公平的薪资待遇。
              </p>
              <button className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-medium transition-colors relative z-10">
                匿名添加薪资
              </button>
            </div>

            {/* Recent Offers */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-deep mb-4 flex items-center justify-between">
                <span>最新 Offer 爆料</span>
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-md">实时更新</span>
              </h3>
              
              <div className="space-y-4">
                {recentOffers.map((offer, index) => (
                  <div key={index} className="p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-deep group-hover:text-primary transition-colors">
                          {offer.company} • {offer.level}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {offer.role} | {offer.yoe} 经验
                        </div>
                      </div>
                      <div className="font-bold text-green-600">
                        {offer.tc}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 text-xs text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {offer.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {offer.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 text-sm font-medium text-primary hover:text-primary-hover flex items-center justify-center transition-colors">
                查看更多记录 <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
