import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { Product } from '@shared/schema';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: `R$ ${product.price}`,
      imageUrl: product.imageUrl || undefined,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Default image based on category
  const defaultImage = product.category === 'burgers'
    ? "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
    : "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250";

  return (
    <Card className="overflow-hidden hover-scale shadow-lg" data-testid={`product-card-${product.id}`}>
      <div className="relative">
        <img 
          src={product.imageUrl || defaultImage}
          alt={product.name}
          className="w-full h-48 object-cover"
          data-testid={`product-image-${product.id}`}
        />
      </div>
      <CardContent className="p-6">
        <h4 className="text-xl font-semibold mb-2" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h4>
        <p className="text-muted-foreground mb-4 text-sm" data-testid={`product-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary" data-testid={`product-price-${product.id}`}>
            R$ {product.price}
          </span>
          <Button 
            onClick={handleAddToCart}
            className={`${
              isAdded 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
            } transition-colors font-medium`}
            data-testid={`add-to-cart-${product.id}`}
          >
            {isAdded ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Adicionado
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
