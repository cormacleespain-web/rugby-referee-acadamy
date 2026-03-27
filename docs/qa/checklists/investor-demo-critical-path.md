# Investor Demo Critical Path Checklist

## Preflight (T-60 min)
- [ ] Required env vars present (Supabase, Stripe, Resend, app URL)
- [ ] Database reachable and seeded with one user per role (`referee`, `coach`, `admin`)
- [ ] Stripe webhook endpoint active and signing secret verified
- [ ] Presenter account can sign in without MFA delays

## P0 Flow Validation
- [ ] Referee creates draft submission
- [ ] Referee adds valid video URL and proceeds to checkout
- [ ] Stripe test payment succeeds and submission becomes `paid`
- [ ] Admin sees paid submission and assigns valid coach
- [ ] Coach opens assigned submission and submits report
- [ ] Referee opens completed submission and sees report content

## Risk Controls
- [ ] Replay a webhook event and confirm no duplicate payment entry
- [ ] Attempt unauthorized admin action from non-admin account and confirm rejection
- [ ] Cancel checkout once and confirm user can retry successfully

## Demo Resilience
- [ ] Backup pre-completed submission exists for instant report showcase
- [ ] `/demo` route verified as narrative fallback
- [ ] "If payment fails" script available to presenter
