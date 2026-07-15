import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import {
  useOpenDining, useParkingLots,
  useEvents, useJobs, useWeather, useAlerts,
  useUniversityInfo
} from '../hooks/useUniversity';
import {
  Search, Sun, Cloud, CloudRain, CloudLightning, CloudSnow,
  CloudDrizzle, CloudFog,
  Car, UtensilsCrossed,
  Calendar, Briefcase, ChevronRight,
  AlertTriangle, X, Sparkles,
  GraduationCap, MapPin, Bus, BookOpen,
  Clock, Navigation2, Heart, ArrowRight,
  Building2, Compass, Users, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// ---- Animation Variants ----
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.38, ease: 'easeOut' as const },
  }),
};

// ---- Demo Data ----
const DEMO_SCHEDULE = [
  {
    id: 'cs1',
    course: 'CS 3375',
    name: 'Computer Organization',
    time: '9:30 AM',
    endTime: '10:50 AM',
    building: 'Holden Hall',
    room: '109',
    color: '#CC0000',
    status: 'completed' as const,
  },
  {
    id: 'cs2',
    course: 'MATH 2350',
    name: 'Calculus III',
    time: '11:00 AM',
    endTime: '12:20 PM',
    building: 'Mathematics Building',
    room: '14',
    color: '#0066CC',
    status: 'in-progress' as const,
  },
  {
    id: 'cs3',
    course: 'CS 4334',
    name: 'Numerical Analysis',
    time: '2:00 PM',
    endTime: '3:20 PM',
    building: 'Holden Hall',
    room: '246',
    color: '#9933CC',
    status: 'upcoming' as const,
  },
  {
    id: 'cs4',
    course: 'ENGL 2311',
    name: 'Technical Writing',
    time: '3:30 PM',
    endTime: '4:50 PM',
    building: 'English/Philosophy',
    room: '103',
    color: '#339933',
    status: 'upcoming' as const,
  },
];

const DEMO_SHUTTLE = {
  route: 'Red Route',
  stop: 'Student Union Building',
  arrival: '4 min',
  nextArrival: '12 min',
  color: '#CC0000',
};

const DEMO_STUDY_SPACES = [
  { id: 'lib1', name: 'University Library – 3rd Floor', occupancy: 42, quiet: 'Silent Zone', openUntil: '2:00 AM', icon: BookOpen },
  { id: 'sub1', name: 'SUB Study Lounge', occupancy: 68, quiet: 'Collaborative', openUntil: '11:00 PM', icon: Wifi },
  { id: 'raw1', name: 'Rawls College Study Room', occupancy: 25, quiet: 'Quiet', openUntil: '10:00 PM', icon: Building2 },
];

// ---- Weather Icon ----
function WeatherIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  const cls = 'shrink-0';
  switch (icon) {
    case 'sun': return <Sun size={size} className={`${cls} text-amber-400`} />;
    case 'sun-dim': return <Sun size={size} className={`${cls} text-amber-300`} />;
    case 'cloud-sun': return <Cloud size={size} className={`${cls} text-amber-300`} />;
    case 'cloud': return <Cloud size={size} className={`${cls} text-slate-400`} />;
    case 'cloud-fog': return <CloudFog size={size} className={`${cls} text-slate-400`} />;
    case 'cloud-drizzle': return <CloudDrizzle size={size} className={`${cls} text-blue-400`} />;
    case 'cloud-rain': return <CloudRain size={size} className={`${cls} text-blue-500`} />;
    case 'snowflake': return <CloudSnow size={size} className={`${cls} text-blue-300`} />;
    case 'cloud-lightning': return <CloudLightning size={size} className={`${cls} text-purple-400`} />;
    default: return <Sun size={size} className={`${cls} text-amber-400`} />;
  }
}

