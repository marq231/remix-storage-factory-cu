-- Enable Row Level Security (RLS) on tables
-- This allows the service role to perform operations while protecting public access

-- Grant Eligibility Table RLS
ALTER TABLE grant_eligibility ENABLE ROW LEVEL SECURITY;

-- Allow service role (backend API) to insert and read
CREATE POLICY "Allow service role to insert eligibility" ON grant_eligibility
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Allow service role to read eligibility" ON grant_eligibility
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Allow admin to read and update eligibility" ON grant_eligibility
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant Applications Table RLS
ALTER TABLE grant_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role to insert grant applications" ON grant_applications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Allow service role to read grant applications" ON grant_applications
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Allow admin to read and update grant applications" ON grant_applications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Loan Applications Table RLS
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role to insert loan applications" ON loan_applications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Allow service role to read loan applications" ON loan_applications
  FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Allow admin to read and update loan applications" ON loan_applications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admin Users Table RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role on admin users" ON admin_users
  FOR ALL
  TO service_role
  WITH CHECK (true);
