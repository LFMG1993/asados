import { FieldValue } from 'firebase/firestore';

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia' | 'nequi';

export interface SaleItem {
  productId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  timestamp: FieldValue;
  userId: string;
  userName: string;
  items: SaleItem[];
  total: number;
  paymentMethod: PaymentMethod;
  customerId?: string;
  isSynced: boolean;
}