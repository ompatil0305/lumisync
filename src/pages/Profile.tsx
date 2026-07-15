import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ttuProfile } from '../data/universityProfile';
import {
  Briefcase, CalendarDays, UtensilsCrossed, Users,
  ChevronRight, Bell, Moon, Sun, Monitor, Type, LogOut,
  Trash2, Lock, Mail, Building2
} from 'lucide-react';
import { useState } from 'react';

export default function Profile() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [showAuth, setShowAuth] = useState(false);

  const user = state.user;
  const isGuest = !user;

  const favorites = [
    { label: 'Saved Jobs', count: state.savedJobs.length, icon: Briefcase, path: '/explore/jobs' },
    { label: 'Saved Events', count: state.savedEvents.length, icon: CalendarDays, path: '/explore/events' },
    { label: 'Favorite Dining', count: state.favoriteDining.length, icon: UtensilsCrossed, path: '/explore/dining' },
    { label: 'Favorite Orgs', count: state.favoriteOrgs.length, icon: Users, path: '/explore/orgs' },
  ];

  const handleSignOut = () => {
    dispatch({ type: 'SIGN_OUT' });
  };

  return (
    <div className="min-h-full bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        </div>
      </div>

      <div className="px-4 py-4 pb-24 space-y-5">
        {/* User Card */}
        <div className="bg-primary rounded-2xl p-5 text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold shrink-0">
              {isGuest ? 'G' : user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg">{isGuest ? 'Guest User' : user.name}</h2>
              <p className="text-sm opacity-80">
                {isGuest ? 'Guest Mode · Texas Tech' : user.email}
              </p>
              <span className="inline-block mt-1.5 text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
                {ttuProfile.name}
              </span>
            </div>
          </div>
        </div>

        {/* Auth buttons if guest */}
        {isGuest && (
          <div className="space-y-2">
            <button
              onClick={() => setShowAuth(!showAuth)}
              className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 text-left"
            >
              <Mail size={20} className="text-primary" />
              <div className="flex-1">
                <p className="font-medium text-sm">Sign in to save favorites</p>
                <p className="text-xs text-muted-foreground">Access personalized features</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>

            {showAuth && (
              <div className="bg-muted rounded-2xl p-4 space-y-2">
                <button className="w-full flex items-center gap-3 bg-background rounded-xl p-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium">Sign in with Google</span>
                </button>
                <button className="w-full flex items-center gap-3 bg-background rounded-xl p-3">
                  <Mail size={20} className="text-primary" />
                  <span className="text-sm font-medium">Sign in with Email</span>
                </button>
                <button
                  onClick={() => {
                    dispatch({ type: 'SET_USER', user: { name: 'Red Raider', email: 'demo@ttu.edu', isGuest: false } });
                    setShowAuth(false);
                  }}
                  className="w-full flex items-center gap-3 bg-background rounded-xl p-3 opacity-50"
                >
                  <Lock size={20} />
                  <div>
                    <span className="text-sm font-medium block">Sign in with Texas Tech eRaider (SSO)</span>
                    <span className="text-[10px] text-muted-foreground">Coming Soon</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    dispatch({ type: 'SET_USER', user: { name: 'Red Raider', email: 'demo@ttu.edu', isGuest: false } });
                    setShowAuth(false);
                  }}
                  className="w-full text-center text-xs text-muted-foreground py-2"
                >
                  Continue as Guest →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Favorites Grid */}
        <div>
          <h3 className="font-semibold text-sm mb-3 px-1">Saved & Favorites</h3>
          <div className="grid grid-cols-2 gap-3">
            {favorites.map((fav) => {
              const Icon = fav.icon;
              return (
                <button
                  key={fav.label}
                  onClick={() => navigate(fav.path)}
                  className="bg-card border border-border rounded-2xl p-4 text-left"
                >
                  <Icon size={20} className="text-primary mb-2" />
                  <p className="text-2xl font-bold">{fav.count}</p>
                  <p className="text-xs text-muted-foreground">{fav.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div>
          <h3 className="font-semibold text-sm mb-3 px-1">Settings</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Appearance */}
            <div className="p-4 border-b border-border">
              <p className="text-xs font-medium text-muted-foreground mb-3">Appearance</p>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => dispatch({ type: 'SET_THEME', theme: mode })}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                      state.theme === mode ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {mode === 'light' && <Sun size={14} />}
                    {mode === 'dark' && <Moon size={14} />}
                    {mode === 'system' && <Monitor size={14} />}
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <button
              onClick={() => dispatch({ type: 'SET_NOTIFICATIONS', enabled: !state.notifications })}
              className="w-full flex items-center justify-between p-4 border-b border-border text-left"
            >
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-muted-foreground" />
                <span className="text-sm">Notification Preferences</span>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors ${state.notifications ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${state.notifications ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
              </div>
            </button>

            {/* Text Size */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Type size={18} className="text-muted-foreground" />
                <span className="text-sm">Accessibility & Text Size</span>
              </div>
              <div className="flex gap-2">
                {(['normal', 'large', 'extra-large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => dispatch({ type: 'SET_TEXT_SIZE', size })}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                      state.textSize === size ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* University */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 size={18} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">University</p>
                <p className="text-xs text-muted-foreground">{ttuProfile.name}</p>
              </div>
            </div>
            <span className="text-[10px] bg-accent/20 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              Only TTU
            </span>
          </div>
        </div>

        {/* Account */}
        {!isGuest && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <LogOut size={18} className="text-muted-foreground" />
              <span className="text-sm">Sign Out</span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 text-left border-t border-border">
              <Trash2 size={18} className="text-red-500" />
              <span className="text-sm text-red-500">Delete Account</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground font-medium">Lumisync v1.0</p>
          <p className="text-[10px] text-muted-foreground">{ttuProfile.tagline}</p>
        </div>
      </div>
    </div>
  );
}
