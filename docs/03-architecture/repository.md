# Repository guide

## Current repository layout

```text
src/                 React SPA
  components/        App shell and shadcn-derived UI primitives
  context/           App-wide client state
  data/              Current local Texas Tech fixtures/data
  hooks/             Provider query hooks and responsive helpers
  pages/             Route-level UI and detail views
  providers/         University contract and Texas Tech implementation
  services/          Browser integrations such as routing and weather
backend/             FastAPI, RAG, migrations, and scripts
docs/                This handbook
scripts/             Data utility scripts
public/              Static assets
```

## Ownership boundaries

| Area | Owns | Must not own |
| --- | --- | --- |
| `src/pages` | Route composition and screen-specific interaction | Raw provider data transformations or shared domain policy |
| `src/providers` | University-specific adapters and normalized client data | Generic visual components |
| `src/services` | External browser-facing integrations | Page state |
| `backend/api` | HTTP validation and response transport | Business rules or raw SQL duplication |
| `backend/rag` | Retrieval orchestration | HTTP behavior |
| `backend/migrations` | Immutable schema evolution | Runtime initialization |

## Target evolution

Do not relocate files merely to match an aspirational diagram. Extract modules when a behavior has at least two consumers or when a route/provider boundary is unclear. The intended direction is feature modules with shared domain contracts, while keeping the existing Vite SPA and FastAPI service deployable independently.

## Required documentation updates

- New public API surface: update `08-api/contracts.md`.
- New persisted entity or schema migration: update `07-database/schema.md` and `domain-model.md`.
- New provider capability: update `10-providers/provider-sdk.md`.
- Cross-cutting decision: add an ADR.
