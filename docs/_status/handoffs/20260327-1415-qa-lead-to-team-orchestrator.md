# Context
- Task: produce a risk-based QA review for site and app flows focused on investor demo failure risk.
- Why: establish release confidence, priority testing, and go/no-go conditions for a high-visibility demonstration.

# Decisions
- Prioritized transaction integrity and end-to-end workflow continuity as P0 because investor trust is most sensitive to payment/data inconsistency.
- Set conditional-go recommendation instead of unconditional go because critical payment/webhook controls are not yet proven.
- Defined release gates around demonstrable evidence (P0 runs, idempotency checks) rather than only static build success.

# Deliverables
- `docs/qa/test-strategy.md`
- `docs/qa/reports/20260327-investor-demo-risk-review.md`
- `docs/qa/checklists/investor-demo-critical-path.md`

# Open Questions
- Who is accountable for implementing webhook idempotency and verification before demo date?
- Which fallback path is approved if Stripe or DB degrades during live demo?
- Is demo success measured by live transaction completion or narrative walkthrough of a seeded completed submission?

# Suggested Next Steps
- Team Orchestrator: assign owners and due dates for P0 mitigations (webhook hardening, nested form fix, lint error cleanup).
- Project Manager: schedule one full dry run with checklist sign-off and artifact capture.
- Engineering: execute fixes, then hand back for QA re-validation against P0 matrix and release gates.
