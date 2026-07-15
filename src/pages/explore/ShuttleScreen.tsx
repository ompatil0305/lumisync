import { useState } from 'react';
import { useNavigate } from 'react-router';
import { shuttleRoutes } from '../../data/universityProfile';
import { Bus, ChevronLeft, Phone } from 'lucide-react';

export default function ShuttleScreen() {
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = useState(shuttleRoutes[0].id);
  const route = shuttleRoutes.find(r => r.id === activeRoute)!;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = days[new Date().getDay() - 1] || 'Sun';

  return (
    <div className="min-h-full bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 pt-3 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Shuttle Tracking</h1>
          </div>
          <div className="flex gap-2">
            {shuttleRoutes.map(r => (
              <button
                key={r.id}
                onClick={() => setActiveRoute(r.id)}
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  activeRoute === r.id ? 'text-white' : 'bg-muted text-muted-foreground'
                }`}
                style={activeRoute === r.id ? { backgroundColor: r.color } : {}}
              >
                <div className="flex items-center gap-1.5 justify-center">
                  <Bus size={14} />
                  {r.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 pb-24 space-y-4">
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-2">
          <span className="text-xs text-blue-700 dark:text-blue-300">
            Demo Data — simulated live tracking. Real deployment powered by Citibus/DoubleMap.
          </span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="font-semibold text-sm mb-1">{route.name} Route</h2>
          <p className="text-xs text-muted-foreground mb-3">{route.description}</p>

          <div className="bg-muted rounded-xl p-3 mb-3">
            <p className="text-xs font-medium mb-1">Today ({today})</p>
            <p className="text-sm">
              {route.schedule[today].start === 'Closed'
                ? 'No service today'
                : `${route.schedule[today].start} – ${route.schedule[today].end}`
              }
            </p>
            {route.schedule[today].start !== 'Closed' && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Frequency: {route.schedule[today].frequency}
              </p>
            )}
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Stops & ETAs</h3>
          <div className="space-y-2">
            {route.stops.map((stop, i) => (
              <div key={stop.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: route.color }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{stop.name}</p>
                </div>
                {stop.nextArrival !== undefined && (
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold" style={{ color: route.color }}>{stop.nextArrival} min</p>
                    <p className="text-[10px] text-muted-foreground">ETA</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="font-semibold text-sm mb-3">Full Schedule</h3>
          <div className="space-y-1.5">
            {days.map(day => (
              <div key={day} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-xs font-medium w-10">{day}</span>
                <span className="text-xs text-muted-foreground">
                  {route.schedule[day].start === 'Closed'
                    ? 'No service'
                    : `${route.schedule[day].start} – ${route.schedule[day].end}`
                  }
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {route.schedule[day].frequency}
                </span>
              </div>
            ))}
          </div>
        </div>

        {route.id === 'raider-ride' && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Phone size={16} className="text-amber-600" />
              How to Request Raider Ride
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              Raider Ride is an on-demand van service. Call (806) 742-RAID or use the DoubleMap app to request pickup.
            </p>
            <p className="text-xs text-muted-foreground">
              Service area: Main campus and select off-campus locations. Wait times typically 10-20 minutes.
            </p>
          </div>
        )}

        <div className="text-center">
          <p className="text-[10px] text-muted-foreground">
            Free for TTU students with student ID via Citibus
          </p>
          <a
            href="https://www.citibus.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary font-medium"
          >
            Visit Citibus Website →
          </a>
        </div>
      </div>
    </div>
  );
}
