-- Seed data: run after migrations
-- Services
INSERT INTO services (id, slug, name, description) VALUES
  (gen_random_uuid(), 'performance_review', 'Performance Review', 'Professional analysis of your match footage with feedback and performance statistics.'),
  (gen_random_uuid(), 'coaching', 'Coaching', 'Self-review first, then a professional coach reviews your match and your self-review. Includes discussion and insights.')
ON CONFLICT (slug) DO NOTHING;

-- Default pricing (single region for MVP - extend with more regions later)
INSERT INTO pricing (service_id, region, currency, amount_cents, active)
SELECT id, 'default', 'EUR', 9900, true FROM services WHERE slug = 'performance_review'
AND NOT EXISTS (SELECT 1 FROM pricing p JOIN services s ON p.service_id = s.id WHERE s.slug = 'performance_review' AND p.region = 'default');

INSERT INTO pricing (service_id, region, currency, amount_cents, active)
SELECT id, 'default', 'EUR', 14900, true FROM services WHERE slug = 'coaching'
AND NOT EXISTS (SELECT 1 FROM pricing p JOIN services s ON p.service_id = s.id WHERE s.slug = 'coaching' AND p.region = 'default');
