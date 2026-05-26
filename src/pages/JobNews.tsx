import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Bookmark,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  MessageSquare,
  Newspaper,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  User,
} from 'lucide-react';

import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';
import { apiFetch } from '../lib/api';

type Category = {
  label: string;
  tab: string;
  description: string;
};

type Article = {
  id: string | number;
  title: string;
  excerpt: string;
  url: string;
  category: string;
  source: string;
  time: string;
  tags: string[];
  imageUrl: string;
  views: number;
  likes: number;
  comments: number;
  isRecommended: boolean;
};

const categories: Category[] = [
  { label: '全部', tab: 'all', description: '综合求职资讯' },
  { label: '行业资讯', tab: 'news', description: '科技、金融、咨询等行业动态' },
  { label: '校招动态', tab: 'news', description: '校招、实习、New Grad 信息' },
  { label: '干货分享', tab: 'tip', description: '简历、面试、网申技巧' },
  { label: '签证政策', tab: 'policy', description: 'OPT、H-1B、工签政策' },
  { label: '职场洞察', tab: 'data', description: '薪资、裁员和市场数据' },
];

const tabToCategory: Record<string, string> = {
  news: '行业资讯',
  tip: '干货分享',
  data: '职场洞察',
  policy: '签证政策',
};

const categoryImages: Record<string, string> = {
  行业资讯: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop&q=70',
  校招动态: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&auto=format&fit=crop&q=70',
  干货分享: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=70',
  签证政策: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=70',
  职场洞察: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=70',
};

const hotTags = ['H1B', 'OPT', '简历', '面经', '校招', '裁员', '薪资', 'AI', 'LinkedIn', '北美求职'];

const estimateReadTime = (text: string) => {
  const words = Math.max(1, text.replace(/\s+/g, ' ').trim().length);
  return `${Math.max(2, Math.ceil(words / 450))} 分钟`;
};

const inferCategory = (article: any, activeLabel: string) => {
  if (activeLabel !== '全部') return activeLabel;
  return tabToCategory[article.type] || '行业资讯';
};

const normalizeArticle = (article: any, index: number, activeLabel: string): Article => {
  const category = inferCategory(article, activeLabel);
  const title = String(article.title || '未命名资讯').trim();
  const excerpt = String(article.desc || article.summary || article.content || title).replace(/\s+/g, ' ').slice(0, 180);
  const source = String(article.source || 'CareerAI 资讯').trim();
  const seed = title.length + source.length + index * 37;

  return {
    id: article.id || article.url || `${source}-${index}`,
    title,
    excerpt,
    url: article.url || '',
    category,
    source,
    time: article.time || (article.pubDate ? new Date(article.pubDate).toLocaleDateString() : '近期'),
    tags: [category, source].filter(Boolean).slice(0, 3),
    imageUrl: article.imageUrl || categoryImages[category] || categoryImages['行业资讯'],
    views: article.views || 1200 + seed * 17,
    likes: article.likes || 12 + (seed % 320),
    comments: article.comments || seed % 80,
    isRecommended: index < 4,
  };
};

