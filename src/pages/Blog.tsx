import React, { useMemo, useState } from 'react';
import { Bookmark, BookOpen, Calendar, Clock, Eye, Search, ThumbsUp, TrendingUp, User } from 'lucide-react';

import SEO from '../components/SEO';
import { useToast } from '../contexts/ToastContext';

const categories = ['全部', '简历优化', '面试技巧', '行业分析', '薪资谈判', '职场发展', '笔试真题'];

const posts = [
  {
    id: 1,
    title: '如何写出更容易通过 ATS 的留学生简历',
    excerpt: '简历不是经历堆叠，而是岗位匹配度的表达。本文从关键词、量化结果和项目结构三个角度拆解高通过率简历。',
    category: '简历优化',
    author: '职引导师',
    date: '2026-03-15',
    readTime: '8 min read',
    tags: ['简历', 'ATS', '秋招'],
    views: 12540,
    likes: 843,
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60',
    recommended: true,
  },
  {
    id: 2,
    title: '大厂行为面试如何用 STAR 讲清楚个人贡献',
    excerpt: '面试官真正想听到的不是“我参与了项目”，而是你如何判断问题、做出选择并带来结果。',
    category: '面试技巧',
    author: '技术面试官',
    date: '2026-03-10',
    readTime: '10 min read',
    tags: ['BQ', 'STAR', '面试'],
    views: 8900,
    likes: 652,
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=60',
    recommended: true,
  },
  {
    id: 3,
    title: '拿到 Offer 后如何判断薪资、团队和签证风险',
    excerpt: 'Offer 决策不只看总包，还要同时考虑地点、股票结构、签证支持、团队稳定性和长期成长空间。',
    category: '薪资谈判',
    author: '前大厂 HRBP',
    date: '2026-02-28',
    readTime: '9 min read',
    tags: ['Offer', '谈薪', '签证'],
    views: 15420,
    likes: 1205,
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&auto=format&fit=crop&q=60',
    recommended: true,
  },
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<number>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const { showToast } = useToast();

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = activeCategory === '全部' || post.category === activeCategory;
      const matchesSearch = !query || post.title.toLowerCase().includes(query) || post.tags.some((tag) => tag.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleBookmark = (event: React.MouseEvent, postId: number) => {
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

  const toggleLike = (event: React.MouseEvent, postId: number) => {
    event.stopPropagation();
    setLikedPosts((current) => {
      const next = new Set(current);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const recommendedPosts = posts.filter((post) => post.recommended);

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <SEO
        title="求职干货博客"
        description="职引求职博客提供留学生简历优化、面试技巧、行业分析、薪资谈判和笔试备考内容。"
        keywords="求职博客,留学生求职,简历优化,面试技巧,薪资谈判"
        canonical="https://www.zhiyincareer.com/blog"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">求职干货博客</h1>
              <p className="text-gray-500 mt-1">系统整理简历、面试、投递和 offer 决策方法。</p>
            </div>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索：面试技巧、简历优化..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white shadow-sm" />
          </div>
        </section>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <section className="space-y-6">
            <div className="flex overflow-x-auto pb-2 gap-2">
              {categories.map((category) => (
                <button key={category} onClick={() => setActiveCategory(category)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeCategory === category ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                  {category}
                </button>
              ))}
            </div>

            {filteredPosts.length > 0 ? (
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
                          <button onClick={(event) => toggleBookmark(event, post.id)} className={`p-1.5 rounded-full transition-colors ${bookmarkedPosts.has(post.id) ? 'text-primary bg-primary/10' : 'text-gray-400 hover:bg-gray-100'}`}>
                            <Bookmark className="w-5 h-5" fill={bookmarkedPosts.has(post.id) ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => <span key={tag} className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">#{tag}</span>)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400 font-medium gap-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" />{post.author}</span>
                          <span className="hidden sm:flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" />{post.date}</span>
                          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" />{post.readTime}</span>
                        </div>
                        <button onClick={(event) => toggleLike(event, post.id)} className={`flex items-center hover:text-blue-500 ${likedPosts.has(post.id) ? 'text-blue-500' : ''}`}>
                          <ThumbsUp className="w-4 h-4 mr-1" fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                          {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-lg font-medium text-gray-900 mb-2">暂未找到相关文章</h2>
                <p className="text-gray-500 mb-5">可以调整关键词或切换分类。</p>
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
                  <div key={post.id} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">{index + 1}</div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{post.title}</h4>
                      <div className="flex items-center text-xs text-gray-500 gap-3"><span className="flex items-center"><Eye className="w-3 h-3 mr-1" />{post.views}</span><span>{post.category}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold mb-2">打造你的求职知识库</h3>
              <p className="text-gray-300 text-sm mb-4">收藏和点赞内容后，后续可以用于推荐更适合你的校招、社招和面试资料。</p>
              <button onClick={() => showToast('已开启个性化推荐', 'success')} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">开启推荐</button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
