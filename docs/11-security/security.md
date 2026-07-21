# Security standard

## Current priorities

- Keep Gemini and database credentials server-only.
- Restrict CORS to known environments; do not use broad origins with credentials.
- Apply validation and request-size limits to every API input.
- Replace process-local chat rate limiting with a shared rate-limit store before multi-instance deployment.
- Do not return raw internal exception messages to clients.

## Data classification

| Class | Examples | Rule |
| --- | --- | --- |
| Public | building locations, public directory facts | Source/provenance required; still validate before display. |
| Restricted | issue reports, operational dashboards | Authenticated, authorized, logged access. |
| Sensitive | student identity, schedules, SSO tokens | Collect only when necessary; encrypt in transit and at rest; least privilege. |
| Secret | API keys, database passwords | Environment/secret manager only; never logs, source, or client bundles. |

## Secure delivery baseline

Use HTTPS, secure headers/CSP appropriate to map and API origins, dependency review, least-privilege database roles, secret rotation, audit logging for administrative writes, and tested backup restoration.

## Incident rule

If a secret is exposed, revoke/rotate it immediately, assess logs and scope, document the incident, and add a prevention control. Do not only remove it from a commit.
