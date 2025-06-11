import { db } from "./firebase";
import { collection, getDocs, limit, addDoc, setDoc, doc, query } from 'firebase/firestore'; // Importa las funciones necesarias

const setupDatabase = async () => {

  try {
    // --- Configuración de la colección 'users' ---
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(query(usersRef, limit(1)));
    if (usersSnapshot.empty) {
      await setDoc(doc(usersRef, 'example_user_id'), {
        name: 'Usuario Ejemplo',
        email: 'ejemplo@example.com',
        role: 'cajero',
        isActive: true,
      });
    } else {
    }

    // --- Configuración de la colección 'suppliers' ---
    const suppliersRef = collection(db, 'suppliers');
    const suppliersSnapshot = await getDocs(query(suppliersRef, limit(1)));
    if (suppliersSnapshot.empty) {
      await addDoc(suppliersRef, {
        name: 'Proveedor Ejemplo',
        contactName: 'Contacto Ejemplo',
        phone: '123-456-7890',
        productsSupplied: [],
      });
    } else {
    }

    // --- Configuración de la colección 'products' ---
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(query(productsRef, limit(1)));
    if (productsSnapshot.empty) {
      await addDoc(productsRef, {
        name: 'Producto Ejemplo',
        description: 'Descripción del producto ejemplo',
        price: 10.0,
        category: 'Comida',
        stockUnit: 'unidad',
        currentStock: 100,
        isDivisible: false,
      });
    } else {
    }
    // --- Configuración de la colección 'sales' ---
    const salesRef = collection(db, 'sales');
    const salesSnapshot = await getDocs(query(salesRef, limit(1)));
    if (salesSnapshot.empty) {
    } else {
    }
    // --- Configuración de la colección 'inventoryMovements' ---
    const inventoryMovementsRef = collection(db, 'inventoryMovements');
    const inventoryMovementsSnapshot = await getDocs(query(inventoryMovementsRef, limit(1)));
    if (inventoryMovementsSnapshot.empty) {
    } else {
    }
  } catch (error) {
    // Manejar el error adecuadamente
  }
};

export { setupDatabase };
