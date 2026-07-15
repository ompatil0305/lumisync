import { useState, useEffect } from 'react';

export function useOSMBuildings(bbox: [number, number, number, number]) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchBuildings() {
      setIsLoading(true);
      try {
        // Construct Overpass API query for buildings in bounding box
        // bbox is [south, west, north, east]
        const query = `
          [out:json][timeout:25];
          (
            way["building"](${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]});
            relation["building"](${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]});
          );
          out body;
          >;
          out skel qt;
        `;
        
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query
        });
        
        if (!response.ok) throw new Error('Failed to fetch OSM data');
        
        const overpassData = await response.json();
        
        // Convert OSM data to GeoJSON for React Leaflet
        const nodes = new Map();
        overpassData.elements.forEach((el: any) => {
          if (el.type === 'node') nodes.set(el.id, [el.lon, el.lat]);
        });
        
        const features: any[] = [];
        overpassData.elements.forEach((el: any) => {
          if (el.type === 'way' && el.nodes) {
            const coordinates = el.nodes.map((n: number) => nodes.get(n)).filter(Boolean);
            if (coordinates.length > 2) {
              features.push({
                type: 'Feature',
                properties: el.tags || {},
                geometry: {
                  type: 'Polygon',
                  coordinates: [coordinates]
                }
              });
            }
          }
        });

        setData({ type: 'FeatureCollection', features } as any);
      } catch (e) {
        console.error('Failed to load OSM buildings:', e);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchBuildings();
  }, [bbox[0], bbox[1], bbox[2], bbox[3]]);

  return { data, isLoading };
}
