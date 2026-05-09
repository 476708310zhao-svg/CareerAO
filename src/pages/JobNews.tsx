import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Search, ThumbsUp, MessageSquare, Share2,
  Clock, Eye, ChevronRight, TrendingUp, Bookmark, Calendar,
  User, Newspaper, ExternalLink,
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import SEO from '../components/SEO';
import { apiFetch } from '../lib/api';

const NEWS_CATEGORIES = ['全部', '行业资讯', '校招动态', '干货分享', '签证政策', '职场洞察'];

const CATEGORY_TO_TAB: Record<string, string> = {
  '全部': 'all',
  '行业资讯': 'news',
  '校招动态': 'news',
  '干货分享': 'tip',
  '签证政策': 'policy',
  '职场洞察': 'data',
};

const TYPE_TO_CATEGORY: Record<string, string> = {
  news: '行业资讯',
  tip: '干货分享',
  data: '职场洞察',
  policy: '签证政策',
};

const CATEGORY_IMAGES: Record<string, string> = {
  '行业资讯': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
  '校招动态': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=60',
  '干货分享': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&auto=format&fit=crop&q=60',
  '签证政策': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=400&auto=format&fit=crop&q=60',
  '职场洞察': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=60',
};

const MOCK_NEWS_POSTS = [
  {
    id: 1, title: '重磅！H-1B 2025财年抽签改革：按人头抽签能提高中签率吗？',
    excerpt: '美国移民局(USCIS)宣布从2025财年开始，实施"一人一抽"的新规。这意味着无论你有多少雇主为你递交申请，你都只能获得一个抽签机会。',
    category: '签证政策', author: '智引观察', date: '2024-03-20', readTime: '6 min',
    tags: ['H1B', '政策解读', '留学生'], views: 18450, likes: 1243, comments: 412,
    imageUrl: CATEGORY_IMAGES['签证政策'], url: '', isRecommended: true,
  },
  {
    id: 2, title: '手把手教你写出大厂HR秒回的简历（附最新模板）',
    excerpt: '简历是你向企业展示自己的第一步，好的简历不是经历的堆砌，而是能力的提炼。从排版、STAR法则、关键词优化三个维度打造满分简历。',
    category: '干货分享', author: '职引导师', date: '2024-03-15', readTime: '8 min',
    tags: ['简历修改', 'STAR法则', '秋招'], views: 12540, likes: 843, comments: 112,
    imageUrl: CATEGORY_IMAGES['干货分享'], url: '', isRecommended: true,
  },
  {
    id: 3, title: '突发！硅谷大厂裁员潮再起：如何度过行业寒冬？',
    excerpt: '近期多家头部科技公司宣布裁员计划。寒冬之下，如何保持竞争力？哪些岗位的需求不降反增？',
    category: '行业资讯', author: '深度科技', date: '2024-03-18', readTime: '10 min',
    tags: ['大厂风向', '硅谷动态', '裁员潮'], views: 23104, likes: 532, comments: 315,
    imageUrl: CATEGORY_IMAGES['行业资讯'], url: '', isRecommended: true,
  },
  {
    id: 4, title: '2024年春招大厂面试全流程解析：从一面到HR面的通关秘籍',
    excerpt: '一面考察基础计算，二面考察系统设计，三面考察业务理解，HR面考察抗压能力...面试套路早知道，斩获Offer少走弯路。',
    category: '干货分享', author: '资深面试官', date: '2024-03-10', readTime: '12 min',
    tags: ['大厂面经', '春招', '面试干货'], views: 8900, likes: 652, comments: 89,
    imageUrl: CATEGORY_IMAGES['干货分享'], url: '', isRecommended: false,
  },
  {
    id: 5, title: '字节跳动、腾讯、阿里2025届提前批网申正式开启！',
    excerpt: '抢跑秋招！各大厂提前批已陆续启动，神仙打架的季节来了。本文整理了目前已开启提前批的核心互联网大厂时间表。',
    category: '校招动态', author: '校招爆料君', date: '2024-03-21', readTime: '4 min',
    tags: ['春招', '互联网大厂', '网申信息'], views: 31200, likes: 2150, comments: 850,
    imageUrl: CATEGORY_IMAGES['校招动态'], url: '', isRecommended: true,
  },
  {
    id: 6, title: 'AI时代下的职场生存指南：哪些岗位会被替代？',
    excerpt: '随着大语言模型和生成式AI的飞速发展，很多传统岗位受到了冲击。作为大学生和初入职场的新人，应当如何调整职业规划？',
    category: '职场洞察', author: '行业研究员', date: '2024-03-05', readTime: '6 min',
    tags: ['人工智能', '职业规划', '前沿趋势'], views: 6530, likes: 421, comments: 231,
    imageUrl: CATEGORY_IMAGES['职场洞察'], url: '', isRecommended: false,
  },
];

interface Post {
  id: string | number;
  title: string;
  excerpt: string;
  url: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  imageUrl: string;
  isRecommended: boolean;
}

