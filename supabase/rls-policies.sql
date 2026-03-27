-- Row Level Security policies for Referee Academy
-- Run this in Supabase SQL Editor after applying Drizzle migrations

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE youth_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- profiles: users can read/update own profile; admins can read all
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- services, pricing: public read
CREATE POLICY "Anyone can read services" ON services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read pricing" ON pricing FOR SELECT TO authenticated USING (true);

-- submissions: referees own their submissions; coaches see assigned; admins see all
CREATE POLICY "Referees can read own submissions" ON submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Referees can insert own submissions" ON submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Referees can update own draft submissions" ON submissions
  FOR UPDATE USING (auth.uid() = user_id AND status = 'draft');

CREATE POLICY "Coaches can read assigned submissions" ON submissions
  FOR SELECT USING (auth.uid() = assigned_coach_id);

CREATE POLICY "Coaches can update assigned submissions (status, etc)" ON submissions
  FOR UPDATE USING (auth.uid() = assigned_coach_id);

-- reports: referee sees report for own submission; coach sees own reports; admin sees all
CREATE POLICY "Referees can read reports for own submissions" ON reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM submissions WHERE submissions.id = reports.submission_id AND submissions.user_id = auth.uid())
  );

CREATE POLICY "Coaches can read own reports" ON reports
  FOR SELECT USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can insert reports for assigned submissions" ON reports
  FOR INSERT WITH CHECK (
    auth.uid() = coach_id AND
    EXISTS (SELECT 1 FROM submissions WHERE submissions.id = reports.submission_id AND submissions.assigned_coach_id = auth.uid())
  );

CREATE POLICY "Coaches can update own reports" ON reports
  FOR UPDATE USING (auth.uid() = coach_id);

-- payments: users see own payments; admins need a policy (handled via service role in app for admin)
CREATE POLICY "Users can read own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- contact_messages: only insert from app (no auth required for form); admin read via service role
CREATE POLICY "Allow insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- youth_initiatives, team_members: public read for published/visible
CREATE POLICY "Anyone can read published youth initiatives" ON youth_initiatives
  FOR SELECT USING (published = true);

CREATE POLICY "Anyone can read visible team members" ON team_members
  FOR SELECT USING (visible = true);

-- Note: Admin full access is best done via service_role key in server-side admin routes (bypasses RLS).
-- Alternatively add policies that check custom claim role = 'admin' from JWT.
