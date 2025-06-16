
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WorkspacePage from "./pages/Workspace";
import RetroPage from "./pages/Retro";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="m-8">
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Heads up!</strong> This is a demo app and it is for testing purposes only. You should not use your real data here.
            </AlertDescription>
          </Alert>
        </div>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/workspace/:workspaceId" element={<WorkspacePage />} />
            <Route path="/workspace/:workspaceId/retro/:retroId" element={<RetroPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </NextThemesProvider>
);

export default App;
