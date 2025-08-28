import { X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import CartItem from './CartItem';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartSidebar({ isOpen, onClose, onCheckout }: CartSidebarProps) {
  const { items, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        data-testid="cart-backdrop"
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-96 bg-card shadow-xl z-50 animate-slide-in-right ${
          window.innerWidth < 768 ? 'w-full' : 'w-96'
        }`}
        data-testid="cart-sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold" data-testid="cart-title">
                Seu Carrinho ({totalItems})
              </h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClose}
                data-testid="close-cart"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-8" data-testid="empty-cart">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Seu carrinho está vazio</p>
              </div>
            ) : (
              <div className="space-y-4" data-testid="cart-items">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary" data-testid="cart-total">
                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <Button 
                  onClick={onCheckout}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="checkout-btn"
                >
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
