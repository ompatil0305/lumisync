import { useParams, useNavigate } from 'react-router';
import { useBuilding, useDiningVenues, useParkingLots } from '../../hooks/useUniversity';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Building2, MapPin, Navigation, UtensilsCrossed, Car, Bus, Layers, Heart, Phone, Globe, Mail, Check } from 'lucide-react';
import { useState } from 'react';

export default function BuildingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);

  const { data: building, isLoading: isBuildingLoading } = useBuilding(id || '');
  const { data: diningVenues = [] } = useDiningVenues();
  const { data: parkingLots = [] } = useParkingLots();

  if (isBuildingLoading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!building) {
    return (
      <div className="min-h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Building not found</p>
      </div>
    );
  }

  const isFav = state.favoriteBuildings?.includes(building.id) || false;

  const nearbyDining = diningVenues.filter(d => d.buildingId === id || !d.buildingId);
  const nearbyParking = building.hasParkingNearby
    ? parkingLots.filter(l => building.hasParkingNearby?.includes(l.id))
    : [];

  return (
    <div className="min-h-full bg-background pb-24">
      {/* Hero */}
      <div className="relative h-56 bg-muted overflow-hidden">
        {building.photos && building.photos.length > 0 ? (
          <img
            src={building.photos[0]}
            alt={building.name}
            className="w-full h-full object-cover animate-fade-in"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <Building2 size={64} className="text-primary/30" />
          </div>
        )}
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-muted transition-all active:scale-95 z-10"
        >
          <ChevronLeft size={20} className="text-foreground" />
        </button>

        {/* Floating Category Tag */}
        <div className="absolute bottom-4 left-4 flex gap-1.5 z-10">
          <span className="text-[10px] bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full font-bold uppercase shadow-sm">
            {building.category}
          </span>
          {building.abbreviation && (
            <span className="text-[10px] bg-black/60 text-white px-2.5 py-0.5 rounded-full font-bold shadow-sm">
              {building.abbreviation}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 py-5 -mt-6 relative">
        <div className="bg-card border border-border rounded-2xl p-5 mb-4 shadow-sm">
          <h1 className="text-xl font-bold text-foreground mb-1">{building.name}</h1>
          {building.officialNumber && building.officialNumber !== 'N/A' && (
            <p className="text-xs text-muted-foreground mb-2">Building #{building.officialNumber}</p>
          )}
          {building.address && (
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin size={14} className="text-primary" /> {building.address}
            </p>
          )}
        </div>

        {/* Favorite & Action Ribbon */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_FAVORITE_BUILDING', buildingId: building.id })}
            className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
              isFav
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                : 'bg-card border-border hover:bg-muted text-muted-foreground'
            }`}
          >
            <Heart size={15} className={isFav ? 'fill-rose-500' : ''} />
            {isFav ? 'Saved to Favorites' : 'Add to Favorites'}
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
              copiedLink
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                : 'bg-card border-border hover:bg-muted text-muted-foreground'
            }`}
          >
            {copiedLink ? <Check size={15} /> : <Globe size={15} />}
            {copiedLink ? 'Copied' : 'Share'}
          </button>
        </div>

        {/* Description */}
        {building.description && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{building.description}</p>
          </div>
        )}

        {/* Access & Utilities Checklist */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-sm space-y-3">
          <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Building Services</h3>
          
          <div className="grid grid-cols-1 gap-2.5 text-xs">
            <div className="flex items-start gap-2.5">
              <Check size={15} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Restrooms</span>
                <span className="text-muted-foreground">{building.restrooms || 'Accessible facilities.'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Check size={15} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Elevators</span>
                <span className="text-muted-foreground">{building.elevators || 'Accessible elevators.'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Check size={15} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Bike Racks</span>
                <span className="text-muted-foreground">{building.bikeRacks || 'Bike parking nearby.'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Check size={15} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Emergency Services</span>
                <span className="text-muted-foreground">{building.emergencyPhones || 'Blue light emergency phones.'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Details */}
        {(building.phone || building.website || building.email) && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-sm space-y-3">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Contact Information</h3>
            <div className="space-y-2 text-xs">
              {building.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-muted-foreground" />
                  <a href={`tel:${building.phone}`} className="text-primary font-medium hover:underline">{building.phone}</a>
                </div>
              )}
              {building.website && (
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-muted-foreground" />
                  <a href={building.website} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline truncate">{building.website}</a>
                </div>
              )}
              {building.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-muted-foreground" />
                  <a href={`mailto:${building.email}`} className="text-primary font-medium hover:underline">{building.email}</a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Departments */}
        {building.departments && building.departments.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers size={15} className="text-primary" />
              Departments
            </h3>
            <div className="flex flex-wrap gap-2">
              {building.departments.map(dept => (
                <span key={dept} className="text-xs bg-muted text-foreground px-3 py-1 rounded-full font-medium">{dept}</span>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Dining */}
        {nearbyDining.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">Nearby Dining</h3>
            <div className="space-y-2">
              {nearbyDining.slice(0, 3).map(d => (
                <button
                  key={d.id}
                  onClick={() => navigate(`/detail/dining/${d.id}`)}
                  className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-3 text-left hover:bg-muted/40 transition-all shadow-sm"
                >
                  <UtensilsCrossed size={18} className="text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{d.name}</p>
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
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">Nearby Parking</h3>
            <div className="space-y-2">
              {nearbyParking.map(lot => {
                const walkInfo = lot.walkingDistances.find(w => w.buildingId === id);
                return (
                  <button
                    key={lot.id}
                    onClick={() => navigate('/explore/parking')}
                    className="w-full flex items-center gap-3 bg-card border border-border rounded-xl p-3 text-left hover:bg-muted/40 transition-all shadow-sm"
                  >
                    <Car size={18} className="text-emerald-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{lot.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {lot.status} {walkInfo ? `· ${walkInfo.minutes} min walk` : ''}
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
          <div className="mb-6">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2.5">Nearest Shuttle Stop</h3>
            <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 shadow-sm">
              <Bus size={18} className="text-blue-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">{building.nearestShuttleStop}</p>
                <p className="text-xs text-muted-foreground">Red Raider & Double T routes</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigate button */}
        <button
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${building.coordinates.lat},${building.coordinates.lng}`;
            window.open(url, '_blank');
          }}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/10 active:scale-98 transition-all"
        >
          <Navigation size={16} />
          Open in Google Maps Directions
        </button>
      </div>
    </div>
  );
}
