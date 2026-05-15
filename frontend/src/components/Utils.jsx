import React from 'react';
import { copyToClipboard, formatDuration } from '../utils/helpers';

export const PlaylistHistory = ({ history, onSelect, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          No search history yet. Start by entering a playlist URL.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Searches</h3>
        <button
          onClick={onClear}
          className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
        >
          Clear History
        </button>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelect(item)}
            className="w-full text-left p-3 rounded-lg hover:bg-white/20 dark:hover:bg-white/5 transition-colors"
          >
            <p className="font-medium text-sm truncate">{item.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {item.videoCount} videos • {formatDuration(item.totalDurationSeconds)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export const CopyButton = ({ text, label = 'Copy Results' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
        copied
          ? 'bg-emerald-500 text-white'
          : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white'
      }`}
    >
      {copied ? '✓ Copied!' : label}
    </button>
  );
};

export const ThemeToggle = ({ isDark, onChange }) => {
  return (
    <button
      onClick={onChange}
      className="p-2 rounded-lg glass hover:bg-white/30 dark:hover:bg-white/20 transition-colors"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};
