// src/features/sales/services/productService.ts
import {
  collection,
  getDocs,
  query,
  doc,
  addDoc, // <-- Asegúrate de que 'addDoc' está importado
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../../../lib/firebase'; // VERIFICA esta ruta
import type { Product } from '../../../types/product.types'; // VERIFICA esta ruta

const productsCollectionRef = collection(db, 'products');

// ** READ **
export const getProducts = async (): Promise<Product[]> => {
  try {
    const q = query(productsCollectionRef);
    const querySnapshot = await getDocs(q);

    const products: Product[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description || '',
        category: data.category,
        imageUrl: data.imageUrl || '',
        stockUnit: data.stockUnit,
        currentStock: data.currentStock,
        price: data.price,
        isDivisible: data.isDivisible,
      };
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// ** CREATE **
// Asegúrate de que la función se llama `addProduct` y está exportada con `export const`
export const addProduct = async (productData: Omit<Product, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(productsCollectionRef, productData); // <-- Asegúrate de que usas `addDoc` aquí
    console.log("Product added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// ** UPDATE **
export const updateProduct = async (productId: string, updateData: Partial<Product>): Promise<void> => {
  try {
    const productDocRef = doc(db, 'products', productId);
    await updateDoc(productDocRef, updateData); // <-- Asegúrate de que usas `updateDoc` aquí
    console.log("Product updated with ID: ", productId);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// ** DELETE **
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const productDocRef = doc(db, 'products', productId);
    await deleteDoc(productDocRef); // <-- Asegúrate de que usas `deleteDoc` aquí
    console.log("Product deleted with ID: ", productId);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
