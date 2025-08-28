import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsCards from '@/components/admin/StatsCards';
import ProductTable from '@/components/admin/ProductTable';
import ProductModal from '@/components/admin/ProductModal';
import { useState } from 'react';
import { Product } from '@shared/schema';
import { Link } from 'wouter';

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-background" data-testid="admin-page">
      {/* Header */}
      <header className="gradient-bg text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold" data-testid="admin-title">Painel Administrativo</h1>
                <p className="opacity-90">Gerencie produtos, pedidos e configurações</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsProductModalOpen(true)}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              data-testid="add-product-btn"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <StatsCards />

        {/* Products Management */}
        <div className="bg-card rounded-xl shadow-md mt-8">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold" data-testid="products-table-title">
              Produtos Cadastrados
            </h2>
          </div>
          <ProductTable onEditProduct={handleEditProduct} />
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <Button 
            onClick={() => window.location.href = '/api/logout'}
            variant="outline"
            data-testid="logout-btn"
          >
            Sair
          </Button>
        </div>
      </main>

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={handleCloseModal}
        product={editingProduct}
      />
    </div>
  );
}
