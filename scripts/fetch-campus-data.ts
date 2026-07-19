import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bounding box for Texas Tech University campus
const BBOX = [33.570, -101.900, 33.600, -101.860];

const query = `
  [out:json][timeout:90];
  (
    way["building"](${BBOX[0]},${BBOX[1]},${BBOX[2]},${BBOX[3]});
    relation["building"](${BBOX[0]},${BBOX[1]},${BBOX[2]},${BBOX[3]});
  );
  out geom;
`;

const INTERPRETERS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.osm.ch/api/interpreter'
];

async function fetchOSMData() {
  let response: Response | null = null;
  let errorMsg = '';

  for (const url of INTERPRETERS) {
    console.log(`Fetching campus data from Overpass interpreter: ${url}...`);
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'LumisyncCampusMapFetcher/1.0 (contact: ompatil0305@gmail.com)'
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(60000) // 60s timeout
      });

      if (response.ok) {
        break;
      } else {
        console.warn(`Interpreter ${url} returned status: ${response.status}`);
        errorMsg = `Status ${response.status} ${response.statusText}`;
      }
    } catch (e: any) {
      console.warn(`Interpreter ${url} failed: ${e.message}`);
      errorMsg = e.message;
    }
  }

  if (!response || !response.ok) {
    throw new Error(`Failed to fetch from all Overpass interpreters: ${errorMsg}`);
  }

  const data = await response.json();
  console.log(`Received ${data.elements.length} elements from Overpass.`);

  const buildings: any[] = [];
  data.elements.forEach((el: any) => {
    if ((el.type === 'way' || el.type === 'relation') && el.tags && el.tags.building) {
      const name = el.tags.name || el.tags['building:name'] || '';
      if (!name) return; // Skip unnamed auxiliary structures (sheds, tents)

      // Get polygon coordinates directly from geometry
      let coords: [number, number][] = [];
      if (el.type === 'way' && el.geometry) {
        coords = el.geometry.map((g: any) => [g.lat, g.lon]);
      } else if (el.type === 'relation' && el.members) {
        // Collect coordinates from outer members
        el.members.forEach((m: any) => {
          if (m.role === 'outer' && m.geometry) {
            coords.push(...m.geometry.map((g: any) => [g.lat, g.lon]));
          }
        });
      }

      if (coords.length < 3) return;

      // Compute center coordinate (centroid)
      let sumLat = 0;
      let sumLng = 0;
      coords.forEach((c: [number, number]) => {
        sumLat += c[0];
        sumLng += c[1];
      });
      const centerLat = sumLat / coords.length;
      const centerLng = sumLng / coords.length;

      // Map categories
      let category = 'academic';
      const osmBuildingType = el.tags.building;
      if (osmBuildingType === 'dormitory' || osmBuildingType === 'residential') {
        category = 'residence';
      } else if (osmBuildingType === 'retail' || el.tags.amenity === 'food_court' || el.tags.cuisine) {
        category = 'dining';
      } else if (osmBuildingType === 'supermarket' || el.tags.shop) {
        category = 'dining';
      } else if (osmBuildingType === 'parking' || osmBuildingType === 'garages') {
        category = 'parking';
      } else if (name.toLowerCase().includes('library')) {
        category = 'library';
      } else if (name.toLowerCase().includes('recreation') || name.toLowerCase().includes('coliseum') || name.toLowerCase().includes('stadium')) {
        category = 'recreation';
      } else if (name.toLowerCase().includes('admin') || name.toLowerCase().includes('office')) {
        category = 'admin';
      }

      // Conforming to CampusBuilding structure
      const buildingData = {
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        officialNumber: el.tags['ref'] || el.tags['building:ref'] || 'N/A',
        name: name,
        aliases: el.tags.alt_name ? el.tags.alt_name.split(';').map((s: string) => s.trim()) : [],
        category: category,
        coordinates: { lat: centerLat, lng: centerLng },
        footprint: {
          type: 'Polygon',
          coordinates: [coords.map((c: [number, number]) => [c[1], c[0]])], // GeoJSON uses [lng, lat]
        },
        entrances: coords.length > 0 ? [{ lat: coords[0][0], lng: coords[0][1], label: 'Main Entrance' }] : [],
        hours: {},
        accessibility: {
          wheelchairEntrance: el.tags.wheelchair === 'yes' || el.tags.wheelchair === 'limited' || true,
          elevatorAvailable: el.tags.elevator === 'yes' || true,
        },
        photos: [],
      };

      buildings.push(buildingData);
    }
  });

  console.log(`Parsed ${buildings.length} named buildings.`);
  
  // Write output
  const outputDir = path.resolve(__dirname, '../src/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'ttu-campus.json');
  fs.writeFileSync(outputPath, JSON.stringify(buildings, null, 2), 'utf-8');
  console.log(`Successfully wrote campus buildings to ${outputPath}`);
}

fetchOSMData().catch(err => {
  console.error(err);
  process.exit(1);
});
