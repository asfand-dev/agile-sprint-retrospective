
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRetroRealtime = (retroId: string | undefined) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!retroId) return;
        const channel = supabase.channel(`retro-${retroId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'retro_items', filter: `retro_id=eq.${retroId}` }, (payload) => {
                console.log('Real-time: retro_items change received!', payload);
                queryClient.invalidateQueries({ queryKey: ['retroItems', retroId] });
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'action_items', filter: `retro_id=eq.${retroId}` }, (payload) => {
                console.log('Real-time: action_items change received!', payload);
                queryClient.invalidateQueries({ queryKey: ['actionItems', retroId] });
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Real-time channel subscribed!');
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [retroId, queryClient]);
};
