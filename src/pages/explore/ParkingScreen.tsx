import { useState } from 'react';
import { useNavigate } from 'react-router';
import { parkingLots } from '../../data/universityProfile';
import { useBuildings } from '../../hooks/useUniversity';
import { Car, ChevronLeft, Navigation, Info } from 'lucide-react';

const filters = ['All', 'Commuter', 'Resident', 'Garage', 'Visitor'];

export default function ParkingScreen() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const { data: buildings = [] } = useBuildings();

  const filtered = parkingLots.filter(l => activeFilter === 'All' ? true : l.category === activeFilter.toLowerCase());

  const getDestinationName = (lotId: string) => {
    const lot = parkingLots.find(l => l.id === lotId);
    if (!lot) return null;
    const walk = lot.walkingDistances.find(w => w.buildingId === selectedDestination);
    if (!walk) return null;
    const building = buildings.find(b => b.id === selectedDestination);
    return { name: building?.name || '', minutes: walk.minutes };
  };

  return (
    <div className="min-h-full bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">Parking</h1>
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
        {/* Simulated data notice */}
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2">
          <Info size={14} className="text-amber-600 shrink-0" />
          <p className="text-[11px] text-amber-700 dark:text-amber-300">
            Demo Data — simulated occupancy. Real-time sensors coming in production.
          </p>
        </div>

        {/* Destination selector */}
        <div className="bg-card border border-border rounded-2xl p-3">
          <p className="text-xs font-medium mb-2">I&apos;m going to:</p>
          <select
            value={selectedDestination || ''}
            onChange={(e) => setSelectedDestination(e.target.value || null)}
            className="w-full bg-muted rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="">Select a building...</option>
            {buildings.filter(b => b.category === 'academic' || b.category === 'admin').map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {filtered.map((lot) => {
          const walkInfo = selectedDestination ? getDestinationName(lot.id) : null;
          const occupancyPct = Math.round((lot.occupiedSpaces / lot.totalSpaces) * 100);
          return (
            <div
              key={lot.id}
              className="bg-card border border-border rounded-2xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Car size={18} className="text-primary" />
                  <h3 className="font-semibold text-sm">{lot.name}</h3>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  lot.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                  lot.status === 'limited' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {lot.status === 'available' ? 'Available' : lot.status === 'limited' ? 'Limited' : 'Full'}
                </span>
              </div>

              {/* Occupancy bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${
                    occupancyPct < 70 ? 'bg-emerald-500' : occupancyPct < 90 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${occupancyPct}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">
                {lot.occupiedSpaces} / {lot.totalSpaces} spaces filled ({occupancyPct}%)
              </p>

              <p className="text-xs text-muted-foreground mb-1.5">{lot.hours}</p>

              {lot.features && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {lot.features.map(f => (
                    <span key={f} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
              )}

              {walkInfo && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-primary">
                  <Navigation size={14} />
                  <span>{walkInfo.minutes} min walk to {walkInfo.name}</span>
                </div>
              )}

              {lot.rate && (
                <p className="text-[10px] text-muted-foreground mt-1.5">{lot.rate}</p>
              )}
            </div>
          );
        })}

        {/* Campus parking rules */}
        <div className="bg-muted rounded-2xl p-4">
          <h3 className="font-semibold text-sm mb-2">Campus Parking Rules</h3>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="shrink-0">•</span>
              Campus core closed to non-permit vehicles weekdays 7:30 AM – 5:30 PM
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0">•</span>
              Most lots open evenings and weekends — check individual lot signs
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0">•</span>
              All permits are electronic (ePermit) tied to license plate — no physical permit needed
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0">•</span>
              Visitor Park & Pay spaces available on a first-come basis
            </li>
          </ul>
          <a
            href="https://www.depts.ttu.edu/parking/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs text-primary font-medium"
          >
            Visit TTU Parking Website →
          </a>
        </div>
      </div>
    </div>
  );
}
