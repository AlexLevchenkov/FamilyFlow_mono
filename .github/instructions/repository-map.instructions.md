---
name: "FamilyFlow Repository Map"
description: "Use when navigating or changing the FamilyFlow monorepo. Summarizes the Client, Server, shared API contracts, package boundaries, and validation commands."
applyTo:
  - "Client/src/**"
  - "Server/src/**"
  - "Server/prisma/**"
  - "packages/contracts/**"
---

# FamilyFlow Repository Map

This repository is an npm-workspaces monorepo. The root `package.json` defines `Client`, `Server`, and `packages/*` as workspaces. Check the nearest package manifest for scripts and dependencies; do not assume a root build or test command exists.

## Main workspaces

- `Client/` is the React, TypeScript, and Vite web client. Its source is organized into `src/app/`, `src/pages/`, `src/features/`, and `src/shared/`. Client-specific structure, feature boundaries, and import conventions are documented in [client-feature-architecture.instructions.md](./client-feature-architecture.instructions.md) and [client-feature-boundaries.instructions.md](./client-feature-boundaries.instructions.md).
- `Server/` is the Express and TypeScript API. Its `src/` is divided into routes, middleware, controllers, services, config, utils, and types. Prisma schema fragments are in `Server/src/models/`; the assembled schema and migrations are under `Server/prisma/`.
- `packages/contracts/` contains shared TypeScript API request and response contracts consumed by both applications through `@familyflow/contracts`. These are public wire contracts, not runtime validators or database models. When changing an API contract, keep the Client usage, Server runtime validation, and OpenAPI documentation aligned. Prisma remains the database model source of truth; Server Zod schemas handle runtime validation.

## Typical validation

- Client: `npm --prefix Client run build` and `npm --prefix Client run lint`.
- Server: `npm --prefix Server run build` and `npm --prefix Server test`. Database-backed work may need the repository's configured test database and Prisma setup; inspect the Server scripts and environment requirements before running migration or reset commands.
- Contracts: validate through the affected Client and Server workspaces. Do not add a root-level validation command unless the repository adopts one.

For a cross-workspace API change, inspect the relevant implementation, validation, and contract consumers before editing. Prefer the narrowest relevant checks, then run checks for every affected workspace.
