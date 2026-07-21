# Frontend architecture

## Current state

The frontend is a Vite React SPA using React Router, TanStack Query, Tailwind CSS, Framer Motion, Leaflet, and an `AppContext` reducer. Route composition is in `src/App.tsx`; provider data flows through `src/hooks/useUniversity.ts` and `src/providers/texasTechProvider.ts`.

## Boundary rules

- Route components compose features and own route state.
- Provider hooks are the sole normal path from UI to university data.
- Components accept normalized props, not raw JSON fixtures.
- React Query owns server/cache state; `AppContext` owns small cross-route client state such as selected entities, theme, and transient preferences.
- Do not add a second global state library until a concrete state ownership problem cannot be solved by existing boundaries.

## Current risks

`AppContext` has grown to include navigation, theme, favorites, selection, search, and preferences. This is acceptable for the current app but should split into focused feature providers or persisted user preferences when authentication arrives. `CampusMap.tsx` is a high-complexity route and should be decomposed by interaction boundary before adding more layers.

## Data lifecycle

`Page ? provider hook ? provider ? API or static fallback ? normalized entity ? UI projection`

## Implementation standards

- Use TypeScript domain/provider interfaces; replace `any` at external boundaries with validated `unknown` mappings.
- Memoize expensive map filtering and geometry transformations, not trivial values.
- Lazy-load heavy routes/layers when bundle measurement proves a benefit.
- Use semantic elements before ARIA. Add ARIA only to express missing semantics.
- Keep UI text and status phrasing reusable and truthful about data provenance.
