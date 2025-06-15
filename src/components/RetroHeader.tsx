
import { Link } from 'react-router-dom';
import { Save, Download, FileText, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface RetroHeaderProps {
  retroName: string;
  retroDate: string;
  workspaceId: string;
  onExport: () => void;
  onGenerateSummary: () => void;
  onShare: () => void;
}

const RetroHeader = ({ retroName, retroDate, workspaceId, onExport, onGenerateSummary, onShare }: RetroHeaderProps) => {
  return (
    <header className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <Link to={`/workspace/${workspaceId}`} className="text-sm font-medium text-primary hover:underline">
          &larr; Back to Workspace
        </Link>
        <div className="flex items-center gap-2">
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
