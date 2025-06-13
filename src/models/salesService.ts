import React, { useEffect, useState } from 'react';
import { db } from './firebase'; // Assuming you have a firebase config file like this
import { collection, getDocs, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';




// Define interfaces for product data and sale items
interface ProductData {
    id: string;
    category: string;
    currentStock: number;
    description: string;
    isDivisible: boolean;
    name: string;
    price: number;
    stockUnit: string;
    // Si tienes una URL de imagen, agrégala
}

interface Sale {
    items: SaleItem[];
    total: number;
    timestamp: Date;
    // Puedes agregar otros campos como el ID del vendedor, método de pago, etc.
    // sellerId?: string;
    // paymentMethod?: string;
}

// Function to get products from the database
export const getProducts = async (): Promise<ProductData[]> => {

    try {
        const productsCollection = collection(db, 'products'); // Assuming your products are in a 'products' collection
        const productSnapshot = await getDocs(productsCollection);
        const productsList = productSnapshot.docs.map(doc => ({
            id: doc.id,
            // Asegúrate de que los nombres de campo aquí coincidan exactamente con Firestore
            category: doc.data().category,
            description: doc.data().description,
            isDivisible: doc.data().isDivisible,
            name: doc.data().name, // <-- Usar el campo 'name'
            price: doc.data().price,
            stockUnit: doc.data().stockUnit,
            // Si tienes imagenUrl, tráela aquí:
            // imagenUrl: doc.data().imagenUrl,
        }));
        return productsList;
    } catch (error) {
        console.error("Error getting products:", error);
        throw new Error("Failed to fetch products.");
    }
};

interface SaleItem {
    id: string; // El ID del producto
    quantity: number;
    currentStock: number; // Add currentStock here if needed for the calculation
    // Include other relevant properties from ProductData if needed
}
// Function to add a new sale to the database
export const addSale = async (saleData: Sale): Promise<string> => {
    try {
        const salesCollection = collection(db, 'sales'); // Asumiendo que tus ventas están en una colección 'sales'
        const docRef = await addDoc(salesCollection, saleData);
        return docRef.id; // Return the ID of the newly created sale document
    } catch (error) {
        console.error("Error adding sale:", error);
        throw new Error("Failed to add sale.");
    }
};

// Function to update inventory (example)
export const updateProductStock = async (items: SaleItem[]): Promise<void> => {
    try { // Ensure the containing function is async
        for (const item of items) {
            const productRef = doc(db, 'products', item.id); // Use db here
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
                const currentStock = productSnap.data()?.currentStock || 0; // Get current stock from DB
                const newStock = Math.max(0, currentStock - item.quantity); // Calculate new stock
                await updateDoc(productRef, {
                    currentStock: newStock // Actualizar el campo 'currentStock'
                });
            } else {
                console.warn(`Product with ID ${item.id} not found for inventory update.`);
            }
        }
    } catch (error) {
        console.error("Error updating inventory:", error);
        throw new Error("Failed to update inventory.");
    }
};

// Add other database interaction functions as needed (e.g., deleteProduct, updateProduct, etc.)