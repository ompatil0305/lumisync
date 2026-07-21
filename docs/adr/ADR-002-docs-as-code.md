# ADR-002: Documentation as code

Status: Accepted
Date: 2026-07-21

## Context

Lumisync has a long-term multi-university and AI platform vision. Architecture guidance must remain reviewable alongside code rather than existing only in chat or informal notes.

## Decision

The `docs/` directory is the version-controlled engineering handbook. Material architecture, API, schema, provider, security, and release-process changes update the corresponding document in the same change set. Significant decisions use ADRs.

## Consequences

Pull requests may include documentation work even when no user-facing behavior changes. Documentation must distinguish current implementation from target architecture to avoid becoming aspirational fiction.

## Alternatives considered

- A single external document: rejected because it is difficult to review, version, and keep synchronized.
- No documentation requirement: rejected because cross-cutting decisions would be repeatedly rediscovered.
