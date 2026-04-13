import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';

export default function SalaryInsights() {
  const [company, setCompany] = useState('Google');
  const [role, setRole] = useState('Software Engineer');
  const [location, setLocation] = useState('San Francisco, CA');

  // Mock data for levels
  const levelData = [
    { level: 'L3', title: 'Entry Level', tc: '195k', base: '135k', stock: '40k', bonus: '20k' },
    { level: 'L4', title: 'Mid Level', tc: '285k', base: '170k', stock: '85k', bonus: '30k', active: true },
    { level: 'L5', title: 'Senior', tc: '390k', base: '210k', stock: '140k', bonus: '40k' },
    { level: 'L6', title: 'Staff', tc: '540k', base: '250k', stock: '230k', bonus: '60k' },
    { level: 'L7', title: 'Senior Staff', tc: '750k', base: '290k', stock: '380k', bonus: '80k' },
  ];

  // Mock data for recent offers
  const recentOffers = [
    { company: 'Google', role: 'SWE', level: 'L4', location: 'San Francisco, CA', tc: '$290,000', yoe: '3 yrs', date: '2天前' },
    { company: 'Meta', role: 'SWE', level: 'E4', location: 'Menlo Park, CA', tc: '$310,000', yoe: '4 yrs', date: '3天前' },
    { company: 'Amazon', role: 'SDE II', level: 'L5', location: 'Seattle, WA', tc: '$275,000', yoe: '3.5 yrs', date: '1周前' },
    { company: 'Apple', role: 'ICT3', level: 'ICT3', location: 'Cupertino, CA', tc: '$260,000', yoe: '2 yrs', date: '1周前' },
    { company: 'TikTok', role: 'Backend Dev', level: '2-1', location: 'San Jose, CA', tc: '$285,000', yoe: '3 yrs', date: '2周前' },
  ];

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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-deep flex items-center">
                    {company} <span className="text-gray-400 mx-2">|</span> {role}
                  </h2>
                  <p className="text-gray-500 mt-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" /> {location} • L4 (Mid Level)
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
                  <div className="text-4xl font-bold text-deep mb-2">$285,000</div>
                  <div className="text-sm text-gray-500">平均总包 (TC)</div>
                </div>
                
                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
                    <div className="text-gray-500 text-sm mb-1">Base Salary</div>
                    <div className="text-xl font-bold text-deep">$170k</div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
                    <div className="text-gray-500 text-sm mb-1">Stock (/yr)</div>
                    <div className="text-xl font-bold text-deep">$85k</div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
                      <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
                    <div className="text-gray-500 text-sm mb-1">Bonus</div>
                    <div className="text-xl font-bold text-deep">$30k</div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Level Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-deep flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                  职级薪资对比 (Level Breakdown)
                </h3>
                <button className="text-gray-500 hover:text-primary flex items-center text-sm font-medium transition-colors">
                  <Filter className="w-4 h-4 mr-1" />
                  筛选
                </button>
              </div>

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
                        className={`border-b border-gray-50 last:border-none transition-colors ${data.active ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
                      >
                        <td className="py-4 px-4">
                          <div className="font-bold text-deep">{data.level}</div>
                          <div className="text-xs text-gray-500">{data.title}</div>
                        </td>
                        <td className="py-4 px-4 font-bold text-deep">${data.tc}</td>
                        <td className="py-4 px-4 text-gray-600">${data.base}</td>
                        <td className="py-4 px-4 text-gray-600">${data.stock}</td>
                        <td className="py-4 px-4 text-gray-600">${data.bonus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
