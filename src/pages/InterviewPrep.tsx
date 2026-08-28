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
  Database,
  FileText,
  Filter,
  Loader2,
  MessageSquare,
  PenTool,
  Sparkles,
  Star,
  ThumbsUp,
  TrendingUp,
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

type PrepQuestion = {
  id: string | number;
  title: string;
  category: string;
  categoryName: string;
  difficulty: string;
  answer: string;
  views: number;
  likes: number;
  isFeatured: boolean;
  isHot: boolean;
  source: string;
};

const questionCategoryLabels: Record<string, string> = {
  java: 'Java',
  frontend: '前端',
  algorithm: '算法',
  system: '系统设计',
  behavior: '行为面试',
  python: 'Python',
  database: '数据库',
};

const fallbackQuestions: PrepQuestion[] = [
  {
    id: 'fallback-q-algo',
    title: '如何解决数组中的 Two Sum 类问题？',
    category: 'algorithm',
    categoryName: '算法',
    difficulty: '简单',
    answer: '用 HashMap 记录遍历过的元素，每一步查 target - nums[i] 是否存在；Three Sum 可排序后用双指针。',
    views: 3100,
    likes: 1860,
    isFeatured: true,
    isHot: true,
    source: '小程序精选题库',
  },
  {
    id: 'fallback-q-system',
    title: '如何设计一个短链接系统？',
    category: 'system',
    categoryName: '系统设计',
    difficulty: '困难',
    answer: '核心是长 URL 到短码映射，可用自增 ID 转 62 进制，结合 Redis 缓存、过期策略、统计和限流。',
    views: 2340,
    likes: 1404,
    isFeatured: true,
    isHot: true,
    source: '小程序精选题库',
  },
  {
    id: 'fallback-q-behavior',
    title: 'Tell me about a time you failed.',
    category: 'behavior',
    categoryName: '行为面试',
    difficulty: '中等',
    answer: '选择真实但有复盘价值的失败案例，按背景、决策、结果、反思和改变来讲，展示成长心态。',
    views: 2000,
    likes: 1200,
    isFeatured: true,
    isHot: true,
    source: '小程序精选题库',
  },
];

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
  isHighlight: Boolean(item.isHighlight) || (item.likesCount || 0) >= 80 || (item.commentsCount || 0) >= 12,
  author: item.userName || '匿名用户',
  createdAt: item.createdAt || new Date().toISOString(),
});

const mapPrepQuestion = (item: any, index: number): PrepQuestion => {
  const category = item.category || 'behavior';
  const views = Number(item.views || 0);
  return {
    id: item.id || `question-${index}`,
    title: item.title || item.question || '面试题',
    category,
    categoryName: item.categoryName || questionCategoryLabels[category] || '综合',
    difficulty: item.difficulty || '中等',
    answer: item.answer || item.hint || '',
    views,
    likes: Number(item.likes || Math.floor(views * 0.6)),
    isFeatured: Boolean(item.isFeatured),
    isHot: Boolean(item.isHot),
    source: item.source || '小程序精选题库',
  };
};

const getExperienceScore = (experience: PrepExperience) =>
  experience.likesCount + experience.commentsCount * 10 + experience.difficulty * 15;

const toGeneratedQuestion = (question: PrepQuestion) => ({
  type: question.categoryName,
  text: question.title,
  difficulty: question.difficulty,
  hint: question.answer,
});

const buildLocalAiResult = (questions: PrepQuestion[]) => {
  const tags = Array.from(new Set(questions.map((question) => question.categoryName))).slice(0, 5);
  const difficultyScore = questions.reduce((sum, question) => {
    if (question.difficulty === '困难') return sum + 4.7;
    if (question.difficulty === '中等') return sum + 4.1;
    return sum + 3.4;
  }, 0) / Math.max(questions.length, 1);

  return {
    highFreq: tags.length ? tags : ['算法', '系统设计', '行为面试'],
    generatedQuestions: questions.slice(0, 6).map(toGeneratedQuestion),
    difficultyPrediction: Number((difficultyScore || 4.2).toFixed(1)),
    source: '小程序精选题库',
  };
};

