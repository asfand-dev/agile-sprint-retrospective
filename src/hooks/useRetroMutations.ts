
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { RetroColumnType } from '@/data/retro/types';

export const useRetroMutations = (retroId: string | undefined, participantId: string | null) => {
    const queryClient = useQueryClient();

    const mutationOptions = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['retroItems', retroId] });
            queryClient.invalidateQueries({ queryKey: ['actionItems', retroId] });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        },
    };

    const addRetroItemMutation = useMutation({
        mutationFn: async ({ description, columnType }: { description: string; columnType: RetroColumnType }) => {
            if (!retroId || !participantId) throw new Error('Missing retro or participant ID');
            return supabase.from('retro_items').insert({ description, column_type: columnType, retro_id: retroId, participant_id: participantId });
        },
        ...mutationOptions,
    });

    const addActionItemMutation = useMutation({
        mutationFn: async (description: string) => {
            if (!retroId || !participantId) throw new Error('Missing retro or participant ID');
            return supabase.from('action_items').insert({ description, retro_id: retroId, participant_id: participantId });
        },
        ...mutationOptions
    });
    
    const updateItemMutation = useMutation({
        mutationFn: async ({ table, itemId, description }: { table: 'retro_items' | 'action_items', itemId: string, description: string }) => {
            return supabase.from(table).update({ description }).eq('id', itemId);
        },
        ...mutationOptions,
    });

    const deleteItemMutation = useMutation({
        mutationFn: async ({ table, itemId }: { table: 'retro_items' | 'action_items', itemId: string }) => {
            return supabase.from(table).delete().eq('id', itemId);
        },
        ...mutationOptions,
    });

    const voteMutation = useMutation({
        mutationFn: async ({ table, itemId, newVoteCount }: { table: 'retro_items' | 'action_items', itemId: string, newVoteCount: number }) => {
            return supabase.from(table).update({ votes: newVoteCount }).eq('id', itemId);
        },
        ...mutationOptions,
    });

    return {
        addRetroItem: addRetroItemMutation.mutate,
        addActionItem: addActionItemMutation.mutate,
        updateItem: updateItemMutation.mutate,
        deleteItem: deleteItemMutation.mutate,
        vote: voteMutation.mutate,
    };
};
