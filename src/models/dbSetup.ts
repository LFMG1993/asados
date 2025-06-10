import { db } from "../firebase";

const setupDatabase = async () => {
  console.log('Verificando y configurando base de datos...');

  try {
    // --- Configuración de la colección 'users' ---
    const usersRef = db.collection('users');
    // Puedes verificar si hay algún documento para saber si la colección "existe"
    // Esto no es estrictamente necesario, ya que Firestore crea la colección al primer documento.
    // Sin embargo, puede ser útil para lógica de inicialización específica.
    const usersSnapshot = await usersRef.limit(1).get();
    if (usersSnapshot.empty) {
      console.log('Colección "users" vacía o no existe. Agregando documento de ejemplo...');
      // Ejemplo: Agregar un usuario de ejemplo (puedes eliminar esto en producción)
      await usersRef.doc('example_user_id').set({
        name: 'Usuario Ejemplo',
        email: 'ejemplo@example.com',
        role: 'cajero',
        isActive: true,
      });
      console.log('Documento de ejemplo agregado a "users".');
    } else {
      console.log('Colección "users" ya contiene documentos.');
    }

    // --- Configuración de la colección 'suppliers' ---
    const suppliersRef = db.collection('suppliers');
    const suppliersSnapshot = await suppliersRef.limit(1).get();
    if (suppliersSnapshot.empty) {
      console.log('Colección "suppliers" vacía o no existe. Agregando documento de ejemplo...');
      await suppliersRef.add({
        name: 'Proveedor Ejemplo',
        contactName: 'Contacto Ejemplo',
        phone: '123-456-7890',
        productsSupplied: [],
      });
      console.log('Documento de ejemplo agregado a "suppliers".');
    } else {
      console.log('Colección "suppliers" ya contiene documentos.');
    }

    // --- Configuración de la colección 'products' ---
    const productsRef = db.collection('products');
    const productsSnapshot = await productsRef.limit(1).get();
    if (productsSnapshot.empty) {
      console.log('Colección "products" vacía o no existe. Agregando documento de ejemplo...');
      await productsRef.add({
        name: 'Producto Ejemplo',
        description: 'Descripción del producto ejemplo',
        price: 10.0,
        category: 'Comida',
        stockUnit: 'unidad',
        currentStock: 100,
        isDivisible: false,
      });
      console.log('Documento de ejemplo agregado a "products".');
    } else {
      console.log('Colección "products" ya contiene documentos.');
    }

    // --- Configuración de la colección 'sales' ---
    const salesRef = db.collection('sales');
    const salesSnapshot = await salesRef.limit(1).get();
    if (salesSnapshot.empty) {
      console.log('Colección "sales" vacía o no existe.');
      // No necesitamos agregar un documento de ejemplo aquí a menos que quieras uno.
    } else {
      console.log('Colección "sales" ya contiene documentos.');
    }

    // --- Configuración de la colección 'inventoryMovements' ---
    const inventoryMovementsRef = db.collection('inventoryMovements');
    const inventoryMovementsSnapshot = await inventoryMovementsRef.limit(1).get();
    if (inventoryMovementsSnapshot.empty) {
      console.log('Colección "inventoryMovements" vacía o no existe.');
      // No necesitamos agregar un documento de ejemplo aquí a menos que quieras uno.
    } else {
      console.log('Colección "inventoryMovements" ya contiene documentos.');
    }

    console.log('Configuración de base de datos completada.');

  } catch (error) {
    console.error('Error durante la configuración de la base de datos:', error);
    // Manejar el error adecuadamente en tu aplicación
  }
};

export { setupDatabase };
