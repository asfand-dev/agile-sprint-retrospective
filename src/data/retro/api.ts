
import { supabase } from '@/integrations/supabase/client';
import { ActionItemWithParticipant, RetroItemWithParticipant } from './types';

export const fetchRetroData = async (retroId: string) => {
  const { data, error } = await supabase.from('retros').select('*').eq('id', retroId).single();
  if (error) throw new Error(error.message);
  return data;
};

export const fetchRetroItems = async (retroId: string) => {
  const { data, error } = await supabase
    .from('retro_items')
    .select('*, session_participants(name)')
    .eq('retro_id', retroId)
    .order('votes', { ascending: false })
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data as RetroItemWithParticipant[];
};

export const fetchActionItems = async (retroId: string) => {
    const { data, error } = await supabase
      .from('action_items')
      .select('*, session_participants(name)')
      .eq('retro_id', retroId)
      .order('votes', { ascending: false })
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data as ActionItemWithParticipant[];
  };

export const fetchSessionPassword = async (workspaceId: string) => {
    if (!workspaceId) return null;
    const { data, error } = await supabase.from('sessions').select('password').eq('id', workspaceId).single();
    if (error) {
        console.warn("Couldn't fetch session password:", error.message);
        return null;
    }
    return data;
};
