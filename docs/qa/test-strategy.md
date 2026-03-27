# QA Test Strategy

## Scope
- Product scope: public marketing pages, authenticated referee app flows, coach review workflow, admin assignment workflow, Stripe payment and webhook processing, and contact form delivery.
- Release scope: investor demo readiness with emphasis on "happy path + credible failure handling" instead of exhaustive edge-case coverage.

## Risk Model
- **Critical risk:** failures that block end-to-end demo (signup/login, submission, payment, assignment, report visibility).
- **High risk:** failures that create data inconsistency, unauthorized access, or payment ambiguity.
- **Medium risk:** degraded UX, stale states, poor recoverability, or weak observability.
- **Low risk:** cosmetic defects that do not affect demo credibility.

## Test Types And Ownership
- **Smoke (manual, per deploy):** core route availability, auth redirects, role dashboard entry.
- **Critical path E2E (automation + manual fallback):** referee -> pay -> admin assign -> coach submit report -> referee view report.
- **Server action/API integration tests:** auth actions, submission actions, admin assign, coach report submit, webhook idempotency.
- **Role/authorization tests:** protected route access and server-action enforcement by role.
- **Payment reliability tests:** checkout session lifecycle, webhook replay, missing metadata, out-of-order events.
- **Operational checks:** required env vars, database connectivity, third-party service availability.

## Investor Demo Test Pyramid
- 65%: deterministic integration and server-action tests around business logic and state transitions.
- 25%: E2E critical path coverage (1-2 browser scenarios per role).
- 10%: exploratory/manual checks for visual and narrative continuity.

## Exit Criteria For Demo Build
- No open P0/P1 defects in critical path flows.
- 100% pass on demo smoke checklist.
- Payment webhook idempotency and duplicate-event handling verified.
- At least one successful end-to-end run in a production-like environment with seeded accounts.
- Rollback/fallback script documented and rehearsed once.
