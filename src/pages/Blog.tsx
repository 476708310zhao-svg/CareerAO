import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Clock, 
  Eye, 
  ChevronRight,
  TrendingUp,
  Bookmark,
  Calendar,
  User
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

// Mock Data for Blog Posts
const MOCK_CATEGORIES = [
  '全部', '简历优化', '面试技巧', '行业分析', '薪资谈判', '职场发展', '笔试真题'
];

const MOCK_BLOG_POSTS = [
  {
    id: 1,
    title: '手把手教你写出大厂HR秒回的简历（附2024最新模板）',
    excerpt: '简历是你向企业展示自己的第一步，好的简历不是经历的堆砌，而是能力的提炼。这篇文章将从排版、STAR法则、关键词优化三个维度，带你打造一份不可拒绝的满分简历。',
    category: '简历优化',
    author: '职引前程导师',
    date: '2024-03-15',
    readTime: '8 min read',
    tags: ['简历修改', 'STAR法则', '秋招'],
    views: 12540,
    likes: 843,
    comments: 112,
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60',
    isRecommended: true
  },
  {
    id: 2,
    title: '2024年春招大厂面试全流程解析：从一面到HR面的通关秘籍',
    excerpt: '一面考察基础计算，二面考察系统设计，三面考察业务理解，HR面考察抗压能力...面试套路早知道，斩获Offer少走弯路。',
    category: '面试技巧',
    author: '资深技术面试官',
    date: '2024-03-10',
    readTime: '12 min read',
    tags: ['大厂面经', '春招', '面试干货'],
    views: 8900,
    likes: 652,
    comments: 89,
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=60',
    isRecommended: true
  },
  {
    id: 3,
    title: 'AI时代下的职场生存指南：哪些岗位会被替代？',
    excerpt: '随着大语言模型和生成式AI的飞速发展，很多传统岗位受到了冲击。作为大学生和初入职场的新人，应当如何调整自己的职业规划？',
    category: '行业分析',
    author: '行业研究员',
    date: '2024-03-05',
    readTime: '6 min read',
    tags: ['人工智能', '职业规划', '前沿趋势'],
    views: 6530,
    likes: 421,
    comments: 231,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60',
    isRecommended: false
  },
  {
    id: 4,
    title: '拿到Offer别激动，教你如何优雅地进行薪资谈判（谈薪话术分享）',
    excerpt: '很多人不敢谈薪是因为不知道底线在哪里，也不知道怎样开口才不会显得傲慢。本文为你揭秘HR定薪的底层逻辑，让你轻松再涨10%-20%。',
    category: '薪资谈判',
    author: '前大厂HRBP',
    date: '2024-02-28',
    readTime: '10 min read',
    tags: ['Offer选择', '谈薪', '职场干货'],
    views: 15420,
    likes: 1205,
    comments: 345,
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&auto=format&fit=crop&q=60',
    isRecommended: true
  },
  {
    id: 5,
    title: '非技术岗该如何进入互联网大厂？从运营到产品的进阶指南',
    excerpt: '除了程序员，大厂的运营、产品、市场岗同样充满机会和挑战。这些岗位看中什么素质？实习经历该如何积累？这篇长文为你一一解答。',
    category: '职场发展',
    author: '产品总监',
    date: '2024-02-20',
    readTime: '9 min read',
    tags: ['产品经理', '用户运营', '转行跳槽'],
    views: 5430,
    likes: 310,
    comments: 72,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60',
    isRecommended: false
  },
  {
    id: 6,
    title: '各大行总行及分支机构2024秋招笔试复盘及真题解析',
    excerpt: '银行笔试涵盖行测、英语、综合知识等多个模块，题量大、时间紧。为大家整理了中国银行、工商银行、建设银行的笔试真题及解析。',
    category: '笔试真题',
    author: '银行备考达人',
    date: '2024-02-15',
    readTime: '15 min read',
    tags: ['银行秋招', '行测', '备考资料'],
    views: 7800,
    likes: 542,
    comments: 68,
    imageUrl: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800&auto=format&fit=crop&q=60',
    isRecommended: false
  }
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<number>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const { showToast } = useToast();

  const handleBookmark = (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    const newBookmarks = new Set(bookmarkedPosts);
    if (newBookmarks.has(postId)) {
      newBookmarks.delete(postId);
      showToast('已取消收藏', 'info');
    } else {
      newBookmarks.add(postId);
      showToast('已加入收藏，可以根据阅读历史推荐内容', 'success');
    }
    setBookmarkedPosts(newBookmarks);
  };

  const handleLike = (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    const newLikes = new Set(likedPosts);
    if (newLikes.has(postId)) {
      newLikes.delete(postId);
    } else {
      newLikes.add(postId);
      showToast('点赞成功', 'success');
    }
    setLikedPosts(newLikes);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast('文章链接已复制到剪贴板', 'success');
  };

  const filteredPosts = MOCK_BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === '全部' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const recommendedPosts = MOCK_BLOG_POSTS.filter(post => post.isRecommended).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">求职干货博客</h1>
              <p className="text-gray-500 mt-1">深度洞察，行业剖析，助你决胜每一次面试</p>
            </div>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索：面试技巧、简历优化..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Layout: Main content & Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Feed */}
          <div className="lg:w-2/3 flex flex-col space-y-6">
            {/* Category Filters */}
            <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-2">
              {MOCK_CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    activeCategory === category 
                      ? 'bg-primary text-white border-primary shadow-sm' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Post List */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-6">
                {filteredPosts.map(post => (
                  <article key={post.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/30 transition-all shadow-sm hover:shadow-md cursor-pointer group">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto md:h-40 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-md text-gray-800">
                          {post.category}
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2 group-hover:text-primary transition-colors">
                            <h2 className="text-xl font-bold text-gray-900 line-clamp-2 leading-snug">
                              {post.title}
                            </h2>
                            <button 
                              onClick={(e) => handleBookmark(e, post.id)}
                              className={`p-1.5 rounded-full transition-colors ${bookmarkedPosts.has(post.id) ? 'text-primary bg-primary/10' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                            >
                              <Bookmark className="w-5 h-5" fill={bookmarkedPosts.has(post.id) ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => (
                              <span key={tag} className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" /> {post.author}</span>
                            <span className="flex items-center hidden sm:flex"><Calendar className="w-3.5 h-3.5 mr-1" /> {post.date}</span>
                            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {post.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button onClick={(e) => handleLike(e, post.id)} className={`flex items-center hover:text-blue-500 transition-colors ${likedPosts.has(post.id) ? 'text-blue-500' : ''}`}>
                              <ThumbsUp className="w-4 h-4 mr-1" fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                              {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                            </button>
                            <button className="flex items-center hover:text-gray-700 transition-colors">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {post.comments}
                            </button>
                            <button onClick={handleShare} className="flex items-center hover:text-gray-700 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关文章</h3>
                <p className="text-gray-500">尝试调整搜索关键词或分类过滤</p>
                <button 
                  onClick={() => {setSearchQuery(''); setActiveCategory('全部')}}
                  className="mt-6 text-primary hover:underline font-medium text-sm"
                >
                  清除过滤条件
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 flex flex-col space-y-6">
            {/* Editor's Choice / Recommended */}
            <div className="bg-gradient-to-br from-primary/5 to-white rounded-2xl p-6 border border-primary/20 shadow-sm">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-900">为你推荐 / Editor's Pick</h3>
              </div>
              <div className="space-y-5">
                {recommendedPosts.map((post, index) => (
                  <div key={post.id} className="group cursor-pointer">
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 space-x-3">
                          <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {post.views}</span>
                          <span>{post.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading History Prompt */}
            <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
              <h3 className="text-lg font-bold mb-2">打造专属你的干货库</h3>
              <p className="text-gray-300 text-sm mb-4">通过收藏和点赞文章，我们会根据你的兴趣倾向及阅读历史，精准推荐更有价值的校招、社招内容。</p>
              <button onClick={() => showToast('已成功开启个性化推荐，我们将为你更新首页流', 'success')} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center shadow-lg shadow-primary/30">
                开启个性化推荐 <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {['简历制作', '秋招', '春招', '面经', '薪资谈判', '职场生存', 'AI算法', '产品运营', '笔试题库', '体制内'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => {setSearchQuery(tag); setActiveCategory('全部');}}
                    className="text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
