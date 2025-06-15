
import { Card, CardContent } from '@/components/ui/card';
import AddRetroItemForm from './AddRetroItemForm';
import ActionItemCard from './ActionItemCard';
import { ActionItemWithParticipant } from '@/data/retro/types';

interface ActionItemsSectionProps {
  items: ActionItemWithParticipant[];
  onAddItem: (description: string) => void;
  onVote: (itemId: string, currentVotes: number, direction: 'up' | 'down') => void;
  onUpdateItem: (itemId: string, description: string) => void;
  onDeleteItem: (itemId: string) => void;
}

const ActionItemsSection = ({ items, onAddItem, onVote, onUpdateItem, onDeleteItem }: ActionItemsSectionProps) => {
  return (
    <div className="mt-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-4">Action Items</h2>
      <Card className="bg-card/20 backdrop-blur-sm border border-border/20">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2 -mr-2">
            {items.length > 0 ? (
                items.map(item => (
                    <ActionItemCard
                        key={item.id}
                        item={item}
                        onVote={onVote}
                        onUpdateItem={onUpdateItem}
                        onDeleteItem={onDeleteItem}
                    />
                ))
            ) : (
                <p className="text-center text-muted-foreground py-4">No action items yet. Add one below!</p>
            )}
          </div>
          <div className="pt-4 border-t border-border/20">
            <AddRetroItemForm onAddItem={onAddItem} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionItemsSection;
