# Engineering principles

## 1. Platform before campus

The core application must not depend on a particular university. University-specific data, branding, URLs, and integration details belong in providers.

## 2. Domain before screen

Model real-world concepts once, then expose them through maps, search, APIs, and UI. A page-specific type is a projection, not a competing source of truth.

## 3. Honest current state

Documentation and UI must distinguish live, official, licensed static, and demo data. Do not market future behavior as current functionality.

## 4. Thin boundaries

Routes validate and delegate. Components render and coordinate. Services own business behavior. Persistence and external integrations stay behind adapters.

## 5. Accessibility and performance are acceptance criteria

Keyboard support, focus management, semantic structure, motion preferences, and measured loading behavior are release requirements.

## 6. Prefer composition and explicit contracts

Reuse components, provider contracts, schema models, and utilities. Avoid copy/paste variations and implicit cross-feature coupling.

## 7. Fail usefully

An unavailable source should produce a clear state, a retry or alternate route, and never invented information.

## 8. Document consequential choices

Use an ADR for cross-cutting technology, data-model, provider, security, or deployment decisions. Update implementation documentation alongside code.
