# Database schema and migration policy

## Current schema

`backend/migrations/schema.sql` currently creates:

- `buildings`: public building directory and GeoJSON/accessibility fields.
- `faculty`: public directory entries with an optional building reference.
- `issue_reports`: user-submitted corrections.
- `ttu_knowledge_chunks`: Gemini 768-dimension RAG chunks with an HNSW vector index.
- `waitlist_signups`: marketing waitlist data.

Row-level security is enabled. Public reads are allowed for buildings and faculty; issue reports allow anonymous insert; RAG chunks have no public policy.

## Target tenancy migration

Before adding a second university, add `universities` and `campuses`, backfill Texas Tech as a provider/campus, then add non-null scoped foreign keys to campus-owned entities. Use an additive migration sequence; do not perform an unreviewed destructive rename.

## Migration policy

1. Migrations are ordered, immutable, reviewed SQL files.
2. Apply migrations in CI/CD or a controlled release job; never at application startup.
3. Every destructive operation has a tested rollback/restore plan.
4. Index foreign keys and query predicates after measuring actual access patterns.
5. Store timestamps as `TIMESTAMPTZ`; record provider source freshness separately from database update time.
6. Do not place private student data in public entity tables.

## Data quality requirements

Every provider-ingested record must retain external source identity, source URL where available, ingestion time, verification status, and parser/version metadata. Data quality is a product requirement, not only an ingestion concern.
