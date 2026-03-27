# Investor Demo Risk-Based QA Review

Date: 2026-03-27  
Author: QA Lead

## Context
- This review is based on current code and route behavior across public site and app workflows.
- `docs/_status/project-brief.md` was not present, so scope was inferred from source, README, and runnable build/lint signals.

## Executive Assessment
- **Current readiness:** Conditional go for investor demo, pending mitigation of payment and flow-integrity risks.
- **Primary demo risks:** Stripe webhook non-idempotency, draft-to-payment state brittleness, and a submission edit UI structure issue that can break payment action reliability.
- **Quality signal snapshot:** `npm run build` passed; `npm run lint` failed with 2 errors and 5 warnings.

## High-Risk Scenarios (Investor-Demo Impact)
1. **Duplicate Stripe webhook events create duplicate payment records**
   - Webhook handler inserts `payments` row on every `checkout.session.completed` without idempotency guard.
   - Demo impact: inconsistent payment ledger, confusing admin state, confidence loss in transaction integrity.

2. **Webhook trust model can update wrong submission state**
   - Webhook relies on `session.metadata.submissionId` without cross-checking checkout session ID ownership or expected amount/currency.
   - Demo impact: a malformed or mismatched payload can mark submission `paid` incorrectly.

3. **Checkout abandonment leaves submission in `payment_pending`**
   - Submission state is updated to `payment_pending` before redirect to Stripe; no timeout/expiry reconciliation path shown.
   - Demo impact: stalled submissions requiring manual intervention during live narrative.

4. **Nested form structure in edit submission page**
   - `EditSubmissionPage` nests a Stripe payment `<form>` inside another `<form>`, which is invalid HTML and browser-dependent in behavior.
   - Demo impact: intermittent "Proceed to payment" failures or inconsistent submit target.

5. **Role and access confidence depends on runtime DB/profile availability**
   - Role checks are layout/server-action enforced, but multiple pages silently swallow DB failures and present empty states.
   - Demo impact: "No data" screens when DB connectivity degrades, which can appear as product incompleteness.

## Test Matrix Priorities
| Priority | Scenario | Flow | Type | Exit Condition |
|---|---|---|---|---|
| P0 | Referee happy path end-to-end | Signup/Login -> Create submission -> Add video -> Pay -> Report visible | E2E + manual witness | One clean run in staging, no manual DB edits |
| P0 | Payment webhook replay/idempotency | Replay same `checkout.session.completed` | API/integration | Single payment row, stable submission status |
| P0 | Admin assignment gate | Paid submission appears and can be assigned to valid coach only | Integration + UI | Invalid coach rejected, valid assignment updates status |
| P0 | Coach report completion | Assigned coach submits report; referee sees it | E2E + integration | Report persisted once, status `completed`, notification path works |
| P1 | Unauthorized route/action attempts | Referee hitting admin/coach actions and pages | Security/authorization tests | Redirect or rejection for all blocked paths |
| P1 | Payment interruption recovery | Cancel checkout, timeout, failed payment | Integration + exploratory | User sees recoverable next action; no stuck unrecoverable state |
| P1 | Third-party degradation | Resend unavailable, DB partial failures | Fault-injection/manual | Core flow degrades gracefully with explicit user feedback |
| P2 | Public site trust UX | Landing, pricing, contact, team/youth pages | Smoke/manual | No broken links, forms, or missing key content |
| P2 | Demo mode routes coherence | `/demo` flow consistency | Smoke/manual | Demo pages navigate and message clearly as mock data |

## Release Gates (Demo)
1. **Gate 1 - Build And Static Quality**
   - `npm run build` passes.
   - `npm run lint` has zero errors (warnings triaged).

2. **Gate 2 - Critical Path Proof**
   - P0 matrix items pass in a production-like environment with seeded role accounts.
   - Evidence captured: test run notes + screenshots or logs for each P0.

3. **Gate 3 - Transaction Integrity**
   - Webhook idempotency test passes.
   - Checkout cancellation/failure path leaves user with deterministic recovery.

4. **Gate 4 - Access Control Confidence**
   - Role-based page and server-action checks validated for all 3 roles.
   - No privilege escalation via direct action invocation.

5. **Gate 5 - Demo Reliability Runbook**
   - 30-minute dry run completed by presenter using demo script.
   - Backup plan prepared (pre-seeded demo account and fallback `/demo` route narrative).

## Pragmatic QA Improvement Plan

### 0-48 Hours (Must-Do Before Investor Demo)
- Add webhook idempotency guard keyed by `stripePaymentIntentId` or `stripeCheckoutSessionId`.
- Validate webhook payload against stored `submissions.stripeCheckoutSessionId` and expected amount/currency.
- Refactor submission edit UI to remove nested forms.
- Fix lint errors and create a short smoke checklist executed on each deploy.

### 3-7 Days (Stability)
- Add integration tests for server actions and state transitions (`draft -> payment_pending -> paid -> assigned -> completed`).
- Add E2E test for full referee->admin->coach->referee path using seeded fixtures.
- Introduce structured error telemetry for payment, webhook, and contact email failures.

### 1-2 Weeks (Confidence At Scale)
- Add periodic reconciliation job for stale `payment_pending` submissions.
- Add release dashboard metrics: conversion to paid, assignment lead time, report completion SLA.
- Extend security tests for role bypass attempts and direct route/action misuse.

## Open Questions
- Who owns Stripe webhook hardening implementation and sign-off timeline before demo?
- Should demo use live Stripe test mode or prerecorded/fallback `/demo` route in case of payment outage?
- What is the accepted fallback when DB is unavailable during presentation (read-only deck/demo mode)?

## Recommendation
- **Go with conditions:** proceed only if all P0 scenarios pass and webhook + nested form issues are addressed first.
- **No-go trigger:** unresolved payment integrity risk or failed end-to-end critical path rehearsal within 24 hours of demo.
