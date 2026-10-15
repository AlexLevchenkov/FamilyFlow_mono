---
name: 'Client Feature Architecture'
description: 'Use when adding or changing features, pages, shared UI, or imports in the Client React application. Covers feature boundaries, folder structure, barrel exports, and aliases.'
applyTo: 'Client/src/**'
---

# Client Feature Architecture

These rules apply only to `Client/src`. Keep the client organized into `app/`, `pages/`, `features/`, and `shared/`.

## Creating a feature

- Put business-specific code in `features/<feature-name>/`. Use a concise, domain-based, lowercase name such as `tasks`, `calendar`, or `family`.
- Organize a feature by responsibility. Add only the folders it needs, such as `components/`, `hooks/`, `types/`, `schemas/`, or `store/`; do not create empty or speculative layers.
- Keep feature UI, state, hooks, schemas, and domain types with the feature that owns them. Keep `shared/` independent of business-specific features.
- A feature may depend on `shared/`. Do not reach into another feature's internal files; expose a deliberate public API from that feature's `index.ts` and compose features at the page or app level when needed.
- Keep route declarations and app-wide providers in `app/`. Pages should stay thin: compose feature views and route-level concerns rather than reimplementing feature logic.
- Reuse existing modules before adding new ones. Use `shared/api` for common HTTP infrastructure and existing API contracts; do not duplicate API clients or contracts in a feature.

## Barrel files and imports

- Use the existing aliases from `vite.config.ts` and `tsconfig.app.json`. Keep both alias configurations in sync when adding or changing an alias.
- Prefer the shortest public import: the alias root, or the alias plus one directory layer when that layer has an `index.ts`. Examples: `@features/tasks`, `@features/tasks/hooks`, `@ui`, and `@ui/atoms`.
- Do not import a feature's individual implementation file from outside that feature, for example `@features/tasks/components/TaskListPanel`. Re-export supported public members through the feature root and responsibility-level `index.ts` files instead.
- When adding a module intended for use outside its directory, export it from that directory's `index.ts`, then from the feature root `index.ts` if it is part of the feature's public API. Use the same pattern for shared UI layers that are imported through `@ui/<layer>`.
- Keep barrel exports intentional: expose supported components, hooks, types, and other public contracts; do not use barrels to make private implementation details public or create circular dependencies.
- Inside a responsibility layer, use direct relative imports for tightly related implementation details when they are not part of that layer's public API.

## Validation

- After adding a feature or changing its public exports, run `npm --prefix Client run build` and `npm --prefix Client run lint`.
- Check that imports resolve using the intended alias and barrel, and update consumers when a public export changes.
