import { Routes, Route, useLocation } from 'react-router';
import { AppProvider, useApp } from './context/AppContext';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import CampusMap from './pages/CampusMap';
import Lumi from './pages/Lumi';
import Profile from './pages/Profile';
import SearchScreen from './pages/SearchScreen';
import FacultyDirectory from './pages/FacultyDirectory';
import WeatherScreen from './pages/WeatherScreen';

// Explore sub-pages
import DiningScreen from './pages/explore/DiningScreen';
import ParkingScreen from './pages/explore/ParkingScreen';
import BuildingsScreen from './pages/explore/BuildingsScreen';
import JobsScreen from './pages/explore/JobsScreen';
import EventsScreen from './pages/explore/EventsScreen';
import OrgsScreen from './pages/explore/OrgsScreen';
import ShuttleScreen from './pages/explore/ShuttleScreen';

// Detail pages
import BuildingDetail from './pages/detail/BuildingDetail';
import DiningDetail from './pages/detail/DiningDetail';
import EventDetail from './pages/detail/EventDetail';
import JobDetail from './pages/detail/JobDetail';
import OrgDetail from './pages/detail/OrgDetail';

// Components
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function AppContent() {
  const { state, dispatch } = useApp();
  const location = useLocation();

  // Sync dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (state.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.isDark]);

  // Check system theme
  useEffect(() => {
    if (state.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      dispatch({ type: 'SET_DARK', isDark: mq.matches });
      const handler = (e: MediaQueryListEvent) => dispatch({ type: 'SET_DARK', isDark: e.matches });
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      dispatch({ type: 'SET_DARK', isDark: state.theme === 'dark' });
    }
  }, [state.theme, dispatch]);

  // Hide bottom nav on detail, search, faculty, and weather pages
  const showNav =
    !location.pathname.includes('/detail/') &&
    location.pathname !== '/search' &&
    location.pathname !== '/faculty' &&
    location.pathname !== '/weather';

  return (
    <div className={`h-screen w-full flex flex-col bg-background text-foreground overflow-hidden ${state.textSize === 'large' ? 'text-[110%]' : state.textSize === 'extra-large' ? 'text-[125%]' : ''}`}>
      <main className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/dining" element={<DiningScreen />} />
            <Route path="/explore/parking" element={<ParkingScreen />} />
            <Route path="/explore/buildings" element={<BuildingsScreen />} />
            <Route path="/explore/jobs" element={<JobsScreen />} />
            <Route path="/explore/events" element={<EventsScreen />} />
            <Route path="/explore/orgs" element={<OrgsScreen />} />
            <Route path="/explore/shuttle" element={<ShuttleScreen />} />
            <Route path="/map" element={<CampusMap />} />
            <Route path="/faculty" element={<FacultyDirectory />} />
            <Route path="/weather" element={<WeatherScreen />} />
            <Route path="/lumi" element={<Lumi />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/detail/building/:id" element={<BuildingDetail />} />
            <Route path="/detail/dining/:id" element={<DiningDetail />} />
            <Route path="/detail/event/:id" element={<EventDetail />} />
            <Route path="/detail/job/:id" element={<JobDetail />} />
            <Route path="/detail/org/:id" element={<OrgDetail />} />
          </Routes>
        </AnimatePresence>
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        {!showSplash && <AppContent />}
      </AppProvider>
    </QueryClientProvider>
  );
}
