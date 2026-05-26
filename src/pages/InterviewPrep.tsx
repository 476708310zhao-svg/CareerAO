import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Award,
  BookOpen,
  BrainCircuit,
  Briefcase,
  Building2,
  Clock,
  Code,
  FileText,
  Filter,
  MessageSquare,
  PenTool,
  Sparkles,
  Star,
  ThumbsUp,
  X,
} from 'lucide-react';

import SEO from '../components/SEO';
import { apiFetch } from '../lib/api';

type PrepExperience = {
  id: string | number;
  title: string;
  company: string;
  position: string;
  type: string;
  difficulty: number;
  content: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  isHighlight: boolean;
  author: string;
  createdAt: string;
};

const fallbackExperiences: PrepExperience[] = [
  {
    id: 'fallback-google',
    title: 'Google SWE New Grad 面试复盘',
    company: 'Google',
    position: 'Software Engineer',
    type: '技术面',
    difficulty: 4.7,
    content: '算法题覆盖图、动态规划和字符串处理，行为面试重点看沟通、owner 意识和复盘能力。',
    tags: ['算法', '系统设计', 'BQ'],
    likesCount: 342,
    commentsCount: 56,
    isHighlight: true,
    author: 'Offer 收割机',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fallback-amazon',
    title: 'Amazon SDE Intern VO 经验',
    company: 'Amazon',
    position: 'SDE Intern',
    type: '综合面',
    difficulty: 3.8,
    content: '一轮 coding 加 leadership principles。建议准备 5 个 STAR 故事，覆盖冲突、失败、owner 和影响力。',
    tags: ['LP', '实习', '算法'],
    likesCount: 45,
    commentsCount: 12,
    isHighlight: false,
    author: '匿名用户',
    createdAt: new Date().toISOString(),
  },
];

const mapPrepExperience = (item: any, index: number): PrepExperience => ({
  id: item.id,
  title: item.title || `${item.company || '公司'} ${item.position || ''} 面经`,
  company: item.company || '未知公司',
  position: item.position || '未知岗位',
  type: item.type || item.round || '面试',
  difficulty: item.difficulty || (index < 3 ? 4.5 : 3.8),
  content: item.content || '',
  tags: Array.isArray(item.tags) ? item.tags : [],
  likesCount: item.likesCount || 0,
  commentsCount: item.commentsCount || 0,
  isHighlight: index < 3 || (item.likesCount || 0) >= 50,
  author: item.userName || '匿名用户',
  createdAt: item.createdAt || new Date().toISOString(),
});

