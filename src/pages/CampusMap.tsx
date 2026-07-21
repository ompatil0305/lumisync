import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { MapContainer, TileLayer, Marker, Polyline, GeoJSON, useMap, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useBuildings, useUniversityInfo } from '../hooks/useUniversity';
import { useApp } from '../context/AppContext';
import type { CampusBuilding } from '../providers/types';
import {
  Search, X, Building2, GraduationCap, Home, BookOpen,
  Trophy, Car, Landmark, UtensilsCrossed, Bus,
  Crosshair, Navigation2, ShieldAlert,
  MapPin, Check, Info, Heart, Share2, ExternalLink,
  Bike, Phone, Globe, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchRoute, type RouteResult } from '../services/routingService';

// Custom short label generator for direct map labels
function getShortLabel(b: CampusBuilding) {
  if (b.abbreviation) return b.abbreviation;
  return b.name
    .replace('Building', '')
    .replace('University', '')
    .replace('Residence Hall', 'Hall')
    .replace('Special Collection', '')
    .trim()
    .split(' ')
    .slice(0, 2)
    .join(' ');
}

// Custom SVG marker generator helper
function getCategoryIconSvg(category: string) {
  switch (category) {
    case 'academic':
      return '<path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 2 2 3 6 3s6-1 6-3v-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    case 'dining':
      return '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v8c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2zM19 15v7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    case 'parking':
      return '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2M7 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    case 'residence':
      return '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    case 'recreation':
      return '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a4 4 0 0 0-4 4v3a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    case 'library':
      return '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    case 'admin':
      return '<path d="M20 22V8M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h8c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18M12 6h2M12 10h2M12 14h2M12 18h2M6 6h2M6 10h2M6 14h2M6 18h2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    default:
      return '<path d="M3 22h18M6 18v-4M10 18v-4M14 18v-4M18 18v-4M12 2 2 7h20zM5 11h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
  }
}

function createCustomMarker(category: string, color: string, isSelected: boolean) {
  const size = isSelected ? 40 : 30;
  const borderWidth = isSelected ? 3.5 : 2.5;
  const iconSize = size * 0.28;
  const iconSvg = getCategoryIconSvg(category);
  const svg = `
    <svg width="${size}" height="${size + 8}" viewBox="0 0 ${size} ${size + 8}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-opacity="0.35"/>
        </filter>
      </defs>
      <path d="M${size/2} 0
        C${size * 0.15} 0 0 ${size * 0.2} 0 ${size * 0.45}
        C0 ${size * 0.8} ${size/2} ${size + 8} ${size/2} ${size + 8}
        C${size/2} ${size + 8} ${size} ${size * 0.8} ${size} ${size * 0.45}
        C${size} ${size * 0.2} ${size * 0.85} 0 ${size/2} 0Z"
        fill="${color}" stroke="white" stroke-width="${borderWidth}" filter="url(#shadow)"/>
      <circle cx="${size/2}" cy="${size * 0.42}" r="${size * 0.24}" fill="white"/>
      <svg x="${size/2 - iconSize/2}" y="${size * 0.42 - iconSize/2}" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" style="color: ${color};">
        ${iconSvg}
      </svg>
    </svg>
  `;
  return L.divIcon({
    className: isSelected ? 'custom-marker-selected z-[1000] transition-all duration-300' : 'custom-marker transition-all duration-300 hover:scale-105',
    html: svg,
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 8],
    popupAnchor: [0, -(size + 8)],
  });
}

