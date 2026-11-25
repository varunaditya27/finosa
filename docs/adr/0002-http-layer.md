<div align="center">

# 0002. HTTP layer

Status: accepted

</div>

## Context

The request path (routing, body reading, error handling, shutdown) is part of what this project teaches. A framework hides it.

## Decision

Use Node's built-in `node:http` module, with Zod to check incoming JSON at runtime. NestJS and similar frameworks are not used. Small libraries are allowed. Node 26 is the target. If a needed library or tool fails on it, fall back to Node 24. TypeScript runs through `tsx`, tests run on Vitest, and `tsc --noEmit` checks types.

## Consequences

- Routing, parsing and error mapping are written by hand and stay visible.
- More code to write and test than with a framework.
- `app.ts` builds the application and `server.ts` only opens the port, so tests never need a network port.
