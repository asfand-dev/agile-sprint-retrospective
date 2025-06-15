import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, Edit, Trash2, Save } from 'lucide-react';
import { useSessionStore } from '@/lib/store';
import { ActionItemWithParticipant } from '@/data/retro/types';

interface ActionItemCardProps {
  item: ActionItemWithParticipant;
  onVote: (itemId: string, currentVotes: number, direction: 'up' | 'down') => void;
  onUpdateItem: (itemId: string, description: string) => void;
  onDeleteItem: (itemId: string) => void;
}

const ActionItemCard = ({ item, onVote, onUpdateItem, onDeleteItem }: ActionItemCardProps) => {
  const { participantId } = useSessionStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(item.description);

  const isOwner = item.participant_id === participantId;

  const handleUpdate = () => {
    if (editedDescription.trim() && editedDescription.trim() !== item.description) {
      onUpdateItem(item.id, editedDescription.trim());
    }
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedDescription(item.description);
    setIsEditing(false);
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/20 border transition-all duration-300 hover:shadow-lg hover:border-primary/40 animate-fade-in-up">
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="text-base bg-background/80"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={handleCancel}>Cancel</Button>
              <Button size="sm" onClick={handleUpdate}><Save className="mr-2 h-4 w-4" />Save</Button>
            </div>
          </div>
        ) : (
          <p className="text-foreground">{item.description}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-2 px-4 bg-card/30 text-xs">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-primary/20" onClick={() => onVote(item.id, item.votes, 'up')}>
                <Plus className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-base w-6 text-center text-primary">{item.votes}</span>
             <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-primary/20" onClick={() => onVote(item.id, item.votes, 'down')}>
                <Minus className="h-4 w-4" />
            </Button>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium">{item.session_participants?.name || 'Anonymous'}</span>
            {isOwner && !isEditing && (
                <>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDeleteItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                </>
            )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActionItemCard;
