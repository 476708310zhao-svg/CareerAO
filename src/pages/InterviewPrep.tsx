import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Building2, 
  MapPin, 
  Briefcase, 
  Star, 
  Clock, 
  FileText, 
  ChevronRight,
  Sparkles,
  Code,
  MessageSquare
} from 'lucide-react';
import { apiFetch } from '../lib/api';

export default function InterviewPrep() {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [region, setRegion] = useState('North America');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [experiences, setExperiences] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!role.trim() && !company.trim()) return;
    setIsSearching(true);
    
    try {
      const params = new URLSearchParams({
        keyword: role,
        company: company,
        page: '1',
        pageSize: '10'
      }).toString();
      
      const response = await apiFetch(`/api/proxy/experiences?${params}`);
      
      if (!response.useMock && response.data && response.data.list) {
        setExperiences(response.data.list);
      } else {
        // Fallback mock data
        setExperiences([
          { id: 1, title: 'Google SWE L3 面经 (2026 New Grad)', company: 'Google', position: 'Software Engineer', type: '面试', round: '终面', content: '...', tags: ['算法', '系统设计'], likesCount: 120, commentsCount: 45, createdAt: '2026-04-10T00:00:00Z' },
          { id: 2, title: 'Meta E3 提前批面经总结', company: 'Meta', position: 'Software Engineer', type: '面试', round: '二面', content: '...', tags: ['BQ', '算法'], likesCount: 85, commentsCount: 22, createdAt: '2026-04-08T00:00:00Z' }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      setExperiences([
        { id: 1, title: 'Google SWE L3 面经 (2026 New Grad)', company: 'Google', position: 'Software Engineer', type: '面试', round: '终面', content: '...', tags: ['算法', '系统设计'], likesCount: 120, commentsCount: 45, createdAt: '2026-04-10T00:00:00Z' }
      ]);
    } finally {
      setIsSearching(false);
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-8 h-8 text-indigo-600 mr-3" />
            笔经面经 (Interview Prep)
          </h1>
          <p className="text-gray-600 mt-2">输入目标岗位与公司，AI 为您智能汇总最新面经、高频考点与通关秘籍。</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel: Search Criteria */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Search className="w-5 h-5 text-indigo-500 mr-2" />
                定制你的备考指南
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">目标岗位 (Role)</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text" 
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      placeholder="e.g. Software Engineer"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">目标公司 (Company)</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text" 
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      placeholder="e.g. Google, Meta"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">求职地区 (Region)</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <select 
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm appearance-none"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      <option value="North America">北美 (North America)</option>
                      <option value="Europe">欧洲 (Europe)</option>
                      <option value="Asia Pacific">亚太 (Asia Pacific)</option>
                      <option value="China">中国大陆 (Mainland China)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={isSearching || (!role.trim() && !company.trim())}
                className={`w-full mt-6 py-3 rounded-xl font-bold text-white text-base flex items-center justify-center transition-all ${
                  isSearching || (!role.trim() && !company.trim()) ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'
                }`}
              >
                {isSearching ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在汇总数据...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" /> 生成备考指南
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel: Results */}
          <div className="w-full lg:w-2/3">
            {!showResults && !isSearching && (
              <div className="h-full bg-white rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-10 h-10 text-indigo-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">等待生成指南</h3>
                <p className="text-gray-500 max-w-md">在左侧输入您感兴趣的岗位和公司，我们将为您提取全网最新面经并提炼高频考点。</p>
              </div>
            )}

            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* High Frequency Topics */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 text-amber-500 mr-2" />
                    高频考点总结 (Top Topics)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-center mb-2">
                        <Code className="w-4 h-4 text-amber-600 mr-2" />
                        <h4 className="font-bold text-sm text-gray-900">算法与数据结构</h4>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1.5 pl-6 list-disc marker:text-amber-400">
                        <li>Graphs (BFS/DFS) - <span className="text-red-500 font-medium">极高频</span></li>
                        <li>Dynamic Programming</li>
                        <li>Sliding Window & Two Pointers</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-center mb-2">
                        <Building2 className="w-4 h-4 text-blue-600 mr-2" />
                        <h4 className="font-bold text-sm text-gray-900">系统设计 (System Design)</h4>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1.5 pl-6 list-disc marker:text-blue-400">
                        <li>Design a Rate Limiter</li>
                        <li>Design a URL Shortener</li>
                        <li>Microservices vs Monolith</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Interview Experiences List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                      <FileText className="w-5 h-5 text-indigo-500 mr-2" />
                      最新真实面经 (Recent Experiences)
                    </h2>
                    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full font-medium">共找到 128 篇</span>
                  </div>
                  
                  <div className="space-y-4">
                    {experiences.map((exp, idx) => (
                      <div key={idx} className="p-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-deep group-hover:text-indigo-600 transition-colors text-sm">{exp.title}</h3>
                          <div className="flex items-center text-xs text-gray-400 whitespace-nowrap ml-4">
                            <Clock className="w-3 h-3 mr-1" /> {new Date(exp.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex space-x-2 mb-3">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded font-medium">{exp.company}</span>
                          {exp.tags && exp.tags.map((tag: string) => (
                            <span key={tag} className={`px-2 py-0.5 text-[10px] rounded font-medium bg-indigo-50 text-indigo-600`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">{exp.content}</p>
                        <div className="mt-3 flex items-center text-xs text-gray-400 space-x-4">
                          <span className="flex items-center"><Star className="w-3 h-3 mr-1" /> {exp.likesCount || 0}</span>
                          <span className="flex items-center"><MessageSquare className="w-3 h-3 mr-1" /> {exp.commentsCount || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full mt-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center justify-center">
                    查看更多面经 <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                {/* Behavioral Questions */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 text-purple-500 mr-2" />
                    行为面试 (Behavioral) 核心题库
                  </h2>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm font-medium text-gray-800">1. Tell me about a time you had a conflict with a teammate.</p>
                      <p className="text-xs text-gray-500 mt-1">考察点：沟通能力、冲突解决、团队协作 (Teamwork)</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm font-medium text-gray-800">2. Describe a project where you had to learn a new technology quickly.</p>
                      <p className="text-xs text-gray-500 mt-1">考察点：学习能力、适应性、抗压能力 (Adaptability)</p>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
