import { useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { Home, Compass, Map, Sparkles, User } from 'lucide-react';
import type { Tab } from '../context/AppContext';

const tabs: { key: Tab; label: string; icon: typeof Home; path: string }[] = [
  { key: 'home', label: 'Home', icon: Home, path: '/' },
  { key: 'explore', label: 'Explore', icon: Compass, path: '/explore' },
  { key: 'map', label: 'Map', icon: Map, path: '/map' },
  { key: 'lumi', label: 'Lumi', icon: Sparkles, path: '/lumi' },
  { key: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useApp();

  const currentPath = location.pathname;

  return (
    <nav className="shrink-0 h-16 bg-background/95 backdrop-blur-lg border-t border-border z-50 pb-safe">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive =
            tab.path === '/'
              ? currentPath === '/'
              : currentPath.startsWith(tab.path);
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => {
                dispatch({ type: 'SET_TAB', tab: tab.key });
                navigate(tab.path);
              }}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="relative p-1">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {tab.key === 'lumi' && (
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-600 border-2 border-background animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
