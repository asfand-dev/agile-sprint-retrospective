
import { useQuery } from '@tanstack/react-query';
import { fetchRetroData, fetchRetroItems, fetchActionItems, fetchSessionPassword } from '@/data/retro/api';

export const useRetroData = (retroId: string | undefined, workspaceId: string | undefined) => {
    const { data: retro, isLoading: isLoadingRetro, error: retroError } = useQuery({
        queryKey: ['retro', retroId],
        queryFn: () => fetchRetroData(retroId!),
        enabled: !!retroId,
    });

    const { data: retroItems, isLoading: isLoadingRetroItems } = useQuery({
        queryKey: ['retroItems', retroId],
        queryFn: () => fetchRetroItems(retroId!),
        enabled: !!retroId,
    });
    
    const { data: actionItems, isLoading: isLoadingActionItems } = useQuery({
        queryKey: ['actionItems', retroId],
        queryFn: () => fetchActionItems(retroId!),
        enabled: !!retroId,
    });

    const { data: sessionData } = useQuery({
        queryKey: ['session_password', workspaceId],
        queryFn: () => fetchSessionPassword(workspaceId!),
        enabled: !!workspaceId,
    });

    const isLoading = isLoadingRetro || isLoadingRetroItems || isLoadingActionItems;

    return {
        retro,
        retroError,
        retroItems,
        actionItems,
        sessionData,
        isLoading,
    };
};
