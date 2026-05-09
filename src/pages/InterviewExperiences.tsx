import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  ThumbsUp, 
  MessageSquare, 
  PenTool, 
  Clock, 
  User, 
  MapPin,
  Briefcase,
  Layers,
  X,
  ChevronDown
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import SEO from '../components/SEO';

// Mock Data
const MOCK_COMPANIES = ['全部', '字节跳动', '腾讯', '阿里巴巴', '华为', 'Google', 'Meta', 'Amazon', 'Microsoft'];
const MOCK_ROLES = ['全部', '前端开发', '后端开发', '算法工程师', '产品经理', '数据分析', '运营'];
const MOCK_ROUNDS = ['全部', '一面', '二面', '三面', 'HR面', '交叉面'];

const INITIAL_POSTS = [
  {
    id: 1,
    title: '字节跳动 抖音电商 前端开发 日常实习面经（已OC）',
    author: '前端小菜鸟',
    company: '字节跳动',
    role: '前端开发',
    round: '三面',
    date: '2024-03-20',
    content: '整体面试体验很好，面试官很注重基础。一面重点考察了JS基础闭包、原型链，手写防抖节流。二面主要问了React的Hooks原理，Fiber架构，以及之前项目中的性能优化点。三面带队Leader面，聊了非常多关于业务方向和未来职业规划的问题。',
    likes: 124,
    comments: 32,
    tags: ['实习', '前端基础', '手写代码']
  },
  {
    id: 2,
    title: 'Google SWE New Grad 2024 Virtual Onsite 面经',
    author: 'CS刷题王',
    company: 'Google',
    role: '后端开发',
    round: '交叉面',
    date: '2024-03-18',
    content: '一共进行了4轮连轴面（包含一轮Behavioral）。Technical面重点考察了图算法（BFS求最短路径变种）、动态规划以及系统设计基础（如何设计一个短链接服务）。Google的面试官非常喜欢和你互动沟通，遇到卡壳的点会给你合适的Hint，一定要注意Communication！',
    likes: 256,
    comments: 45,
    tags: ['LeetCode', '系统设计', '北美秋招']
  },
  {
    id: 3,
    title: '腾讯 WXG 微信支付 产品经理 秋招面经（凉经）',
    author: '不想做开发的PM',
    company: '腾讯',
    role: '产品经理',
    round: '二面',
    date: '2024-03-15',
    content: '挂在二面。一面是非常细节的简历深挖，重点问了实习期间做的一个拉新活动的转化率漏斗。二面偏宏观，给了个场景题：如果微信要在东南亚推广支付业务，你会如何设计冷启动策略？这部分准备不足，答得很空散。',
    likes: 89,
    comments: 112,
    tags: ['产品思维', '场景题', '业务出海']
  },
  {
    id: 4,
    title: '华为 2012实验室 算法工程师 春招面经',
    author: 'AI之路',
    company: '华为',
    role: '算法工程师',
    round: '一面',
    date: '2024-03-12',
    content: '华为的机试很难，建议提前多刷牛客上的原题（特别是字符串处理和回溯算法）。一面主要是过简历里的项目，因为我有论文，所以面试官问了很多关于模型Loss函数设计、优化器选择的细节。手撕代码是一道中等难度的二叉树遍历。',
    likes: 145,
    comments: 20,
    tags: ['华为机试', '深度学习', '模型优化']
  }
];

