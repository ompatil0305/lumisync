# Release checklist

## Product and data

- [ ] Every launch claim matches implemented capability and data freshness.
- [ ] Provider source ownership, refresh cadence, and known gaps are documented.
- [ ] Empty/error/offline states provide a useful next step.
- [ ] Deep links and primary routes are verified on mobile and desktop.

## Engineering

- [ ] Lint, type-check, tests, and production builds pass.
- [ ] Migrations are reviewed, backed up, and applied through the release workflow.
- [ ] Health checks and rollback plan are verified.
- [ ] Error monitoring and structured logs are active.
- [ ] Secrets are present only in the deployment secret manager.

## Accessibility and privacy

- [ ] Keyboard pass completed for search, navigation, map alternatives, dialogs, and forms.
- [ ] Contrast and reduced-motion pass completed.
- [ ] Public/private/restricted data paths are reviewed.
- [ ] Privacy notice and support/contact routes are current.

## AI

- [ ] Provider-scoped retrieval and citations are verified.
- [ ] Refusal and emergency escalation behavior is tested.
- [ ] Rate limits, cost alerts, and model failure states are configured.
