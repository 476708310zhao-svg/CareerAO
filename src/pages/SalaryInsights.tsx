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
  Table as TableIcon,
  X,
  GitCompare,
  LineChart as LineChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { apiFetch } from '../lib/api';
import SEO from '../components/SEO';

export default function SalaryInsights() {
  const [company, setCompany] = useState('Google');
  const [role, setRole] = useState('Software Engineer');
  const [location, setLocation] = useState('San Francisco, CA');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(1); // Default to L4 (index 1)
  
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);
  const [recentOffers, setRecentOffers] = useState<any[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);

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

  // Mock data for 5-year trend
  const trendData = [
    { year: '2022', 'Google': 260, 'Meta': 255, 'Amazon': 230 },
    { year: '2023', 'Google': 275, 'Meta': 280, 'Amazon': 245 },
    { year: '2024', 'Google': 285, 'Meta': 310, 'Amazon': 260 },
    { year: '2025', 'Google': 290, 'Meta': 315, 'Amazon': 275 },
    { year: '2026', 'Google': 305, 'Meta': 330, 'Amazon': 290 }
  ];

  // Mock data for Percentiles (based on selected data)
  const percentiles = {
    p25: Math.round(selectedData.tc * 0.85),
    p50: selectedData.tc,
    p75: Math.round(selectedData.tc * 1.2)
  };

  // Mock data for submit form
  const [submitForm, setSubmitForm] = useState({ company: '', role: '', level: '', base: '', stock: '', bonus: '' });

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
      <SEO
        title="薪资待遇洞察 (Salary Insights)"
        description="最真实的科技大厂、金融咨询薪水数据揭秘。支持搜索按公司、岗位、地区维度的Base, Bonus, L1/L2级别薪资待遇。"
        keywords="留学生薪资, 大厂薪资, levels薪资, 科技公司待遇, 薪水查询"
        canonical="https://www.zhiyincareer.com/salary-insights"
      />
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

              {/* Percentiles */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-4">当前职级薪资分位数 (Percentiles)</h4>
                <div className="relative pt-6 pb-2">
                   {/* Track */}
                   <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-200 rounded-full -translate-y-1/2"></div>
                   
                   {/* P25 Marker */}
                   <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                     <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow-sm group-hover:scale-125 transition-transform"></div>
                     <span className="absolute -top-7 text-xs font-bold text-gray-500">P25</span>
                     <span className="absolute -bottom-6 text-xs text-gray-500 whitespace-nowrap">${percentiles.p25}k</span>
                   </div>

                   {/* P50 Marker */}
                   <div className="absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                     <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md group-hover:scale-125 transition-transform"></div>
                     <span className="absolute -top-7 text-sm font-black text-primary">P50 (中位数)</span>
                     <span className="absolute -bottom-6 text-sm font-bold text-gray-900 whitespace-nowrap">${percentiles.p50}k</span>
                   </div>

                   {/* P75 Marker */}
                   <div className="absolute top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                     <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm group-hover:scale-125 transition-transform"></div>
                     <span className="absolute -top-7 text-xs font-bold text-green-600">P75</span>
                     <span className="absolute -bottom-6 text-xs text-gray-500 whitespace-nowrap">${percentiles.p75}k</span>
                   </div>

                   {/* Active Range Highlight */}
                   <div className="absolute top-1/2 left-[25%] w-[50%] h-1.5 bg-primary/20 rounded-full -translate-y-1/2 pointer-events-none"></div>
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
                          setSelectedLevelIndex(Number(state.activeTooltipIndex));
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

            {/* 5-Year Trend & Company Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Trend Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-deep flex items-center mb-6">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  薪资增长趋势 (5-Year Trend)
                </h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}k`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      <Line type="monotone" dataKey="Google" stroke="#4285F4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Meta" stroke="#0668E1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Amazon" stroke="#FF9900" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Company Comparison CTA */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center text-center">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
                  <GitCompare className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">横向对比大厂包裹</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                  想知道 {role} 岗位在 Google, Apple 和 Meta 哪家的 TC 更有竞争力？支持最多对比 5 家公司。
                </p>
                <button 
                  onClick={() => setComparisonMode(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm w-full max-w-xs mx-auto"
                >
                  开启公司对比
                </button>
              </div>
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
              <button 
                onClick={() => setShowSubmitModal(true)}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-medium transition-colors relative z-10"
              >
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

      {/* Submit Salary Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto w-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Award className="w-5 h-5 mr-2 text-primary" />
                匿名分享 Offer
              </h2>
              <button onClick={() => setShowSubmitModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl flex items-start">
                <div className="mr-2 mt-0.5">💡</div>
                <p>你的提交将被完全匿名化处理，仅用于汇总和生成统计数据，帮助完善薪资透明度。</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">入职公司</label>
                  <input type="text" placeholder="e.g. Google" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">岗位</label>
                  <input type="text" placeholder="e.g. Software Engineer" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">职级</label>
                  <input type="text" placeholder="e.g. L4" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地区</label>
                  <input type="text" placeholder="e.g. SF Bay Area" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">包裹明细 (年度)</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Base Salary (基本薪资)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input type="number" placeholder="170,000" className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Stock/RSU (年度股票)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input type="number" placeholder="85,000" className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Target Bonus (目标奖金)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input type="number" placeholder="30,000" className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowSubmitModal(false)}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold mt-4 shadow-lg shadow-primary/20"
              >
                提交包裹详情
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal (Max 5 companies mock) */}
      {comparisonMode && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <GitCompare className="w-6 h-6 mr-2 text-indigo-600" />
                  公司薪资对比图谱: Software Engineer (L4/Mid-Level)
                </h2>
                <p className="text-gray-500 mt-1">San Francisco Bay Area • 最多支持对比 5 家大厂</p>
              </div>
              <button onClick={() => setComparisonMode(false)} className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full shadow-sm">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto bg-white flex-1">
              {/* Add company selector mock */}
              <div className="flex gap-3 mb-8">
                {['Google', 'Meta', 'Apple', 'Amazon'].map(c => (
                  <div key={c} className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium flex items-center">
                    {c} <X className="w-3 h-3 ml-2 cursor-pointer hover:text-indigo-900" />
                  </div>
                ))}
                <button className="border border-dashed border-gray-300 text-gray-500 px-4 py-2 rounded-lg font-medium flex items-center hover:bg-gray-50">
                  + 添加对比 (4/5)
                </button>
              </div>

              {/* Comparison Bar Chart */}
              <div className="h-[350px] w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Google (L4)', base: 170, stock: 85, bonus: 30, tc: 285 },
                      { name: 'Meta (E4)', base: 180, stock: 105, bonus: 25, tc: 310 },
                      { name: 'Apple (ICT3)', base: 165, stock: 75, bonus: 20, tc: 260 },
                      { name: 'Amazon (SDE II)', base: 175, stock: 100, bonus: 0, tc: 275 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}k`} tick={{ fill: '#6b7280' }} />
                    <Tooltip cursor={{ fill: '#f9fafb' }} formatter={(val) => `$${val}k`} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="base" name="Base Salary" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} maxBarSize={40} />
                    <Bar dataKey="stock" name="Stock/RSU" stackId="a" fill="#a855f7" maxBarSize={40} />
                    <Bar dataKey="bonus" name="Bonus" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Data Table */}
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-y border-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-sm font-medium text-gray-500">Company & Level</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-500">Base</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-500">Stock (yr)</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-500">Bonus</th>
                    <th className="py-3 px-4 text-sm font-bold text-gray-900 border-l border-gray-200">Total Comp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50">
                    <td className="py-4 px-4 font-bold text-gray-900">Meta (E4)</td>
                    <td className="py-4 px-4 text-gray-600">$180k</td>
                    <td className="py-4 px-4 text-gray-600">$105k</td>
                    <td className="py-4 px-4 text-gray-600">$25k</td>
                    <td className="py-4 px-4 font-black text-indigo-600 border-l border-gray-100 bg-indigo-50/30">$310,000</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-4 px-4 font-bold text-gray-900">Google (L4)</td>
                    <td className="py-4 px-4 text-gray-600">$170k</td>
                    <td className="py-4 px-4 text-gray-600">$85k</td>
                    <td className="py-4 px-4 text-gray-600">$30k</td>
                    <td className="py-4 px-4 font-black text-indigo-600 border-l border-gray-100 bg-indigo-50/30">$285,000</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-4 px-4 font-bold text-gray-900">Amazon (SDE II)</td>
                    <td className="py-4 px-4 text-gray-600">$175k</td>
                    <td className="py-4 px-4 text-gray-600">$100k</td>
                    <td className="py-4 px-4 text-gray-600">$0k</td>
                    <td className="py-4 px-4 font-black text-indigo-600 border-l border-gray-100 bg-indigo-50/30">$275,000</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-bold text-gray-900">Apple (ICT3)</td>
                    <td className="py-4 px-4 text-gray-600">$165k</td>
                    <td className="py-4 px-4 text-gray-600">$75k</td>
                    <td className="py-4 px-4 text-gray-600">$20k</td>
                    <td className="py-4 px-4 font-black text-indigo-600 border-l border-gray-100 bg-indigo-50/30">$260,000</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-6 bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm border border-yellow-100">
                <span className="font-bold flex items-center mb-1">📌 Offer 决策建议：</span>
                 Meta 的整体包裹目前最具竞争力，且股票授予部分（105k）占比最高，如果看好后期涨幅建议优先考虑。Amazon 虽然 Base 最高（175k），但第二年以后缺乏明确的 Target Bonus，需关注 sign-on bonus 结构。
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
