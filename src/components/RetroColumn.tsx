
import { CardTitle } from '@/components/ui/card';
import { RetroItemWithParticipant } from '@/data/retro/types';
import AddRetroItemForm from './AddRetroItemForm';
import RetroItemCard from './RetroItemCard';

interface RetroColumnProps {
  title: string;
  items: RetroItemWithParticipant[];
  colorClass: string;
  onAddItem: (description: string) => void;
  onVote: (itemId: string, currentVotes: number, direction: 'up' | 'down') => void;
  onUpdateItem: (itemId: string, description: string) => void;
  onDeleteItem: (itemId: string) => void;
}

const RetroColumn = ({ title, items, colorClass, onAddItem, onVote, onUpdateItem, onDeleteItem }: RetroColumnProps) => {
  return (
    <div className={`rounded-lg border-2 ${colorClass} flex flex-col bg-card/10 backdrop-blur-sm h-[800px] animate-fade-in-up`}>
      <div className="p-6 pb-2">
        <CardTitle>{title}</CardTitle>
      </div>
      <div className="flex flex-col flex-grow p-4 gap-4 min-h-0">
        <AddRetroItemForm onAddItem={onAddItem} />
        <div className="flex-grow overflow-y-auto space-y-4 pr-2 -mr-2">
          {items.map(item => (
            <RetroItemCard
              key={item.id}
              item={item}
              onVote={onVote}
              onUpdateItem={onUpdateItem}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RetroColumn;