export default function InterviewExperiences() {
  const [posts, setPosts] = useState<any[]>(INITIAL_POSTS);
  const [activeCompany, setActiveCompany] = useState('全部');
  const [activeRole, setActiveRole] = useState('全部');
  const [activeRound, setActiveRound] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', company: '字节跳动', role: '前端开发', round: '一面', content: '', tags: '' });
  const { showToast } = useToast();

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const { fetchExperiencesList } = await import('../lib/firestore_api');
        const dbExps = await fetchExperiencesList();
        if (dbExps && dbExps.length > 0) {
          const formattedDbExps = dbExps.map((exp: any) => ({
            id: exp.id,
            title: exp.title || `${exp.company || ''} ${exp.role || ''} ${exp.round || ''}`,
            author: exp.userId || 'Anonymous user',
            company: exp.company || 'Unknown',
            role: exp.role || 'Unknown role',
            round: exp.round || 'Unknown round',
            date: '今天',
            content: exp.content || '',
            likes: Math.floor(Math.random() * 50) + 1,
            comments: Math.floor(Math.random() * 20),
            tags: [exp.role, exp.company].filter(Boolean)
          }));
          setPosts([...formattedDbExps, ...INITIAL_POSTS] as any[]);
        }
      } catch (error) {
        console.error('Failed to load experiences', error);
      }
    };
    loadExperiences();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      showToast('标题和内容不能为空', 'error');
      return;
    }

    try {
      const { db } = await import('../lib/firebase');
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      
      const newId = 'exp_' + Math.floor(Math.random() * 1000000);
      await setDoc(doc(db, 'interview_experiences', newId), {
         title: newPost.title,
         company: newPost.company,
         role: newPost.role,
         round: newPost.round,
         content: newPost.content,
         userId: 'You', // Since Auth might be active or not
         status: 'published',
         createdAt: serverTimestamp(),
         updatedAt: serverTimestamp()
      });

      const post = {
        id: newId,
        title: newPost.title,
        author: 'You', 
        company: newPost.company,
        role: newPost.role,
        round: newPost.round,
        date: new Date().toISOString().split('T')[0],
        content: newPost.content,
        likes: 0,
        comments: 0,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };

      setPosts([post, ...posts] as any[]);
      setIsModalOpen(false);
      setNewPost({ title: '', company: '字节跳动', role: '前端开发', round: '一面', content: '', tags: '' });
      showToast('面经发布成功！积分+50', 'success');
    } catch (e: any) {
       console.error("Error publishing", e);
       showToast('发布失败 ' + e.message, 'error');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesMatch = (activeCompany === '全部' || post.company === activeCompany) &&
                         (activeRole === '全部' || post.role === activeRole) &&
                         (activeRound === '全部' || post.round === activeRound);
    
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesMatch && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 font-sans">
      <SEO
        title="笔经面经 (Interview Experiences)"
        description="互联网/金融大厂求职真实面经库，包含笔试题目、面试流程、面试问题及详细解析，助你从容应对各大公司面试。"
        keywords="面经, 笔经, 字节跳动面经, 腾讯面经, 算法工程师面试, 留学生面试"
        canonical="https://www.zhiyincareer.com/interview-experiences"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-xl border border-blue-200">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">大厂面经库</h1>
              <p className="text-gray-500 mt-1">海量真实面试经验，助你摸清大厂套路</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜索公司、岗位或关键字..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center shadow-md whitespace-nowrap"
            >
              <PenTool className="w-4 h-4 mr-2" /> 发布面经
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar: Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <div className="flex items-center mb-4 text-gray-800">
                <Filter className="w-5 h-5 mr-2" />
                <h3 className="font-bold text-lg">筛选条件</h3>
              </div>
              
              <div className="space-y-6">
                {/* Company Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-3 flex items-center">
                    <Building2 className="w-4 h-4 mr-1.5" /> 公司
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_COMPANIES.map(company => (
                      <button
                        key={company}
                        onClick={() => setActiveCompany(company)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          activeCompany === company ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-3 flex items-center">
                    <Briefcase className="w-4 h-4 mr-1.5" /> 岗位
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_ROLES.map(role => (
                      <button
                        key={role}
                        onClick={() => setActiveRole(role)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          activeRole === role ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Round Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-3 flex items-center">
                    <Layers className="w-4 h-4 mr-1.5" /> 面试轮次
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_ROUNDS.map(round => (
                      <button
                        key={round}
                        onClick={() => setActiveRound(round)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          activeRound === round ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {round}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content: Post List */}
          <div className="lg:w-3/4">
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <div key={post.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold text-gray-900 leading-tight hover:text-blue-600 cursor-pointer">
                        {post.title}
                      </h2>
                      <span className="text-sm text-gray-400 whitespace-nowrap ml-4 flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> {post.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 whitespace-nowrap overflow-x-auto pb-1 scrollbar-hide">
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

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.content}
                    </p>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                      <div className="flex gap-2">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                        <button className="flex items-center hover:text-blue-600 transition-colors">
                          <ThumbsUp className="w-4 h-4 mr-1.5" /> {post.likes}
                        </button>
                        <button className="flex items-center hover:text-blue-600 transition-colors">
                          <MessageSquare className="w-4 h-4 mr-1.5" /> {post.comments}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的面经</h3>
                  <p className="text-gray-500 mb-6">尝试换个搜索词或放宽筛选条件，或者你可以成为第一个分享的人！</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-6 py-2.5 rounded-xl font-medium transition-colors"
                  >
                    分享我的面经
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Publish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <PenTool className="w-5 h-5 mr-2 text-blue-600" /> 发布面经
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handlePublish} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input 
                  type="text" 
                  value={newPost.title}
                  onChange={e => setNewPost({...newPost, title: e.target.value})}
                  placeholder="例如：字节跳动秋招前端一二三面面经"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">公司</label>
                  <div className="relative">
                    <select 
                      value={newPost.company}
                      onChange={e => setNewPost({...newPost, company: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                    >
                      {MOCK_COMPANIES.filter(c => c !== '全部').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">岗位</label>
                  <div className="relative">
                    <select 
                      value={newPost.role}
                      onChange={e => setNewPost({...newPost, role: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                    >
                      {MOCK_ROLES.filter(r => r !== '全部').map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">面试轮次</label>
                  <div className="relative">
                    <select 
                      value={newPost.round}
                      onChange={e => setNewPost({...newPost, round: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                    >
                      {MOCK_ROUNDS.filter(r => r !== '全部').map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">内容与真实题目分享</label>
                <textarea 
                  value={newPost.content}
                  onChange={e => setNewPost({...newPost, content: e.target.value})}
                  placeholder="详细描述面试流程、考察的技术点、HR沟通细节或代码原题..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all h-40 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标签 (可选，用逗号分隔)</label>
                <input 
                  type="text" 
                  value={newPost.tags}
                  onChange={e => setNewPost({...newPost, tags: e.target.value})}
                  placeholder="例如：后端开发, LeetCode, 春招"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  取消
                </button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20">
                  发布并获取积分
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
