
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddRetroItemFormProps {
  onAddItem: (description: string) => void;
}

const AddRetroItemForm = ({ onAddItem }: AddRetroItemFormProps) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onAddItem(description.trim());
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        placeholder="Type your thoughts..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="bg-transparent"
        rows={3}
      />
      <Button type="submit" size="sm" className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Item
      </Button>
    </form>
  );
};

export default AddRetroItemForm;
