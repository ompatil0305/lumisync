import { useParams, useNavigate } from 'react-router';
import { buildings, diningVenues, parkingLots } from '../../data/universityProfile';
import { ChevronLeft, Building2, MapPin, Navigation, UtensilsCrossed, Car, Bus, Layers } from 'lucide-react';

export default function BuildingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const building = buildings.find(b => b.id === id);

  if (!building) {
    return (
      <div className="min-h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Building not found</p>
      </div>
    );
  }

  const nearbyDining = diningVenues.filter(d => d.buildingId === id || !d.buildingId);
  const nearbyParking = building.hasParkingNearby
    ? parkingLots.filter(l => building.hasParkingNearby?.includes(l.id))
    : [];

  return (
    <div className="min-h-full bg-background">
      {/* Hero */}
      <div className="relative h-48 bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 size={64} className="text-primary/30" />
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-lg"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="px-4 py-5 pb-24 -mt-6 relative">
        <div className="bg-card border border-border rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium uppercase">
              {building.category}
            </span>
            {building.abbreviation && (
              <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">{building.abbreviation}</span>
            )}
          </div>
          <h1 className="text-xl font-bold mb-1">{building.name}</h1>
          {building.address && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin size={14} /> {building.address}
            </p>
          )}
          {building.floors && (
            <p className="text-sm text-muted-foreground mt-0.5">{building.floors} floors</p>
          )}
        </div>

        {/* Description */}
        {building.description && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{building.description}</p>
          </div>
        )}

        {/* Departments */}
        {building.departments && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Layers size={16} className="text-primary" />
              Departments
            </h3>
            <div className="flex flex-wrap gap-2">
              {building.departments.map(dept => (
                <span key={dept} className="text-xs bg-muted px-2.5 py-1 rounded-full">{dept}</span>
              ))}
            </div>
          </div>
        )}

        {/* Floor Plan (Demo) */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4">
          <h3 className="font-semibold text-sm mb-3">Floor Directory (Demo Data)</h3>
          <div className="space-y-2">
            {Array.from({ length: building.floors || 3 }, (_, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <span className="text-xs font-medium w-16 shrink-0">Floor {i + 1}</span>
                <span className="text-xs text-muted-foreground">
                  {i === 0 ? 'Main entrance, lobby' : i === 1 ? 'Classrooms, faculty offices' : i === 2 ? 'Computer labs, study areas' : 'Administrative offices'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Detailed floor plans with room navigation coming in a future update.
          </p>
        </div>

        {/* Nearby Dining */}
        {nearbyDining.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-3">Nearby Dining</h3>
            <div className="space-y-2">
              {nearbyDining.slice(0, 3).map(d => (
                <button
                  key={d.id}
                  onClick={() => navigate(`/detail/dining/${d.id}`)}
                  className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-3 text-left"
                >
                  <UtensilsCrossed size={18} className="text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.location}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Parking */}
        {nearbyParking.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-3">Nearby Parking</h3>
            <div className="space-y-2">
              {nearbyParking.map(lot => {
                const walkInfo = lot.walkingDistances.find(w => w.buildingId === id);
                return (
                  <button
                    key={lot.id}
                    onClick={() => navigate('/explore/parking')}
                    className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-3 text-left"
                  >
                    <Car size={18} className="text-emerald-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{lot.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {lot.status} · {walkInfo?.minutes} min walk
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Nearest Shuttle */}
        {building.nearestShuttleStop && (
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-3">Nearest Shuttle Stop</h3>
            <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
              <Bus size={18} className="text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-medium">{building.nearestShuttleStop}</p>
                <p className="text-xs text-muted-foreground">Red Raider & Double T routes</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigate button */}
        <button
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${building.coordinates[0]},${building.coordinates[1]}`;
            window.open(url, '_blank');
          }}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-medium text-sm flex items-center justify-center gap-2"
        >
          <Navigation size={18} />
          Get Walking Directions
        </button>
      </div>
    </div>
  );
}
