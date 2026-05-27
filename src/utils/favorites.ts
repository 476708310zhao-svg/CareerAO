import { useState, useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';

// A simple event emitter to sync state across components without context
class EventEmitter {
  events: Record<string, Function[]> = {};

  on(event: string, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event: string, listener: Function) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  emit(event: string, payload?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(payload));
  }
}

export const favoritesEmitter = new EventEmitter();

type FavoriteMeta = {
  title?: string;
  subtitle?: string;
};

type FavoriteTargetId = number | string;

type TypedFavoritesOptions = {
  type: string;
  storageKey: string;
  eventName: string;
};

export function useTypedFavorites({ type, storageKey, eventName }: TypedFavoritesOptions) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFavorites(Array.isArray(parsed) ? parsed.map(String) : []);
      } catch (e) {
        console.error('Failed to parse typed favorites');
      }
    }

    const handleUpdate = (newFavorites: string[]) => {
      setFavorites(newFavorites.map(String));
    };

    favoritesEmitter.on(eventName, handleUpdate);
    return () => favoritesEmitter.off(eventName, handleUpdate);
  }, [eventName, storageKey]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    apiFetch(`/api/proxy/favorites?type=${encodeURIComponent(type)}`)
      .then((response) => {
        if (cancelled) return;
        const list = response.data || [];
        const remoteFavorites = Array.isArray(list)
          ? list.map((item: any) => String(item.targetId)).filter(Boolean)
          : [];
        setFavorites(remoteFavorites);
        localStorage.setItem(storageKey, JSON.stringify(remoteFavorites));
        favoritesEmitter.emit(eventName, remoteFavorites);
      })
      .catch((error) => {
        console.warn(`Failed to load remote ${type} favorites:`, error);
      });

    return () => {
      cancelled = true;
    };
  }, [eventName, isAuthenticated, storageKey, type]);

  const persistLocalFavorites = (nextFavorites: string[]) => {
    setFavorites(nextFavorites);
    localStorage.setItem(storageKey, JSON.stringify(nextFavorites));
    favoritesEmitter.emit(eventName, nextFavorites);
  };

  const syncFavorite = async (targetId: FavoriteTargetId, shouldFavorite: boolean, meta?: FavoriteMeta) => {
    if (!isAuthenticated) return;

    if (shouldFavorite) {
      await apiFetch('/api/proxy/favorites', {
        method: 'POST',
        body: JSON.stringify({
          type,
          targetId,
          title: meta?.title || '',
          subtitle: meta?.subtitle || '',
        }),
      });
      return;
    }

    await apiFetch('/api/proxy/favorites', {
      method: 'DELETE',
      body: JSON.stringify({ type, targetId }),
    });
  };

  const toggleFavorite = (targetId: FavoriteTargetId, meta?: FavoriteMeta) => {
    const normalizedId = String(targetId);
    const shouldFavorite = !favorites.includes(normalizedId);
    const nextFavorites = shouldFavorite
      ? [...favorites, normalizedId]
      : favorites.filter((id) => id !== normalizedId);

    persistLocalFavorites(nextFavorites);
    syncFavorite(targetId, shouldFavorite, meta).catch((error) => {
      console.warn(`Failed to sync ${type} favorite:`, error);
      persistLocalFavorites(favorites);
    });
  };

  const isFavorite = (targetId: FavoriteTargetId) => favorites.includes(String(targetId));

  return { favorites, toggleFavorite, isFavorite };
}

export function useCampusFavorites() {
  return useTypedFavorites({
    type: 'campus',
    storageKey: 'careerai_campus_favorites',
    eventName: 'update:campus',
  });
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('careerai_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites');
      }
    }

    // Listen for cross-component updates
    const handleUpdate = (newFavorites: number[]) => {
      setFavorites(newFavorites);
    };

    favoritesEmitter.on('update', handleUpdate);
    return () => favoritesEmitter.off('update', handleUpdate);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    apiFetch('/api/proxy/favorites?type=job')
      .then((response) => {
        if (cancelled) return;
        const list = response.data || [];
        const remoteFavorites = Array.isArray(list)
          ? list.map((item: any) => Number(item.targetId)).filter((id: number) => Number.isFinite(id))
          : [];
        setFavorites(remoteFavorites);
        localStorage.setItem('careerai_favorites', JSON.stringify(remoteFavorites));
        favoritesEmitter.emit('update', remoteFavorites);
      })
      .catch((error) => {
        console.warn('Failed to load remote favorites:', error);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const persistLocalFavorites = (nextFavorites: number[]) => {
    setFavorites(nextFavorites);
    localStorage.setItem('careerai_favorites', JSON.stringify(nextFavorites));
    favoritesEmitter.emit('update', nextFavorites);
  };

  const syncFavorite = async (jobId: number, shouldFavorite: boolean, meta?: FavoriteMeta) => {
    if (!isAuthenticated) return;

    if (shouldFavorite) {
      await apiFetch('/api/proxy/favorites', {
        method: 'POST',
        body: JSON.stringify({ type: 'job', targetId: jobId, title: meta?.title || '', subtitle: meta?.subtitle || '' }),
      });
      return;
    }

    await apiFetch('/api/proxy/favorites', {
      method: 'DELETE',
      body: JSON.stringify({ type: 'job', targetId: jobId }),
    });
  };

  const toggleFavorite = (jobId: number, meta?: FavoriteMeta) => {
    const shouldFavorite = !favorites.includes(jobId);
    const newFavorites = favorites.includes(jobId)
      ? favorites.filter(id => id !== jobId)
      : [...favorites, jobId];

    persistLocalFavorites(newFavorites);
    syncFavorite(jobId, shouldFavorite, meta).catch((error) => {
      console.warn('Failed to sync favorite:', error);
      persistLocalFavorites(favorites);
    });
  };

  const isFavorite = (jobId: number) => favorites.includes(jobId);

  return { favorites, toggleFavorite, isFavorite };
}
