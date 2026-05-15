import { Header } from './components/Layout';
import { useDarkMode } from './hooks/useCustom';
import './index.css';
import { Dashboard } from './pages/Dashboard';

function App() {
  const { isDark, toggle: toggleTheme } = useDarkMode();

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white">
        <Header isDark={isDark} onThemeToggle={toggleTheme} />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Dashboard />
        </main>

      </div>
    </div>
  );
}

export default App;
