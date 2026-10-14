---
name: "Client Feature Boundaries"
description: "Use when adding or changing Client features, feature state, page composition, or shared modules. Defines feature ownership and cross-feature collaboration boundaries in Client/src."
applyTo: "Client/src/**"
---

# Client Feature Boundaries

- A business capability owns its UI, domain state, hooks, schemas, and feature-specific types under `Client/src/features/<feature>/`. Keep implementation details inside that feature unless they are intentionally part of its public API.
- Place a module in `shared/` only when it is reusable without depending on a business feature. Shared code must not import from `features/`; move domain-specific behavior back to its owning feature instead.
- A feature may use shared UI, API infrastructure, contracts, and utilities. Avoid coupling one feature to another feature's internal components, hooks, store, or types.
- Expose cross-feature functionality deliberately through the feature's root `index.ts` and responsibility-level `index.ts` files. Consumers should import through the feature's public alias, such as `@features/tasks`; use an alias plus one directory level only when that layer's `index.ts` provides the public API.
- When a screen needs multiple capabilities, compose them in a page or an app-level route/layout component. Do not make one feature depend on another merely to combine their views.
- Keep route definitions and application-wide provider composition in `app/`. Put reusable route-screen composition in `pages/`; keep business behavior in feature modules rather than growing page components into feature implementations.
- Keep state with the capability that owns and changes it. Lift state to a page or app-level provider only when multiple features genuinely coordinate that state; pass the smallest explicit interface needed.
- Prefer shared API contracts for wire data and feature types for UI/domain-specific state. Do not duplicate API request/response shapes as feature-owned contracts.
- Before extracting code into `shared/` or exposing a new feature export, check whether the code is truly domain-independent and whether the public API creates a dependency cycle.
