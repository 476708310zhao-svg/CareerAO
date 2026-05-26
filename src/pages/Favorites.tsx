import React, { useEffect, useState } from 'react';
import { Bookmark, Briefcase, ExternalLink, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import SEO from '../components/SEO';
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
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadFavorites = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await apiFetch('/api/proxy/favorites?type=job');
      setFavorites(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.warn('Failed to load favorites:', error);
      setFavorites([]);
      setErrorMessage('收藏列表加载失败，请确认已登录后重试。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeFavorite = async (item: FavoriteItem) => {
    try {
      await apiFetch('/api/proxy/favorites', {
        method: 'DELETE',
        body: JSON.stringify({ type: item.type, targetId: item.targetId }),
      });
      const next = favorites.filter((favorite) => favorite.id !== item.id);
      setFavorites(next);
      favoritesEmitter.emit('update', next.map((favorite) => Number(favorite.targetId)).filter(Number.isFinite));
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
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-8">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4">
            <Bookmark className="w-4 h-4" />
            Saved Jobs
          </div>
          <h1 className="text-3xl font-black text-gray-900">我的收藏</h1>
          <p className="text-gray-500 mt-3">登录后收藏的职位会同步到后台账号，方便你跨设备继续查看。</p>
        </section>

        {errorMessage && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white border border-gray-100 rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        ) : favorites.length ? (
          <div className="space-y-4">
            {favorites.map((item) => (
              <article key={item.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-900 line-clamp-1">{item.title || `职位 #${item.targetId}`}</h2>
                    <p className="text-sm text-gray-500 mt-1">{item.subtitle || '职位收藏'}</p>
                    {item.createdAt && <p className="text-xs text-gray-400 mt-1">收藏于 {new Date(item.createdAt).toLocaleDateString()}</p>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link to={`/jobs/${item.targetId}`} className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors">
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
            <h2 className="text-lg font-bold text-gray-900">还没有收藏职位</h2>
            <p className="text-sm text-gray-500 mt-2 mb-6">在职位列表或职位详情页点击收藏后，会出现在这里。</p>
            <Link to="/jobs" className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold">
              去找职位
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
