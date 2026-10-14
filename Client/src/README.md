# Client source architecture

The client follows a feature-driven structure:

- `app/` initializes the application, global providers, and declarative router.
- `pages/` composes feature views for individual routes.
- `features/` contains business-specific UI, hooks, types, schemas, and state. A feature may depend on `shared/`, but not on another feature's internals.
- `shared/` contains business-independent API infrastructure, UI primitives, layouts, utilities, and mock infrastructure.

Feature code is organized by responsibility, for example:

```text
features/
  auth/{components,hooks,schemas,store,types}
  tasks/{components,hooks,types}
  calendar/components
  family/components
  goals/components
```

Keep route definitions in `app/router.tsx`, keep page components focused on composing features, and expose only reusable, domain-independent primitives from `shared/ui`.
