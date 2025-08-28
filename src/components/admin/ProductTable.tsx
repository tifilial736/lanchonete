import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@shared/schema';
import { isUnauthorizedError } from '@/lib/authUtils';

interface ProductTableProps {
  onEditProduct: (product: Product) => void;
}

export default function ProductTable({ onEditProduct }: ProductTableProps) {
  const { data: products = [], isLoading } = useProducts();
  const { toast } = useToast();
  const deleteProductMutation = useDeleteProduct();

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      return;
    }

    deleteProductMutation.mutate(product.id, {
      onError: (error) => {
        if (isUnauthorizedError(error)) {
          toast({
            title: "Unauthorized",
            description: "You are logged out. Logging in again...",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = "/api/login";
          }, 500);
          return;
        }
        
        toast({
          title: "Erro",
          description: "Não foi possível excluir o produto.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({
          title: "Produto excluído",
          description: "O produto foi removido com sucesso.",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium">Produto</th>
              <th className="text-left p-4 font-medium">Categoria</th>
              <th className="text-left p-4 font-medium">Preço</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-border animate-pulse">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg"></div>
                    <div>
                      <div className="h-4 bg-muted rounded mb-1 w-24"></div>
                      <div className="h-3 bg-muted rounded w-32"></div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="h-6 bg-muted rounded w-20"></div>
                </td>
                <td className="p-4">
                  <div className="h-4 bg-muted rounded w-16"></div>
                </td>
                <td className="p-4">
                  <div className="h-6 bg-muted rounded w-16"></div>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-muted rounded"></div>
                    <div className="w-8 h-8 bg-muted rounded"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const defaultImage = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50";

  return (
    <div className="overflow-x-auto" data-testid="products-table">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-4 font-medium">Produto</th>
            <th className="text-left p-4 font-medium">Categoria</th>
            <th className="text-left p-4 font-medium">Preço</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-border" data-testid={`product-row-${product.id}`}>
              <td className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={product.imageUrl || defaultImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      data-testid={`product-table-image-${product.id}`}
                    />
                  </div>
                  <div>
                    <p className="font-medium" data-testid={`product-table-name-${product.id}`}>
                      {product.name}
                    </p>
                    <p 
                      className="text-sm text-muted-foreground truncate max-w-xs"
                      data-testid={`product-table-description-${product.id}`}
                    >
                      {product.description}
                    </p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <Badge 
                  variant="secondary" 
                  className="bg-primary/10 text-primary"
                  data-testid={`product-table-category-${product.id}`}
                >
                  {product.category === 'burgers' ? 'Hambúrguer' : 'Combo'}
                </Badge>
              </td>
              <td className="p-4">
                <span 
                  className="font-medium"
                  data-testid={`product-table-price-${product.id}`}
                >
                  R$ {product.price}
                </span>
              </td>
              <td className="p-4">
                <Badge 
                  variant={product.isActive ? "default" : "secondary"}
                  className={product.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}
                  data-testid={`product-table-status-${product.id}`}
                >
                  {product.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary hover:bg-primary/10"
                    onClick={() => onEditProduct(product)}
                    data-testid={`edit-product-${product.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteProduct(product)}
                    disabled={deleteProductMutation.isPending}
                    data-testid={`delete-product-${product.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <div className="text-center py-8" data-testid="no-products">
          <p className="text-muted-foreground">Nenhum produto cadastrado</p>
        </div>
      )}
    </div>
  );
}
