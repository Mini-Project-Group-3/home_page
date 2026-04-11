
-- Create marketplace listings table
CREATE TABLE public.marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  farmer_name text NOT NULL,
  phone text NOT NULL,
  farmer_id text,
  language text DEFAULT 'en',
  location_source text DEFAULT 'manual',
  lat numeric,
  lng numeric,
  state text,
  district text,
  village text,
  pincode text,
  nearest_mandi text,
  status text NOT NULL DEFAULT 'pending',
  govt_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create marketplace crops table
CREATE TABLE public.marketplace_crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  crop_id text,
  name text NOT NULL,
  variety text,
  season text,
  harvest_date date,
  quantity_qtl numeric,
  grade text DEFAULT 'B',
  moisture_pct numeric,
  is_organic boolean DEFAULT false,
  storage_type text,
  price_per_qtl numeric,
  negotiable boolean DEFAULT true,
  images jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_crops ENABLE ROW LEVEL SECURITY;

-- Policies for marketplace_listings
CREATE POLICY "Anyone can view marketplace listings"
  ON public.marketplace_listings FOR SELECT USING (true);

CREATE POLICY "Anyone can submit marketplace listings"
  ON public.marketplace_listings FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update marketplace listings"
  ON public.marketplace_listings FOR UPDATE USING (true);

-- Policies for marketplace_crops
CREATE POLICY "Anyone can view marketplace crops"
  ON public.marketplace_crops FOR SELECT USING (true);

CREATE POLICY "Anyone can submit marketplace crops"
  ON public.marketplace_crops FOR INSERT WITH CHECK (true);

-- Index for faster filtering
CREATE INDEX idx_marketplace_listings_status ON public.marketplace_listings(status);
CREATE INDEX idx_marketplace_crops_listing_id ON public.marketplace_crops(listing_id);
CREATE INDEX idx_marketplace_crops_name ON public.marketplace_crops(name);
