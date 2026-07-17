export interface RouteResult {
  path: [number, number][]; // [lat, lng] array
  distance: number; // in meters
  duration: number; // in seconds
  instructions: string[];
}

export async function fetchRoute(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  options?: { mode?: 'walking' | 'cycling' | 'accessible'; avoidStairs?: boolean }
): Promise<RouteResult> {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const mode = options?.mode || 'walking';
  
  // Map standard modes to Mapbox profile names
  const mapboxProfile = mode === 'cycling' ? 'cycling' : 'walking';
  // Map standard modes to OSRM profile names
  const osrmProfile = mode === 'cycling' ? 'bicycle' : 'foot';

  if (mapboxToken) {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/${mapboxProfile}/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${mapboxToken}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const route = data.routes[0];
        if (route) {
          const path = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
          return {
            path,
            distance: route.distance,
            duration: route.duration,
            instructions: route.legs[0]?.steps?.map((s: any) => s.maneuver.instruction) || []
          };
        }
      }
    } catch (e) {
      console.warn('Mapbox routing failed, falling back to OSRM:', e);
    }
  }

  // Default to OSRM public walking/bicycle router
  try {
    const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&steps=true`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json();
      const route = data.routes?.[0];
      if (route) {
        const path = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
        return {
          path,
          distance: route.distance,
          duration: route.duration,
          instructions: route.legs?.[0]?.steps?.map((s: any) => s.name || s.maneuver?.type) || []
        };
      }
    }
  } catch (e) {
    console.warn('OSRM routing failed, falling back to straight line:', e);
  }

  // Local/simple straight-line fallback (2 points)
  const distance = calculateHaversineDistance(start, end);
  const averageWalkingSpeed = 1.34; // 1.34 meters per second (~3 mph)
  const duration = distance / averageWalkingSpeed;

  return {
    path: [
      [start.lat, start.lng],
      [end.lat, end.lng]
    ],
    distance,
    duration,
    instructions: ['Walk straight to the destination.']
  };
}

function calculateHaversineDistance(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLng = (p2.lng - p1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