const getDifficultyClass = (difficulty: string) => {
  if (difficulty === '困难' || difficulty === 'Hard') return 'bg-red-50 text-red-600 border-red-100';
  if (difficulty === '中等' || difficulty === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-100';
  return 'bg-emerald-50 text-emerald-700 border-emerald-100';
};

export default function InterviewPrep() {
  const [activeTab, setActiveTab] = useState<'recent' | 'highlights' | 'ai-tools'>('recent');
  const [experiences, setExperiences] = useState<PrepExperience[]>(fallbackExperiences);
  const [experienceSource, setExperienceSource] = useState('小程序面经库');
  const [isExperienceLoading, setIsExperienceLoading] = useState(true);
  const [questions, setQuestions] = useState<PrepQuestion[]>(fallbackQuestions);
  const [questionSource, setQuestionSource] = useState('小程序精选题库');
  const [questionTotal, setQuestionTotal] = useState(fallbackQuestions.length);
  const [isQuestionLoading, setIsQuestionLoading] = useState(true);
  const [role, setRole] = useState('Software Engineer');
  const [company, setCompany] = useState('Google');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsExperienceLoading(true);
    apiFetch('/api/proxy/experiences?page=1&pageSize=40')
      .then((response) => {
        const list = response.data?.list || [];
        if (!cancelled && list.length) {
          setExperiences(list.map(mapPrepExperience));
          setExperienceSource(response.data?.source === 'database+curated' ? '小程序面经库 + 精选面经' : '小程序面经库');
        }
      })
      .catch((error) => {
        console.warn('Interview prep fallback:', error);
        if (!cancelled) setExperienceSource('本地兜底面经');
      })
      .finally(() => {
        if (!cancelled) setIsExperienceLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams({
        page: '1',
        pageSize: '12',
        mode: 'relevant',
        company: company.trim() || 'Google',
        role: role.trim() || 'Software Engineer',
      });

      setIsQuestionLoading(true);
      apiFetch(`/api/proxy/interview-questions?${params.toString()}`)
        .then((response) => {
          const list = response.data?.list || [];
          if (!cancelled && list.length) {
            setQuestions(list.map(mapPrepQuestion));
            setQuestionSource(response.data?.sourceLabel || '小程序精选题库');
            setQuestionTotal(response.data?.stats?.total || response.data?.total || list.length);
          }
        })
        .catch((error) => {
          console.warn('Question bank fallback:', error);
          if (!cancelled) {
            setQuestions(fallbackQuestions);
            setQuestionSource('本地兜底题库');
            setQuestionTotal(fallbackQuestions.length);
          }
        })
        .finally(() => {
          if (!cancelled) setIsQuestionLoading(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [company, role]);

  const recentExperiences = useMemo(
    () => [...experiences].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [experiences],
  );

  const highlightExperiences = useMemo(() => {
    const highlighted = experiences
      .filter((experience) => experience.isHighlight)
      .sort((a, b) => getExperienceScore(b) - getExperienceScore(a));

    if (highlighted.length >= 4) return highlighted;
    return [...experiences].sort((a, b) => getExperienceScore(b) - getExperienceScore(a)).slice(0, 8);
  }, [experiences]);

  const filteredExperiences = useMemo(
    () => (activeTab === 'highlights' ? highlightExperiences : recentExperiences),
    [activeTab, highlightExperiences, recentExperiences],
  );

  const activeExperienceLabel =
    activeTab === 'ai-tools'
      ? `${questionSource} · 共 ${questionTotal} 题`
      : activeTab === 'highlights'
        ? '按点赞、评论和难度综合排序'
        : '按发布时间排序';

  const handleGenerateAI = async () => {
    if (!role.trim() || !company.trim()) return;
    setIsGenerating(true);
    setAiResult(null);
    const questionSeed = questions.length ? questions : fallbackQuestions;
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
      const parsed = match ? JSON.parse(match[0]) : null;
      setAiResult(parsed || buildLocalAiResult(questionSeed));
    } catch (error) {
      console.warn('AI interview prep fallback:', error);
      setAiResult(buildLocalAiResult(questionSeed));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="zy-page-shell min-h-screen bg-white pb-16 pt-28">
      <SEO
        title="笔经面经社区"
        description="查看真实面经、提炼高频考点，并使用 AI 生成目标公司和岗位的模拟题。"
        keywords="面试准备,面经社区,AI面试题,留学生求职"
        canonical="https://www.zhiyincareer.com/interview-prep"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="zy-page-title flex items-center text-3xl">
              <BookOpen className="w-8 h-8 text-primary mr-3" />
              笔经面经社区
            </h1>
            <p className="text-gray-600 mt-2">发现真实面经、沉淀求职经验，并用 AI 预测下一场面试考点。</p>
            <p className="text-xs text-gray-400 mt-2">
              {experiences.length} 条面经 · {experienceSource} · {activeExperienceLabel}
            </p>
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
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        AI 正在分析并出题...
                      </>
                    ) : '生成预测题库'}
                  </button>

                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 flex items-center">
                          <Database className="w-4 h-4 mr-2 text-indigo-500" />
                          小程序题库匹配
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {isQuestionLoading ? '正在同步题库...' : `${questionSource} · 共 ${questionTotal} 题 · 当前匹配 ${questions.length} 题`}
                        </p>
                      </div>
                      <span className="inline-flex items-center w-fit px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold">
                        <TrendingUp className="w-3.5 h-3.5 mr-1" />
                        按目标岗位排序
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {questions.slice(0, 6).map((question) => (
                        <article key={question.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50/70 hover:bg-white hover:border-indigo-200 transition-colors">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getDifficultyClass(question.difficulty)}`}>{question.difficulty}</span>
                            <span className="text-xs text-gray-500 font-medium">{question.categoryName}</span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 leading-5">{question.title}</h4>
                          {question.answer && <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-5">{question.answer}</p>}
                          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                            <span className="flex items-center"><FileText className="w-3.5 h-3.5 mr-1" /> {question.source}</span>
                            <span>{question.views} 浏览</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>

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
                                <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getDifficultyClass(question.difficulty || '')}`}>{question.difficulty}</span>
                                <span className="text-xs text-gray-500 font-medium">{question.type}</span>
                              </div>
                              <p className="text-gray-800 text-sm font-medium">{question.text}</p>
                              {question.hint && <p className="mt-2 text-xs text-gray-500 leading-5">{question.hint}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                    <span>{activeTab === 'highlights' ? '精华专区' : '最新面经'} · {filteredExperiences.length} 条</span>
                    <span>{activeExperienceLabel}</span>
                  </div>
                  {isExperienceLoading && (
                    <div className="bg-white p-5 border border-gray-200 rounded-2xl text-sm text-gray-500 flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin text-primary" />
                      正在同步小程序面经...
                    </div>
                  )}
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
                  {!isExperienceLoading && filteredExperiences.length === 0 && (
                    <div className="bg-white p-10 border border-gray-200 rounded-2xl text-center">
                      <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="font-bold text-gray-900">暂未同步到相关面经</p>
                      <p className="text-sm text-gray-500 mt-1">可以稍后刷新，或前往大厂面经库发布一条新的经验。</p>
                    </div>
                  )}
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
