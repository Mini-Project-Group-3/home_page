
-- Create table for scheme applications
CREATE TABLE public.scheme_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheme_name TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  village TEXT,
  land_area_acres NUMERIC,
  aadhaar_last_four TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scheme_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form, no auth required)
CREATE POLICY "Anyone can submit a scheme application"
  ON public.scheme_applications
  FOR INSERT
  WITH CHECK (true);

-- No one can read/update/delete from client side
