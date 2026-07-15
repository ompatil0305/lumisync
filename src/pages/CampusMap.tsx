import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useBuildings, useMapCategories, useUniversityInfo } from '../hooks/useUniversity';
import type { CampusBuilding } from '../providers/types';
import {
  Search, X, Building2, GraduationCap, Home, BookOpen,
  Trophy, Car, Heart, Landmark, UtensilsCrossed, Bus,
  Crosshair, Share, Star, Navigation2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useOSMBuildings } from '../hooks/useOSMBuildings';
import { GeoJSON } from 'react-leaflet';

// Custom SVG marker generator
function createCustomMarker(color: string, isSelected: boolean) {
  const size = isSelected ? 42 : 32;
  const borderWidth = isSelected ? 4 : 3;
  const svg = `
    <svg width="${size}" height="${size + 8}" viewBox="0 0 ${size} ${size + 8}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.4"/>
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
    className: isSelected ? 'custom-marker-selected z-[1000] drop-shadow-xl transition-all duration-300' : 'custom-marker transition-all duration-300 hover:scale-110',
    html: svg,
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 8],
    popupAnchor: [0, -(size + 8)],
  });
}

// Custom Cluster Icon
const createClusterCustomIcon = function (cluster: any) {
  return L.divIcon({
    html: `<div class="w-10 h-10 rounded-full bg-primary text-white border-4 border-white shadow-lg flex items-center justify-center font-bold text-sm transform transition-transform hover:scale-110">${cluster.getChildCount()}</div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40, true),
  });
};

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 18, { animate: true, duration: 1.2 });
  }, [center, map]);
  return null;
}

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(info.location.coordinates);

  const ttuBounds: [number, number, number, number] = [33.570, -101.900, 33.600, -101.860];
  const { data: osmData } = useOSMBuildings(ttuBounds);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Map limits
  const maxBounds = L.latLngBounds(
    L.latLng(33.570, -101.900), // Southwest
    L.latLng(33.600, -101.860)  // Northeast
  );

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
          b.aliases?.some((a) => a.toLowerCase().includes(q)) ||
          b.departments?.some((d) => d.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [buildings, activeCategory, searchQuery]);

  const handleBuildingClick = useCallback((building: CampusBuilding) => {
    setSelectedBuilding(building);
    setMapCenter(building.coordinates);
    setSearchQuery('');
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
  }, []);

  const handleCategoryClick = useCallback((catId: string) => {
    setActiveCategory((prev) => (prev === catId ? null : catId));
    setSelectedBuilding(null); // Clear selection on filter
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedBuilding(null);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-full relative flex flex-col md:flex-row">
      {/* Map */}
      <div className="flex-1 relative z-0 h-full w-full">
        <MapContainer
          center={info.location.coordinates}
          zoom={16}
          minZoom={14}
          maxZoom={19}
          maxBounds={maxBounds}
          maxBoundsViscosity={1.0}
          className="h-full w-full"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {osmData && (
            <GeoJSON 
              data={osmData} 
              style={{
                fillColor: '#cc0000',
                fillOpacity: 0.15,
                color: '#cc0000',
                weight: 1,
              }}
            />
          )}
          <MapController center={mapCenter} />

          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={50}
            showCoverageOnHover={false}
          >
            {buildings
              .filter((b) => !activeCategory || b.category === activeCategory)
              .map((building) => {
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
          </MarkerClusterGroup>
        </MapContainer>

        {/* Map Controls */}
        <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-3">
          <button
            onClick={() => setMapCenter(info.location.coordinates)}
            className="w-12 h-12 bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-2xl shadow-xl border border-border flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
            aria-label="Center map"
          >
            <Crosshair size={22} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Floating Search Overlay (Top) */}
      <div className="absolute top-4 left-4 right-4 md:left-6 md:w-96 z-[2000]">
        <div className={'bg-white/95 dark:bg-card/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 transition-all duration-300 ' + (isSearchFocused ? 'shadow-2xl ring-2 ring-primary/20' : '')}>
          <div className="flex items-center px-4 h-14">
            <Search size={20} className={'shrink-0 transition-colors ' + (isSearchFocused ? 'text-primary' : 'text-muted-foreground')} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search buildings, departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="flex-1 ml-3 bg-transparent outline-none text-base placeholder:text-muted-foreground font-medium"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }} className="p-1.5 hover:bg-muted rounded-full transition-colors">
                <X size={18} className="text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchQuery && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-border/50 bg-white/95 dark:bg-card/95 rounded-b-2xl max-h-[60vh] overflow-y-auto"
              >
                {filteredBuildings.length === 0 ? (
                  <div className="px-6 py-8 text-center text-muted-foreground">
                    <Building2 size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">No locations found</p>
                    <p className="text-xs mt-1">Try searching by abbreviation</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {filteredBuildings.slice(0, 8).map((b) => (
                      <button
                        key={b.id}
                        className="w-full px-5 py-3 flex items-start gap-4 hover:bg-muted/60 text-left transition-colors"
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent blur
                          handleBuildingClick(b);
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                          {(() => {
                            const Icon = categoryIcons[b.category] || Building2;
                            const color = mapCategories.find((c) => c.id === b.category)?.color;
                            return <Icon size={16} style={{ color }} />;
                          })()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold truncate text-foreground">{b.name}</div>
                          <div className="text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-1.5">
                            <span className="font-semibold bg-muted-foreground/10 px-1.5 py-0.5 rounded">{b.abbreviation}</span>
                            {b.departments && b.departments.length > 0 && <span>• {b.departments[0]}</span>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Filter Pills (Visible when search is not active/dropdown closed) */}
        <AnimatePresence>
          {!isSearchFocused && !selectedBuilding && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 flex gap-2 overflow-x-auto pb-2 hide-scrollbar px-1"
            >
              {mapCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const Icon = categoryIcons[cat.id] || Building2;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-md active:scale-95 ' + (
                      isActive
                        ? 'text-white shadow-lg'
                        : 'bg-white/95 dark:bg-card/95 text-muted-foreground hover:bg-white hover:text-foreground'
                    )}
                    style={isActive ? { backgroundColor: cat.color } : {}}
                  >
                    <Icon size={16} />
                    {cat.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Building Info Card (Apple Maps Style) */}
      <AnimatePresence>
        {selectedBuilding && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 md:w-[420px] md:left-6 md:bottom-6 md:top-auto z-[2001] bg-white dark:bg-card rounded-t-3xl md:rounded-3xl shadow-2xl border border-border/50 max-h-[85vh] md:max-h-[80vh] flex flex-col overflow-hidden"
          >
            {/* Drag Handle (Mobile only) */}
            <div className="md:hidden flex justify-center pt-3 pb-2 absolute top-0 left-0 right-0 z-10">
              <div className="w-12 h-1.5 rounded-full bg-white/40 shadow-sm backdrop-blur-md" />
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseCard}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="overflow-y-auto hide-scrollbar pb-6">
              {/* Building Image Cover */}
              {selectedBuilding.photo ? (
                <div className="w-full h-56 relative shrink-0">
                  <img
                    src={selectedBuilding.photo}
                    alt={selectedBuilding.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-5 right-5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="px-2.5 py-0.5 rounded-md text-xs font-bold text-white shadow-sm"
                        style={{
                          backgroundColor: mapCategories.find((c) => c.id === selectedBuilding.category)?.color,
                        }}
                      >
                        {mapCategories.find((c) => c.id === selectedBuilding.category)?.label}
                      </span>
                      <span className="text-xs text-white/90 font-bold bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        {selectedBuilding.abbreviation}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-md">
                      {selectedBuilding.name}
                    </h2>
                  </div>
                </div>
              ) : (
                <div className="pt-10 px-5 pb-4 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-md text-xs font-bold text-white"
                      style={{
                        backgroundColor: mapCategories.find((c) => c.id === selectedBuilding.category)?.color,
                      }}
                    >
                      {mapCategories.find((c) => c.id === selectedBuilding.category)?.label}
                    </span>
                    <span className="text-xs text-muted-foreground font-bold bg-muted px-2 py-0.5 rounded-md">
                      {selectedBuilding.abbreviation}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight">{selectedBuilding.name}</h2>
                </div>
              )}

              <div className="px-5 pt-5 space-y-6">
                
                {/* Action Row */}
                <div className="flex justify-around items-center border-b border-border/40 pb-5">
                  <button className="flex flex-col items-center gap-1.5 text-primary hover:opacity-80 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Navigation2 size={22} className="fill-primary" />
                    </div>
                    <span className="text-xs font-semibold">Directions</span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Star size={20} />
                    </div>
                    <span className="text-xs font-semibold">Favorite</span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Share size={20} />
                    </div>
                    <span className="text-xs font-semibold">Share</span>
                  </button>
                </div>

                {/* Description */}
                {selectedBuilding.description && (
                  <div>
                    <h3 className="text-sm font-bold mb-2">About</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedBuilding.description}
                    </p>
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedBuilding.address && (
                    <div className="bg-muted/40 p-3 rounded-2xl">
                      <div className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Address</div>
                      <div className="text-sm font-semibold">{selectedBuilding.address}</div>
                    </div>
                  )}
                  {selectedBuilding.wheelchairAccessible && (
                    <div className="bg-muted/40 p-3 rounded-2xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <circle cx="12" cy="4" r="2"/>
                          <path d="M19 13v-2a2 2 0 0 0-2-2H9c-1.1 0-2 .9-2 2v2"/>
                          <path d="M12 9v13"/>
                          <path d="M8 22h8"/>
                          <path d="m15 15 3 3"/>
                          <path d="m9 15-3 3"/>
                        </svg>
                      </div>
                      <div className="text-sm font-semibold">Wheelchair Accessible</div>
                    </div>
                  )}
                </div>

                {/* Connections (Nearby) */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold">Connections</h3>
                  <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                    {selectedBuilding.hasDining && (
                      <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-2xl shrink-0 min-w-[140px] border border-transparent hover:border-orange-500/30 transition-colors cursor-pointer" onClick={() => navigate('/explore/dining')}>
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <UtensilsCrossed size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold">Dining</div>
                          <div className="text-xs text-muted-foreground">Nearby</div>
                        </div>
                      </div>
                    )}
                    {selectedBuilding.hasParkingNearby && selectedBuilding.hasParkingNearby.length > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-2xl shrink-0 min-w-[140px] border border-transparent hover:border-blue-500/30 transition-colors cursor-pointer" onClick={() => navigate('/explore/parking')}>
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <Car size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold">Parking</div>
                          <div className="text-xs text-muted-foreground">Nearby</div>
                        </div>
                      </div>
                    )}
                    {selectedBuilding.nearestShuttleStop && (
                      <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-2xl shrink-0 min-w-[140px] border border-transparent hover:border-red-500/30 transition-colors cursor-pointer" onClick={() => navigate('/explore/shuttle')}>
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                          <Bus size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold">Shuttle</div>
                          <div className="text-xs text-muted-foreground">{selectedBuilding.nearestShuttleStop}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Departments */}
                {selectedBuilding.departments && selectedBuilding.departments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold mb-3">Departments Inside</h3>
                    <div className="flex flex-col gap-2">
                      {selectedBuilding.departments.map((dept) => (
                        <div key={dept} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <BookOpen size={14} />
                          </div>
                          <span className="text-sm font-medium">{dept}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* View Details Button */}
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/detail/building/' + selectedBuilding.id)}
                    className="w-full py-3.5 bg-secondary text-secondary-foreground rounded-2xl font-bold text-sm hover:bg-secondary/80 transition-colors"
                  >
                    View Full Directory
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
