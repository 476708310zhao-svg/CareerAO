import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Building2, 
  Briefcase, 
  Star, 
  Clock, 
  FileText, 
  Sparkles,
  Code,
  MessageSquare,
  ThumbsUp,
  Award,
  PenTool,
  BrainCircuit,
  Filter,
  X
} from 'lucide-react';

const MOCK_EXPERIENCES = [
  { id: 1, title: 'Google SWE L3 面经 (2026 New Grad) - 已拿 Offer', company: 'Google', position: 'Software Engineer', type: '技术面', difficulty: 4.8, content: '一轮电面，四轮 VO（3轮 Coding + 1轮 BQ）。Coding 主要考了图的遍历和 DP，具体题目有 Course Schedule 的变体。BQ 问了如何处理 Deadline... \n\n【AI 提取考点】：Graph, DP, Conflict Resolution.', tags: ['技术面试', '行为面试', '算法'], likesCount: 342, commentsCount: 56, isHighlight: true, author: 'Offer收割机', createdAt: '2026-04-10T00:00:00Z' },
  { id: 2, title: 'Meta E3 提前批面经总结 (挂了，攒人品)', company: 'Meta', position: 'Software Engineer', type: '综合面', difficulty: 4.5, content: '分享下教训。二面 BQ 没有准备好，考了如果和 Tech Lead 有冲突怎么处理。算法部分考了合并区间和二叉树的序列化，虽然做出来了但交流不够。', tags: ['行为面试', '经验教训'], likesCount: 128, commentsCount: 34, isHighlight: true, author: '路人甲', createdAt: '2026-04-08T00:00:00Z' },
  { id: 3, title: 'Amazon SDE Intern VO 过经', company: 'Amazon', position: 'SDE Intern', type: '技术面', difficulty: 3.8, content: '只有一轮45分钟的VO，两道题加上15分钟的LP（领导力准则）。两数之和变体，以及一个简单的 OOD。LP 准备好故事库就行。', tags: ['技术面试', '算法'], likesCount: 45, commentsCount: 12, isHighlight: false, author: '小透明', createdAt: '2026-04-20T00:00:00Z' },
  { id: 4, title: 'ByteDance TikTok 前端一面面经', company: 'ByteDance', position: 'Frontend Developer', type: '技术面', difficulty: 4.6, content: '面了70多分钟，八股文问得很深。手写代码环节包括防抖节流实现、以及一个带并发限制的 Promise 调度器。', tags: ['技术面试', '前端'], likesCount: 210, commentsCount: 44, isHighlight: true, author: '前端达人', createdAt: '2026-04-18T00:00:00Z' },
  { id: 5, title: 'Bloomberg HR 电话面试分享', company: 'Bloomberg', position: 'Data Analyst', type: 'HR面', difficulty: 2.5, content: '主要问了为什么要来彭博，以及背景调查相关。比较轻松，注意表达热情即可，时长大概只有15分钟。', tags: ['HR面', '行为面试'], likesCount: 22, commentsCount: 3, isHighlight: false, author: 'DataCat', createdAt: '2026-04-21T00:00:00Z' },
];

