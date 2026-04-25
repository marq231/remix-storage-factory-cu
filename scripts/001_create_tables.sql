-- NextFund US Database Schema
-- Tables for grant eligibility, grant applications, and loan applications

-- Grant Eligibility Applications Table
CREATE TABLE IF NOT EXISTS grant_eligibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_code VARCHAR(8) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  ssn VARCHAR(11) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant Applications Table
CREATE TABLE IF NOT EXISTS grant_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_code VARCHAR(8) NOT NULL REFERENCES grant_eligibility(application_code),
  full_name VARCHAR(255) NOT NULL,
  home_address TEXT NOT NULL,
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  is_immigrant BOOLEAN NOT NULL,
  marital_status VARCHAR(50) NOT NULL,
  annual_income DECIMAL(15, 2) NOT NULL,
  reason_for_grant TEXT NOT NULL,
  id_type VARCHAR(50) NOT NULL,
  id_document_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loan Applications Table
CREATE TABLE IF NOT EXISTS loan_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_tier VARCHAR(50) NOT NULL,
  loan_amount DECIMAL(15, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  home_address TEXT NOT NULL,
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  is_immigrant BOOLEAN NOT NULL,
  marital_status VARCHAR(50) NOT NULL,
  annual_income DECIMAL(15, 2) NOT NULL,
  reason_for_loan TEXT NOT NULL,
  collateral TEXT NOT NULL,
  id_type VARCHAR(50) NOT NULL,
  id_document_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_grant_eligibility_status ON grant_eligibility(status);
CREATE INDEX IF NOT EXISTS idx_grant_eligibility_code ON grant_eligibility(application_code);
CREATE INDEX IF NOT EXISTS idx_grant_applications_status ON grant_applications(status);
CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON loan_applications(status);

-- Admin users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
