import { useParams, useNavigate } from 'react-router';
import { diningVenues, isVenueOpen } from '../../data/universityProfile';
import { ChevronLeft, UtensilsCrossed, Clock, MapPin, Heart, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DiningDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const venue = diningVenues.find(v => v.id === id);

  if (!venue) {
    return (
      <div className="min-h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Venue not found</p>
      </div>
    );
  }

  const open = isVenueOpen(venue);
  const isFav = state.favoriteDining.includes(venue.id);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-full bg-background">
      {/* Hero */}
      <div className="relative h-48 bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <UtensilsCrossed size={64} className="text-primary/30" />
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-lg"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_FAVORITE_DINING', venueId: venue.id })}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-lg"
        >
          <Heart size={18} className={isFav ? 'text-red-500 fill-red-500' : 'text-muted-foreground'} />
        </button>
      </div>

      <div className="px-4 py-5 pb-24 -mt-6 relative">
        <div className="bg-card border border-border rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              open ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              {open ? 'Open Now' : 'Closed'}
            </span>
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full capitalize">
              {venue.category.replace('-', ' ')}
            </span>
          </div>
          <h1 className="text-xl font-bold mb-1">{venue.name}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin size={14} /> {venue.location}
          </p>
          {venue.distance && (
            <p className="text-xs text-muted-foreground mt-0.5">{venue.distance} from center campus</p>
          )}
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{venue.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {venue.acceptsDiningBucks && (
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">Accepts Dining Bucks</span>
          )}
          {venue.hasCommuterDiscount && (
            <span className="text-xs bg-accent/20 text-amber-700 px-2.5 py-1 rounded-full font-medium">15% Commuter Discount</span>
          )}
        </div>

        {/* Stations */}
        {venue.stations && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-4">
            <h3 className="font-semibold text-sm mb-3">Culinary Stations</h3>
            <div className="flex flex-wrap gap-2">
              {venue.stations.map(s => (
                <span key={s} className="text-xs bg-muted px-2.5 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Menu highlights */}
        {venue.menuHighlights && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-4">
            <h3 className="font-semibold text-sm mb-3">Menu Highlights</h3>
            <div className="flex flex-wrap gap-2">
              {venue.menuHighlights.map(m => (
                <span key={m} className="text-xs bg-primary/5 text-primary px-2.5 py-1 rounded-full">{m}</span>
              ))}
            </div>
          </div>
        )}

        {/* Hours */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            Hours
          </h3>
          <div className="space-y-1.5">
            {days.map(day => {
              const hours = venue.hours[day];
              const isToday = day === days[new Date().getDay()];
              return (
                <div key={day} className={`flex items-center justify-between py-1 ${isToday ? 'font-medium' : ''}`}>
                  <span className="text-xs w-10">{day}</span>
                  <span className={`text-xs ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {hours?.open === 'Closed' ? 'Closed' : `${hours?.open} – ${hours?.close}`}
                  </span>
                  {isToday && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Today</span>}
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 flex items-start gap-1">
            <Info size={12} className="shrink-0 mt-0.5" />
            Hours are demo data and subject to change. Check ttu.edu/hospitality for current hours.
          </p>
        </div>

        {/* Navigate to venue */}
        <button
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${venue.coordinates[0]},${venue.coordinates[1]}`;
            window.open(url, '_blank');
          }}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-medium text-sm flex items-center justify-center gap-2"
        >
          <MapPin size={18} />
          Navigate Here
        </button>
      </div>
    </div>
  );
}
