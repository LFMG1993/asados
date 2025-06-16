import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Product } from '../../../types';

export const getProducts = async (): Promise<Product[]> => {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  // Mapeamos los documentos y añadimos el ID a cada objeto de producto
  const productList = productSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Product));
  return productList;
};