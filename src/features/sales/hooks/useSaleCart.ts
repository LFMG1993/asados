import { useState, useMemo } from 'react';
import type { Product, ProductVariant, SaleItem } from '../../../types';
import { toast } from 'react-toastify';

export const useSaleCart = () => {
  const [items, setItems] = useState<SaleItem[]>([]);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    if (quantity <= 0) return;

    const existingItemIndex = items.findIndex(
      item => item.productId === product.id && item.variantName === variant.name
    );

    const stockNeeded = variant.stockConsumption * quantity;
    if(stockNeeded > product.currentStock) {
        toast.warn(`Stock insuficiente para ${product.name} - ${variant.name}`);
        return;
    }

    if (existingItemIndex > -1) {
      // Si ya existe, actualiza la cantidad
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].subtotal = updatedItems[existingItemIndex].quantity * variant.price;
      setItems(updatedItems);
    } else {
      // Si no existe, lo añade como nuevo
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        variantName: variant.name,
        quantity: quantity,
        unitPrice: variant.price,
        subtotal: quantity * variant.price,
      };
      setItems(prevItems => [...prevItems, newItem]);
    }
    toast.success(`${quantity} x ${product.name} (${variant.name}) añadido.`);
  };

  const removeFromCart = (productId: string, variantName: string) => {
    setItems(prevItems => prevItems.filter(
      item => !(item.productId === productId && item.variantName === variantName)
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  }, [items]);

  return { items, addToCart, removeFromCart, clearCart, total };
};