export default function JobNews() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>(MOCK_NEWS_POSTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiData, setIsApiData] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string | number>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string | number>>(new Set());
  const { showToast } = useToast();

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const tab = CATEGORY_TO_TAB[activeCategory] || 'all';
      const res = await apiFetch(`/api/proxy/news?tab=${tab}`);
      const articles: any[] = res.articles || [];
      if (articles.length > 0) {
        const mapped: Post[] = articles.map((a, i) => {
          const cat = TYPE_TO_CATEGORY[a.type] || '行业资讯';
          return {
            id: a.id || `api_${i}`,
            title: a.title,
            excerpt: a.desc || a.title,
            url: a.url || '',
            category: cat,
            author: a.source || '资讯',
            date: a.time || '',
            readTime: '5 min',
            tags: [],
            views: 0,
            likes: 0,
            comments: 0,
            imageUrl: CATEGORY_IMAGES[cat] || CATEGORY_IMAGES['行业资讯'],
            isRecommended: i < 3,
          };
        });
        setPosts(mapped);
        setIsApiData(true);
      } else {
        setPosts(MOCK_NEWS_POSTS);
        setIsApiData(false);
      }
    } catch {
      setPosts(MOCK_NEWS_POSTS);
      setIsApiData(false);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const handleBookmark = (e: React.MouseEvent, postId: string | number) => {
    e.stopPropagation();
    const next = new Set(bookmarkedPosts);
    if (next.has(postId)) { next.delete(postId); showToast('已取消收藏', 'info'); }
    else { next.add(postId); showToast('已加入收藏', 'success'); }
    setBookmarkedPosts(next);
  };

  const handleLike = (e: React.MouseEvent, postId: string | number) => {
    e.stopPropagation();
    const next = new Set(likedPosts);
    if (next.has(postId)) next.delete(postId);
    else { next.add(postId); showToast('点赞成功', 'success'); }
    setLikedPosts(next);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast('文章链接已复制到剪贴板', 'success');
  };

  const handleArticleClick = (post: Post) => {
    if (post.url) window.open(post.url, '_blank', 'noopener,noreferrer');
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === '全部' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const recommendedPosts = posts.filter(p => p.isRecommended).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 font-sans">
      <SEO
        title="求职资讯"
        description="最新求职干货与行业新闻、签证政策解读、留学生求职动态。及时追踪求职市场变化，斩获高薪Offer。"
        keywords="求职资讯, 求职新闻, H1B政策, 大厂动态, 校招资讯"
        canonical="https://www.zhiyincareer.com/news"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
              <Newspaper className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">求职资讯</h1>
              <p className="text-gray-500 mt-1">行业动态与干货齐飞，助你掌握最新求职风向</p>
            </div>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索：H1B、简历、大厂..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 flex flex-col space-y-6">
            <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-2">
              {NEWS_CATEGORIES.map(category => (
                <button key={category} onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    activeCategory === category
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                  }`}>
                  {category}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
                    <div className="flex gap-6">
                      <div className="w-1/3 h-40 bg-gray-200 rounded-xl" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-6">
                {filteredPosts.map(post => (
                  <article key={post.id}
                    onClick={() => handleArticleClick(post)}
                    className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/30 transition-all shadow-sm hover:shadow-md cursor-pointer group">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto md:h-40 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={post.imageUrl} alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-md text-gray-800">
                          {post.category}
                        </div>
                        {post.url && (
                          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur p-1 rounded-md">
                            <ExternalLink className="w-3 h-3 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                              {post.title}
                            </h2>
                            <button onClick={(e) => handleBookmark(e, post.id)}
                              className={`p-1.5 rounded-full transition-colors shrink-0 ml-2 ${bookmarkedPosts.has(post.id) ? 'text-primary bg-primary/10' : 'text-gray-400 hover:bg-gray-100'}`}>
                              <Bookmark className="w-5 h-5" fill={bookmarkedPosts.has(post.id) ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map(tag => (
                                <span key={tag} className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">#{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" />{post.author}</span>
                            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" />{post.date || post.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            {!isApiData && (
                              <>
                                <button onClick={(e) => handleLike(e, post.id)}
                                  className={`flex items-center hover:text-blue-500 transition-colors ${likedPosts.has(post.id) ? 'text-blue-500' : ''}`}>
                                  <ThumbsUp className="w-4 h-4 mr-1" fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                                  {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                                </button>
                                <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-1" />{post.comments}</span>
                              </>
                            )}
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关资讯</h3>
                <p className="text-gray-500">尝试调整搜索关键词或分类过滤</p>
                <button onClick={() => { setSearchQuery(''); setActiveCategory('全部'); }}
                  className="mt-6 text-primary hover:underline font-medium text-sm">
                  清除过滤条件
                </button>
              </div>
            )}
          </div>

          <div className="lg:w-1/3 flex flex-col space-y-6">
            <div className="bg-gradient-to-br from-primary/5 to-white rounded-2xl p-6 border border-primary/20 shadow-sm">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-900">必读推荐</h3>
              </div>
              <div className="space-y-5">
                {recommendedPosts.map((post, index) => (
                  <div key={post.id} onClick={() => handleArticleClick(post)} className="group cursor-pointer">
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 space-x-3">
                          {!isApiData && <span className="flex items-center"><Eye className="w-3 h-3 mr-1" />{post.views}</span>}
                          <span>{post.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
              <h3 className="text-lg font-bold mb-2">打造专属资讯库</h3>
              <p className="text-gray-300 text-sm mb-4">通过收藏和点赞，精准推荐最有价值的行业动态及干货内容。</p>
              <button onClick={() => showToast('已开启个性化推荐', 'success')}
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center shadow-lg shadow-primary/30">
                开启个性化推送 <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">热搜标签</h3>
              <div className="flex flex-wrap gap-2">
                {['H1B抽签', '秋招动态', '裁员消息', '面经', '薪资大赏', '行业新闻', '海归回国', '北美动态', '北美互联网', '金融求职'].map(tag => (
                  <button key={tag}
                    onClick={() => { setSearchQuery(tag); setActiveCategory('全部'); }}
                    className="text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors">
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
