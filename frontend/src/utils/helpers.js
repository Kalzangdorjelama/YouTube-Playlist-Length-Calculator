/**
 * Extract YouTube playlist ID from URL
 */
export const extractPlaylistId = (url) => {
  if (!url || typeof url !== 'string') return null;

  // Match URLs like:
  // - youtube.com/playlist?list=PLxxxxx
  // - youtu.be/PLxxxxx
  // - youtube.com/watch?v=xxx&list=PLxxxxx
  const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  
  if (playlistMatch && playlistMatch[1]) {
    return playlistMatch[1];
  }

  return null;
};

/**
 * Format seconds to human-readable duration
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

/**
 * Validate YouTube URL
 */
export const isValidYoutubeUrl = (url) => {
  if (!url) return false;
  const youtubeRegex = /(youtube\.com|youtu\.be)/;
  return youtubeRegex.test(url);
};

/**
 * Calculate completion time based on duration and hours per day
 */
export const calculateCompletionTime = (totalSeconds, hoursPerDay = 1) => {
  if (!totalSeconds || !hoursPerDay || hoursPerDay <= 0) return null;

  const totalHours = totalSeconds / 3600;
  const days = Math.ceil(totalHours / hoursPerDay);

  return {
    totalHours: totalHours.toFixed(1),
    days,
    weeks: Math.ceil(days / 7),
    months: Math.ceil(days / 30)
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Save to localStorage with JSON serialization
 */
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

/**
 * Get from localStorage with JSON parsing
 */
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to get from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove from localStorage
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
    return false;
  }
};
