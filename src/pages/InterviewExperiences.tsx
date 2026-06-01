import React, { useEffect, useMemo, useState } from 'react';
import {
  Bot,
  Briefcase,
  Building2,
  ChevronDown,
  Clock,
  Filter,
  Layers,
  MessageSquare,
  PenTool,
  Search,
  Sparkles,
  ThumbsUp,
  User,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

type Experience = {
  id: number | string;
  title: string;
  author: string;
  company: string;
  role: string;
  round: string;
  type: string;
  date: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
};

const filters = {
  companies: ['全部', 'Google', 'Meta', 'Amazon', 'Microsoft', 'ByteDance', 'Tencent', 'Alibaba', 'Huawei', 'Goldman Sachs', 'McKinsey'],
  roles: ['全部', 'Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'Product Manager', 'Data Analyst', 'Machine Learning Engineer', 'Business Analyst', 'Investment Banking Analyst'],
  rounds: ['全部', '一面', '二面', '三面', 'HR 面', 'Virtual Onsite', 'Super Day', 'Case Interview'],
};

const fallbackExperiences: Experience[] = [
  {
    id: 'fallback-google',
    title: 'Google SWE New Grad Virtual Onsite 面经',
    author: '匿名用户',
    company: 'Google',
    role: 'Software Engineer',
    round: 'Virtual Onsite',
    type: '技术面试',
    date: '近期',
    content: '四轮面试包含算法、系统设计和行为面。算法题重视沟通，建议边写边解释思路、复杂度和测试用例。',
    likes: 128,
    comments: 12,
    tags: ['算法', '系统设计', 'BQ'],
  },
  {
    id: 'fallback-byte',
    title: 'ByteDance 前端实习一二面复盘',
    author: '前端同学',
    company: 'ByteDance',
    role: 'Frontend Engineer',
    round: '二面',
    type: '技术面试',
    date: '近期',
    content: '重点考察 JavaScript 基础、React Hooks、项目性能优化和手写代码。二面会深化业务理解和协作方式。',
    likes: 96,
    comments: 8,
    tags: ['前端', 'React', '实习'],
  },
];

const mapExperience = (item: any): Experience => ({
  id: item.id,
  title: item.title || `${item.company || '公司'} ${item.position || ''} 面经`,
  author: item.userName || item.author || '匿名用户',
  company: item.company || '未知公司',
  role: item.position || item.role || '未知岗位',
  round: item.round || item.type || '面试',
  type: item.type || '面试',
  date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('zh-CN') : '近期',
  content: item.content || '',
  likes: item.likesCount || item.likes || 0,
  comments: item.commentsCount || item.comments || 0,
  tags: Array.isArray(item.tags) ? item.tags.filter(Boolean) : [],
});

export default function InterviewExperiences() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Experience[]>(fallbackExperiences);
  const [likedPosts, setLikedPosts] = useState<Set<Experience['id']>>(new Set());
  const [activeCompany, setActiveCompany] = useState('全部');
  const [activeRole, setActiveRole] = useState('全部');
  const [activeRound, setActiveRound] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [dataSource, setDataSource] = useState('后端面经库');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    company: 'Google',
    role: 'Software Engineer',
    round: '一面',
    content: '',
    tags: '',
  });

  useEffect(() => {
    let cancelled = false;
    const loadExperiences = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch('/api/proxy/experiences?page=1&pageSize=30');
        const list = response.data?.list || [];
        if (!cancelled && list.length) {
          setPosts(list.map(mapExperience));
          setDataSource(response.data?.source === 'database+curated' ? '数据库与精选面经库' : '数据库面经库');
        }
      } catch (error) {
        console.warn('Experience list fallback:', error);
        if (!cancelled) setDataSource('本地兜底面经');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    loadExperiences();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesFilters =
        (activeCompany === '全部' || post.company === activeCompany) &&
        (activeRole === '全部' || post.role === activeRole) &&
        (activeRound === '全部' || post.round === activeRound);
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.company.toLowerCase().includes(query) ||
        post.role.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query);
      return matchesFilters && matchesSearch;
    });
  }, [activeCompany, activeRole, activeRound, posts, searchQuery]);

  const hasActiveFilters =
    activeCompany !== '全部' ||
    activeRole !== '全部' ||
    activeRound !== '全部' ||
    Boolean(searchQuery.trim());

  const clearFilters = () => {
    setActiveCompany('全部');
    setActiveRole('全部');
    setActiveRound('全部');
    setSearchQuery('');
  };

  const toggleLike = (postId: Experience['id']) => {
    setLikedPosts((current) => {
      const next = new Set(current);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
        showToast('已收藏这条备考经验', 'success');
      }
      return next;
    });
  };

  const startInterviewPractice = (post: Experience) => {
    navigate('/ai-interview', {
      state: {
        company: post.company,
        role: post.role,
        jd: [
          post.title,
          `公司：${post.company}`,
          `岗位：${post.role}`,
          `轮次：${post.round}`,
          `面经重点：${post.content}`,
          post.tags.length ? `标签：${post.tags.join('、')}` : '',
        ].filter(Boolean).join('\n'),
      },
    });
  };

  const handlePublish = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      showToast('标题和内容不能为空', 'error');
      return;
    }

    setIsPublishing(true);
    const tags = newPost.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    try {
      const response = await apiFetch('/api/proxy/experiences', {
        method: 'POST',
        body: JSON.stringify({
          company: newPost.company,
          position: newPost.role,
          round: newPost.round,
          type: '面试',
          title: newPost.title,
          content: newPost.content,
          tags,
          isAnonymous: true,
        }),
      });
      const created = response.data ? mapExperience(response.data) : null;
      setPosts((current) => [created || {
        id: `local_${Date.now()}`,
        title: newPost.title,
        author: '匿名用户',
        company: newPost.company,
        role: newPost.role,
        round: newPost.round,
        type: '面试',
        date: new Date().toLocaleDateString('zh-CN'),
        content: newPost.content,
        likes: 0,
        comments: 0,
        tags,
      }, ...current]);
      setIsModalOpen(false);
      setNewPost({ title: '', company: 'Google', role: 'Software Engineer', round: '一面', content: '', tags: '' });
      showToast('面经已发布', 'success');
    } catch (error: any) {
      showToast(error.message || '发布失败，请先登录后再试', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <SEO
        title="笔经面经"
        description="查看和分享真实面试经验，按公司、岗位和轮次筛选，帮助留学生准备技术面、行为面、Case 和 HR 面。"
        keywords="面经,笔经,留学生面试,大厂面试,技术面试,行为面试"
        canonical="https://www.zhiyincareer.com/interview-experiences"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-xl border border-blue-200">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">大厂面经库</h1>
              <p className="text-gray-500 mt-1">按公司、岗位和轮次筛选真实经验，快速摸清面试重点。</p>
              <p className="text-xs text-gray-400 mt-1">{posts.length} 条面经 · {dataSource}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索公司、岗位或关键词..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
              />
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center shadow-sm whitespace-nowrap">
              <PenTool className="w-4 h-4 mr-2" /> 发布面经
            </button>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4 text-gray-800">
                <div className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  <h2 className="font-bold text-lg">筛选条件</h2>
                </div>
                {hasActiveFilters && (
                  <button type="button" onClick={clearFilters} className="text-xs font-medium text-gray-500 hover:text-blue-600">
                    清空
                  </button>
                )}
              </div>
              {[
                ['公司', filters.companies, activeCompany, setActiveCompany, Building2],
                ['岗位', filters.roles, activeRole, setActiveRole, Briefcase],
                ['轮次', filters.rounds, activeRound, setActiveRound, Layers],
              ].map(([label, values, active, setter, Icon]) => (
                <div key={label as string} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center">
                    {React.createElement(Icon as typeof Building2, { className: 'w-4 h-4 mr-1.5' })}
                    {label as string}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(values as string[]).map((value) => (
                      <button
                        key={value}
                        onClick={() => (setter as React.Dispatch<React.SetStateAction<string>>)(value)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          active === value ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="mt-6 rounded-2xl bg-gray-900 p-5 text-white">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-100">
                  <Sparkles className="h-4 w-4" />
                  AI 备考动作
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-300">选中目标公司和岗位后，可以直接用面经内容生成模拟面试。</p>
                <button
                  type="button"
                  onClick={() => navigate('/ai-interview')}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-blue-50"
                >
                  <Bot className="mr-2 h-4 w-4" />
                  进入 AI 面试
                </button>
              </div>
            </div>
          </aside>

          <section className="lg:w-3/4">
            {isLoading ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 text-gray-500">正在同步面经数据...</div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-3 gap-4">
                      <h2 className="text-xl font-bold text-gray-900 leading-tight">{post.title}</h2>
                      <span className="text-sm text-gray-400 whitespace-nowrap flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> {post.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-4 flex-wrap">
                      <span className="flex items-center bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        <User className="w-4 h-4 mr-1.5 text-gray-400" /> {post.author}
                      </span>
                      <span className="flex items-center font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        <Building2 className="w-4 h-4 mr-1.5" /> {post.company}
                      </span>
                      <span className="flex items-center text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        <Briefcase className="w-4 h-4 mr-1.5 text-gray-400" /> {post.role}
                      </span>
                      <span className="flex items-center text-orange-700 bg-orange-50 px-2 py-1 rounded border border-orange-100">
                        <Layers className="w-4 h-4 mr-1.5 text-orange-400" /> {post.round}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{post.content}</p>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 pt-4 border-t border-gray-50 gap-4">
                      <div className="flex gap-2 flex-wrap">
                        {post.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">#{tag}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-500">
                        <button
                          type="button"
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center rounded-lg px-2 py-1 transition-colors ${
                            likedPosts.has(post.id) ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1.5" fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                          {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                        </button>
                        <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-1.5" /> {post.comments}</span>
                        <button
                          type="button"
                          onClick={() => startInterviewPractice(post)}
                          className="inline-flex items-center rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                          <Bot className="mr-1.5 h-3.5 w-3.5" />
                          AI 模拟
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的面经</h2>
                <p className="text-gray-500 mb-6">可以换个关键词，或发布第一篇相关经验。</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2.5 rounded-xl font-medium transition-colors">清空筛选</button>
                  )}
                  <button onClick={() => setIsModalOpen(true)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-6 py-2.5 rounded-xl font-medium transition-colors">分享我的面经</button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <PenTool className="w-5 h-5 mr-2 text-blue-600" /> 发布面经
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="关闭">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="p-6 space-y-5">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">标题</span>
                <input value={newPost.title} onChange={(event) => setNewPost({ ...newPost, title: event.target.value })} placeholder="例如：Google SWE L3 视频面经" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  ['公司', 'company', filters.companies.filter((value) => value !== '全部')],
                  ['岗位', 'role', filters.roles.filter((value) => value !== '全部')],
                  ['轮次', 'round', filters.rounds.filter((value) => value !== '全部')],
                ].map(([label, field, values]) => (
                  <label key={field as string} className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-1">{label as string}</span>
                    <div className="relative">
                      <select value={newPost[field as keyof typeof newPost]} onChange={(event) => setNewPost({ ...newPost, [field as string]: event.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white">
                        {(values as string[]).map((value) => <option key={value} value={value}>{value}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </label>
                ))}
              </div>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">内容与真题分享</span>
                <textarea value={newPost.content} onChange={(event) => setNewPost({ ...newPost, content: event.target.value })} placeholder="描述面试流程、考点、题目和建议..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all h-40 resize-none" />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">标签，使用英文逗号分隔</span>
                <input value={newPost.tags} onChange={(event) => setNewPost({ ...newPost, tags: event.target.value })} placeholder="例如：算法, BQ, 系统设计" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
              </label>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors">取消</button>
                <button type="submit" disabled={isPublishing} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60">
                  {isPublishing ? '发布中...' : '发布面经'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
