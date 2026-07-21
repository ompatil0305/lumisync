# Lumisync engineering handbook

This directory is the version-controlled source of truth for Lumisync product and engineering decisions. It describes the current implementation accurately, identifies intended target architecture separately, and records decisions that change the platform's direction.

## How to use this handbook

- Read `00-introduction` before contributing.
- Treat `03-architecture/system-overview.md` as the entry point for technical design.
- Update the relevant document in the same pull request as any material architecture change.
- Use an ADR for decisions that are expensive to reverse or affect multiple systems.

## Current implementation at a glance

Lumisync is a React 19 and Vite single-page application backed by a FastAPI service. The application uses a university-provider interface, currently implemented by Texas Tech data. PostgreSQL with pgvector stores public campus data and RAG knowledge chunks. The marketing website is maintained separately in `lumisync_website` and is not part of this checkout.

## Handbook map

| Area | Document |
| --- | --- |
| Mission and language | [Vision](00-introduction/vision.md), [principles](00-introduction/engineering-principles.md), [glossary](00-introduction/glossary.md) |
| Product direction | [Campus operating system](01-product/campus-operating-system.md), [roadmap](01-product/roadmap.md) |
| Experience | [Design system](02-design/design-system.md), [accessibility](02-design/accessibility.md) |
| Technical foundation | [System overview](03-architecture/system-overview.md), [domain model](03-architecture/domain-model.md), [repository guide](03-architecture/repository.md) |
| Runtime systems | [Frontend](04-frontend/architecture.md), [backend](05-backend/architecture.md), [AI](06-ai/ai-platform.md), [database](07-database/schema.md), [API](08-api/contracts.md) |
| Flagship platform capabilities | [Campus Engine](09-campus-engine/campus-engine.md), [providers](10-providers/provider-sdk.md) |
| Operational readiness | [security](11-security/security.md), [DevOps](12-devops/operations.md), [testing](13-testing/strategy.md), [performance](14-performance/performance.md), [launch](15-launch/release-checklist.md) |
| Durable decisions | [ADRs](adr/README.md) |

## Documentation conventions

`Current` describes behavior present in the repository. `Target` describes an approved direction that has not necessarily been implemented. Requirements use **must**, recommendations use **should**, and ideas use **may**.
