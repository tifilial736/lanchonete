import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const itemTotal = parseFloat(item.price.replace('R$ ', '').replace(',', '.')) * item.quantity;
  const defaultImage = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64";

  return (
    <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg" data-testid={`cart-item-${item.id}`}>
      <div className="w-16 h-16 bg-background rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={item.imageUrl || defaultImage}
          alt={item.name}
          className="w-full h-full object-cover"
          data-testid={`cart-item-image-${item.id}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate" data-testid={`cart-item-name-${item.id}`}>
          {item.name}
        </h4>
        <p className="text-sm text-muted-foreground" data-testid={`cart-item-price-${item.id}`}>
          {item.price}
        </p>
        <p className="text-sm font-medium text-primary" data-testid={`cart-item-total-${item.id}`}>
          Total: R$ {itemTotal.toFixed(2).replace('.', ',')}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={handleDecrease}
          data-testid={`decrease-quantity-${item.id}`}
        >
          {item.quantity === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
        </Button>
        <span className="w-8 text-center font-medium" data-testid={`item-quantity-${item.id}`}>
          {item.quantity}
        </span>
        <Button 
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={handleIncrease}
          data-testid={`increase-quantity-${item.id}`}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
