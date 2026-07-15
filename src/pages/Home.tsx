import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import {
  useOpenDining, useParkingLots,
  useEvents, useJobs, useWeather, useAlerts,
  useUniversityInfo
} from '../hooks/useUniversity';
import {
  Search, Sun, Cloud, CloudRain, CloudLightning, CloudSnow,
  CloudDrizzle, CloudFog, Wind, Droplets,
  Eye, Navigation, Car, UtensilsCrossed,
  Calendar, Briefcase, Users, ChevronRight,
  AlertTriangle, X, Sparkles, GraduationCap, Compass,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' as const },
  }),
};

// Weather icon mapping
function WeatherIcon({ icon, size = 24 }: { icon: string; size?: number }) {
  const props = { size, className: 'shrink-0' };
  switch (icon) {
    case 'sun': return <Sun {...props} className="text-amber-500" />;
    case 'sun-dim': return <Sun {...props} className="text-amber-400" />;
    case 'cloud-sun': return <Cloud {...props} className="text-amber-400" />;
    case 'cloud': return <Cloud {...props} className="text-gray-400" />;
    case 'cloud-fog': return <CloudFog {...props} className="text-gray-400" />;
    case 'cloud-drizzle': return <CloudDrizzle {...props} className="text-blue-400" />;
    case 'cloud-rain': return <CloudRain {...props} className="text-blue-500" />;
    case 'snowflake': return <CloudSnow {...props} className="text-blue-300" />;
    case 'cloud-lightning': return <CloudLightning {...props} className="text-purple-500" />;
    case 'moon': return <Sun {...props} className="text-indigo-300" />;
    default: return <Sun {...props} className="text-amber-500" />;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const info = useUniversityInfo();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Data queries
  const { data: weather } = useWeather();
  const { data: alerts = [] } = useAlerts();
  const { data: openDining = [] } = useOpenDining();
  const { data: events = [] } = useEvents();
  const { data: jobs = [] } = useJobs();
  const { data: parkingLots = [] } = useParkingLots();

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const upcomingEvents = events.slice(0, 4);
  const newJobs = jobs.filter((j) => j.isNew).slice(0, 3);
  const nearestLot = parkingLots[0];

  // Filter non-dismissed alerts
  const activeAlerts = alerts.filter((a) => !state.dismissedAlerts.includes(a.id));

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground">{dayName}</p>
              <h1 className="text-lg font-bold">
                {greeting()}, <span className="text-primary">Raider</span> 👋
              </h1>
            </div>
            {/* Weather Widget - Compact */}
            {weather && (
              <button
                onClick={() => navigate('/weather')}
                className="flex items-center gap-2 bg-muted/80 rounded-xl px-3 py-2 hover:bg-muted transition-colors"
              >
                <WeatherIcon icon={weather.current.icon} size={22} />
                <div className="text-right">
                  <span className="text-sm font-semibold">{weather.current.temp}°</span>
                  <span className="text-[10px] text-muted-foreground ml-1">{info.location.city}</span>
                </div>
              </button>
            )}
          </div>

          {/* Search Bar */}
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center gap-2.5 bg-muted rounded-xl px-3 h-11 text-left hover:bg-muted/80 transition-colors"
          >
            <Search size={18} className="text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground">Search dining, buildings, jobs, events...</span>
          </button>
        </div>
      </header>

      <div className="px-4 py-4 space-y-5">
        {/* Alerts */}
        <AnimatePresence>
          {activeAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: 100 }}
              className={`relative rounded-2xl p-4 ${
                alert.severity === 'critical'
                  ? 'bg-red-500/10 border border-red-500/20'
                  : alert.severity === 'warning'
                  ? 'bg-amber-500/10 border border-amber-500/20'
                  : 'bg-blue-500/10 border border-blue-500/20'
              }`}
            >
              <button
                onClick={() => dispatch({ type: 'DISMISS_ALERT', alertId: alert.id })}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5"
              >
                <X size={14} />
              </button>
              <div className="flex items-start gap-3 pr-6">
                <AlertTriangle
                  size={20}
                  className={
                    alert.severity === 'critical'
                      ? 'text-red-500'
                      : alert.severity === 'warning'
                      ? 'text-amber-500'
                      : 'text-blue-500'
                  }
                />
                <div>
                  <h3 className="text-sm font-semibold">{alert.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Weather Detail Card */}
        {weather && (
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onClick={() => navigate('/weather')}
            className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-5 border border-primary/10 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <WeatherIcon icon={weather.current.icon} size={32} />
                  <span className="text-3xl font-bold">{weather.current.temp}°F</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Feels like {weather.current.feelsLike}° • {weather.current.condition}
                </p>
                {weather.dataSource === 'live' && (
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Live
                  </span>
                )}
                {weather.dataSource === 'demo' && (
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                    Demo Data
                  </span>
                )}
              </div>
              <div className="text-right space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Droplets size={12} />
                  {weather.current.humidity}%
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Wind size={12} />
                  {weather.current.windSpeed} mph
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Eye size={12} />
                  {weather.current.uvIndex} UV
                </div>
              </div>
            </div>

            {/* Hourly Forecast */}
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
              {weather.hourly.slice(0, 8).map((hour, i) => (
                <div key={i} className="flex flex-col items-center gap-1 min-w-[48px]">
                  <span className="text-[10px] text-muted-foreground">{hour.time}</span>
                  <WeatherIcon icon={hour.icon} size={16} />
                  <span className="text-xs font-medium">{hour.temp}°</span>
                </div>
              ))}
            </div>

            {/* 7-Day Forecast Preview */}
            <div className="mt-4 pt-3 border-t border-primary/10 space-y-1.5">
              {weather.daily.slice(0, 3).map((day) => (
                <div key={day.date} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground w-12">{day.dayName}</span>
                  <div className="flex items-center gap-2">
                    <WeatherIcon icon={day.icon} size={16} />
                    <span className="text-xs text-muted-foreground">{day.precipitation}%</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="font-medium">{day.high}°</span>
                    <span className="text-muted-foreground">{day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Access Grid */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-base font-semibold mb-3">Quick Access</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Compass, label: 'Explore', path: '/explore', color: '#CC0000' },
              { icon: Navigation, label: 'Map', path: '/map', color: '#0066CC' },
              { icon: GraduationCap, label: 'Faculty', path: '/faculty', color: '#9933CC' },
              { icon: UtensilsCrossed, label: 'Dining', path: '/explore/dining', color: '#FF6600' },
              { icon: Calendar, label: 'Events', path: '/explore/events', color: '#0099CC' },
              { icon: Briefcase, label: 'Jobs', path: '/explore/jobs', color: '#339933' },
              { icon: Users, label: 'Orgs', path: '/explore/orgs', color: '#CC0066' },
              { icon: Car, label: 'Parking', path: '/explore/parking', color: '#666666' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1.5 p-3 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all active:scale-95"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon size={20} style={{ color: item.color }} />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Open Dining */}
        {openDining.length > 0 && (
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-semibold">Open Now</h2>
                <p className="text-xs text-muted-foreground">Dining near you</p>
              </div>
              <button
                onClick={() => navigate('/explore/dining')}
                className="text-xs text-primary flex items-center gap-0.5 font-medium"
              >
                See all <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {openDining.slice(0, 2).map((venue) => (
                <button
                  key={venue.id}
                  onClick={() => navigate(`/detail/dining/${venue.id}`)}
                  className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <UtensilsCrossed size={18} className="text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span className="text-xs text-green-600 font-medium">Open</span>
                    </div>
                    <h3 className="text-sm font-medium truncate">{venue.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{venue.location}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Parking Status */}
        {nearestLot && (
          <motion.div
            custom={3}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onClick={() => navigate('/explore/parking')}
            className="bg-card border border-border rounded-2xl p-4 cursor-pointer hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Car size={18} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Nearest Lot</p>
                  <h3 className="text-sm font-medium">{nearestLot.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      nearestLot.status === 'available' ? 'bg-green-500' :
                      nearestLot.status === 'limited' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <span className="text-xs text-muted-foreground capitalize">{nearestLot.status}</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </motion.div>
        )}

        {/* Upcoming Events */}
        <motion.div
          custom={4}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold">Upcoming Events</h2>
              <p className="text-xs text-muted-foreground">This week</p>
            </div>
            <button
              onClick={() => navigate('/explore/events')}
              className="text-xs text-primary flex items-center gap-0.5 font-medium"
            >
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {upcomingEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => navigate(`/detail/event/${event.id}`)}
                className="min-w-[260px] bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all text-left"
              >
                <div className="h-24 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <Calendar size={28} className="text-primary/40" />
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    {event.hasFreeFood && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                        Free Food
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">{event.category}</span>
                  </div>
                  <h3 className="text-sm font-medium line-clamp-1">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event.startTime} · {event.location.split(' - ')[0]}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Campus Jobs */}
        <motion.div
          custom={5}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold">Campus Jobs</h2>
              <p className="text-xs text-muted-foreground">New postings</p>
            </div>
            <button
              onClick={() => navigate('/explore/jobs')}
              className="text-xs text-primary flex items-center gap-0.5 font-medium"
            >
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {newJobs.slice(0, 3).map((job) => (
              <button
                key={job.id}
                onClick={() => navigate(`/detail/job/${job.id}`)}
                className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/30 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <Briefcase size={18} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">{job.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{job.department}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{job.type}</span>
                    <span className="text-[10px] text-muted-foreground">{job.payRange}/hr</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Lumi AI Promo */}
        <motion.div
          custom={6}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          onClick={() => navigate('/lumi')}
          className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 text-primary-foreground cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Ask Lumi Anything</h3>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                Your AI campus assistant. Get instant answers about classes, events, dining, and more.
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-white/90 font-medium">
                Try it now <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Tagline */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground/50 font-medium tracking-wide">
            {info.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}

// AnimatePresence wrapper for alerts
function AnimatePresence({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
