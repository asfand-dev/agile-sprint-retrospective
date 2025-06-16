import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSessionStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Users, LogOut, Upload, Trash2, Moon, Sun } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';

type Retro = {
  id: string;
  name: string;
  retro_date: string;
};

type Participant = {
    id: string;
    name: string
}

const WorkspacePage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { participantId, clearSession: clearWorkspace } = useSessionStore();
  const [workspaceName, setWorkspaceName] = useState('');
  const [retros, setRetros] = useState<Retro[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    if (!participantId || !workspaceId) {
      toast({ title: 'Error', description: 'You are not in a workspace. Redirecting...', variant: 'destructive' });
      navigate('/');
      return;
    }

    const fetchWorkspaceData = async () => {
      setIsLoading(true);
      try {
        const { data: sessionData, error: sessionError } = await supabase
          .from('sessions')
          .select('name')
          .eq('id', workspaceId)
          .single();

        if (sessionError) throw sessionError;
        setWorkspaceName(sessionData.name);

        const { data: retrosData, error: retrosError } = await supabase
          .from('retros')
          .select('id, name, retro_date')
          .eq('session_id', workspaceId)
          .order('created_at', { ascending: false });

        if (retrosError) throw retrosError;
        setRetros(retrosData);
      } catch (error) {
        toast({ title: 'Error fetching workspace data', description: error instanceof Error ? error.message : 'An unknown error occurred', variant: 'destructive' });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkspaceData();
    
    const channel = supabase.channel(`session-${workspaceId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'session_participants', filter: `session_id=eq.${workspaceId}` }, payload => {
        console.log('Change received!', payload)
        fetchParticipants();
    })
    .subscribe()

    const fetchParticipants = async () => {
        const { data, error } = await supabase
            .from('session_participants')
            .select('id, name')
            .eq('session_id', workspaceId);
        if(error) {
            console.error("Error fetching participants", error)
        } else {
            setParticipants(data);
        }
    }
    fetchParticipants();

    return () => {
        supabase.removeChannel(channel);
    }

  }, [workspaceId, participantId, navigate]);

  const handleCreateRetro = async () => {
    const retroName = prompt('Enter a name for the new retrospective:');
    if (retroName && workspaceId) {
      try {
        const { data, error } = await supabase
          .from('retros')
          .insert({ name: retroName, session_id: workspaceId })
          .select()
          .single();

        if (error) throw error;
        toast({ title: 'Success', description: 'New retrospective created!' });
        navigate(`/workspace/${workspaceId}/retro/${data.id}`);
      } catch (error) {
        toast({ title: 'Error creating retro', description: error instanceof Error ? error.message : 'An unknown error occurred', variant: 'destructive' });
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const text = e.target?.result as string;
            const importedData = JSON.parse(text);

            if (!importedData.name || !importedData.retroItems || !importedData.actionItems) {
                throw new Error("Invalid retro file format.");
            }

            const { data: newRetro, error: retroError } = await supabase
                .from('retros')
                .insert({
                    name: `(Imported) ${importedData.name}`,
                    session_id: workspaceId!,
                    retro_date: importedData.date || new Date().toISOString()
                })
                .select()
                .single();

            if (retroError) throw retroError;

            const newRetroId = newRetro.id;

            if (importedData.retroItems.length > 0) {
                const itemsToInsert = importedData.retroItems.map((item: { description: string; votes?: number; column_type: string }) => ({
                    retro_id: newRetroId,
                    participant_id: participantId!,
                    description: item.description,
                    votes: item.votes || 0,
                    column_type: item.column_type,
                }));
                const { error: retroItemsError } = await supabase.from('retro_items').insert(itemsToInsert);
                if (retroItemsError) throw retroItemsError;
            }

            if (importedData.actionItems.length > 0) {
                const actionItemsToInsert = importedData.actionItems.map((item: { description: string; votes?: number }) => ({
                    retro_id: newRetroId,
                    participant_id: participantId!,
                    description: item.description,
                    votes: item.votes || 0,
                }));
                const { error: actionItemsError } = await supabase.from('action_items').insert(actionItemsToInsert);
                if (actionItemsError) throw actionItemsError;
            }

            toast({ title: 'Success', description: 'Retro imported successfully!' });
            navigate(`/workspace/${workspaceId}/retro/${newRetroId}`);

        } catch (error) {
            toast({ title: 'Import Error', description: error instanceof Error ? error.message : 'An unknown error occurred', variant: 'destructive' });
        } finally {
            if(event.target) event.target.value = '';
        }
    };
    reader.readAsText(file);
  };
  
  const handleLogout = () => {
    clearWorkspace();
    navigate('/');
    toast({ title: 'Logged out', description: 'You have left the workspace.' });
  }

  const handleDeleteRetro = async (retroId: string) => {
    if (window.confirm('Are you sure you want to delete this retrospective? This action cannot be undone.')) {
      try {
        const { error } = await supabase.from('retros').delete().eq('id', retroId);
        if (error) throw error;
        toast({ title: 'Success', description: 'Retrospective deleted.' });
        setRetros(currentRetros => currentRetros.filter(retro => retro.id !== retroId));
      } catch (error) {
        toast({ title: 'Error deleting retro', description: error instanceof Error ? error.message : 'An unknown error occurred', variant: 'destructive' });
      }
    }
  };

  const handleDeleteParticipant = async (participantIdToDelete: string) => {
    if (window.confirm('Are you sure you want to remove this participant? Their contributions will be marked as "Deleted user".')) {
      try {
        const { error } = await supabase.from('session_participants').delete().eq('id', participantIdToDelete);
        if (error) throw error;
        toast({ title: 'Success', description: 'Participant removed.' });
        setParticipants(currentParticipants => currentParticipants.filter(p => p.id !== participantIdToDelete));
      } catch (error) {
        toast({ title: 'Error removing participant', description: error instanceof Error ? error.message : 'An unknown error occurred', variant: 'destructive' });
      }
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading workspace...</div>;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 animate-fade-in-up">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-glow">Workspace: {workspaceName}</h1>
            <p className="text-muted-foreground">Welcome to the retrospective dashboard.</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileImport} accept=".json" className="hidden" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}><LogOut /> Logout</Button>
            <Button variant="outline" onClick={handleImportClick}><Upload /> Import Retro</Button>
            <Button onClick={handleCreateRetro}><PlusCircle /> New Retro</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Retrospectives</CardTitle>
                <CardDescription>Select a retrospective to view or start a new one.</CardDescription>
              </CardHeader>
              <CardContent>
                {retros.length > 0 ? (
                  <ul className="space-y-3">
                    {retros.map((retro) => (
                      <li key={retro.id} className="border border-border/20 rounded-md hover:bg-secondary/50 transition-colors">
                        <div className="flex justify-between items-center p-4">
                            <Link to={`/workspace/${workspaceId}/retro/${retro.id}`} className="flex-grow">
                              <div>
                                <p className="font-semibold text-primary">{retro.name}</p>
                                <p className="text-sm text-muted-foreground">Date: {format(new Date(retro.retro_date), 'PPP')}</p>
                              </div>
                            </Link>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/workspace/${workspaceId}/retro/${retro.id}`}>Open</Link>
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => handleDeleteRetro(retro.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-border/30 rounded-lg">
                    <p className="text-muted-foreground">No retrospectives yet.</p>
                    <Button variant="link" onClick={handleCreateRetro}>Create your first one</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
             <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5"/> Participants</CardTitle>
                    <CardDescription>Users currently in this workspace.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {participants.map(p => (
                            <li key={p.id} className={`p-2 rounded-md flex justify-between items-center ${p.id === participantId ? 'bg-primary/20 text-primary-foreground font-semibold' : ''}`}>
                                <span>
                                    {p.name} {p.id === participantId && '(You)'}
                                </span>
                                {p.id !== participantId && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-6 w-6"
                                        onClick={() => handleDeleteParticipant(p.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;
