# Accessibility standard

## Release standard

All new and materially changed flows must meet WCAG 2.2 AA where applicable. Accessibility is verified during development, not deferred to a final polish pass.

## Required behavior

- Keyboard users can reach, operate, and leave every interactive control.
- Visible focus is never removed without an equivalent indicator.
- Dialogs and sheets trap focus, close on Escape where appropriate, and restore focus to their trigger.
- Form controls have programmatic labels, instructions, and errors.
- Information is not conveyed by color alone.
- Motion respects `prefers-reduced-motion`.
- Touch targets are at least 44 by 44 CSS pixels when feasible.

## Map-specific requirements

Interactive maps must have a non-map equivalent for core tasks: searchable results, a selectable list, textual directions, and accessible building details. Map pins and polygons need accessible names; clustering cannot be the sole way to discover a location.

## Verification

1. Run automated checks in CI once configured.
2. Test primary routes with keyboard only.
3. Check dark and light contrast for text, icons, status colors, and focus indicators.
4. Test dialogs, search, and map detail selection with a screen reader before release.
5. Record known exceptions and remediation dates in an issue; do not silently accept them.
