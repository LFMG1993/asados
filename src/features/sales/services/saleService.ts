import { runTransaction, collection, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Sale, SaleItem, Product } from '../../../types';

// Esta función es crítica. Usa una transacción para asegurar la integridad de los datos.
export const finalizeSaleInTransaction = async (saleData: Omit<Sale, 'id' | 'timestamp' | 'isSynced'>) => {
  await runTransaction(db, async (transaction) => {
    // 1. Validar el stock y preparar las actualizaciones de productos
    const productUpdates = [];
    for (const item of saleData.items) {
      const productRef = doc(db, 'products', item.productId);
      const productDoc = await transaction.get(productRef);

      if (!productDoc.exists()) {
        throw new Error(`El producto "${item.productName}" ya no existe.`);
      }

      const product = productDoc.data() as Product;
      const variant = product.variants.find(v => v.name === item.variantName);
      if (!variant) {
        throw new Error(`La variante "${item.variantName}" del producto "${item.productName}" no existe.`);
      }

      const stockToConsume = item.quantity * variant.stockConsumption;

      if (product.currentStock < stockToConsume) {
        throw new Error(`Stock insuficiente para "${item.productName} - ${item.variantName}". Disponible: ${product.currentStock}, se necesitan: ${stockToConsume}`);
      }
      
      const newStock = product.currentStock - stockToConsume;
      productUpdates.push({ ref: productRef, newStock });
    }

    // 2. Si todas las validaciones pasan, realizar las escrituras
    // Actualizar el stock de todos los productos
    for (const update of productUpdates) {
      transaction.update(update.ref, { currentStock: update.newStock });
    }

    // 3. Crear el nuevo documento de venta
    const saleRef = doc(collection(db, 'sales'));
    transaction.set(saleRef, {
      ...saleData,
      timestamp: new Date(), // Usaremos un timestamp de cliente por simplicidad, serverTimestamp es otra opción
      isSynced: true, // Se asume que hay conexión para realizar la transacción
    });
  });
};