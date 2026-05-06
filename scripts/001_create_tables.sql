-- Military Portal Database Schema
-- Creates tables for leave requests, approval payments, flight payments, and care packages

-- Leave Requests Table
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('emergency', 'vacation', 'medical')),
  soldier_name TEXT NOT NULL,
  soldier_rank TEXT NOT NULL,
  soldier_id TEXT NOT NULL,
  relationship_to_soldier TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_status TEXT NOT NULL DEFAULT 'not_required' CHECK (payment_status IN ('not_required', 'pending', 'completed')),
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approval Payments Table (payment made after leave is approved, before flight booking)
CREATE TABLE IF NOT EXISTS public.approval_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leave_request_id UUID NOT NULL REFERENCES public.leave_requests(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 10000.00,
  platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 10500.00,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'bank_transfer')),
  billing_address TEXT,
  billing_city TEXT,
  billing_zip TEXT,
  billing_country TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flight Payments Table
CREATE TABLE IF NOT EXISTS public.flight_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leave_request_id UUID NOT NULL REFERENCES public.leave_requests(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  flight_amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'bank_transfer')),
  departure_location TEXT,
  arrival_location TEXT,
  departure_date DATE,
  billing_address TEXT,
  billing_city TEXT,
  billing_zip TEXT,
  billing_country TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Care Packages Table
CREATE TABLE IF NOT EXISTS public.care_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  recipient_name TEXT NOT NULL,
  recipient_rank TEXT NOT NULL,
  recipient_unit TEXT NOT NULL,
  recipient_base TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  message TEXT,
  estimated_weight DECIMAL(5, 2),
  shipping_cost DECIMAL(10, 2),
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'shipped', 'delivered')),
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flight_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_packages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leave_requests (allow all operations for authenticated users)
CREATE POLICY "Allow all operations on leave_requests" ON public.leave_requests
  FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for approval_payments
CREATE POLICY "Allow all operations on approval_payments" ON public.approval_payments
  FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for flight_payments
CREATE POLICY "Allow all operations on flight_payments" ON public.flight_payments
  FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for care_packages
CREATE POLICY "Allow all operations on care_packages" ON public.care_packages
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_type ON public.leave_requests(type);
CREATE INDEX IF NOT EXISTS idx_leave_requests_applicant_email ON public.leave_requests(applicant_email);
CREATE INDEX IF NOT EXISTS idx_approval_payments_leave_request ON public.approval_payments(leave_request_id);
CREATE INDEX IF NOT EXISTS idx_flight_payments_leave_request ON public.flight_payments(leave_request_id);
CREATE INDEX IF NOT EXISTS idx_care_packages_sender_email ON public.care_packages(sender_email);
