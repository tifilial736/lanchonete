import { Button } from '@/components/ui/button';

interface CategoryTabsProps {
  activeCategory: 'burgers' | 'combos';
  onCategoryChange: (category: 'burgers' | 'combos') => void;
}

export default function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-card rounded-lg p-1 shadow-md">
        <Button
          variant={activeCategory === 'burgers' ? 'default' : 'ghost'}
          className={`px-6 py-3 rounded-md font-medium ${
            activeCategory === 'burgers'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted'
          }`}
          onClick={() => onCategoryChange('burgers')}
          data-testid="burgers-tab"
        >
          Hambúrgueres
        </Button>
        <Button
          variant={activeCategory === 'combos' ? 'default' : 'ghost'}
          className={`px-6 py-3 rounded-md font-medium ${
            activeCategory === 'combos'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted'
          }`}
          onClick={() => onCategoryChange('combos')}
          data-testid="combos-tab"
        >
          Combos
        </Button>
      </div>
    </div>
  );
}
