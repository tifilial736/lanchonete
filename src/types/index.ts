export interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  imageUrl?: string;
}

export interface OrderFormData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: 'pix' | 'money' | 'card';
}

export interface OrderSummary {
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
}
