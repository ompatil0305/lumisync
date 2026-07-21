# DevOps and operations

## Current deployment shape

The SPA is deployable to Vercel with a rewrite to `index.html`. The backend includes a Dockerfile, Railway configuration, and Docker Compose for a local FastAPI/PostgreSQL stack.

## Required environments

Maintain separate development, staging, and production environments with independent secrets, databases, and data-ingestion permissions. Staging must exercise the same deployment path as production.

## Release pipeline target

`format/lint ? type-check ? unit tests ? API tests ? production build ? migration dry run ? deploy ? health check ? monitor`

Database migration is a release step before application rollout. It must not execute on each API process startup.

## Observability

Every request should have a request ID. Capture structured logs, error rate, latency, database connection health, map/search failures, model latency, retrieval confidence, and cost metrics. Do not log secrets or user message content by default.

## Backup and recovery

Define database backup retention, restoration ownership, restore-time target, and an at-least-quarterly restore exercise before storing non-public user data.
