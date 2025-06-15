
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface JoinRetroPromptProps {
    workspaceId: string;
    onJoin: (participantId: string) => void;
}

const JoinRetroPrompt = ({ workspaceId, onJoin }: JoinRetroPromptProps) => {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast({ title: 'Error', description: 'Please enter your name.', variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('session_participants')
                .insert({ name: name.trim(), session_id: workspaceId })
                .select('id')
                .single();
            
            if (error) throw error;

            if (data?.id) {
                toast({ title: 'Success', description: `Welcome, ${name.trim()}!`});
                onJoin(data.id);
            } else {
                throw new Error("Could not create participant.");
            }
        } catch (error: any) {
            toast({ title: 'Error joining session', description: error.message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm animate-fade-in-up">
                <CardHeader>
                    <CardTitle>Join Retrospective</CardTitle>
                    <CardDescription>Enter your name to join this session.</CardDescription>
                </CardHeader>
                <form onSubmit={handleJoin}>
                    <CardContent>
                        <Input 
                            placeholder="Your name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            disabled={isLoading}
                            autoFocus
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading || !name.trim()}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Joining...' : 'Join Session'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default JoinRetroPrompt;
