import { useState } from 'react';
import { useNavigate } from 'react-router';
import { diningVenues, isVenueOpen } from '../../data/universityProfile';
import { Search, UtensilsCrossed, Heart, ChevronLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const filters = ['All', 'Open Now', 'All-You-Care', 'Grab & Go', 'Coffee', 'Fast Food'];

export default function DiningScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = diningVenues.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' ? true :
      activeFilter === 'Open Now' ? isVenueOpen(v) :
      activeFilter === 'All-You-Care' ? v.category === 'all-you-care' :
      activeFilter === 'Grab & Go' ? v.category === 'grab-go' :
      activeFilter === 'Coffee' ? v.category === 'coffee' :
      activeFilter === 'Fast Food' ? v.category === 'fast-food' : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-full bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Dining</h1>
          </div>
          <div className="relative mb-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
        <p className="text-[10px] text-muted-foreground text-center">
          Hours — Demo Data, subject to change. Check{' '}
          <a href="https://www.depts.ttu.edu/hospitality/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            ttu.edu/hospitality
          </a>{' '}
          for current hours.
        </p>

        {filtered.map((venue) => {
          const open = isVenueOpen(venue);
          const isFav = state.favoriteDining.includes(venue.id);
          return (
            <button
              key={venue.id}
              onClick={() => navigate(`/detail/dining/${venue.id}`)}
              className="w-full flex items-start gap-3.5 bg-card border border-border rounded-2xl p-3.5 text-left"
            >
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <UtensilsCrossed size={28} className="text-primary/50" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`w-2 h-2 rounded-full ${open ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className={`text-xs font-medium ${open ? 'text-emerald-600' : 'text-red-500'}`}>
                    {open ? 'Open' : 'Closed'}
                  </span>
                  {venue.distance && <span className="text-xs text-muted-foreground">· {venue.distance}</span>}
                </div>
                <p className="font-semibold text-sm">{venue.name}</p>
                <p className="text-xs text-muted-foreground">{venue.location}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {venue.acceptsDiningBucks && (
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Dining Bucks</span>
                  )}
                  {venue.hasCommuterDiscount && (
                    <span className="text-[10px] bg-accent/20 text-amber-700 px-1.5 py-0.5 rounded-full">15% Off Commuters</span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'TOGGLE_FAVORITE_DINING', venueId: venue.id });
                }}
                className="shrink-0 p-1"
              >
                <Heart size={18} className={isFav ? 'text-red-500 fill-red-500' : 'text-muted-foreground'} />
              </button>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <UtensilsCrossed size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No venues found</p>
          </div>
        )}
      </div>
    </div>
  );
}
