# AI platform

## Current state

Lumi currently receives a message list and `university_id`, generates a Gemini embedding, searches `ttu_knowledge_chunks` with pgvector, rejects low-similarity retrieval, builds a system prompt, and streams a Gemini response. Citations are assembled internally but are not returned in the streaming HTTP contract.

## Target pipeline

`User query ? validation/rate limit ? provider scope ? evidence retrieval ? grounding check ? prompt composition ? model adapter ? structured answer and citations`

## Requirements

- Retrieve only provider-scoped, attributable information.
- Return a structured response contract that includes text chunks, citations, and actionable entity references.
- Preserve source URL, title, source type, retrieval timestamp, and chunk version for every citation.
- Refuse or redirect when evidence is insufficient; never fill gaps with invented campus facts.
- Keep model provider, embedding model, and vector dimensions configurable behind adapters.
- Log latency, retrieval quality, token/cost telemetry, and failures without retaining sensitive content unnecessarily.

## Evaluation

Maintain a versioned provider-scoped evaluation set covering factual retrieval, citation correctness, refusal behavior, action selection, and adversarial prompt handling. A change to prompts, embeddings, chunking, model, or retrieval ranking must run that evaluation before release.

## Non-goals

Lumi is not an authority for emergency instructions, medical advice, academic records, or private student data. Those requests route to appropriate official systems or emergency services.
