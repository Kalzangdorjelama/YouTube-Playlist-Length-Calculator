import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for managing toast notifications
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type };
    
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

/**
 * Custom hook for managing dark mode
 */
export const useDarkMode = (initialState = false) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';

    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggle = useCallback(() => {
    setIsDark(prev => {
      const newState = !prev;
      localStorage.setItem('theme', newState ? 'dark' : 'light');
      
      if (newState) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return newState;
    });
  }, []);

  // Apply theme on mount
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return { isDark, toggle };
};

/**
 * Custom hook for playlist history
 */
export const usePlaylistHistory = () => {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('playlistHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const addToHistory = useCallback((item) => {
    setHistory(prev => {
      const updated = [item, ...prev.filter(h => h.playlistId !== item.playlistId)].slice(0, 10);
      localStorage.setItem('playlistHistory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('playlistHistory');
  }, []);

  return { history, addToHistory, clearHistory };
};
