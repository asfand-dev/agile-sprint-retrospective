
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateWorkspaceForm } from '@/components/CreateWorkspaceForm';
import { JoinWorkspaceForm } from '@/components/JoinWorkspaceForm';
import { Rocket } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="inline-block bg-primary/10 p-4 rounded-full text-primary mb-4 animate-[spin_5s_linear_infinite]">
          <Rocket className="h-12 w-12" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-glow sm:text-6xl">
          Agile Sprint Retrospective
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Collaborate with your team, reflect on your sprint, and plan for success in a dynamic, real-time workspace.
        </p>
      </div>
      <Tabs defaultValue="create" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Workspace</TabsTrigger>
          <TabsTrigger value="join">Join Workspace</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateWorkspaceForm />
        </TabsContent>
        <TabsContent value="join">
          <JoinWorkspaceForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
