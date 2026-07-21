# ADR-001: Provider-first architecture

Status: Accepted
Date: 2026-07-21

## Context

Lumisync launches with Texas Tech data but is intended to support multiple universities. Current frontend code already has a `UniversityProvider` interface and a Texas Tech implementation, while some data and RAG persistence remain Texas Tech-specific.

## Decision

University-specific data, sources, branding inputs, URLs, and integrations will be represented by provider adapters. Shared UI, domain behavior, API contracts, and Campus Engine code must remain provider-neutral. All persistent campus data will be scoped by university and campus before a second provider launches.

## Consequences

Provider contracts require validation, fixtures, and capability declarations. Existing Texas Tech assumptions must move behind the provider boundary incrementally. This adds adapter work but prevents forks of the product for each university.

## Alternatives considered

- Per-university application forks: rejected because they duplicate fixes and drift quickly.
- A global generic schema with no provider layer: rejected because source formats and integrations vary materially by university.
