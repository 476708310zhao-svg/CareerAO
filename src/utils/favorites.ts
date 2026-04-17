import { useState, useEffect } from 'react';

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

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    // Load initial favorites from localStorage
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

  const toggleFavorite = (jobId: number) => {
    const newFavorites = favorites.includes(jobId)
      ? favorites.filter(id => id !== jobId)
      : [...favorites, jobId];
    
    setFavorites(newFavorites);
    localStorage.setItem('careerai_favorites', JSON.stringify(newFavorites));
    favoritesEmitter.emit('update', newFavorites);
    
    // In a real app, you would also sync this with the backend:
    // apiFetch(`/api/jobs/${jobId}/favorite`, { method: 'POST' });
  };

  const isFavorite = (jobId: number) => favorites.includes(jobId);

  return { favorites, toggleFavorite, isFavorite };
}
