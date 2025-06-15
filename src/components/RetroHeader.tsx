
import { Link } from 'react-router-dom';
import { Save, Download, FileText, Share2, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';

interface RetroHeaderProps {
  retroName: string;
  retroDate: string;
  workspaceId: string;
  onExport: () => void;
  onGenerateSummary: () => void;
  onShare: () => void;
}

const RetroHeader = ({ retroName, retroDate, workspaceId, onExport, onGenerateSummary, onShare }: RetroHeaderProps) => {
  const { setTheme, theme } = useTheme();

  return (
    <header className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <Link to={`/workspace/${workspaceId}`} className="text-sm font-medium text-primary hover:underline">
          &larr; Back to Workspace
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onShare}><Share2 /> Share</Button>
          <Button variant="outline" size="sm" onClick={onExport}><Download /> Export</Button>
          <Button variant="outline" size="sm" onClick={onGenerateSummary}><FileText /> Generate Summary</Button>
          <Button size="sm" disabled><Save /> Save Retro</Button>
        </div>
      </div>
      <h1 className="text-4xl font-bold text-glow">{retroName}</h1>
      <p className="mt-1 text-lg text-muted-foreground">Date: {format(new Date(retroDate), 'PPP')}</p>
    </header>
  );
};

export default RetroHeader;
