import { useParams, useNavigate } from 'react-router';
import { campusEvents } from '../../data/universityProfile';
import { ChevronLeft, CalendarDays, Clock, MapPin, Sparkles, Share2, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const event = campusEvents.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Event not found</p>
      </div>
    );
  }

  const isSaved = state.savedEvents.includes(event.id);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: `${event.title} at ${event.location}`,
      });
    }
  };

  return (
    <div className="min-h-full bg-background">
      {/* Hero */}
      <div className="relative h-56 bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <CalendarDays size={64} className="text-primary/30" />
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-lg"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SAVE_EVENT', eventId: event.id })}
            className="w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-lg"
          >
            <Heart size={18} className={isSaved ? 'text-red-500 fill-red-500' : 'text-muted-foreground'} />
          </button>
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-lg"
          >
            <Share2 size={18} className="text-muted-foreground" />
          </button>
        </div>
        {event.hasFreeFood && (
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center gap-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full font-medium">
              <Sparkles size={14} /> Free Food
            </span>
          </div>
        )}
      </div>

      <div className="px-4 py-5 pb-24 -mt-6 relative">
        <div className="bg-card border border-border rounded-2xl p-5 mb-4">
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            {event.category}
          </span>
          <h1 className="text-xl font-bold mt-2 mb-1">{event.title}</h1>
          <p className="text-sm text-muted-foreground">Hosted by {event.organization}</p>
        </div>

        {/* Details */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4 space-y-3">
          <div className="flex items-center gap-3">
            <CalendarDays size={18} className="text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-primary shrink-0" />
            <p className="text-sm">{event.startTime} – {event.endTime}</p>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">{event.location}</p>
              {event.buildingId && (
                <button
                  onClick={() => navigate(`/detail/building/${event.buildingId}`)}
                  className="text-xs text-primary mt-0.5"
                >
                  View building →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4">
          <h3 className="font-semibold text-sm mb-2">About</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
        </div>

        {/* RSVP note */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            In production, RSVPs sync with TechConnect. For this demo, saving the event adds it to your favorites.
          </p>
        </div>

        {/* Save/RSVP button */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SAVE_EVENT', eventId: event.id })}
          className={`w-full rounded-2xl py-3.5 font-medium text-sm flex items-center justify-center gap-2 ${
            isSaved
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          <Heart size={18} className={isSaved ? 'fill-red-500' : ''} />
          {isSaved ? 'Saved to Favorites' : 'Save to Favorites'}
        </button>
      </div>
    </div>
  );
}
