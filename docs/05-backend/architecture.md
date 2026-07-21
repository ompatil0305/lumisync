# Backend architecture

## Current state

`backend/main.py` creates the FastAPI app and mounts `api/routes.py` under `/api/v1`. Current routes cover health, chat, buildings, faculty, and issue reports. `VectorService` owns synchronous SQLAlchemy database access; `RAGPipeline` composes vector retrieval and the Gemini service.

## Required boundary

`HTTP route ? request/response schema ? domain service ? repository/adapter ? database or external system`

Routes must validate input, derive request metadata, and map service errors to HTTP responses. They must not own SQL query construction, RAG policy, or provider-specific business decisions.

## Current production gaps

- Startup runs schema initialization and data migration. Move this to an explicit migration/release job before scaling beyond a single process.
- Chat rate limiting is an in-memory dictionary and is not shared across workers or deployments.
- Error responses expose raw exception detail in several routes.
- Database access is synchronous inside async route handlers; measure and move to an async strategy or bounded worker model before high concurrency.

## Target module layout

```text
backend/
  api/             transport and schemas
  domains/         campus, search, ai, reports
  repositories/    database queries
  providers/       external university adapters
  rag/             retrieval and answer orchestration
  infrastructure/  database, cache, model clients, observability
  migrations/      ordered deploy-time migrations
```

This is an evolutionary target. Extract a domain when it has independent rules or multiple routes, rather than moving every file at once.
