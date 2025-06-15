
-- Enable Row Level Security on tables
ALTER TABLE public.retro_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;

-- Create permissive policies to allow operations. This is required for realtime to work.
-- Note: For a production app, you should implement stricter policies with user authentication.
CREATE POLICY "Enable all access for retro_items" ON public.retro_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for action_items" ON public.action_items FOR ALL USING (true) WITH CHECK (true);

-- Add tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.retro_items, public.action_items;
