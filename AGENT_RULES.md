# Automated Agent Contribution Rules

This document defines rules and expectations for automated coding agents contributing to the MPL project.

## 1. Scope of Changes
- Prefer small, incremental pull requests.
- Avoid sweeping refactors unless an issue explicitly authorizes them.
- Never remove environment variable usage without replacing functionality.

## 2. Security & Secrets
- Never commit real secrets (.env, auth-config.ts, API keys).
- Only reference variables defined in `.env.example`.
- If a new secret is required, add a placeholder in `.env.example` and document in README.

## 3. Environment Variables
- All newly introduced env vars must be added to `.env.example` and documented.
- Fail fast with a clear error message if a required variable is missing.

## 4. Dependency Management
- Avoid adding dependencies unless necessary.
- Prefer existing stack: Express, Drizzle ORM, Vite, esbuild, React, Tailwind.
- For utilities (date, validation) prefer already installed libs. Do NOT add large utility libs for trivial helpers.

## 5. Coding Standards
- Use TypeScript strictness already configured.
- Keep functions small and focused.
- Use async/await over promise chains.
- Validate input using existing Zod schemas; add new schemas if needed.

## 6. Database & Migrations
- Use Drizzle schema in `shared/schema.ts` for structural changes.
- Generate migrations with drizzle-kit (if configured) and commit them.
- Do not run destructive migrations automatically in production code paths.

## 7. Error Handling & Logging
- Include context in error logs (operation + id parameters).
- Avoid logging sensitive data (passwords, tokens, emails).
- Surface user-safe messages in API responses; log technical details server-side.

## 8. API Design
- Prefix REST endpoints with `/api`.
- Use existing naming conventions for tournament stages (stage2, stage3, stage4, kingston, etc.).
- Validate all write operations with appropriate Zod schema.

## 9. Frontend Conventions
- Keep components colocated under `client/src`.
- Reuse design system components (shadcn/ui + Radix) instead of reinventing primitives.
- Prefer TanStack Query for server state; avoid ad-hoc global stores.

## 10. Performance Considerations
- Avoid N+1 DB queries inside loops; batch where possible.
- Cache static config responses if they are repeatedly requested.

## 11. Tests (If Introduced)
- Place future tests under `tests/` or co-located with `.test.ts` suffix.
- Mock external services (Discord, SendGrid) in tests.

## 12. Build & Deployment
- Backend bundled with esbuild; do not introduce alternative bundlers.
- Avoid dynamic require patterns that break ESM build.
- Keep start script functional: `npm run build && npm run start` should succeed with proper `.env`.

## 13. Bot PR Checklist
Every automated PR must include in description:
- Purpose
- Files changed summary
- New env vars? (Yes/No)
- Migration included? (Yes/No)
- Manual steps required

## 14. Prohibited Actions
- Committing generated `dist/` artifacts.
- Adding analytics / telemetry without approval.
- Changing license.

## 15. Suggested Future Enhancements (Safe for Bots)
- Add health + readiness endpoints.
- Add simple rate limiting middleware.
- Add basic integration tests for critical endpoints.

---
Follow these rules to maintain project quality and security.
