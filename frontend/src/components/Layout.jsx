
export const Header = ({ isDark, onThemeToggle }) => {
  return (
    <header className="glass backdrop-blur-lg sticky top-0 z-40 border-b border-white/10 dark:border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-2xl">▶️</div>
          <div>
            <h1 className="text-xl font-bold">PlayTime</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              YouTube Playlist Length Calculator
            </p>
          </div>
        </div>
        <button
          onClick={onThemeToggle}
          className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};
