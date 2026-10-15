# @familyflow/contracts

Shared TypeScript types for the public API, used by the Client and Server npm
workspaces. Import API request/response types from `@familyflow/contracts`
instead of defining another copy in an application.

```ts
import type { CreateListRequest, ListModel } from '@familyflow/contracts';
```

These are wire/API contracts. Prisma remains the source of truth for database
models, and Server Zod schemas remain responsible for runtime validation.
Update the shared types when the public API changes, and keep the corresponding
server validation and OpenAPI documentation aligned.
