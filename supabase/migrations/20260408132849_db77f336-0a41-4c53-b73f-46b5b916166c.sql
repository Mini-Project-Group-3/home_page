CREATE POLICY "Anyone can view scheme applications"
ON public.scheme_applications
FOR SELECT
USING (true);