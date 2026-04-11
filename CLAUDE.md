# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test              # Run all tests (Vitest)
npm run test -- --run # Run tests once (no watch)
npm run lint          # ESLint on ./src
npm run build         # tsup build (ESM + CJS output)
npm run dev           # tsup watch mode
```

To run a single test file:
```bash
npx vitest run test/application/create-feature-flag.service.test.ts
```

## Architecture

Hexagonal Architecture with DDD. Three strict layers:

```
Domain → Application → Infrastructure
```

**Domain** (`src/domain/`):
- `feature-flag.entity.ts` — core entity with `activate()` / `deactivate()` methods; `key` is readonly
- `feature-flag-repository.entity.ts` — the `FeatureFlagRepository` interface that all storage adapters must implement

**Application** (`src/application/`):
- `manager.service.ts` — singleton coordinator; initialized once with a `FeatureFlagRepository` via `getInstance(repository)`, then used via `getInstance()` thereafter
- One service file per use case (create, activate, deactivate, delete, get, getAll, getAllActive, getAllInactive)

**Infrastructure** (`src/infrastructure/repositories/`):
- `redis.repository.ts` — primary; uses ioredis, Redis hashes (`feature_flag:{key}`), pub/sub cache invalidation on channel `fflags_updates`, paginated SCAN for getAll
- `postgres.repository.ts` — uses `pg` Pool; `INSERT ... ON CONFLICT ... DO UPDATE`
- `mysql.repository.ts` — uses `mysql2/promise`; `INSERT ... ON DUPLICATE KEY UPDATE`; booleans stored as tinyint(1)

**Testing**: `test/infrastructure/repositories/inmemory.repository.ts` implements `FeatureFlagRepository` for unit tests — all service tests use this in-memory adapter. No real database or Redis needed for tests.

## Key Conventions

- Path aliases: `domain/*`, `application/*`, `infrastructure/*` map to `src/` subdirectories (defined in both `tsconfig.json` and `vitest.config.ts`)
- `schema.sql` at root defines the shared DB schema for PostgreSQL and MySQL
- Entry point for the published package is `src/index.ts`; bundled to `dist/` as ESM + CJS
- Vitest globals are enabled — no need to import `describe`, `it`, `expect`
