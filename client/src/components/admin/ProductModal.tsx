import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { insertProductSchema, type InsertProduct, type Product } from '@shared/schema';
import { isUnauthorizedError } from '@/lib/authUtils';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { toast } = useToast();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  
  const isEditing = !!product;

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category: 'burgers',
      imageUrl: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (product && isOpen) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || '',
        isActive: product.isActive,
      });
    } else if (!isOpen) {
      form.reset({
        name: '',
        description: '',
        price: '',
        category: 'burgers',
        imageUrl: '',
        isActive: true,
      });
    }
  }, [product, isOpen, form]);

  const onSubmit = (data: InsertProduct) => {
    const mutation = isEditing ? updateProductMutation : createProductMutation;
    const payload = isEditing ? { id: product.id, ...data } : data;

    mutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: isEditing ? "Produto atualizado" : "Produto criado",
          description: `${data.name} foi ${isEditing ? 'atualizado' : 'criado'} com sucesso.`,
        });
        onClose();
      },
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
          description: `Não foi possível ${isEditing ? 'atualizar' : 'criar'} o produto.`,
          variant: "destructive",
        });
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="product-modal">
      <div 
        className="bg-card rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold" data-testid="product-modal-title">
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="close-product-modal">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Snacks Burger" 
                        {...field} 
                        data-testid="product-name-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição dos ingredientes" 
                        rows={3}
                        {...field} 
                        data-testid="product-description-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="product-category-select">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="burgers">Hambúrgueres</SelectItem>
                        <SelectItem value="combos">Combos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="15.90" 
                        type="text"
                        {...field} 
                        data-testid="product-price-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://exemplo.com/imagem.jpg" 
                        type="url"
                        {...field} 
                        data-testid="product-image-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Produto ativo</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="product-active-switch"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  data-testid="cancel-product-btn"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={createProductMutation.isPending || updateProductMutation.isPending}
                  data-testid="save-product-btn"
                >
                  {(createProductMutation.isPending || updateProductMutation.isPending) 
                    ? 'Salvando...' 
                    : 'Salvar Produto'
                  }
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
