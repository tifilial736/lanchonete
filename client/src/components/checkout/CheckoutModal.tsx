import { useState } from 'react';
import { X, CreditCard, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { orderWithItemsSchema, type InsertOrderWithItems } from '@shared/schema';
import { OrderFormData, OrderSummary } from '@/types';
import { useMutation } from '@tanstack/react-query';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPIXPayment: () => void;
}

export default function CheckoutModal({ isOpen, onClose, onPIXPayment }: CheckoutModalProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'money' | 'card'>('pix');

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderWithItemsSchema.omit({ items: true })),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      paymentMethod: 'pix',
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: InsertOrderWithItems) => {
      const response = await apiRequest('POST', '/api/orders', orderData);
      return response.json();
    },
    onSuccess: (order) => {
      clearCart();
      toast({
        title: "Pedido Confirmado!",
        description: `Seu pedido #${order.id.slice(0, 8)} foi recebido com sucesso.`,
      });

      if (paymentMethod === 'pix') {
        onPIXPayment();
      } else {
        onClose();
        toast({
          title: "Aguarde o contato",
          description: "Entraremos em contato via WhatsApp para confirmar seu pedido.",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível processar seu pedido. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const orderSummary: OrderSummary = {
    subtotal: totalPrice,
    delivery: 5.00,
    discount: paymentMethod === 'pix' ? totalPrice * 0.05 : 0,
    total: totalPrice + 5.00 - (paymentMethod === 'pix' ? totalPrice * 0.05 : 0),
  };

  const onSubmit = (data: OrderFormData) => {
    const orderData: InsertOrderWithItems = {
      ...data,
      paymentMethod,
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price.replace('R$ ', '').replace(',', '.'),
      })),
    };

    createOrderMutation.mutate(orderData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="checkout-modal">
      <div 
        className="bg-card rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold" data-testid="checkout-title">Finalizar Pedido</h3>
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="close-checkout">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Customer Info */}
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite seu nome" 
                        {...field} 
                        data-testid="input-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(35) 99999-9999" 
                        {...field} 
                        data-testid="input-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Rua, número, bairro, cidade" 
                        rows={3}
                        {...field} 
                        data-testid="input-address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Forma de Pagamento</Label>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(value: 'pix' | 'money' | 'card') => {
                    setPaymentMethod(value);
                    form.setValue('paymentMethod', value);
                  }}
                  className="space-y-2"
                  data-testid="payment-methods"
                >
                  <div className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">PIX</span>
                      </div>
                      <span>PIX (5% de desconto)</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="money" id="money" />
                    <Label htmlFor="money" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span>Dinheiro na entrega</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span>Cartão na entrega</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Order Summary */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-3" data-testid="order-summary-title">Resumo do Pedido</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span data-testid="order-subtotal">R$ {orderSummary.subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de entrega</span>
                    <span data-testid="order-delivery">R$ {orderSummary.delivery.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {paymentMethod === 'pix' && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto PIX (5%)</span>
                      <span data-testid="order-discount">-R$ {orderSummary.discount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary" data-testid="order-total">
                      R$ {orderSummary.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={createOrderMutation.isPending}
                data-testid="confirm-order-btn"
              >
                {createOrderMutation.isPending ? 'Processando...' : 'Confirmar Pedido'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