// ---- Occupancy Bar ----
function OccupancyBar({ pct }: { pct: number }) {
  const color = pct < 40 ? '#22c55e' : pct < 70 ? '#f59e0b' : '#ef4444';
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

// ---- Status Badge ----
function StatusBadge({ status }: { status: 'completed' | 'in-progress' | 'upcoming' }) {
  if (status === 'in-progress')
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/20">In Progress</span>;
  if (status === 'completed')
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Done</span>;
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Upcoming</span>;
}

// ---- Main Component ----
export default function Home() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const info = useUniversityInfo();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [favEvents, setFavEvents] = useState<string[]>([]);

  const { data: weather } = useWeather();
  const { data: alerts = [] } = useAlerts();
  const { data: openDining = [] } = useOpenDining();
  const { data: events = [] } = useEvents();
  const { data: jobs = [] } = useJobs();
  const { data: parkingLots = [] } = useParkingLots();

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const activeAlerts = alerts.filter((a) => !state.dismissedAlerts.includes(a.id));
  const nearestLot = parkingLots[0];
  const featuredDining = openDining[0];
  const todayEvents = events.slice(0, 3);
  const newJobs = jobs.filter((j) => j.isNew).slice(0, 3);



  const toggleFav = (id: string) =>
    setFavEvents((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const quickActions = [
    { icon: Compass, label: 'Explore', path: '/explore', color: '#CC0000' },
    { icon: MapPin, label: 'Map', path: '/map', color: '#0066CC' },
    { icon: GraduationCap, label: 'Faculty', path: '/faculty', color: '#9933CC' },
    { icon: UtensilsCrossed, label: 'Dining', path: '/explore/dining', color: '#FF6600' },
    { icon: Calendar, label: 'Events', path: '/explore/events', color: '#0099CC' },
    { icon: Briefcase, label: 'Jobs', path: '/explore/jobs', color: '#339933' },
    { icon: Users, label: 'Orgs', path: '/explore/orgs', color: '#CC0066' },
    { icon: Sparkles, label: 'Lumi AI', path: '/lumi', color: '#7C3AED' },
  ];

  return (
    <div className="min-h-full bg-background">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/40">
        <div className="px-4 pt-4 pb-3 space-y-3">
          {/* Greeting Row */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">{dayName}</p>
              <h1 className="text-xl font-bold mt-0.5">
                {greeting}, <span className="text-primary">Raider</span> 👋
              </h1>
            </div>
            {/* Weather Chip */}
            {weather && (
              <button
                onClick={() => navigate('/weather')}
                className="flex items-center gap-1.5 bg-muted/80 hover:bg-muted active:scale-95 transition-all rounded-2xl px-3 py-2 border border-border/50"
              >
                <WeatherIcon icon={weather.current.icon} size={18} />
                <span className="text-sm font-bold">{weather.current.temp}°F</span>
                <span className="text-[10px] text-muted-foreground hidden sm:block">{info.location.city}</span>
              </button>
            )}
          </div>

          {/* Search Bar */}
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center gap-3 bg-muted/60 hover:bg-muted border border-border/40 rounded-2xl px-4 h-12 text-left transition-all"
          >
            <Search size={17} className="text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground">Buildings, dining, jobs, faculty…</span>
          </button>
        </div>
      </header>

      <div className="px-4 py-5 space-y-6 pb-10">

        {/* ── Campus Alerts ── */}
        <AnimatePresence>
          {activeAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: 80, transition: { duration: 0.2 } }}
              className={`relative rounded-2xl p-4 border ${
                alert.severity === 'critical'
                  ? 'bg-red-500/8 border-red-500/20'
                  : alert.severity === 'warning'
                  ? 'bg-amber-500/8 border-amber-500/20'
                  : 'bg-blue-500/8 border-blue-500/20'
              }`}
            >
              <button
                onClick={() => dispatch({ type: 'DISMISS_ALERT', alertId: alert.id })}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X size={14} />
              </button>
              <div className="flex items-start gap-3 pr-6">
                <AlertTriangle
                  size={18}
                  className={
                    alert.severity === 'critical' ? 'text-red-500 shrink-0' :
                    alert.severity === 'warning' ? 'text-amber-500 shrink-0' :
                    'text-blue-500 shrink-0'
                  }
                />
                <div>
                  <p className="text-sm font-semibold">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{alert.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ── Today's Schedule ── */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <SectionHeader
            title="Today's Schedule"
            subtitle={`${DEMO_SCHEDULE.length} classes`}
            action="Canvas"
            onAction={() => {}}
            badge="Demo"
          />
          <div className="relative pl-4">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-border rounded-full" />
            <div className="space-y-3">
              {DEMO_SCHEDULE.map((cls) => (
                <div key={cls.id} className="relative flex gap-4">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-4 top-4 w-3 h-3 rounded-full border-2 border-background z-10 shrink-0 ${
                      cls.status === 'in-progress' ? 'animate-pulse' : ''
                    }`}
                    style={{ backgroundColor: cls.status === 'completed' ? '#9ca3af' : cls.color }}
                  />
                  <div
                    className={`flex-1 rounded-2xl p-4 border transition-all ${
                      cls.status === 'in-progress'
                        ? 'bg-card border-green-500/30 shadow-sm shadow-green-500/10'
                        : cls.status === 'completed'
                        ? 'bg-muted/30 border-border/40 opacity-60'
                        : 'bg-card border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-lg text-white"
                            style={{ backgroundColor: cls.color }}
                          >
                            {cls.course}
                          </span>
                          <StatusBadge status={cls.status} />
                        </div>
                        <h3 className="text-sm font-semibold leading-snug">{cls.name}</h3>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={11} />{cls.time} – {cls.endTime}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 size={11} />{cls.building} {cls.room}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/map')}
                        className="shrink-0 w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Navigation2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Quick Actions ── */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <SectionHeader title="Quick Actions" />
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-2 p-3 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm active:scale-95 transition-all"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}18` }}>
                  <item.icon size={21} style={{ color: item.color }} />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Recommended Parking ── */}
        {nearestLot && (
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
            <SectionHeader title="Recommended Parking" badge="Demo" onAction={() => navigate('/explore/parking')} action="All Lots" />
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 px-5 py-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center">
                      <Car size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Nearest Available</p>
                      <h3 className="text-base font-bold leading-snug">{nearestLot.name}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      nearestLot.status === 'available' ? 'bg-green-500/15 text-green-600' :
                      nearestLot.status === 'limited' ? 'bg-amber-500/15 text-amber-600' :
                      'bg-red-500/15 text-red-500'
                    }`}>
                      {nearestLot.status === 'available' ? 'Open' : nearestLot.status === 'limited' ? 'Limited' : 'Full'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 flex items-center justify-between">
                <div className="flex gap-5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock size={12} />~5 min walk</span>
                  <span className="flex items-center gap-1.5"><Car size={12} />{nearestLot.totalSpaces - nearestLot.occupiedSpaces} spaces</span>
                  <span className="flex items-center gap-1.5"><MapPin size={12} />0.2 mi</span>
                </div>
                <button
                  onClick={() => navigate('/map')}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-80 transition-opacity"
                >
                  Directions <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Dining Recommendation ── */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
          <SectionHeader title="Dining Now" badge="Demo" onAction={() => navigate('/explore/dining')} action="All Venues" />
          {featuredDining ? (
            <div
              className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-orange-500/30 hover:shadow-md transition-all active:scale-[0.99]"
              onClick={() => navigate(`/detail/dining/${featuredDining.id}`)}
            >
              <div className="h-32 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-orange-400/5 flex items-center justify-center relative">
                <UtensilsCrossed size={40} className="text-orange-400/50" />
                <div className="absolute top-3 left-3">
                  <span className="flex items-center gap-1.5 text-xs font-bold bg-green-500 text-white px-2.5 py-1 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />Open Now
                  </span>
                </div>
              </div>
              <div className="px-4 py-3">
                <h3 className="font-bold text-base">{featuredDining.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{featuredDining.location}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={11} />Closes 10 PM</span>
                    <span className="flex items-center gap-1"><MapPin size={11} />~3 min walk</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/detail/dining/${featuredDining.id}`); }}
                    className="text-xs font-bold text-primary hover:opacity-80 transition-opacity"
                  >
                    Menu →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-5 text-center">
              <UtensilsCrossed size={28} className="mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No venues open right now</p>
            </div>
          )}
        </motion.div>

        {/* ── Next Shuttle ── */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
          <SectionHeader title="Next Shuttle" badge="Demo" onAction={() => navigate('/explore/shuttle')} action="All Routes" />
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${DEMO_SHUTTLE.color}20` }}>
                <Bus size={22} style={{ color: DEMO_SHUTTLE.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: DEMO_SHUTTLE.color }}>
                    {DEMO_SHUTTLE.route}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin size={11} />{DEMO_SHUTTLE.stop}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black text-primary">{DEMO_SHUTTLE.arrival}</p>
                <p className="text-[10px] text-muted-foreground">Then {DEMO_SHUTTLE.nextArrival}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Today's Events ── */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <SectionHeader title="Today's Events" onAction={() => navigate('/explore/events')} action="See All" />
          <div className="space-y-3">
            {todayEvents.length === 0 ? (
              <EmptyCard icon={Calendar} label="No events today" />
            ) : (
              todayEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden flex cursor-pointer hover:border-primary/30 hover:shadow-sm active:scale-[0.99] transition-all"
                  onClick={() => navigate(`/detail/event/${event.id}`)}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0 self-stretch">
                    <Calendar size={24} className="text-primary/40" />
                  </div>
                  <div className="flex-1 min-w-0 p-3 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      {event.hasFreeFood && (
                        <span className="text-[10px] font-bold bg-amber-500/15 text-amber-600 px-1.5 py-0.5 rounded-full">🍕 Free Food</span>
                      )}
                      <span className="text-[10px] text-muted-foreground">{event.category}</span>
                    </div>
                    <h3 className="text-sm font-semibold line-clamp-1">{event.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock size={10} />{event.startTime} · {event.location.split(' - ')[0]}
                    </p>
                  </div>
                  <div className="flex items-center pr-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFav(event.id); }}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                    >
                      <Heart
                        size={17}
                        className={favEvents.includes(event.id) ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}
                      />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* ── Campus Jobs ── */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <SectionHeader title="Campus Jobs" subtitle="New postings" onAction={() => navigate('/explore/jobs')} action="See All" />
          <div className="space-y-2.5">
            {newJobs.length === 0 ? (
              <EmptyCard icon={Briefcase} label="No new jobs" />
            ) : (
              newJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-green-500/30 hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer"
                  onClick={() => navigate(`/detail/job/${job.id}`)}
                >
                  <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <Briefcase size={19} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{job.title}</h3>
                    <p className="text-xs text-muted-foreground">{job.department}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full font-medium">{job.type}</span>
                      <span className="text-[10px] text-muted-foreground">{job.payRange}/hr</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/detail/job/${job.id}`); }}
                    className="shrink-0 text-xs font-bold text-primary border border-primary/30 px-3 py-1.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Apply
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* ── Study Spaces ── */}
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
          <SectionHeader title="Study Spaces" badge="Demo" onAction={() => navigate('/map')} action="Find More" />
          <div className="space-y-2.5">
            {DEMO_STUDY_SPACES.map((space) => (
              <div key={space.id} className="bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-all cursor-pointer hover:shadow-sm active:scale-[0.99]"
                onClick={() => navigate('/map')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                    <space.icon size={18} className="text-violet-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{space.name}</h3>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Clock size={10} />Open until {space.openUntil}</span>
                      <span className="font-medium">{space.quiet}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    space.occupancy < 40 ? 'bg-green-500/10 text-green-600' :
                    space.occupancy < 70 ? 'bg-amber-500/10 text-amber-600' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {space.occupancy}%
                  </span>
                </div>
                <OccupancyBar pct={space.occupancy} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Lumi AI Banner ── */}
        <motion.div
          custom={8}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          onClick={() => navigate('/lumi')}
          className="bg-gradient-to-br from-primary via-primary to-[#8B0000] rounded-2xl p-5 cursor-pointer hover:shadow-xl hover:shadow-primary/20 active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm">
              <Sparkles size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-base">Ask Lumi Anything</h3>
              <p className="text-xs text-white/75 mt-0.5 leading-relaxed">
                AI assistant for classes, events, dining, and more.
              </p>
            </div>
            <ArrowRight size={20} className="text-white/70 shrink-0" />
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-[10px] text-muted-foreground/40 font-medium tracking-widest uppercase">{info.tagline}</p>
        </div>
      </div>
    </div>
  );
}

// ── Section Header Helper ──
function SectionHeader({
  title, subtitle, action, onAction, badge,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-bold">{title}</h2>
        {badge && (
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600">
            {badge}
          </span>
        )}
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action && onAction && (
        <button onClick={onAction} className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:opacity-80 transition-opacity">
          {action} <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

// ── Empty State Helper ──
function EmptyCard({ icon: Icon, label }: { icon: typeof Calendar; label: string }) {
  return (
    <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 text-center">
      <Icon size={26} className="mx-auto text-muted-foreground/30 mb-2" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
