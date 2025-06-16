import { db } from "./firebase";
import { collection, doc, getDocs, writeBatch, serverTimestamp, query, limit } from 'firebase/firestore';
import type { User, Product, Supplier } from '../types';

export const setupDatabase = async () => {
  console.log("Iniciando la configuración de la base de datos...");

  try {
    // Usamos un 'batch' para ejecutar todas las escrituras a la vez.
    const batch = writeBatch(db);

    // --- 1. Configuración de la colección 'users' ---
    console.log("Verificando colección 'users'...");
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(query(usersRef, limit(1)));

    if (usersSnapshot.empty) {
      console.log("Colección 'users' está vacía. Creando usuarios de ejemplo...");
      // Creamos un usuario para cada rol
      const adminUserRef = doc(usersRef, 'admin_user_id_example'); // Usa un ID predecible para pruebas
      batch.set(adminUserRef, {
        name: 'Administrador Principal',
        email: 'admin@example.com',
        role: 'admin',
        isActive: true,
        createdAt: serverTimestamp()
      } as User);

      const supervisorUserRef = doc(usersRef, 'supervisor_user_id_example');
      batch.set(supervisorUserRef, {
        name: 'Supervisor Turno A',
        email: 'supervisor@example.com',
        role: 'supervisor',
        isActive: true,
        createdAt: serverTimestamp()
      } as User);

      const cajeroUserRef = doc(usersRef, 'cajero_user_id_example');
      batch.set(cajeroUserRef, {
        name: 'Cajero Principal',
        email: 'cajero@example.com',
        role: 'cajero',
        isActive: true,
        createdAt: serverTimestamp()
      } as User);
    } else {
      console.log("Colección 'users' ya contiene datos.");
    }

    // --- 2. Configuración de la colección 'suppliers' ---
    console.log("Verificando colección 'suppliers'...");
    const suppliersRef = collection(db, 'suppliers');
    const suppliersSnapshot = await getDocs(query(suppliersRef, limit(1)));
    if (suppliersSnapshot.empty) {
      console.log("Colección 'suppliers' está vacía. Creando proveedor de ejemplo...");

      // El objeto que creamos ahora sí coincide con la interfaz
      const newSupplierData: Supplier = {
        name: 'Distribuidora de Pollos El Campesino',
        contactName: 'Juan Valdés',
        phone: '310-123-4567',
        email: 'ventas@elcampesino.com',
        productsSupplied: [],
        createdAt: serverTimestamp() // <-- AÑADIMOS EL CAMPO FALTANTE
      };

      const supplierRef = doc(suppliersRef); // Firestore sigue generando el ID por su cuenta

      // Ya no necesitas forzar el tipo con 'as Supplier', aunque si lo dejas, ya no dará error.
      // TypeScript ahora entiende que 'newSupplierData' es compatible con 'Supplier'.
      batch.set(supplierRef, newSupplierData);

    } else {
      console.log("Colección 'suppliers' ya contiene datos.");
    }

    // --- 3. Configuración de la colección 'products' ---
    console.log("Verificando colección 'products'...");
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(query(productsRef, limit(1)));
    if (productsSnapshot.empty) {
      console.log("Colección 'products' está vacía. Creando productos de ejemplo...");

      // Ejemplo 1: Pollo Asado (con variantes)
      const polloAsadoRef = doc(productsRef);
      batch.set(polloAsadoRef, {
        name: 'Pollo Asado',
        description: 'Jugoso pollo asado a la leña con nuestro adobo especial.',
        category: 'Asados',
        baseStockUnit: 'unidades',
        currentStock: 50, // 50 pollos enteros en stock
        variants: [
          { name: 'Entero', price: 30000, stockConsumption: 1 },
          { name: 'Medio', price: 16000, stockConsumption: 0.5 },
          { name: 'Cuarto', price: 9000, stockConsumption: 0.25 },
        ]
      } as Product);

      // Ejemplo 2: Pollo Broaster (con variantes)
      const polloBroasterRef = doc(productsRef);
      batch.set(polloBroasterRef, {
        name: 'Pollo Broaster',
        description: 'Crujiente y delicioso pollo apanado.',
        category: 'Broaster',
        baseStockUnit: 'unidades',
        currentStock: 40,
        variants: [
          { name: '8 Presas (Entero)', price: 35000, stockConsumption: 1 },
          { name: '4 Presas (Medio)', price: 18000, stockConsumption: 0.5 },
        ]
      } as Product);

      // Ejemplo 3: Sopa de Menudencias (producto simple)
      const sopaRef = doc(productsRef);
      batch.set(sopaRef, {
        name: 'Sopa de Menudencias',
        description: 'Sopa tradicional para empezar con energía.',
        category: 'Sopas y Bandejas',
        baseStockUnit: 'unidades', // En este caso, "unidades" significa "porciones"
        currentStock: 100,
        variants: [
          { name: 'Porción', price: 8000, stockConsumption: 1 },
        ]
      } as Product);
    } else {
      console.log("Colección 'products' ya contiene datos.");
    }

    // --- 4. Ejecutar todas las operaciones de escritura ---
    await batch.commit();
    console.log("¡Base de datos inicializada con éxito!");

  } catch (error) {
    console.error("Error durante la configuración de la base de datos: ", error);
  }
};
