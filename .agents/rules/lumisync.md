# Lumisync Engineering Rules

## Required Reading Before Edits

Before making architecture, data, provider, AI, map, or API changes, read:

- docs/README.md
- docs/03-architecture/system-overview.md
- docs/03-architecture/domain-model.md
- docs/10-providers/provider-sdk.md
- docs/09-campus-engine/campus-engine.md
- docs/06-ai/ai-platform.md

If the docs conflict with the current implementation, explain the mismatch before changing code.

## Existing Stack Reality

The current Lumisync app is a React + Vite + TypeScript frontend with a FastAPI backend.

Do not assume Next.js unless the repository is later migrated.

## Core Architecture

Lumisync is platform-first and provider-driven.

The core application must remain university-agnostic. University-specific branding, assets, maps, data ingestion, and configuration belong inside provider implementations such as texasTechProvider.

Model real-world entities first. UI screens, API routes, and AI workflows should project canonical domain models instead of creating competing page-specific types.

## No Silent Architecture Drift

Do not introduce:

- duplicate domain types
- page-specific entity shapes
- hardcoded Texas Tech logic outside providers
- direct JSON imports inside route/page components
- database access from UI code
- prompt logic inside API route handlers
- migration execution during app startup

## Provider Rules

Every external data boundary must carry a provider or university identifier.

Examples:

- RAG chat context
- database queries
- search indexes
- map entity loading
- faculty, dining, parking, events, and building APIs

Entity IDs must be stable. Use UUIDs for persistent identifiers and slugs for human-facing URLs/lookups.

Provider adapters are responsible for normalizing university-specific data shapes into canonical Lumisync entities.

Page components must not detect or branch on university-specific data structures.

## AI/RAG Rules

Lumi must use provider-scoped context.

Every RAG request must include:

- university_id
- provider identifier
- source metadata
- citation-capable retrieved context

AI responses must not claim information that was not retrieved or provided.

Do not hardcode university knowledge directly into prompts.

## Campus Engine Rules

Treat the map as the Campus Engine, not just a Leaflet page.

Map data should flow through:

Provider -> normalized campus entities -> hooks/services -> UI renderer

Do not bind the map renderer directly to Texas Tech data.

The Campus Engine should stay ready for:

- building polygons
- accessibility routes
- indoor navigation
- routing
- map labels
- search
- provider-specific overlays

## Backend Rules

FastAPI routes should stay thin.

Use this boundary:

Route/controller -> validation and transport
Service -> business logic
Provider/adapter -> external systems and university-specific data
Repository/database layer -> persistence

Database migrations must be run explicitly as deployment steps, not dynamically during web server startup.

Failures should degrade gracefully. Do not invent data. Use smart retries or normalized static fallback data when appropriate.

## Frontend Rules

UI page files must not directly import raw data or JSON fixtures.

Resolve data through provider-aware hooks or services, such as:

- useBuildings
- useFaculty
- useDining
- useParking
- useCampusProvider

Components should use shared types and reusable UI patterns.

Avoid one-off design variants unless the design system explicitly supports them.

## Definition Of Done

Before finishing a change, verify:

- provider boundaries are preserved
- TypeScript types remain safe
- UI degrades gracefully when data is missing
- no university-specific logic leaked into shared code
- no duplicate domain models were introduced
- docs are updated if architecture changed
- lint, build, or tests were run when relevant

Report exactly what changed, what was verified, and what was intentionally left untouched.
