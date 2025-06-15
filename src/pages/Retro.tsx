
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSessionStore } from '@/lib/store';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

import { RetroColumnType } from '@/data/retro/types';
import { useRetroData } from '@/hooks/useRetroData';
import { useRetroSession } from '@/hooks/useRetroSession';
import { useRetroRealtime } from '@/hooks/useRetroRealtime';
import { useRetroMutations } from '@/hooks/useRetroMutations';

import RetroHeader from '@/components/RetroHeader';
import RetroColumn from '@/components/RetroColumn';
import ActionItemsSection from '@/components/ActionItemsSection';
import JoinRetroPrompt from '@/components/JoinRetroPrompt';

const RetroPage = () => {
    const { workspaceId, retroId } = useParams<{ workspaceId: string; retroId: string }>();
    const { participantId, setParticipant } = useSessionStore();

    const { isVerifying, showJoinPrompt, handleJoin } = useRetroSession(workspaceId);
    const { retro, retroError, retroItems, actionItems, sessionData, isLoading } = useRetroData(retroId, workspaceId);
    const { addRetroItem, addActionItem, updateItem, deleteItem, vote } = useRetroMutations(retroId, participantId);
    useRetroRealtime(retroId);

    const columns: { title: string; type: RetroColumnType; colorClass: string; }[] = [
        { title: 'What went well?', type: 'well', colorClass: 'border-green-500/40' },
        { title: 'What could be improved?', type: 'improve', colorClass: 'border-red-500/40' },
        { title: 'What should we start doing?', type: 'start', colorClass: 'border-yellow-500/40' },
    ];

    const filteredItems = useMemo(() => {
        return columns.map(col => ({
            ...col,
            items: retroItems?.filter(item => item.column_type === col.type) || [],
        }));
    }, [retroItems]);

    const handleExport = () => {
        if (!retro || !retroItems || !actionItems) {
            toast({ title: 'Error', description: 'Data not loaded yet.', variant: 'destructive' });
            return;
        }

        const simplifiedRetroItems = retroItems.map(item => ({
            description: item.description,
            votes: item.votes,
            column_type: item.column_type
        }));
        const simplifiedActionItems = actionItems.map(item => ({
            description: item.description,
            votes: item.votes
        }));

        const exportData = {
            name: retro.name,
            date: retro.retro_date,
            retroItems: simplifiedRetroItems,
            actionItems: simplifiedActionItems,
        };

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(exportData, null, 2)
        )}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = `${retro.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        toast({ title: 'Success', description: 'Retro exported successfully.' });
    };

    const handleGenerateSummary = () => {
        if (!retro || !retroItems || !actionItems) {
            toast({ title: 'Error', description: 'Data not loaded yet.', variant: 'destructive' });
            return;
        }

        let markdown = `# Retrospective Summary: ${retro.name}\n\n`;
        markdown += `**Date:** ${format(new Date(retro.retro_date), 'PPP')}\n\n`;

        markdown += "## What went well?\n";
        retroItems.filter(item => item.column_type === 'well').forEach(item => {
            markdown += `- ${item.description} (Votes: ${item.votes})\n`;
        });
        markdown += "\n";

        markdown += "## What could be improved?\n";
        retroItems.filter(item => item.column_type === 'improve').forEach(item => {
            markdown += `- ${item.description} (Votes: ${item.votes})\n`;
        });
        markdown += "\n";

        markdown += "## What should we start doing?\n";
        retroItems.filter(item => item.column_type === 'start').forEach(item => {
            markdown += `- ${item.description} (Votes: ${item.votes})\n`;
        });
        markdown += "\n";

        markdown += "## Action Items\n";
        actionItems.forEach(item => {
            markdown += `- ${item.description} (Votes: ${item.votes})\n`;
        });

        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Retro_Summary_${retro.name.replace(/\s+/g, '_')}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({ title: 'Success', description: 'Summary generated and downloaded.' });
    };

    const handleShare = () => {
        if (!sessionData?.password) {
            toast({ title: 'Error', description: 'Could not retrieve sharing information.', variant: 'destructive' });
            return;
        }
        const url = new URL(window.location.href);
        url.searchParams.set('password', sessionData.password);
        navigator.clipboard.writeText(url.toString());
        toast({ title: 'Success', description: 'Retro link copied to clipboard!' });
    };

    if (isVerifying || isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading retrospective...</div>;
    }
    
    if (showJoinPrompt && workspaceId) {
        return <JoinRetroPrompt
            workspaceId={workspaceId}
            onJoin={(newParticipantId) => handleJoin(newParticipantId)}
        />
    }

    if (retroError) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading retro: {retroError.message}</div>;
    }

    if (!retro) {
        return <div className="min-h-screen flex items-center justify-center">Retro not found.</div>;
    }

    const handleVote = (table: 'retro_items' | 'action_items') => (itemId: string, currentVotes: number, direction: 'up' | 'down') => {
        const newVoteCount = direction === 'up' ? currentVotes + 1 : currentVotes - 1;
        vote({ table, itemId, newVoteCount });
    };

    const handleUpdateItem = (table: 'retro_items' | 'action_items') => (itemId: string, description: string) => {
        updateItem({ table, itemId, description });
    };

    const handleDeleteItem = (table: 'retro_items' | 'action_items') => (itemId: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            deleteItem({ table, itemId });
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto w-full">
                <RetroHeader 
                    retroName={retro.name} 
                    retroDate={retro.retro_date} 
                    workspaceId={workspaceId!}
                    onExport={handleExport}
                    onGenerateSummary={handleGenerateSummary}
                    onShare={handleShare}
                />

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
                    {filteredItems.map(col => (
                        <RetroColumn
                            key={col.type}
                            title={col.title}
                            items={col.items}
                            colorClass={col.colorClass}
                            onAddItem={(description) => addRetroItem({ description, columnType: col.type })}
                            onVote={handleVote('retro_items')}
                            onUpdateItem={handleUpdateItem('retro_items')}
                            onDeleteItem={handleDeleteItem('retro_items')}
                        />
                    ))}
                </main>
                
                <ActionItemsSection 
                    items={actionItems || []}
                    onAddItem={(description) => addActionItem(description)}
                    onVote={handleVote('action_items')}
                    onUpdateItem={handleUpdateItem('action_items')}
                    onDeleteItem={handleDeleteItem('action_items')}
                />
            </div>
        </div>
    );
};

export default RetroPage;
