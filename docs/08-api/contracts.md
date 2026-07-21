# API contracts

## Conventions

- All public application endpoints are versioned under `/api/v1`.
- JSON uses camelCase at public boundaries; existing snake_case responses are a compatibility constraint to plan deliberately rather than change silently.
- Errors use a stable code and user-safe message. Raw exceptions are logged, not returned.
- Collection endpoints are provider/campus scoped before multi-campus data is introduced.

## Current endpoints

| Method | Path | Current purpose |
| --- | --- | --- |
| GET | `/health` | Database-oriented health status. |
| POST | `/api/v1/chat` | Streams Lumi text. |
| GET | `/api/v1/buildings` | Lists buildings; optional category filter. |
| GET | `/api/v1/buildings/{idOrSlug}` | Fetches a building. |
| GET | `/api/v1/faculty` | Lists faculty; optional department/search filters. |
| GET | `/api/v1/faculty/{id}` | Fetches a faculty record. |
| POST | `/api/v1/issues` | Submits a correction report for a building or faculty record. |

## Target error envelope

```json
{
  "error": {
    "code": "ENTITY_NOT_FOUND",
    "message": "No building matched that identifier.",
    "requestId": "?"
  }
}
```

## Chat contract target

Replace bare text streaming with server-sent events or an equivalent typed stream containing `text_delta`, `citation`, `entity_reference`, `completed`, and `error` events. This enables reliable citations and prevents clients from parsing prose to discover actions.

## Contract changes

Additive fields are preferred. Breaking changes require a new API version, migration plan, consumer inventory, and release note. Validate external input with Pydantic models and enforce length/shape limits before processing.