// Custom Cluster Icon
const createClusterCustomIcon = function (cluster: any) {
  return L.divIcon({
    html: `<div class="w-9 h-9 rounded-full bg-primary text-white border-3 border-white shadow-md flex items-center justify-center font-bold text-xs transform transition-transform hover:scale-105">${cluster.getChildCount()}</div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(36, 36, true),
  });
};

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 17, { animate: true, duration: 1.2 });
  }, [center, map]);
  return null;
}

function ZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const handleZoom = () => {
      onZoomChange(map.getZoom());
    };
    map.on('zoomend', handleZoom);
    onZoomChange(map.getZoom());
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map, onZoomChange]);
  return null;
}

const categoryIcons: Record<string, typeof Building2> = {
  academic: GraduationCap,
  dining: UtensilsCrossed,
  parking: Car,
  residence: Home,
  recreation: Trophy,
  library: BookOpen,
  admin: Building2,
  other: Landmark
};

const majorStartLocations = [
  { id: 'sub', name: 'Student Union Building', coordinates: { lat: 33.58138, lng: -101.8747 } },
  { id: 'library', name: 'University Library', coordinates: { lat: 33.58142, lng: -101.8762 } },
  { id: 'rawls-college', name: 'Rawls College of Business', coordinates: { lat: 33.5864, lng: -101.8791 } },
  { id: 'holden-hall', name: 'Holden Hall', coordinates: { lat: 33.5835, lng: -101.8745 } },
  { id: 'rec', name: 'Student Recreation Center', coordinates: { lat: 33.5794, lng: -101.8893 } }
];

export default function CampusMap() {
  const navigate = useNavigate();
  const info = useUniversityInfo();
  const { data: buildings = [] } = useBuildings();

  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>(null);
  
  const { state, dispatch } = useApp();
  const [routingMode, setRoutingMode] = useState<'walking' | 'cycling' | 'accessible'>('walking');
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Geolocation and routing states
  const [userLatLng, setUserLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [routingStart, setRoutingStart] = useState<{ name: string; coordinates: { lat: number; lng: number } } | null>(null);
  const avoidStairs = routingMode === 'accessible';
  const [isRoutingActive, setIsRoutingActive] = useState(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  // Category selection checkboxes (Default all true)
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({
    academic: true,
    dining: true,
    parking: true,
    residence: true,
    recreation: true,
    library: true,
    admin: true,
    other: true
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(info.location.coordinates);
  const [zoomLevel, setZoomLevel] = useState(16);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Map bounds
  const maxBounds = L.latLngBounds(
    L.latLng(33.570, -101.910), // Southwest
    L.latLng(33.610, -101.850)  // Northeast
  );

  // Geolocation Watcher
  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) {
      setGeolocationError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLatLng(coords);
        setMapCenter([coords.lat, coords.lng]);
        setGeolocationError(null);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setGeolocationError('Could not access location. Please enable GPS permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const isMajorBuilding = useCallback((building: CampusBuilding) => {
    return !!(
      building.description ||
      (building.departments && building.departments.length > 0) ||
      ['sub', 'library', 'rawls-college', 'holden-hall', 'admin-building', 'english-phil', 'university-library', 'talkington-hall', 'jones-stadium', 'student-rec', 'student-health', 'moody-planetarium'].includes(building.id)
    );
  }, []);

  // Filter buildings by categories and search query
  const filteredBuildings = useMemo(() => {
    return buildings.filter((b) => {
      // Category filter check
      const matchesCategory = selectedCategories[b.category] ?? true;
      if (!matchesCategory) return false;

      // Search query filter check
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        return (
          b.name.toLowerCase().includes(q) ||
          b.officialNumber.toLowerCase().includes(q) ||
          b.aliases.some((alias) => alias.toLowerCase().includes(q)) ||
          b.abbreviation?.toLowerCase().includes(q) ||
          b.departments?.some((dept) => dept.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [buildings, selectedCategories, searchQuery]);

  const handleBuildingClick = useCallback((building: CampusBuilding) => {
    setSelectedBuilding(building);
    setMapCenter([building.coordinates.lat, building.coordinates.lng]);
    setSearchQuery('');
    setIsSearchFocused(false);
    setIsRoutingActive(false);
    setRouteResult(null);
    setRoutingStart(null);
    setRoutingMode('walking');
    searchInputRef.current?.blur();
  }, []);

  const toggleCategory = useCallback((catId: string) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
    setSelectedBuilding(null); // Clear selection on category filter
  }, []);

  const handleStartRouting = useCallback(async (modeOverride?: 'walking' | 'cycling' | 'accessible') => {
    if (!selectedBuilding) return;
    const mode = modeOverride || routingMode;
    if (modeOverride) setRoutingMode(modeOverride);

    // Default start point: Geolocation if available, otherwise first major location (SUB)
    let startPoint = routingStart;

    if (!startPoint) {
      if (userLatLng) {
        startPoint = { name: 'My Location', coordinates: userLatLng };
      } else {
        startPoint = { name: majorStartLocations[0].name, coordinates: majorStartLocations[0].coordinates };
      }
      setRoutingStart(startPoint);
    }

    // Pick target: if mode is accessible or avoidStairs is enabled and building has entrances, route to first entrance
    let targetCoords = selectedBuilding.coordinates;
    if ((mode === 'accessible' || avoidStairs) && selectedBuilding.entrances.length > 0) {
      const accessibleEntrance = selectedBuilding.entrances[0];
      targetCoords = { lat: accessibleEntrance.lat, lng: accessibleEntrance.lng };
    }

    setIsRoutingActive(true);

    try {
      const result = await fetchRoute(startPoint.coordinates, targetCoords, { 
        mode,
        avoidStairs: mode === 'accessible' || avoidStairs 
      });
      setRouteResult(result);
    } catch (e) {
      console.error('Routing failed:', e);
    }
  }, [selectedBuilding, routingStart, userLatLng, routingMode, avoidStairs]);

  const handleCloseCard = useCallback(() => {
    setSelectedBuilding(null);
    setIsRoutingActive(false);
    setRouteResult(null);
    setRoutingStart(null);
  }, []);

  return (
    <div className="h-full relative flex flex-col md:flex-row overflow-hidden bg-background">
      {/* Map Window */}
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
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* User Location Pulse Marker */}
          {userLatLng && (
            <Marker
              position={[userLatLng.lat, userLatLng.lng]}
              icon={L.divIcon({
                html: `<div class="relative flex items-center justify-center">
                         <div class="absolute w-6 h-6 bg-blue-500/30 rounded-full animate-ping"></div>
                         <div class="w-4.5 h-4.5 bg-blue-500 border-2.5 border-white rounded-full shadow-lg"></div>
                       </div>`,
                className: 'user-location-marker',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              })}
            />
          )}

          {/* Navigation Polyline Route */}
          {routeResult && (
            <Polyline
              positions={routeResult.path}
              color="#000000"
              weight={5}
              opacity={0.8}
            />
          )}
          {routeResult && (
            <Polyline
              positions={routeResult.path}
              color="#CC0000"
              weight={3}
              dashArray="6, 8"
              opacity={0.95}
            />
          )}

          <MapController center={mapCenter} />
          <ZoomTracker onZoomChange={setZoomLevel} />

          {/* Polygons (Footprints) - only show when zoomed in >= 16 */}
          {zoomLevel >= 16 && buildings
            .filter((b) => selectedCategories[b.category] !== false)
            .map((building) => {
              const isSelected = selectedBuilding?.id === building.id;
              // Fetch colors from categories
              let color = '#CC0000';
              if (building.category === 'dining') color = '#F59E0B'; // Orange
              else if (building.category === 'parking') color = '#10B981'; // Green
              else if (building.category === 'residence') color = '#EC4899'; // Pink
              else if (building.category === 'recreation') color = '#3B82F6'; // Blue
              else if (building.category === 'library') color = '#8B5CF6'; // Purple
              else if (building.category === 'admin') color = '#6B7280'; // Slate

              const showLabel = zoomLevel >= 18 || (zoomLevel >= 16 && isMajorBuilding(building)) || isSelected;

              return (
                <GeoJSON
                  key={`footprint-${building.id}-${isSelected ? 'selected' : 'normal'}`}
                  data={building.footprint as any}
                  style={{
                    fillColor: isSelected ? '#CC0000' : color,
                    fillOpacity: isSelected ? 0.35 : 0.15,
                    color: isSelected ? '#CC0000' : color,
                    weight: isSelected ? 3.5 : 1.5,
                  }}
                  eventHandlers={{
                    click: () => handleBuildingClick(building),
                  }}
                >
                  {showLabel && (
                    <Tooltip
                      permanent
                      direction="center"
                      className="custom-building-label bg-transparent border-none shadow-none text-[8.5px] font-extrabold text-stone-800 dark:text-stone-200 text-center select-none pointer-events-none drop-shadow-[0_1.5px_1.5px_rgba(255,255,255,0.85)] dark:drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.85)] transition-all duration-300"
                    >
                      <div className={isSelected ? 'text-[11.5px] text-primary scale-110 font-black' : ''}>
                        {getShortLabel(building)}
                      </div>
                    </Tooltip>
                  )}
                </GeoJSON>
              );
            })}

          {/* Marker Cluster (Pins) - only show when zoomed out < 16 */}
          {zoomLevel < 16 && (
            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={createClusterCustomIcon}
              maxClusterRadius={80}
              showCoverageOnHover={false}
            >
              {buildings
                .filter((b) => selectedCategories[b.category] !== false)
                .filter((b) => isMajorBuilding(b) || selectedBuilding?.id === b.id)
                .map((building) => {
                  const isSelected = selectedBuilding?.id === building.id;
                  let color = '#CC0000';
                  if (building.category === 'dining') color = '#F59E0B'; // Orange
                  else if (building.category === 'parking') color = '#10B981'; // Green
                  else if (building.category === 'residence') color = '#EC4899'; // Pink
                  else if (building.category === 'recreation') color = '#3B82F6'; // Blue
                  else if (building.category === 'library') color = '#8B5CF6'; // Purple
                  else if (building.category === 'admin') color = '#6B7280'; // Slate

                  return (
                    <Marker
                      key={`marker-${building.id}`}
                      position={[building.coordinates.lat, building.coordinates.lng]}
                      icon={createCustomMarker(building.category, color, isSelected)}
                      eventHandlers={{
                        click: () => handleBuildingClick(building),
                      }}
                    />
                  );
                })}
            </MarkerClusterGroup>
          )}
        </MapContainer>

        {/* Map Control Buttons (Locate / Center) */}
        <div className="absolute bottom-28 right-4 z-[1000] flex flex-col gap-2">
          <button
            onClick={handleLocateUser}
            className="w-12 h-12 bg-white dark:bg-card border border-border rounded-xl shadow-lg flex items-center justify-center hover:bg-muted text-foreground transition-all active:scale-95"
            aria-label="Locate me"
          >
            <Crosshair size={22} />
          </button>
          <button
            onClick={() => setMapCenter(info.location.coordinates)}
            className="w-12 h-12 bg-white dark:bg-card border border-border rounded-xl shadow-lg flex items-center justify-center hover:bg-muted text-foreground transition-all active:scale-95"
            aria-label="Recenter campus"
          >
            <MapPin size={22} />
          </button>
        </div>

        {/* Geolocation Error Alert popup */}
        {geolocationError && (
          <div className="absolute bottom-6 left-4 right-4 md:left-6 md:right-auto md:w-80 z-[1000] bg-red-500 text-white rounded-xl shadow-xl px-4 py-3 text-xs flex items-center gap-3">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{geolocationError}</span>
            <button onClick={() => setGeolocationError(null)} className="ml-auto font-bold opacity-80 hover:opacity-100">Dismiss</button>
          </div>
        )}
      </div>

      {/* Floating Search Overlay (Top Left) */}
      <div className="absolute top-4 left-4 right-4 md:left-6 md:w-96 z-[2000] flex flex-col gap-2.5">
        <div className={'bg-white/95 dark:bg-card/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 transition-all duration-300 ' + (isSearchFocused ? 'shadow-2xl ring-2 ring-primary/20' : '')}>
          <div className="flex items-center px-4 h-13">
            <Search size={18} className={'shrink-0 transition-colors ' + (isSearchFocused ? 'text-primary' : 'text-muted-foreground')} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search building name, alias, #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="flex-1 ml-3 bg-transparent outline-none text-sm placeholder:text-muted-foreground font-semibold"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }} className="p-1.5 hover:bg-muted rounded-full transition-colors">
                <X size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Search Dropdown Panel */}
          <AnimatePresence>
            {isSearchFocused && searchQuery && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-border/50 bg-white/95 dark:bg-card/95 rounded-b-2xl max-h-[50vh] overflow-y-auto"
              >
                {filteredBuildings.length === 0 ? (
                  <div className="px-6 py-6 text-center text-muted-foreground">
                    <Building2 size={24} className="mx-auto mb-2 opacity-20" />
                    <p className="text-xs font-semibold">No campus locations match search query</p>
                  </div>
                ) : (
                  <div className="py-1">
                    {filteredBuildings.slice(0, 8).map((b) => (
                      <button
                        key={b.id}
                        className="w-full px-5 py-2.5 flex items-start gap-3.5 hover:bg-muted/60 text-left transition-colors"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleBuildingClick(b);
                        }}
                      >
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                          {(() => {
                            const Icon = categoryIcons[b.category] || Building2;
                            return <Icon size={14} className="text-primary" />;
                          })()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold truncate text-foreground">{b.name}</div>
                          <div className="text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-1.5">
                            <span className="font-semibold bg-muted-foreground/15 px-1 py-0.2 rounded text-[10px]">{b.abbreviation || 'TTU'}</span>
                            {b.officialNumber && b.officialNumber !== 'N/A' && (
                              <span>• Bldg #{b.officialNumber}</span>
                            )}
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

        {/* Horizontal Scroll Filter Pills */}
        <AnimatePresence>
          {!isSearchFocused && !selectedBuilding && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex gap-1.5 overflow-x-auto pb-1.5 hide-scrollbar px-0.5"
            >
              {Object.keys(selectedCategories).map((catId) => {
                const isSelected = selectedCategories[catId];
                const Icon = categoryIcons[catId] || Building2;
                return (
                  <button
                    key={catId}
                    onClick={() => toggleCategory(catId)}
                    className={'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-md active:scale-95 ' + (
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-primary/10'
                        : 'bg-white/95 dark:bg-card/95 text-muted-foreground hover:bg-white hover:text-foreground'
                    )}
                  >
                    <Icon size={13} />
                    <span className="capitalize">{catId}</span>
                    {isSelected && <Check size={11} className="ml-0.5 shrink-0" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Building Details Slide Up Bottom Sheet (Framer Motion) */}
      <AnimatePresence>
        {selectedBuilding && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute bottom-0 left-0 right-0 md:w-[400px] md:left-6 md:bottom-6 md:top-24 md:top-auto z-[2001] bg-white dark:bg-card rounded-t-3xl md:rounded-2xl shadow-2xl border border-border/50 max-h-[75vh] md:max-h-[70vh] flex flex-col overflow-hidden"
          >
            {/* Drag Bar (Mobile only) */}
            <div className="md:hidden flex justify-center pt-3 pb-2 absolute top-0 left-0 right-0 z-10">
              <div className="w-12 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700 shadow-sm" />
            </div>

            {/* Close button */}
            <button
              onClick={handleCloseCard}
              className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={16} />
            </button>

            {/* Image Banner */}
            <div className="relative h-44 w-full bg-stone-100 dark:bg-stone-900 overflow-hidden">
              {selectedBuilding.photos && selectedBuilding.photos.length > 0 ? (
                <img
                  src={selectedBuilding.photos[0]}
                  alt={selectedBuilding.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/5 to-primary/10">
                  <Building2 size={48} className="text-primary/20 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary/40">Lumisync Campus Map</span>
                </div>
              )}
              {/* Category overlay */}
              <div className="absolute bottom-3 left-4 flex gap-1.5 items-center">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground uppercase shadow-sm">
                  {selectedBuilding.category}
                </span>
                {selectedBuilding.abbreviation && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white uppercase shadow-sm">
                    {selectedBuilding.abbreviation}
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-y-auto hide-scrollbar pb-6 flex-1">
              {/* Header Title Details */}
              <div className="p-5 pb-3 border-b border-border/40">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-extrabold leading-tight text-foreground">{selectedBuilding.name}</h2>
                    {selectedBuilding.officialNumber && selectedBuilding.officialNumber !== 'N/A' && (
                      <p className="text-xs text-muted-foreground mt-0.5">Building #{selectedBuilding.officialNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons (Favorites, Share, Google Maps) */}
              <div className="px-5 py-3 border-b border-border/40 flex justify-around gap-2 bg-muted/10">
                {/* Favorite */}
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_FAVORITE_BUILDING', buildingId: selectedBuilding.id })}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                    state.favoriteBuildings?.includes(selectedBuilding.id)
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                      : 'bg-white dark:bg-card border-border hover:bg-stone-50 text-muted-foreground'
                  }`}>
                    <Heart size={18} className={state.favoriteBuildings?.includes(selectedBuilding.id) ? 'fill-rose-500' : ''} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground">
                    {state.favoriteBuildings?.includes(selectedBuilding.id) ? 'Saved' : 'Favorite'}
                  </span>
                </button>

                {/* Share Link */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/detail/building/${selectedBuilding.id}`);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                    copiedLink
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                      : 'bg-white dark:bg-card border-border hover:bg-stone-50 text-muted-foreground'
                  }`}>
                    {copiedLink ? <Check size={18} /> : <Share2 size={18} />}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground">
                    {copiedLink ? 'Copied' : 'Copy Link'}
                  </span>
                </button>

                {/* Open in Google Maps */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedBuilding.coordinates.lat},${selectedBuilding.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border bg-white dark:bg-card border-border hover:bg-stone-50 text-muted-foreground transition-all">
                    <ExternalLink size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground">Maps</span>
                </a>
              </div>

              <div className="px-5 pt-4 space-y-5">
                {/* Directions Modes Tabs */}
                {!isRoutingActive ? (
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Directions Mode</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleStartRouting('walking')}
                        className="py-2.5 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-xl font-bold text-xs text-primary transition-all flex flex-col items-center justify-center gap-1"
                      >
                        <Navigation2 size={15} />
                        <span>Walk</span>
                      </button>
                      <button
                        onClick={() => handleStartRouting('cycling')}
                        className="py-2.5 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-xl font-bold text-xs text-primary transition-all flex flex-col items-center justify-center gap-1"
                      >
                        <Bike size={15} />
                        <span>Cycle</span>
                      </button>
                      <button
                        onClick={() => handleStartRouting('accessible')}
                        className="py-2.5 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-xl font-bold text-xs text-primary transition-all flex flex-col items-center justify-center gap-1"
                      >
                        <Info size={15} />
                        <span>Accessible</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/40 p-4 rounded-xl space-y-3.5 border border-border/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-foreground">Route details ({routingMode})</span>
                      </div>
                      <button onClick={() => setIsRoutingActive(false)} className="text-[10px] font-bold text-primary hover:underline">Cancel</button>
                    </div>

                    {/* Start selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Start From</label>
                      <select
                        value={routingStart?.name || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'My Location' && userLatLng) {
                            setRoutingStart({ name: 'My Location', coordinates: userLatLng });
                          } else {
                            const found = majorStartLocations.find((l) => l.name === val);
                            if (found) {
                              setRoutingStart({ name: found.name, coordinates: found.coordinates });
                              // Re-trigger routing calculation
                              setTimeout(() => handleStartRouting(routingMode), 50);
                            }
                          }
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-card border border-border rounded-lg outline-none font-semibold text-foreground"
                      >
                        {userLatLng && <option value="My Location">My Location (GPS)</option>}
                        {majorStartLocations.map((l) => (
                          <option key={l.id} value={l.name}>{l.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Route results metrics */}
                    {routeResult && (
                      <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold">Duration</div>
                          <div className="text-sm font-extrabold text-primary">
                            {Math.ceil(routeResult.duration / 60)} mins
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-muted-foreground uppercase font-bold">Distance</div>
                          <div className="text-sm font-extrabold text-foreground">
                            {routeResult.distance > 1000 
                              ? `${(routeResult.distance / 1000).toFixed(2)} km`
                              : `${Math.round(routeResult.distance)} meters`}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Contact and Quick Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedBuilding.phone && (
                    <div className="p-3 bg-muted/20 rounded-xl flex items-start gap-2 border border-border/20">
                      <Phone size={14} className="text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[9px] font-extrabold uppercase text-muted-foreground">Phone</div>
                        <a href={`tel:${selectedBuilding.phone}`} className="font-semibold text-primary hover:underline">{selectedBuilding.phone}</a>
                      </div>
                    </div>
                  )}
                  {selectedBuilding.website && (
                    <div className="p-3 bg-muted/20 rounded-xl flex items-start gap-2 border border-border/20">
                      <Globe size={14} className="text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[9px] font-extrabold uppercase text-muted-foreground">Website</div>
                        <a href={selectedBuilding.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline truncate block max-w-[120px]">Visit Site</a>
                      </div>
                    </div>
                  )}
                  {selectedBuilding.email && (
                    <div className="p-3 bg-muted/20 rounded-xl flex items-start gap-2 border border-border/20 col-span-2">
                      <Mail size={14} className="text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[9px] font-extrabold uppercase text-muted-foreground">Email</div>
                        <a href={`mailto:${selectedBuilding.email}`} className="font-semibold text-primary hover:underline">{selectedBuilding.email}</a>
                      </div>
                    </div>
                  )}
                </div>

                {/* About description */}
                {selectedBuilding.description && (
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">About</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {selectedBuilding.description}
                    </p>
                  </div>
                )}

                {/* Address & Accessibility Checklist */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location & Access</h3>
                  <div className="bg-muted/30 p-4 rounded-xl space-y-3 text-xs">
                    {selectedBuilding.address && (
                      <div className="flex gap-2">
                        <MapPin size={14} className="text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-wider">Address</div>
                          <div className="font-semibold text-foreground">{selectedBuilding.address}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t border-border/40 pt-2.5 space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-wider">Restrooms</div>
                          <div className="font-semibold text-foreground">{selectedBuilding.restrooms || 'Accessible public restrooms available.'}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-wider">Elevators</div>
                          <div className="font-semibold text-foreground">{selectedBuilding.elevators || 'Elevators available.'}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-wider">Bike Racks</div>
                          <div className="font-semibold text-foreground">{selectedBuilding.bikeRacks || 'Bike racks located nearby.'}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-wider">Emergency Phones</div>
                          <div className="font-semibold text-foreground">{selectedBuilding.emergencyPhones || 'Emergency phones available.'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connections (Nearby) */}
                {(selectedBuilding.hasDining || selectedBuilding.hasParkingNearby || selectedBuilding.nearestShuttleStop) && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nearby Features</h3>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                      {selectedBuilding.hasDining && (
                        <div className="flex items-center gap-2.5 p-2.5 bg-muted/30 rounded-xl shrink-0 min-w-[110px] border border-transparent hover:border-primary/20 transition-all cursor-pointer" onClick={() => navigate('/explore/dining')}>
                          <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <UtensilsCrossed size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-bold">Dining</div>
                            <div className="text-[10px] text-muted-foreground">In Building</div>
                          </div>
                        </div>
                      )}
                      {selectedBuilding.hasParkingNearby && selectedBuilding.hasParkingNearby.length > 0 && (
                        <div className="flex items-center gap-2.5 p-2.5 bg-muted/30 rounded-xl shrink-0 min-w-[110px] border border-transparent hover:border-primary/20 transition-all cursor-pointer" onClick={() => navigate('/explore/parking')}>
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Car size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-bold">Parking</div>
                            <div className="text-[10px] text-muted-foreground">Nearby lots</div>
                          </div>
                        </div>
                      )}
                      {selectedBuilding.nearestShuttleStop && (
                        <div className="flex items-center gap-2.5 p-2.5 bg-muted/30 rounded-xl shrink-0 min-w-[110px] border border-transparent hover:border-primary/20 transition-all cursor-pointer" onClick={() => navigate('/explore/shuttle')}>
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Bus size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-bold">Shuttle</div>
                            <div className="text-[10px] text-muted-foreground">{selectedBuilding.nearestShuttleStop}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Departments */}
                {selectedBuilding.departments && selectedBuilding.departments.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Departments</h3>
                    <div className="flex flex-col gap-1.5">
                      {selectedBuilding.departments.map((dept) => (
                        <div key={dept} className="flex items-center gap-2.5 p-2.5 bg-muted/20 rounded-lg">
                          <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <BookOpen size={12} />
                          </div>
                          <span className="text-xs font-medium text-foreground">{dept}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Report an Issue prefilled GitHub issues link */}
                <div className="pt-2">
                  <a
                    href={`https://github.com/ompatil0305/lumisync/issues/new?title=${encodeURIComponent('Map Issue: ' + selectedBuilding.name)}&body=${encodeURIComponent('Building ID: ' + selectedBuilding.id + '\nOfficial Number: ' + selectedBuilding.officialNumber + '\n\nPlease describe the issue (e.g. wrong coordinates, wrong outline, accessibility details):')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 border border-dashed border-border text-muted-foreground rounded-xl text-center text-xs font-bold hover:text-foreground hover:bg-muted/35 transition-all flex items-center justify-center gap-1.5"
                  >
                    Report an issue (closed/wrong coordinates)
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