export default function InterviewPrep() {
  const [activeTab, setActiveTab] = useState<'recent' | 'highlights' | 'ai-tools'>('recent');
  
  // States for AI Tool tab
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // States for Publish Modal
  const [showPublishModal, setShowPublishModal] = useState(false);

  const filteredExperiences = activeTab === 'highlights' 
    ? MOCK_EXPERIENCES.filter(exp => exp.isHighlight)
    : MOCK_EXPERIENCES;

  const handleGenerateAI = () => {
    if (!role || !company) return;
    setIsGenerating(true);
    setAiResult(null);
    setTimeout(() => {
      setAiResult({
        highFreq: ['Graphs (BFS/DFS)', 'Dynamic Programming', 'System Design - Rate Limiter'],
        generatedQuestions: [
          { type: 'Coding', text: 'Given a directed graph showing task dependencies, determine if all tasks can be finished.', difficulty: 'Medium' },
          { type: 'System Design', text: 'Design a distributed rate limiter that works across multiple regions.', difficulty: 'Hard' },
          { type: 'Behavioral', text: 'Tell me about a time you had to push back on a product requirement.', difficulty: 'Medium' }
        ],
        difficultyPrediction: 4.7
      });
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-8 h-8 text-primary mr-3" />
              笔经面经社区
            </h1>
            <p className="text-gray-600 mt-2">发现真实面经、沉淀求职经验，或使用 AI 智能预测下一场面试考题。</p>
          </div>
          <button 
            onClick={() => setShowPublishModal(true)}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center shrink-0 w-fit"
          >
            <PenTool className="w-4 h-4 mr-2" />
            发布面经
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Area: Tabs & List */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* Nav Tabs */}
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-full overflow-x-auto custom-scrollbar shrink-0">
              <button 
                onClick={() => setActiveTab('recent')}
                className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${activeTab === 'recent' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Clock className="w-4 h-4 mr-2" />
                最新面经
              </button>
              <button 
                onClick={() => setActiveTab('highlights')}
                className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${activeTab === 'highlights' ? 'bg-amber-50 text-amber-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Award className="w-4 h-4 mr-2" />
                精华专区
              </button>
              <button 
                onClick={() => setActiveTab('ai-tools')}
                className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${activeTab === 'ai-tools' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <BrainCircuit className="w-4 h-4 mr-2" />
                AI 题库预测
              </button>
            </div>

            {/* Content Based on Tabs */}
            <AnimatePresence mode="wait">
              {activeTab === 'ai-tools' ? (
                <motion.div
                  key="ai-tools"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                >
                  <div className="flex items-center mb-6">
                    <Sparkles className="w-6 h-6 text-indigo-500 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">AI 面试考题生成器</h2>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">输入目标岗位与公司，AI 将基于全网真实面经数据，为您提炼高频词并自动生成模拟笔试/面试题。</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">目标公司 (例如：Google)</label>
                      <input 
                        type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">目标岗位 (例如：SDE)</label>
                      <input 
                        type="text" value={role} onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerateAI}
                    disabled={isGenerating || !company || !role}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center"
                  >
                    {isGenerating ? 'AI 正在深度解析与出题...' : '一键生成预测题库'}
                  </button>

                  {/* AI Results */}
                  {aiResult && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 pt-8 border-t border-gray-100 space-y-6">
                      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500">综合评估</p>
                          <p className="font-bold text-gray-900">面经真实难度预测</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-amber-400 fill-current mr-2" />
                          <span className="text-2xl font-black text-gray-900">{aiResult.difficultyPrediction}</span><span className="text-sm text-gray-500 ml-1">/ 5.0</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center"><Award className="w-4 h-4 mr-2 text-indigo-500" /> 高频考点提取</h3>
                        <div className="flex flex-wrap gap-2">
                          {aiResult.highFreq.map((tag: string) => (
                            <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-sm font-medium">{tag}</span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center"><Code className="w-4 h-4 mr-2 text-purple-500" /> AI 预测真题</h3>
                        <div className="space-y-3">
                          {aiResult.generatedQuestions.map((q: any, i: number) => (
                            <div key={i} className="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors bg-white shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                                  q.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                }`}>{q.difficulty}</span>
                                <span className="text-xs text-gray-500 font-medium">{q.type}</span>
                              </div>
                              <p className="text-gray-800 text-sm font-medium">{q.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {filteredExperiences.map((exp) => (
                    <div key={exp.id} className="bg-white p-6 border border-gray-200 rounded-2xl hover:border-primary hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors flex items-center">
                            {exp.isHighlight && <Award className="w-5 h-5 text-amber-500 mr-2 shrink-0" />}
                            {exp.title}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end shrink-0 ml-4">
                          <div className="flex items-center bg-gray-50 px-2 py-1 rounded border border-gray-100 mb-1">
                            <Star className="w-3 h-3 text-amber-400 fill-current mr-1" />
                            <span className="text-xs font-bold text-gray-700">难度 {exp.difficulty}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md flex items-center">
                          <Building2 className="w-3 h-3 mr-1" /> {exp.company}
                        </span>
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md flex items-center">
                          <Briefcase className="w-3 h-3 mr-1" /> {exp.position}
                        </span>
                        {exp.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium rounded-md flex items-center">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
                        {exp.content}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center hover:text-primary transition-colors">
                            <ThumbsUp className="w-4 h-4 mr-1.5" /> {exp.likesCount}
                          </span>
                          <span className="flex items-center hover:text-primary transition-colors">
                            <MessageSquare className="w-4 h-4 mr-1.5" /> {exp.commentsCount}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-3 font-medium text-gray-500">{exp.author}</span>
                          <span className="hidden sm:inline">{new Date(exp.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel: Sidebar Stats & Tags */}
          <div className="w-full lg:w-1/3 shrink-0 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 text-gray-400 mr-2" />
                热门面经分类 (Tags)
              </h3>
              <div className="flex flex-wrap gap-2">
                {['技术面试', '行为面试 (BQ)', 'HR面', '系统设计', '算法', '前端', '后端', '数据科学'].map(tag => (
                  <button key={tag} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-sm border border-indigo-100 p-6">
              <h3 className="font-bold text-indigo-900 mb-2 flex items-center">
                <BrainCircuit className="w-5 h-5 text-indigo-600 mr-2" />
                不知道怎么写面经？
              </h3>
              <p className="text-sm text-indigo-800/80 mb-4 leading-relaxed">
                试试使用 AI 面经录音助手，面试结束后直接口述你的回忆，AI 自动帮你整理成结构化、可阅读的精华面经！
              </p>
              <button className="w-full bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
                体验 AI 智能记录
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mock Publish Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">发布新面经</h2>
                <button onClick={() => setShowPublishModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                  <input type="text" placeholder="例如：Google SWE L3 视频面经" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">公司</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">岗位</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                    面试内容 & 注意事项
                    <span className="text-xs text-indigo-500 font-medium cursor-pointer flex items-center"><Sparkles className="w-3 h-3 mr-1"/> AI 帮你润色</span>
                  </label>
                  <textarea rows={6} placeholder="分享你的面试流程、遇到的题目以及给后来人的建议..." className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-primary resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">添加标签 (Tags)</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 cursor-pointer">+ 技术面试</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 cursor-pointer">+ 行为面试</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 cursor-pointer">+ HR面</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                <button onClick={() => setShowPublishModal(false)} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors">取消</button>
                <button onClick={() => setShowPublishModal(false)} className="px-6 py-2 bg-primary text-white font-medium hover:bg-primary-hover rounded-xl shadow-sm transition-colors">发布面经</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
