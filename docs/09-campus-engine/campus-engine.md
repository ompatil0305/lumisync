# Campus Engine

## Purpose

The Campus Engine is Lumisync's spatial capability: it turns normalized campus entities into search, map, selection, route, and contextual experiences. The map is its first interface, not its definition.

## Current state

`CampusMap.tsx` renders Leaflet tiles, markers, clusters, selected-building details, optional GeoJSON footprints, and routing through Mapbox when configured or public OSRM as a fallback. Buildings are supplied by the Texas Tech provider.

## Engine contract

- Input: provider-scoped normalized entities, geometry, layers, and optional routing graph/feed.
- Output: visible entities, search candidates, selected entity context, routes, labels, and accessible textual alternatives.
- The engine must not embed a university name, coordinate, or data-source URL.

## Layer model

1. Base tiles and campus boundary.
2. Building footprints and labels.
3. Point entities: dining, parking, shuttle stops, emergency resources.
4. Contextual overlays: routes, selection, filters, events, accessibility.

## Performance rules

- Render entities by viewport and zoom level.
- Load geometry progressively; do not make every route wait for every polygon.
- Keep selection state independent of data fetching so changing a pin does not rebuild the map.
- Cluster only where it improves comprehension; searchable list results remain available.

## Accessibility and routing

An accessible path is not a walking route with a different icon. It requires verified accessibility attributes and a routing data source capable of honoring constraints. Until that exists, label the option as an estimate or unavailable; do not imply verified barrier-free guidance.

## Roadmap

First normalize entity geometry and provenance. Next extract the present map concerns into layers, selection, labels, and routing modules. Add polygons and a second provider before considering indoor navigation.
