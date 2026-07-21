# Provider SDK

## Purpose

Providers isolate university-specific data, branding, sources, and integrations. The current `UniversityProvider` TypeScript interface and `texasTechProvider` demonstrate the pattern, but providers need stronger validation and provenance before they support multiple campuses.

## Provider responsibilities

- Identify a university and campus.
- Supply normalized campus entities and supported capabilities.
- Map raw source data to canonical models.
- Preserve source, freshness, and verification metadata.
- Supply approved URLs, theme inputs, and retrieval source registrations.
- Degrade explicitly when a capability is unavailable.

## Provider prohibitions

- No shared UI imports.
- No untyped raw API values leaking to pages.
- No hard-coded credentials.
- No statement that static or demo data is live.
- No cross-campus identifier collisions.

## Capability contract

The present interface exposes buildings, faculty, dining, parking, shuttles, events, jobs, organizations, alerts, weather, search, and map categories. Future contracts should separate required capabilities (identity, campus, buildings) from optional capabilities (live transit, occupancy, indoor routing), so incomplete providers are explicit and usable.

## Onboarding a provider

1. Create provider identity and campus metadata.
2. Register authoritative sources and rights/refresh expectations.
3. Implement normalization with fixtures and contract tests.
4. Validate IDs, geometry, accessibility fields, and provenance.
5. Run search and map acceptance checks.
6. Register Lumi knowledge sources and evaluation cases.
7. Launch behind a provider capability flag; monitor data quality.

## Texas Tech migration note

Keep the existing provider working while canonical types are introduced. Make each new property additive and map it in one adapter; do not make page components detect Texas Tech-specific data shapes.
