import { useState } from 'react';
import { Drumstick, ShoppingCart, Menu, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import CategoryTabs from '@/components/menu/CategoryTabs';
import ProductCard from '@/components/menu/ProductCard';
import CartSidebar from '@/components/cart/CartSidebar';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import PIXModal from '@/components/checkout/PIXModal';
import { useProducts } from '@/hooks/useProducts';
import { Link } from 'wouter';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { data: products = [], isLoading } = useProducts();
  
  const [activeCategory, setActiveCategory] = useState<'burgers' | 'combos'>('burgers');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPIXOpen, setIsPIXOpen] = useState(false);

  const filteredProducts = products.filter(product => 
    product.category === activeCategory && product.isActive
  );

  return (
    <div className="min-h-screen flex flex-col" data-testid="home-page">
      {/* Header */}
      <header className="gradient-bg text-primary-foreground shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <Drumstick className="text-primary text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" data-testid="brand-name">Snacks Chicken</h1>
                <p className="text-sm opacity-90">Delivery & Takeout</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Button
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                data-testid="menu-btn"
              >
                <Menu className="mr-2 h-4 w-4" />
                Cardápio
              </Button>
              {isAuthenticated && (
                <Link href="/admin">
                  <Button
                    variant="ghost"
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                    data-testid="admin-btn"
                  >
                    Admin
                  </Button>
                </Link>
              )}
              <Button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-secondary text-secondary-foreground hover:bg-secondary/90"
                data-testid="cart-toggle"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Carrinho
                {totalItems > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    data-testid="cart-count"
                  >
                    {totalItems}
                  </span>
                )}
              </Button>
            </nav>

            <Button className="md:hidden text-primary-foreground" variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4" data-testid="hero-title">
            Deliciosos Hambúrgueres
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Feitos com ingredientes frescos e muito sabor
          </p>
          <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400"
              alt="Restaurant interior" 
              className="w-full h-64 object-cover" 
              data-testid="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4" data-testid="menu-title">
              Nosso Cardápio
            </h3>
            <p className="text-muted-foreground text-lg">
              Escolha entre nossos deliciosos hambúrgueres e combos
            </p>
          </div>

          <CategoryTabs 
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-muted"></div>
                  <div className="p-6">
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-20 bg-muted rounded"></div>
                      <div className="h-10 w-24 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4" data-testid="contact-title">Entre em Contato</h3>
          <div className="flex items-center justify-center space-x-6">
            <a 
              href="tel:3599926-7979" 
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              data-testid="phone-link"
            >
              <span className="text-2xl">📱</span>
              <span className="font-medium">(35) 99926-7979</span>
            </a>
            <div className="text-muted-foreground" data-testid="address">
              <MapPin className="inline mr-2 h-4 w-4" />
              Rua João Pinheiro, 429 - Bairro Aparecida
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Drumstick className="text-primary-foreground text-sm" />
            </div>
            <span className="font-semibold">Snacks Chicken</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 Snacks Chicken. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Modals and Sidebars */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />
      
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onPIXPayment={() => {
          setIsCheckoutOpen(false);
          setIsPIXOpen(true);
        }}
      />

      <PIXModal
        isOpen={isPIXOpen}
        onClose={() => setIsPIXOpen(false)}
      />
    </div>
  );
}
