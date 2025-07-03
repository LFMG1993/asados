// src/features/suppliers/services/supplierService.ts

import {
    collection,
    getDocs,
    query,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    // Importa serverTimestamp si quieres guardar timestamps generados por el servidor
    serverTimestamp,
  } from 'firebase/firestore';
  import { db } from '../../../lib/firebase'; // ** VERIFICA ESTA RUTA ** (Desde services hasta lib)
  
  // ** Importa el tipo Supplier **
  import type { Supplier } from '../../../types/supplier.types'; // ** VERIFICA ESTA RUTA ** (Desde services hasta types en la raíz)
  
  // Referencia a la colección de proveedores en Firestore
  const suppliersCollectionRef = collection(db, 'suppliers');
  
  // ** READ: Obtener todos los proveedores **
  export const getSuppliers = async (): Promise<Supplier[]> => {
    console.log("SupplierService: Calling getSuppliers");
    try {
      const q = query(suppliersCollectionRef);
      const querySnapshot = await getDocs(q);
      console.log("SupplierService: Query snapshot obtained:", querySnapshot.docs.length, "documents found.");
  
      const suppliers: Supplier[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
         console.log(`SupplierService: Mapping document ID: ${doc.id}, Data:`, data);
        // Mapea los datos de Firestore a la estructura del tipo Supplier
        return {
          id: doc.id, // Usa el ID del documento de Firestore
          name: data.name,
          contactPerson: data.contactPerson || '', // Usa || '' para opcionales si podrían ser nulos/undefined en BD
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          notes: data.notes || '',
          // ** Maneja los timestamps **
          // Firestore Timestamp a Date de JavaScript
          createdAt: data.createdAt?.toDate() || new Date(0), // Proporciona un valor por defecto seguro
          updatedAt: data.updatedAt?.toDate() || new Date(0),
        } as Supplier; // Type assertion para asegurar el tipo
      });
  
      console.log("SupplierService: Mapped suppliers array before returning:", suppliers);
      return suppliers;
    } catch (error: any) {
      console.error("SupplierService: Error fetching suppliers:", error);
      throw error;
    }
  };
  
  // ** CREATE: Añadir un nuevo proveedor **
  // supplierData no necesita 'id', pero debe incluir los otros campos del tipo Supplier
  export const addSupplier = async (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
      console.log("SupplierService: addSupplier called with data:", supplierData);
    try {
      // Añade timestamps generados por el servidor al crear
      const dataToSave = {
          ...supplierData,
          createdAt: serverTimestamp(), // Usa serverTimestamp para fecha de creación
          updatedAt: serverTimestamp(), // Usa serverTimestamp para fecha de actualización inicial
      };
      const docRef = await addDoc(suppliersCollectionRef, dataToSave); // Añade a Firestore
      console.log("SupplierService: Supplier added with ID:", docRef.id);
      return docRef.id; // Devuelve el ID generado
    } catch (error: any) {
      console.error("SupplierService: Error adding supplier:", error);
      throw error;
    }
  };
  
  // ** UPDATE: Actualizar un proveedor existente **
  // updateData puede ser parcial, pero debe incluir el ID del proveedor
  export const updateSupplier = async (supplierId: string, updateData: Partial<Omit<Supplier, 'createdAt'>>): Promise<void> => {
       console.log(`SupplierService: updateSupplier called for ID: ${supplierId}, Data:`, updateData);
    try {
       // Añade solo el timestamp de actualización al actualizar
       const dataToUpdate = {
           ...updateData,
           updatedAt: serverTimestamp(), // Usa serverTimestamp para fecha de actualización
       };
      const supplierDocRef = doc(db, 'suppliers', supplierId); // Referencia al documento
      await updateDoc(supplierDocRef, dataToUpdate); // Actualiza en Firestore
      console.log("SupplierService: Supplier updated with ID:", supplierId);
    } catch (error: any) {
      console.error("SupplierService: Error updating supplier:", error);
      throw error;
    }
  };
  
  // ** DELETE: Eliminar un proveedor **
  export const deleteSupplier = async (supplierId: string): Promise<void> => {
       console.log("SupplierService: deleteSupplier called for ID:", supplierId);
    try {
      const supplierDocRef = doc(db, 'suppliers', supplierId); // Referencia al documento
      await deleteDoc(supplierDocRef); // Elimina el documento
       console.log("SupplierService: Supplier deleted with ID:", supplierId);
    } catch (error: any) {
      console.error("SupplierService: Error deleting supplier:", error);
      throw error;
    }
  };
  