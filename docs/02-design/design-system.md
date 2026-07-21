# Design system

## Purpose

Create a durable visual and interaction language for the student application. The current codebase uses Tailwind tokens and shadcn-derived primitives; this document defines how to make their usage consistent without an immediate component-library rewrite.

## Principles

- Typography and spacing establish hierarchy before color does.
- Use a neutral Lumisync base system. Provider identity is an additive theme, never a global product dependency.
- Components expose a small, documented set of variants.
- Motion explains change; it does not compete with content.

## Tokens

| Token family | Requirement |
| --- | --- |
| Color | Semantic roles: background, surface, foreground, muted, border, primary, destructive, success, warning. Provider color may map to `primary` only through a theme boundary. |
| Spacing | Use a four-point rhythm: 4, 8, 12, 16, 24, 32, 48, 64. |
| Typography | Define display, heading, body, label, and metadata roles; do not encode hierarchy with arbitrary text sizes. |
| Radius | Use a small fixed scale; shared primitives own the choice. |
| Motion | Standard durations: 150ms feedback, 200?250ms reveal, 300ms modal/page transition. Respect reduced motion. |
| Elevation | Prefer borders and surface contrast; use shadow only to communicate layering. |

## Component rules

- Buttons: primary, secondary, ghost, destructive, and link only.
- Cards: a consistent border/radius/padding contract; hover is reserved for interactive cards.
- Forms: every control has an associated label, visible focus, validation message, and error relationship.
- Empty/error/loading states: explain what happened and give a recovery action.
- Icons: use Lucide icons at deliberate sizes; decorative icons are hidden from assistive technology.

## Theme architecture

Current provider data contains Texas Tech colors. Preserve this as provider data, but shared CSS must never name a university. A future `UniversityTheme` adapter should map a validated provider theme to semantic CSS variables; it must enforce contrast requirements.

## Related documents

- [Accessibility](accessibility.md)
- [Frontend architecture](../04-frontend/architecture.md)
