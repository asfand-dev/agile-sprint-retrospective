
-- Drop the existing foreign key constraints to redefine them
ALTER TABLE public.retro_items DROP CONSTRAINT IF EXISTS retro_items_retro_id_fkey;
ALTER TABLE public.action_items DROP CONSTRAINT IF EXISTS action_items_retro_id_fkey;

-- Add the foreign key constraints back with ON DELETE CASCADE
ALTER TABLE public.retro_items
ADD CONSTRAINT retro_items_retro_id_fkey
FOREIGN KEY (retro_id)
REFERENCES public.retros(id)
ON DELETE CASCADE;

ALTER TABLE public.action_items
ADD CONSTRAINT action_items_retro_id_fkey
FOREIGN KEY (retro_id)
REFERENCES public.retros(id)
ON DELETE CASCADE;