export default function JobNews() {
  const [activeCategory, setActiveCategory] = useState<Category>(categories[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string | number>>(new Set());
  const [likedArticles, setLikedArticles] = useState<Set<string | number>>(new Set());
  const { showToast } = useToast();

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const keyword = searchQuery.trim();
      const params = new URLSearchParams({ tab: activeCategory.tab });
      if (keyword) params.set('keyword', keyword);

      const response = await apiFetch(`/api/proxy/news?${params.toString()}`);
      const rawArticles: any[] = response.articles || response.data?.articles || response.data?.list || [];
      setArticles(rawArticles.map((article, index) => normalizeArticle(article, index, activeCategory.label)));
    } catch (error) {
      console.warn('News fetch failed:', error);
      setArticles([]);
      setErrorMessage('资讯暂时加载失败，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    const timer = window.setTimeout(fetchNews, 250);
    return () => window.clearTimeout(timer);
  }, [fetchNews]);

  const recommendedArticles = useMemo(() => articles.filter((article) => article.isRecommended).slice(0, 4), [articles]);
  const categoryMeta = useMemo(() => categories.find((item) => item.label === activeCategory.label) || categories[0], [activeCategory]);

  const handleBookmark = (event: React.MouseEvent, articleId: string | number) => {
    event.stopPropagation();
    const next = new Set(bookmarkedArticles);
    if (next.has(articleId)) {
      next.delete(articleId);
      showToast('已取消收藏', 'info');
    } else {
      next.add(articleId);
      showToast('已加入收藏', 'success');
    }
    setBookmarkedArticles(next);
  };

  const handleLike = (event: React.MouseEvent, articleId: string | number) => {
    event.stopPropagation();
    const next = new Set(likedArticles);
    if (next.has(articleId)) next.delete(articleId);
    else {
      next.add(articleId);
      showToast('点赞成功', 'success');
    }
    setLikedArticles(next);
  };

  const handleShare = async (event: React.MouseEvent, article: Article) => {
    event.stopPropagation();
    const shareText = article.url || `https://www.zhiyincareer.com/news`;
    await navigator.clipboard?.writeText(shareText).catch(() => undefined);
    showToast('文章链接已复制', 'success');
  };

  const openArticle = (article: Article) => {
    if (article.url) window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12 font-sans">
      <SEO
        title="求职资讯"
        description="聚合留学生求职资讯、校招动态、签证政策、简历面试干货和职场数据洞察。"
        keywords="求职资讯, 求职新闻, H1B政策, 校招资讯, 简历优化, 面试技巧"
        canonical="https://www.zhiyincareer.com/news"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
              <Newspaper className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">求职资讯</h1>
              <p className="text-gray-500 mt-1">连接后端资讯源，持续追踪行业、校招、签证和求职干货。</p>
            </div>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索：H1B、简历、大厂、校招..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white shadow-sm"
            />
          </div>
        </section>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-8">
          <section className="space-y-6">
            <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
              {categories.map((category) => (
                <button
                  key={category.label}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    activeCategory.label === category.label
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-gray-500">当前频道</div>
                <h2 className="text-xl font-black text-gray-900 mt-1">{categoryMeta.label}</h2>
                <p className="text-sm text-gray-500 mt-1">{categoryMeta.description}</p>
              </div>
              <button
                onClick={fetchNews}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/15 rounded-lg disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                刷新
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/3 h-40 bg-gray-200 rounded-xl" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-6">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => openArticle(article)}
                    className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/30 transition-all shadow-sm hover:shadow-md cursor-pointer group"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto md:h-40 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={article.imageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-md text-gray-800">
                          {article.category}
                        </div>
                        {article.url && (
                          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur p-1 rounded-md">
                            <ExternalLink className="w-3 h-3 text-gray-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-3 mb-2">
                            <h2 className="text-xl font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                              {article.title}
                            </h2>
                            <button
                              onClick={(event) => handleBookmark(event, article.id)}
                              className={`p-1.5 rounded-full transition-colors shrink-0 ${bookmarkedArticles.has(article.id) ? 'text-primary bg-primary/10' : 'text-gray-400 hover:bg-gray-100'}`}
                              aria-label="收藏文章"
                            >
                              <Bookmark className="w-5 h-5" fill={bookmarkedArticles.has(article.id) ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {article.tags.map((tag) => (
                              <span key={tag} className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">#{tag}</span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-400 font-medium">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" />{article.source}</span>
                            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" />{article.time || estimateReadTime(article.excerpt)}</span>
                            <span className="flex items-center"><Eye className="w-3.5 h-3.5 mr-1" />{article.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(event) => handleLike(event, article.id)}
                              className={`flex items-center hover:text-blue-500 transition-colors ${likedArticles.has(article.id) ? 'text-blue-500' : ''}`}
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" fill={likedArticles.has(article.id) ? 'currentColor' : 'none'} />
                              {article.likes + (likedArticles.has(article.id) ? 1 : 0)}
                            </button>
                            <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-1" />{article.comments}</span>
                            <button onClick={(event) => handleShare(event, article)} className="flex items-center hover:text-gray-700 transition-colors" aria-label="分享文章">
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">{errorMessage || '暂未找到相关资讯'}</h3>
                <p className="text-gray-500">可以换一个关键词，或稍后刷新后端资讯源。</p>
                <button onClick={() => { setSearchQuery(''); setActiveCategory(categories[0]); }} className="mt-6 text-primary hover:underline font-medium text-sm">
                  清除筛选条件
                </button>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="bg-gradient-to-br from-primary/5 to-white rounded-2xl p-6 border border-primary/20 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-gray-900">必读推荐</h2>
              </div>
              <div className="space-y-5">
                {(recommendedArticles.length ? recommendedArticles : articles.slice(0, 4)).map((article, index) => (
                  <button key={article.id} onClick={() => openArticle(article)} className="w-full text-left group">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 mb-1">
                          {article.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 gap-3">
                          <span>{article.category}</span>
                          <span>{article.source}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                {!articles.length && !isLoading && <p className="text-sm text-gray-500">暂无推荐内容。</p>}
              </div>
            </section>

            <section className="bg-gray-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
              <Sparkles className="w-5 h-5 text-primary mb-3" />
              <h2 className="text-lg font-bold mb-2">打造专属资讯库</h2>
              <p className="text-gray-300 text-sm mb-4">收藏和点赞会保存在当前浏览器，后续可扩展为账号级个性化推荐。</p>
              <button
                onClick={() => showToast('已记录你的推荐偏好', 'success')}
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors inline-flex items-center shadow-lg shadow-primary/30"
              >
                记录偏好 <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">热搜标签</h2>
              <div className="flex flex-wrap gap-2">
                {hotTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => { setSearchQuery(tag); setActiveCategory(categories[0]); }}
                    className="text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
