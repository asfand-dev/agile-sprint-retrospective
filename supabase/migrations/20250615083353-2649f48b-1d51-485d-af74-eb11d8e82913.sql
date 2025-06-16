
-- Drop existing foreign key constraints which have ON DELETE CASCADE
ALTER TABLE public.retro_items DROP CONSTRAINT "retro_items_participant_id_fkey";
ALTER TABLE public.action_items DROP CONSTRAINT "action_items_participant_id_fkey";

-- Make participant_id nullable to allow setting it to NULL on deletion
ALTER TABLE public.retro_items ALTER COLUMN participant_id DROP NOT NULL;
ALTER TABLE public.action_items ALTER COLUMN participant_id DROP NOT NULL;

-- Add new foreign key constraints with ON DELETE SET NULLAdd commentMore actions
ALTER TABLE public.retro_items
  ADD CONSTRAINT "retro_items_participant_id_fkey"
  FOREIGN KEY (participant_id) REFERENCES public.session_participants(id) ON DELETE SET NULL;

ALTER TABLE public.action_items
  ADD CONSTRAINT "action_items_participant_id_fkey"
  FOREIGN KEY (participant_id) REFERENCES public.session_participants(id) ON DELETE SET NULL;