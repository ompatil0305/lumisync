# Performance standard

## Measurement first

Track Core Web Vitals for the SPA, JavaScript bundle composition, map time-to-interactive, map layer render time, provider/API latency, search latency, and Lumi time-to-first-token. Optimize measured bottlenecks rather than adding blanket memoization.

## Current hotspots

- Leaflet, clustering, geometry, and route overlays make the map route the primary bundle/rendering risk.
- `CampusMap.tsx` mixes several interaction responsibilities and should avoid rerendering all markers on selection changes.
- Public OSRM fallback has variable reliability and latency; failure state is a first-class product behavior.

## Requirements

- Heavy map modules and optional layers should load progressively.
- Images must have intentional dimensions, responsive sizes, and lazy loading where appropriate.
- Provider calls should be cached with deliberate freshness rules.
- Avoid shipping admin, AI, or map code on routes that cannot use it once route splitting is introduced.
- Protect backend resources with timeouts, bounded retries, connection pooling, and distributed rate limits.
