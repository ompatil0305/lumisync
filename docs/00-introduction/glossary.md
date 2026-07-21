# Glossary

| Term | Meaning |
| --- | --- |
| Campus Engine | The platform capability that represents entities, geometry, selection, layers, routing, and spatial context. The current map UI is its first consumer. |
| Campus entity | A discoverable campus object: building, dining venue, parking lot, event, faculty member, organization, shuttle stop, or future entity. |
| Provider | A university-specific implementation of the `UniversityProvider` contract. `texasTechProvider` is the current implementation. |
| Canonical model | The shared platform representation of an entity, independent of a screen or raw data source. |
| Projection | A UI/API-specific shape derived from a canonical model. |
| Provenance | Source and freshness metadata describing where data came from and how trustworthy/current it is. |
| RAG | Retrieval-augmented generation: retrieve trusted context, then provide it to an LLM to produce an answer. |
| Lumi | Lumisync's campus assistant. The current backend uses Gemini and pgvector; future provider-neutral architecture must not assume a particular model vendor. |
| Current | Implemented behavior in this repository today. |
| Target | Intended architecture approved for incremental adoption; it may not exist in code yet. |
