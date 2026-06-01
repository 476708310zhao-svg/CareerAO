import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  FileText,
  Mic,
  RefreshCw,
  Search,
  ThumbsUp,
  TrendingUp,
  User,
} from 'lucide-react';

import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

type BlogPost = {
  id: string | number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  views: number;
  likes: number;
  imageUrl: string;
  recommended: boolean;
  url?: string;
};

const categories = ['全部', '简历优化', '面试技巧', '行业分析', '薪资谈判', '职场发展', '签证身份'];

const categoryImages: Record<string, string> = {
  简历优化: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=900&auto=format&fit=crop&q=70',
  面试技巧: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&auto=format&fit=crop&q=70',
  行业分析: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=70',
  薪资谈判: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=900&auto=format&fit=crop&q=70',
  职场发展: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=70',
  签证身份: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&auto=format&fit=crop&q=70',
};

const fallbackPosts: BlogPost[] = [
  {
    id: 'fallback-ats',
    title: '如何写出更容易通过 ATS 的留学生简历',
    excerpt: '从关键词、项目量化和岗位匹配三个角度，拆解一份高通过率简历应该怎么写。',
    category: '简历优化',
    author: '职引编辑部',
    date: '2026-05-28',
    readTime: '8 分钟',
    tags: ['简历', 'ATS', '求职干货'],
    views: 12540,
    likes: 843,
    imageUrl: categoryImages['简历优化'],
    recommended: true,
  },
  {
    id: 'fallback-star',
    title: '大厂行为面试如何用 STAR 讲清个人贡献',
    excerpt: '面试官想听到的不是“我参与了项目”，而是你如何判断问题、做出选择并带来结果。',
    category: '面试技巧',
    author: '职引编辑部',
    date: '2026-05-25',
    readTime: '10 分钟',
    tags: ['BQ', 'STAR', '面试'],
    views: 8900,
    likes: 652,
    imageUrl: categoryImages['面试技巧'],
    recommended: true,
  },
  {
    id: 'fallback-offer',
    title: '拿到 Offer 后如何判断薪资、团队和签证风险',
    excerpt: 'Offer 决策不只看总包，还要同时考虑地点、股票结构、签证支持和长期成长空间。',
    category: '薪资谈判',
    author: '职引编辑部',
    date: '2026-05-20',
    readTime: '9 分钟',
    tags: ['Offer', '谈薪', '签证'],
    views: 15420,
    likes: 1205,
    imageUrl: categoryImages['薪资谈判'],
    recommended: true,
  },
];

function inferCategory(article: any) {
  const text = `${article.title || ''} ${article.desc || ''} ${article.type || ''}`.toLowerCase();
  if (/visa|h-1b|h1b|opt|cpt|签证|身份/.test(text)) return '签证身份';
  if (/salary|compensation|offer|薪资|谈薪|总包/.test(text)) return '薪资谈判';
  if (/resume|ats|简历/.test(text)) return '简历优化';
  if (/interview|case|star|面试|笔试|系统设计/.test(text)) return '面试技巧';
  if (/career|linkedin|network|职场|内推|求职/.test(text)) return '职场发展';
  return article.type === 'data' ? '行业分析' : '职场发展';
}

function estimateReadTime(text: string) {
  return `${Math.max(3, Math.ceil((text || '').length / 450))} 分钟`;
}

