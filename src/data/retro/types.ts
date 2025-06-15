
import { Tables, Enums } from '@/integrations/supabase/types';

export type RetroItemWithParticipant = Tables<'retro_items'> & {
  session_participants: { name: string } | null;
};

export type ActionItemWithParticipant = Tables<'action_items'> & {
  session_participants: { name: string } | null;
};

export type RetroColumnType = Enums<'retro_column_type'>;
