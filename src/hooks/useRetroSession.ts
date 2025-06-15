
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSessionStore } from '@/lib/store';
import { toast } from '@/components/ui/use-toast';

export const useRetroSession = (workspaceId: string | undefined) => {
    const { participantId, sessionId, setParticipant } = useSessionStore();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showJoinPrompt, setShowJoinPrompt] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        if (!workspaceId) {
            setIsVerifying(false);
            return;
        }

        const password = searchParams.get('password');

        if (participantId && sessionId === workspaceId) {
            setIsVerifying(false);
            return;
        }

        if (password) {
            const verifyPassword = async () => {
                const { data, error } = await supabase
                    .from('sessions')
                    .select('id')
                    .eq('id', workspaceId)
                    .eq('password', password)
                    .single();

                if (data && !error) {
                    setShowJoinPrompt(true);
                } else {
                    toast({ title: 'Invalid Link', description: 'The sharing link is invalid or has expired.', variant: 'destructive' });
                    navigate('/');
                }
                setIsVerifying(false);
            };
            verifyPassword();
        } else if (!participantId || sessionId !== workspaceId) {
            toast({ title: 'Access Denied', description: 'You need to join the workspace first.', variant: 'destructive' });
            navigate(`/`);
        } else {
            setIsVerifying(false);
        }

    }, [workspaceId, participantId, sessionId, searchParams, navigate]);

    const handleJoin = (newParticipantId: string) => {
        if (!workspaceId) return;
        setParticipant(newParticipantId, workspaceId);
        searchParams.delete('password');
        setSearchParams(searchParams, { replace: true });
        setShowJoinPrompt(false);
    };
    
    return { isVerifying, showJoinPrompt, handleJoin };
};