function normalizePost(article: any, index: number): BlogPost {
  const category = inferCategory(article);
  const title = String(article.title || '求职干货').trim();
  const excerpt = String(article.desc || article.summary || article.content || title).replace(/\s+/g, ' ').slice(0, 180);
  const seed = title.length + index * 29;
  return {
    id: article.id || article.url || `article_${index}`,
    title,
    excerpt,
    category,
    author: article.source || '职引资讯',
    date: article.pubDate ? new Date(article.pubDate).toLocaleDateString('zh-CN') : article.time || '近期',
    readTime: estimateReadTime(`${title}${excerpt}`),
    tags: (article.tags?.length ? article.tags : [category, article.lang === 'en' ? 'English' : '中文']).slice(0, 4),
    views: article.views || 1600 + seed * 19,
    likes: article.likes || 18 + (seed % 260),
    imageUrl: article.imageUrl || categoryImages[category] || categoryImages['职场发展'],
    recommended: index < 4,
    url: article.url || '',
  };
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [sourceLabel, setSourceLabel] = useState('内置精选');
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<BlogPost['id']>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<BlogPost['id']>>(new Set());
  const { showToast } = useToast();

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/api/proxy/news?tab=tip&limit=72');
      const articles = Array.isArray(response.articles) ? response.articles : response.data?.articles || [];
      if (articles.length) {
        setPosts(articles.map((article: any, index: number) => normalizePost(article, index)));
        setSourceLabel(response.source === 'cache' ? '缓存资讯' : 'RSS + 职引精选');
      } else {
        setPosts(fallbackPosts);
        setSourceLabel('内置精选');
      }
    } catch (error) {
      console.warn('Blog news fallback:', error);
      setPosts(fallbackPosts);
      setSourceLabel('内置精选');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = activeCategory === '全部' || post.category === activeCategory;
      const matchesSearch = !query || [post.title, post.excerpt, post.author, ...post.tags].some((value) => String(value).toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, posts, searchQuery]);

  const toggleBookmark = (event: React.MouseEvent, postId: BlogPost['id']) => {
    event.stopPropagation();
    setBookmarkedPosts((current) => {
      const next = new Set(current);
      if (next.has(postId)) {
        next.delete(postId);
        showToast('已取消收藏', 'info');
      } else {
        next.add(postId);
        showToast('已加入收藏', 'success');
      }
      return next;
    });
  };

  const toggleLike = (event: React.MouseEvent, postId: BlogPost['id']) => {
    event.stopPropagation();
    setLikedPosts((current) => {
      const next = new Set(current);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const openOriginal = (event: React.MouseEvent, post: BlogPost) => {
    event.stopPropagation();
    if (!post.url) {
      showToast('该内容暂无外部原文链接', 'info');
      return;
    }
    window.open(post.url, '_blank', 'noopener,noreferrer');
  };

  const recommendedPosts = posts.filter((post) => post.recommended).slice(0, 5);

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <SEO
        title="求职干货博客"
        description="职引求职博客聚合简历优化、面试技巧、薪资谈判、签证身份和职场发展内容，帮助留学生系统准备求职。"
        keywords="求职博客,留学生求职,简历优化,面试技巧,薪资谈判,ATS,LinkedIn"
        canonical="https://www.zhiyincareer.com/blog"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">求职干货博客</h1>
              <p className="text-gray-500 mt-1">系统整理简历、面试、投递、offer 和身份规划方法。</p>
            </div>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="搜索：面试技巧、简历优化、LinkedIn..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white shadow-sm"
            />
          </div>
        </section>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ['内容数量', `${posts.length}`],
            ['数据来源', sourceLabel],
            ['当前筛选', activeCategory],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="text-xs text-gray-500">{label}</div>
              <div className="mt-1 text-lg font-black text-gray-900">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <section className="space-y-6">
            <div className="flex overflow-x-auto pb-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    activeCategory === category ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
              <button onClick={fetchPosts} disabled={isLoading} className="inline-flex items-center whitespace-nowrap rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary disabled:opacity-60">
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                刷新
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-5">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="h-5 w-2/3 rounded bg-gray-200" />
                    <div className="mt-4 h-4 w-full rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-3/4 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/30 transition-all shadow-sm hover:shadow-md cursor-pointer group">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-1/3 aspect-video md:h-40 rounded-xl overflow-hidden shrink-0">
                      <img src={post.imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-md text-gray-800">{post.category}</div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h2 className="text-xl font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">{post.title}</h2>
                          <button onClick={(event) => toggleBookmark(event, post.id)} className={`p-1.5 rounded-full transition-colors ${bookmarkedPosts.has(post.id) ? 'text-primary bg-primary/10' : 'text-gray-400 hover:bg-gray-100'}`} aria-label="收藏文章">
                            <Bookmark className="w-5 h-5" fill={bookmarkedPosts.has(post.id) ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => <span key={tag} className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">#{tag}</span>)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-400 font-medium">
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" />{post.author}</span>
                          <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" />{post.date}</span>
                          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" />{post.readTime}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {post.url && (
                            <button onClick={(event) => openOriginal(event, post)} className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-primary/10 hover:text-primary">
                              阅读原文 <ArrowRight className="ml-1 h-3 w-3" />
                            </button>
                          )}
                          <button onClick={(event) => toggleLike(event, post.id)} className={`flex items-center hover:text-blue-500 ${likedPosts.has(post.id) ? 'text-blue-500' : ''}`}>
                            <ThumbsUp className="w-4 h-4 mr-1" fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                            {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-medium text-gray-900 mb-2">暂未找到相关文章</h2>
                <p className="text-gray-500 mb-5">可以调整关键词，或切换分类。</p>
                <button onClick={() => { setSearchQuery(''); setActiveCategory('全部'); }} className="text-primary font-bold text-sm">清除筛选</button>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-primary/20 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-900">编辑推荐</h3>
              </div>
              <div className="space-y-5">
                {recommendedPosts.map((post, index) => (
                  <button key={post.id} onClick={(event) => openOriginal(event, post)} className="flex gap-4 text-left">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">{index + 1}</div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{post.title}</h4>
                      <div className="flex items-center text-xs text-gray-500 gap-3"><span className="flex items-center"><Eye className="w-3 h-3 mr-1" />{post.views}</span><span>{post.category}</span></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold mb-2">打造你的求职知识库</h3>
              <p className="text-gray-300 text-sm mb-4">收藏和点赞内容后，后续可以扩展为账号级个性化推荐。</p>
              <button onClick={() => showToast('已记录你的推荐偏好', 'success')} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">记录偏好</button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">读完继续行动</h3>
              <div className="space-y-3">
                <Link to="/my-resume" className="group flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 p-4 hover:bg-primary/5 hover:border-primary/20 transition-colors">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">优化简历表达</p>
                      <p className="text-xs text-gray-500 mt-0.5">把方法应用到简历版本</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary" />
                </Link>
                <Link to="/ai-interview" className="group flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 p-4 hover:bg-primary/5 hover:border-primary/20 transition-colors">
                  <div className="flex items-center">
                    <Mic className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">练一场 AI 面试</p>
                      <p className="text-xs text-gray-500 mt-0.5">用 STAR 和项目表达做模拟追问</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
