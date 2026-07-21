# Testing strategy

## Test pyramid

- **Unit:** provider normalization, search ranking, routing fallback, schema validation, RAG policy helpers.
- **Integration:** FastAPI routes with a test database; provider/API adapters; migration application.
- **End-to-end:** search-to-detail, map selection-to-directions, Lumi cited answer/refusal, issue report, keyboard navigation.
- **Manual/visual:** map interaction, responsive layout, dark mode, screen-reader behavior, and contrast.

## Minimum quality gates

Every change must lint and type-check. New business rules require unit tests. New or changed API behavior requires integration coverage. A change to a critical student path requires an end-to-end check. A change to a provider requires contract fixtures.

## Test data

Use source-safe fixtures with explicit provenance. Never use production secrets or private student data. Include malformed geometry, missing hours, stale records, and unavailable external API scenarios.

## AI evaluation

Keep a versioned suite by provider that asserts groundedness, citations, safe refusal, and entity/action selection. AI behavior is evaluated, not judged only by a single manual prompt.
