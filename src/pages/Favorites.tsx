import React, { useEffect, useState } from 'react';
import { Bookmark, Briefcase, CalendarDays, ExternalLink, LogIn, RefreshCw, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';
import { favoritesEmitter } from '../utils/favorites';

type FavoriteItem = {
  id: number;
  type: string;
  targetId: string;
  title?: string;
  subtitle?: string;
  createdAt?: string;
};

export default function Favorites() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [activeType, setActiveType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const typeTabs = [
    { key: '', label: '全部', count: favorites.length },
    { key: 'job', label: '职位', count: favorites.filter((item) => item.type === 'job').length },
    { key: 'campus', label: '校招', count: favorites.filter((item) => item.type === 'campus').length },
  ];

  const visibleFavorites = activeType ? favorites.filter((item) => item.type === activeType) : favorites;

  const loadFavorites = async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await apiFetch('/api/proxy/favorites');
      setFavorites(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.warn('Failed to load favorites:', error);
      setFavorites([]);
      setErrorMessage('收藏列表加载失败，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated]);

  const removeFavorite = async (item: FavoriteItem) => {
    try {
      await apiFetch('/api/proxy/favorites', {
        method: 'DELETE',
        body: JSON.stringify({ type: item.type, targetId: item.targetId }),
      });
      const next = favorites.filter((favorite) => favorite.id !== item.id);
      setFavorites(next);
      if (item.type === 'job') {
        favoritesEmitter.emit('update', next.filter((favorite) => favorite.type === 'job').map((favorite) => Number(favorite.targetId)).filter(Number.isFinite));
      }
      if (item.type === 'campus') {
        favoritesEmitter.emit('update:campus', next.filter((favorite) => favorite.type === 'campus').map((favorite) => String(favorite.targetId)));
      }
    } catch (error) {
      console.warn('Failed to remove favorite:', error);
      setErrorMessage('取消收藏失败，请稍后重试。');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <SEO
        title="我的收藏"
        description="查看你收藏的职位机会，快速回到职位详情继续准备投递。"
        canonical="https://www.zhiyincareer.com/favorites"
        noindex
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4">
              <Bookmark className="w-4 h-4" />
              Saved Items
            </div>
            <h1 className="text-3xl font-black text-gray-900">我的收藏</h1>
            <p className="text-gray-500 mt-3">职位和校招机会会同步到账号，方便后续投递、提醒和复盘。</p>
          </div>
          {isAuthenticated && (
            <button onClick={loadFavorites} className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:border-primary/30 hover:text-primary transition-colors">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新收藏
            </button>
          )}
        </section>

        {!isAuthenticated ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <LogIn className="w-12 h-12 mx-auto text-primary/40 mb-4" />
            <h2 className="text-lg font-bold text-gray-900">登录后查看收藏</h2>
            <p className="text-sm text-gray-500 mt-2 mb-6">登录账号后，你收藏的职位会自动同步到这里。</p>
            <button onClick={() => openAuthModal('login')} className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover">
              立即登录
            </button>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="mb-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
              {typeTabs.map((tab) => (
                <button
                  key={tab.key || 'all'}
                  onClick={() => setActiveType(tab.key)}
                  className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                    activeType === tab.key ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:text-primary'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${activeType === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white border border-gray-100 rounded-2xl h-28 animate-pulse" />
                ))}
              </div>
            ) : visibleFavorites.length ? (
              <div className="space-y-4">
                {visibleFavorites.map((item) => (
                  <article key={item.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'campus' ? 'bg-amber-50 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                        {item.type === 'campus' ? <CalendarDays className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-bold text-gray-900 line-clamp-1">{item.title || `${item.type === 'campus' ? '校招机会' : '职位'} #${item.targetId}`}</h2>
                        <p className="text-sm text-gray-500 mt-1">{item.subtitle || (item.type === 'campus' ? '校招收藏' : '职位收藏')}</p>
                        {item.createdAt && <p className="text-xs text-gray-400 mt-1">收藏于 {new Date(item.createdAt).toLocaleDateString()}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link to={item.type === 'campus' ? '/campus-calendar' : `/jobs/${item.targetId}`} className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors">
                        查看详情 <ExternalLink className="w-4 h-4 ml-1.5" />
                      </Link>
                      <button onClick={() => removeFavorite(item)} className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors" aria-label="取消收藏">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                <Bookmark className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h2 className="text-lg font-bold text-gray-900">还没有匹配的收藏</h2>
                <p className="text-sm text-gray-500 mt-2 mb-6">可以去职位列表收藏岗位，或在校招日历收藏校招机会。</p>
                <Link to={activeType === 'campus' ? '/campus-calendar' : '/jobs'} className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold">
                  {activeType === 'campus' ? '查看校招日历' : '去找职位'}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
