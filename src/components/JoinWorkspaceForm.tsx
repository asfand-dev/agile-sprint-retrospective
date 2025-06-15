
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSessionStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function JoinWorkspaceForm() {
  const [workspaceName, setWorkspaceName] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setParticipant = useSessionStore((state) => state.setParticipant);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName || !password || !userName) {
      toast({ title: 'Error', description: 'All fields are required.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);

    try {
      // Find session
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('id, password')
        .eq('name', workspaceName)
        .single();
      
      if (sessionError || !sessionData) {
        throw new Error('Workspace not found or wrong credentials.');
      }
      
      if (sessionData.password !== password) {
        throw new Error('Incorrect password.');
      }

      // Create participant
      const { data: participantData, error: participantError } = await supabase
        .from('session_participants')
        .insert({ session_id: sessionData.id, name: userName })
        .select()
        .single();

      if (participantError) throw participantError;

      setParticipant(participantData.id, sessionData.id);
      toast({ title: 'Success', description: 'Joined workspace successfully!' });
      navigate(`/workspace/${sessionData.id}`);

    } catch (error: any) {
      toast({
        title: 'Error joining workspace',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/20">
      <CardHeader>
        <CardTitle>Join an Existing Workspace</CardTitle>
        <CardDescription>Enter the workspace details to join your team.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Workspace Name"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <Input
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Joining...' : 'Join Workspace'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