export default function InterviewPrep() {
  const [activeTab, setActiveTab] = useState<'recent' | 'highlights' | 'ai-tools'>('recent');
  const [experiences, setExperiences] = useState<PrepExperience[]>(fallbackExperiences);
  const [role, setRole] = useState('Software Engineer');
  const [company, setCompany] = useState('Google');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch('/api/proxy/experiences?page=1&pageSize=12')
      .then((response) => {
        const list = response.data?.list || [];
        if (!cancelled && list.length) setExperiences(list.map(mapPrepExperience));
      })
      .catch((error) => console.warn('Interview prep fallback:', error));
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredExperiences = useMemo(
    () => (activeTab === 'highlights' ? experiences.filter((experience) => experience.isHighlight) : experiences),
    [activeTab, experiences],
  );

  const handleGenerateAI = async () => {
    if (!role.trim() || !company.trim()) return;
    setIsGenerating(true);
    setAiResult(null);
    try {
      const response = await apiFetch('/api/proxy/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          temperature: 0.45,
          messages: [
            {
              role: 'system',
              content: 'You are an interview preparation coach. Return JSON only with highFreq string array, generatedQuestions array of {type,text,difficulty}, and difficultyPrediction number.',
            },
            {
              role: 'user',
              content: `Company: ${company}\nRole: ${role}\nGenerate realistic interview prep topics and questions.`,
            },
          ],
        }),
      });
      const raw = response.choices?.[0]?.message?.content || '';
      const match = raw.match(/\{[\s\S]*\}/);
      setAiResult(match ? JSON.parse(match[0]) : null);
    } catch (error) {
      console.warn('AI interview prep fallback:', error);
      setAiResult({
        highFreq: ['Algorithms', 'System Design', 'Behavioral stories'],
        generatedQuestions: [
          { type: 'Coding', text: 'Given task dependencies, determine whether all tasks can be completed.', difficulty: 'Medium' },
          { type: 'System Design', text: 'Design a distributed rate limiter for a global product.', difficulty: 'Hard' },
          { type: 'Behavioral', text: 'Tell me about a time you disagreed with a teammate and how you resolved it.', difficulty: 'Medium' },
        ],
        difficultyPrediction: 4.5,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <SEO
        title="笔经面经社区"
        description="查看真实面经、提炼高频考点，并使用 AI 生成目标公司和岗位的模拟题。"
        keywords="面试准备,面经社区,AI面试题,留学生求职"
        canonical="https://www.zhiyincareer.com/interview-prep"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center">
              <BookOpen className="w-8 h-8 text-primary mr-3" />
              笔经面经社区
            </h1>
            <p className="text-gray-600 mt-2">发现真实面经、沉淀求职经验，并用 AI 预测下一场面试考点。</p>
          </div>
          <button onClick={() => setShowPublishModal(true)} className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center shrink-0 w-fit">
            <PenTool className="w-4 h-4 mr-2" />
            发布面经
          </button>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          <section className="w-full lg:w-2/3 space-y-6">
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-full overflow-x-auto shrink-0">
              {[
                ['recent', '最新面经', Clock, 'bg-primary/10 text-primary'],
                ['highlights', '精华专区', Award, 'bg-amber-50 text-amber-600'],
                ['ai-tools', 'AI 题库预测', BrainCircuit, 'bg-indigo-50 text-indigo-600'],
              ].map(([id, label, Icon, activeClass]) => (
                <button
                  key={id as string}
                  onClick={() => setActiveTab(id as typeof activeTab)}
                  className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${activeTab === id ? activeClass : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {React.createElement(Icon as typeof Clock, { className: 'w-4 h-4 mr-2' })}
                  {label as string}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'ai-tools' ? (
                <motion.div key="ai-tools" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex items-center mb-6">
                    <Sparkles className="w-6 h-6 text-indigo-500 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">AI 面试考题生成器</h2>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">输入目标公司和岗位，AI 会生成高频考点、模拟真题和难度预估。</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <label className="block">
                      <span className="block text-sm font-medium text-gray-700 mb-1">目标公司</span>
                      <input value={company} onChange={(event) => setCompany(event.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium text-gray-700 mb-1">目标岗位</span>
                      <input value={role} onChange={(event) => setRole(event.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </label>
                  </div>
                  <button onClick={handleGenerateAI} disabled={isGenerating || !company || !role} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center">
                    {isGenerating ? 'AI 正在分析并出题...' : '生成预测题库'}
                  </button>

                  {aiResult && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 pt-8 border-t border-gray-100 space-y-6">
                      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500">综合评估</p>
                          <p className="font-bold text-gray-900">面试真实难度预测</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-amber-400 fill-current mr-2" />
                          <span className="text-2xl font-black text-gray-900">{aiResult.difficultyPrediction || 4.2}</span>
                          <span className="text-sm text-gray-500 ml-1">/ 5.0</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center"><Award className="w-4 h-4 mr-2 text-indigo-500" /> 高频考点</h3>
                        <div className="flex flex-wrap gap-2">
                          {(aiResult.highFreq || []).map((tag: string) => (
                            <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-sm font-medium">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center"><Code className="w-4 h-4 mr-2 text-purple-500" /> AI 预测真题</h3>
                        <div className="space-y-3">
                          {(aiResult.generatedQuestions || []).map((question: any, index: number) => (
                            <div key={`${question.type}-${index}`} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                <span className={`px-2 py-0.5 text-xs font-bold rounded ${question.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{question.difficulty}</span>
                                <span className="text-xs text-gray-500 font-medium">{question.type}</span>
                              </div>
                              <p className="text-gray-800 text-sm font-medium">{question.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  {filteredExperiences.map((experience) => (
                    <article key={experience.id} className="bg-white p-6 border border-gray-200 rounded-2xl hover:border-primary hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3 gap-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                          {experience.isHighlight && <Award className="w-5 h-5 text-amber-500 mr-2 shrink-0" />}
                          {experience.title}
                        </h2>
                        <div className="flex items-center bg-gray-50 px-2 py-1 rounded border border-gray-100 shrink-0">
                          <Star className="w-3 h-3 text-amber-400 fill-current mr-1" />
                          <span className="text-xs font-bold text-gray-700">难度 {experience.difficulty}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md flex items-center"><Building2 className="w-3 h-3 mr-1" /> {experience.company}</span>
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md flex items-center"><Briefcase className="w-3 h-3 mr-1" /> {experience.position}</span>
                        {experience.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium rounded-md">{tag}</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">{experience.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center"><ThumbsUp className="w-4 h-4 mr-1.5" /> {experience.likesCount}</span>
                          <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-1.5" /> {experience.commentsCount}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-3 font-medium text-gray-500">{experience.author}</span>
                          <span className="hidden sm:inline">{new Date(experience.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <aside className="w-full lg:w-1/3 shrink-0 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 text-gray-400 mr-2" />
                热门面经标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {['技术面', '行为面试', 'HR面', '系统设计', '算法', '前端', '后端', '数据科学'].map((tag) => (
                  <button key={tag} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm transition-colors">{tag}</button>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-sm border border-indigo-100 p-6">
              <h3 className="font-bold text-indigo-900 mb-2 flex items-center">
                <BrainCircuit className="w-5 h-5 text-indigo-600 mr-2" />
                不知道怎么准备？
              </h3>
              <p className="text-sm text-indigo-800/80 mb-4 leading-relaxed">切到 AI 题库预测，输入公司和岗位，就能得到一组可立即练习的题目。</p>
              <button onClick={() => setActiveTab('ai-tools')} className="w-full bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
                打开 AI 题库预测
              </button>
            </div>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">发布新面经</h2>
                <button onClick={() => setShowPublishModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 text-sm text-gray-600">
                发布表单已在“笔经面经”主页面接入后端接口。这里保留快捷入口，避免两个入口逻辑重复。
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                <button onClick={() => setShowPublishModal(false)} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors">关闭</button>
                <a href="/interview-experiences" className="px-6 py-2 bg-primary text-white font-medium hover:bg-primary-hover rounded-xl shadow-sm transition-colors">去发布面经</a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
