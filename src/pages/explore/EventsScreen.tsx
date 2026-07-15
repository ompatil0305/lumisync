import { useState } from 'react';
import { useNavigate } from 'react-router';
import { campusEvents } from '../../data/universityProfile';
import { CalendarDays, Search, ChevronLeft, Sparkles, MapPin, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const filters = ['All', 'Academic', 'Career', 'Sports', 'Social', 'International', 'Free Food'];

export default function EventsScreen() {
  const navigate = useNavigate();
  useApp(); // for future use
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const filtered = campusEvents.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.organization.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === 'All' ? true :
      activeFilter === 'Free Food' ? e.hasFreeFood :
      e.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-full bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-xl font-bold">Events</h1>
            </div>
            <div className="flex gap-1 bg-muted rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewMode === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewMode === 'calendar' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
              >
                Calendar
              </button>
            </div>
          </div>
          <div className="relative mb-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-muted rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 pb-24 space-y-3">
        {filtered.map((evt) => (
          <button
            key={evt.id}
            onClick={() => navigate(`/detail/event/${evt.id}`)}
            className="w-full bg-card border border-border rounded-2xl overflow-hidden text-left"
          >
            <div className="w-full h-32 bg-muted flex items-center justify-center">
              <CalendarDays size={36} className="text-primary/30" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {evt.hasFreeFood && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-medium">
                        <Sparkles size={10} /> Free Food
                      </span>
                    )}
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{evt.category}</span>
                  </div>
                  <h3 className="font-semibold text-sm leading-tight">{evt.title}</h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <Clock size={12} /> {formatDate(evt.date)} · {evt.startTime}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin size={12} /> {evt.location}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Hosted by {evt.organization}</p>
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <CalendarDays size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No events found</p>
          </div>
        )}
      </div>
    </div>
  );
}
