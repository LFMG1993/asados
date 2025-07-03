// src/features/suppliers/hooks/useSuppliers.ts

import { useState, useEffect, useCallback } from 'react';
// ** Importa el tipo Supplier **
import type { Supplier } from '../../../types/supplier.types'; // ** VERIFICA ESTA RUTA ** (Desde hooks hasta types en la raíz)

// ** Importa las funciones del servicio de proveedores **
import {
  getSuppliers,
  addSupplier as addSupplierService,
  updateSupplier as updateSupplierService,
  deleteSupplier as deleteSupplierService
} from '../services/supplierService'; // ** VERIFICA ESTA RUTA ** (Desde hooks hasta services)


// Define la interfaz del resultado que el hook va a devolver
interface UseSuppliersResult {
  suppliers: Supplier[];
  loading: boolean;
  error: Error | null;
  // Funciones CRUD que los componentes usarán
  addSupplier: (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateSupplier: (supplierId: string, updateData: Partial<Omit<Supplier, 'createdAt'>>) => Promise<void>;
  deleteSupplier: (supplierId: string) => Promise<void>;
  // Función para refrescar la lista (opcional)
  refreshSuppliers: () => Promise<void>;
}

export function useSuppliers(): UseSuppliersResult {
  console.log("useSuppliers hook is running"); // Log para depuración

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Función para obtener los proveedores, envuelta en useCallback para estabilidad
  const fetchSuppliers = useCallback(async () => {
    console.log("Hook: fetchSuppliers is being called"); // Log para depuración
    try {
      setLoading(true); // Inicia el estado de carga
      const suppliersData = await getSuppliers(); // Llama al servicio READ
      console.log("Hook: Data received from service:", suppliersData); // Log datos recibidos
      setSuppliers(suppliersData); // Actualiza el estado local de proveedores
      console.log("Hook: Suppliers state set."); // Log estado actualizado
    } catch (err: any) {
      console.error("Hook: Error fetching suppliers:", err); // Log errores
      setError(err); // Establece el estado de error
      setSuppliers([]); // Limpia la lista en caso de error
    } finally {
      setLoading(false); // Finaliza el estado de carga
      console.log("Hook: fetchSuppliers finished. Loading:", false); // Log estado final
    }
  }, [getSuppliers]); // Dependencia de la función getSuppliers del servicio

  // useEffect para cargar proveedores al montar el componente que usa este hook
  useEffect(() => {
    console.log("Hook: useEffect in useSuppliers is running"); // Log para depuración
    fetchSuppliers(); // Dispara la carga inicial
    // No necesitas una función de limpieza aquí a menos que implementes
    // suscripciones en tiempo real que debas detener.
  }, [fetchSuppliers]); // Dependencia de fetchSuppliers

  // ** CREATE: Función para añadir un proveedor (en el hook) **
  const addSupplier = useCallback(async (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    console.log("Hook: addSupplier called with data:", supplierData); // Log datos recibidos
    try {
      // Llama a la función del servicio para añadir el proveedor a la base de datos
      const newSupplierId = await addSupplierService(supplierData);
      console.log("Hook: Supplier added via service, received ID:", newSupplierId); // Log ID

      // Opcional: Actualiza el estado local agregando el nuevo proveedor.
      // Esto evita tener que volver a cargar toda la lista de la BD después de añadir.
      // Necesitas construir el objeto Supplier completo con el ID y timestamps simulados
      // o recargar la lista si la simulación no es precisa.
       // Para ser precisos con timestamps generados por el servidor, una recarga podría ser mejor,
       // o hacer que el servicio addSupplier devuelva el objeto completo con timestamps.
       // Por ahora, solo simulamos con el ID, timestamps pueden ser inexactos hasta recargar.
       const tempNewSupplier: Supplier = {
           ...supplierData,
           id: newSupplierId,
           createdAt: new Date(), // Timestamp temporal
           updatedAt: new Date(), // Timestamp temporal
       };
       setSuppliers(prevSuppliers => [...prevSuppliers, tempNewSupplier]);
       console.log("Hook: Suppliers state updated optimistically after add.");

      return newSupplierId; // Devuelve el ID generado
    } catch (err: any) {
      console.error("Hook: Error in addSupplier:", err); // Log errores
      // Puedes agregar un toast de error aquí si el componente no lo maneja explícitamente
      // toast.error(`Error al añadir proveedor: ${err.message}`);
      throw err; // Re-lanza el error para que el componente que llama pueda manejarlo
    }
  }, [addSupplierService]); // Dependencia de la función del servicio

  // ** UPDATE: Función para actualizar un proveedor (en el hook) **
  const updateSupplier = useCallback(async (supplierId: string, updateData: Partial<Omit<Supplier, 'createdAt'>>): Promise<void> => {
     console.log(`Hook: updateSupplier called for ID: ${supplierId}, Data:`, updateData); // Log datos
    try {
      // Llama a la función del servicio para actualizar el proveedor en la base de datos
      await updateSupplierService(supplierId, updateData);
      console.log("Hook: Supplier updated via service."); // Log llamada al servicio

      // Opcional: Actualiza el estado local modificando el proveedor existente.
      // Simula la actualización del timestamp.
       setSuppliers(prevSuppliers =>
         prevSuppliers.map(supplier =>
           supplier.id === supplierId ? { ...supplier, ...updateData as Supplier, updatedAt: new Date() } : supplier
         )
       );
        console.log(`Hook: Suppliers state updated optimistically for ID: ${supplierId}.`);

    } catch (err: any) {
      console.error("Hook: Error in updateSupplier:", err); // Log errores
       // toast.error(`Error al actualizar proveedor: ${err.message}`);
      throw err; // Re-lanza el error
    }
  }, [updateSupplierService]); // Dependencia de la función del servicio

  // ** DELETE: Función para eliminar un proveedor (en el hook) **
  const deleteSupplier = useCallback(async (supplierId: string): Promise<void> => {
    console.log("Hook: deleteSupplier called for ID:", supplierId); // Log ID
    try {
      // Llama a la función del servicio para eliminar el proveedor de la base de datos
      await deleteSupplierService(supplierId);
      console.log("Hook: Supplier deleted via service."); // Log llamada al servicio

      // Opcional: Actualiza el estado local eliminando el proveedor.
      setSuppliers(prevSuppliers =>
        prevSuppliers.filter(supplier => supplier.id !== supplierId)
      );
      console.log(`Hook: Suppliers state updated optimistically, removing ID: ${supplierId}.`);

    } catch (err: any) {
      console.error("Hook: Error in deleteSupplier:", err); // Log errores
       // toast.error(`Error al eliminar proveedor: ${err.message}`);
      throw err; // Re-lanza el error
    }
  }, [deleteSupplierService]); // Dependencia de la función del servicio

  // Función opcional para refrescar la lista de proveedores manualmente
  const refreshSuppliers = useCallback(async () => {
      console.log("Hook: refreshSuppliers called."); // Log llamada
      await fetchSuppliers(); // Llama a la función de obtención
  }, [fetchSuppliers]); // Dependencia de fetchSuppliers


  // Log de los valores que el hook devuelve
  console.log("useSuppliers returning:", { suppliers, loading, error });

  // Devuelve los proveedores, estados y las funciones del CRUD
  return {
    suppliers,
    loading,
    error,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    refreshSuppliers, // Exporta la función de refresco
  };
}
