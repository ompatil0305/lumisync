import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useBuildings, useMapCategories, useUniversityInfo } from '../hooks/useUniversity';
import type { CampusBuilding } from '../providers/types';
import {
  Search, X, Building2, GraduationCap, Home, BookOpen,
  Trophy, Car, Heart, Landmark, UtensilsCrossed, Bus,
  Navigation, ChevronRight, Crosshair
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet icon fix
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom SVG marker
function createCustomMarker(color: string, isSelected: boolean) {
  const size = isSelected ? 36 : 28;
  const borderWidth = isSelected ? 4 : 3;
  const svg = `
    <svg width="${size}" height="${size + 8}" viewBox="0 0 ${size} ${size + 8}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M${size/2} 0
        C${size * 0.11} 0 0 ${size * 0.22} 0 ${size * 0.5}
        C0 ${size * 0.875} ${size/2} ${size + 8} ${size/2} ${size + 8}
        C${size/2} ${size + 8} ${size} ${size * 0.875} ${size} ${size * 0.5}
        C${size} ${size * 0.22} ${size * 0.89} 0 ${size/2} 0Z"
        fill="${color}" stroke="white" stroke-width="${borderWidth}" filter="url(#shadow)"/>
      <circle cx="${size/2}" cy="${size * 0.4}" r="${size * 0.18}" fill="white"/>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-marker',
    html: svg,
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 8],
    popupAnchor: [0, -(size + 8)],
  });
}

// Map recenter component
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  map.flyTo(center, 18, { animate: true, duration: 1.5 });
  return null;
}

// Category icon mapping
const categoryIcons: Record<string, typeof Building2> = {
  academic: GraduationCap,
  administrative: Building2,
  residence: Home,
  library: BookOpen,
  recreation: Trophy,
  parking: Car,
  landmark: Landmark,
  health: Heart,
  museum: BookOpen,
  dining: UtensilsCrossed,
};

export default function CampusMap() {
  const navigate = useNavigate();
  const info = useUniversityInfo();
  const { data: buildings = [], isLoading } = useBuildings();
  const mapCategories = useMapCategories();

  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>(info.location.coordinates);

  // Filter buildings
  const filteredBuildings = useMemo(() => {
    let filtered = buildings;
    if (activeCategory) {
      filtered = filtered.filter((b) => b.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.abbreviation.toLowerCase().includes(q) ||
          b.departments?.some((d) => d.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [buildings, activeCategory, searchQuery]);

  const handleBuildingClick = useCallback((building: CampusBuilding) => {
    setSelectedBuilding(building);
    setMapCenter(building.coordinates);
  }, []);

  const handleCategoryClick = useCallback((catId: string) => {
    setActiveCategory((prev) => (prev === catId ? null : catId));
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedBuilding(null);
  }, []);

  const handleNavigateToDetail = useCallback((buildingId: string) => {
    navigate(`/detail/building/${buildingId}`);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-full relative flex flex-col">
      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={info.location.coordinates}
          zoom={16}
          className="h-full w-full"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapController center={mapCenter} />

          {filteredBuildings.map((building) => {
            const category = mapCategories.find((c) => c.id === building.category);
            const isSelected = selectedBuilding?.id === building.id;
            const color = category?.color || '#CC0000';

            return (
              <Marker
                key={building.id}
                position={building.coordinates}
                icon={createCustomMarker(color, isSelected)}
                eventHandlers={{
                  click: () => handleBuildingClick(building),
                }}
              />
            );
          })}
        </MapContainer>

        {/* Search Overlay */}
        <div className="absolute top-4 left-4 right-4 z-[1000]">
          <div className="bg-white/95 dark:bg-card/95 backdrop-blur-lg rounded-2xl shadow-lg border border-border/50 overflow-hidden">
            <div className="flex items-center px-4 h-12">
              <Search size={18} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search buildings, departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 ml-3 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1">
                  <X size={16} className="text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-border/50"
                >
                  <div className="max-h-48 overflow-y-auto">
                    {filteredBuildings.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-muted-foreground">No buildings found</div>
                    ) : (
                      filteredBuildings.slice(0, 5).map((b) => (
                        <button
                          key={b.id}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-muted/50 text-left transition-colors"
                          onClick={() => {
                            handleBuildingClick(b);
                            setSearchQuery('');
                          }}
                        >
                          <Building2 size={16} className="text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{b.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {b.abbreviation} {b.departments ? `| ${b.departments[0]}` : ''}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="absolute top-20 left-4 right-4 z-[1000]">
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {mapCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const Icon = categoryIcons[cat.id] || Building2;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shadow-sm ${
                    isActive
                      ? 'text-white'
                      : 'bg-white/90 dark:bg-card/90 text-muted-foreground hover:bg-white'
                  }`}
                  style={isActive ? { backgroundColor: cat.color } : {}}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
          <button
            onClick={() => setMapCenter(info.location.coordinates)}
            className="w-10 h-10 bg-white/95 dark:bg-card/95 rounded-xl shadow-lg border border-border/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Crosshair size={18} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Building Info Card (Bottom Sheet Style) */}
      <AnimatePresence>
        {selectedBuilding && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-[1001] bg-white dark:bg-card rounded-t-3xl shadow-2xl border-t border-border/50 max-h-[60%] overflow-y-auto"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="px-5 pb-6">
              {/* Building Image */}
              {selectedBuilding.photo ? (
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={selectedBuilding.photo}
                    alt={selectedBuilding.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <button
                    onClick={handleCloseCard}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                        style={{
                          backgroundColor: mapCategories.find((c) => c.id === selectedBuilding.category)?.color,
                        }}
                      >
                        {mapCategories.find((c) => c.id === selectedBuilding.category)?.label}
                      </span>
                      <span className="text-[10px] text-white/80 font-medium">
                        {selectedBuilding.abbreviation}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white">{selectedBuilding.name}</h2>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                        style={{
                          backgroundColor: mapCategories.find((c) => c.id === selectedBuilding.category)?.color,
                        }}
                      >
                        {mapCategories.find((c) => c.id === selectedBuilding.category)?.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{selectedBuilding.abbreviation}</span>
                    </div>
                    <h2 className="text-xl font-bold">{selectedBuilding.name}</h2>
                  </div>
                  <button
                    onClick={handleCloseCard}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Address & Quick Info */}
              {selectedBuilding.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Navigation size={14} />
                  {selectedBuilding.address}
                </div>
              )}

              {/* Description */}
              {selectedBuilding.description && (
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {selectedBuilding.description}
                </p>
              )}

              {/* Departments */}
              {selectedBuilding.departments && selectedBuilding.departments.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">Departments</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBuilding.departments.map((dept) => (
                      <span
                        key={dept}
                        className="px-2.5 py-1 bg-muted rounded-lg text-xs text-muted-foreground"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Amenities */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {selectedBuilding.hasDining && (
                  <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-xl">
                    <UtensilsCrossed size={18} className="text-orange-500" />
                    <span className="text-[10px] text-muted-foreground text-center">Dining</span>
                  </div>
                )}
                {selectedBuilding.hasParkingNearby && selectedBuilding.hasParkingNearby.length > 0 && (
                  <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-xl">
                    <Car size={18} className="text-blue-500" />
                    <span className="text-[10px] text-muted-foreground text-center">Parking</span>
                  </div>
                )}
                {selectedBuilding.nearestShuttleStop && (
                  <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-xl">
                    <Bus size={18} className="text-red-500" />
                    <span className="text-[10px] text-muted-foreground text-center">Shuttle</span>
                  </div>
                )}
              </div>

              {/* View Details Button */}
              <button
                onClick={() => handleNavigateToDetail(selectedBuilding.id)}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                View Full Details
                <ChevronRight size={16} />
              </button>

              {/* Data Source Badge */}
              <div className="flex justify-center mt-3">
                <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                  {selectedBuilding.dataSource === 'official-directory' && 'Official Directory'}
                  {selectedBuilding.dataSource === 'live-public' && 'Live Public Data'}
                  {selectedBuilding.dataSource === 'demo' && 'Demo Data'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
