// src/features/sales/hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react'; // Importa useCallback
import type { Product } from '../../../types/product.types';
import { getProducts, addProduct as addProductService, updateProduct as updateProductService, deleteProduct as deleteProductService } from '../services/productService'; // Importa las nuevas funciones y renómbralas

// Define los tipos para las funciones que el hook va a exponer
type AddProductFn = (productData: Omit<Product, 'id'>) => Promise<string>;
type UpdateProductFn = (productId: string, updateData: Partial<Product>) => Promise<void>;
type DeleteProductFn = (productId: string) => Promise<void>;

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  // Agrega las funciones del CRUD al resultado del hook
  addProduct: AddProductFn;
  updateProduct: UpdateProductFn;
  deleteProduct: DeleteProductFn;
  // Opcional: función para refrescar la lista de productos manualmente
  refreshProducts: () => Promise<void>;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Función para obtener los productos, envuelta en useCallback para estabilidad
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (err: any) {
      setError(err);
      setProducts([]); // Limpia la lista en caso de error
    } finally {
      setLoading(false);
    }
  }, []); // Sin dependencias ya que solo obtiene datos

  // useEffect para cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // El efecto depende de fetchProducts

  // ** CREATE (Función en el hook) **
  const addProduct: AddProductFn = useCallback(async (productData) => {
    try {
      // Llama al servicio para añadir el producto a la BD
      const newProductId = await addProductService(productData);
      // Opcional: Actualiza el estado local agregando el nuevo producto
      // Esto evita tener que recargar toda la lista.
      const newProduct: Product = { ...productData, id: newProductId };
      setProducts(prevProducts => [...prevProducts, newProduct]);
      return newProductId; // Devuelve el ID generado
    } catch (err) {
      console.error("Error in addProduct hook:", err);
      throw err; // Re-lanza el error para que el componente lo maneje
    }
  }, []); // Sin dependencias si las funciones del servicio no cambian

  // ** UPDATE (Función en el hook) **
  const updateProduct: UpdateProductFn = useCallback(async (productId, updateData) => {
    try {
      // Llama al servicio para actualizar el producto en la BD
      await updateProductService(productId, updateData);
      // Opcional: Actualiza el estado local modificando el producto existente
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId ? { ...product, ...updateData } : product
        )
      );
    } catch (err) {
      console.error("Error in updateProduct hook:", err);
      throw err;
    }
  }, []);

  // ** DELETE (Función en el hook) **
  const deleteProduct: DeleteProductFn = useCallback(async (productId) => {
    try {
      // Llama al servicio para eliminar el producto en la BD
      await deleteProductService(productId);
      // Opcional: Actualiza el estado local eliminando el producto
      setProducts(prevProducts =>
        prevProducts.filter(product => product.id !== productId)
      );
    } catch (err) {
      console.error("Error in deleteProduct hook:", err);
      throw err;
    }
  }, []);

  // Opcional: Función para refrescar la lista manualmente si es necesario
  const refreshProducts = useCallback(async () => {
      await fetchProducts();
  }, [fetchProducts]);


  // Devuelve los productos, estados y las funciones del CRUD
  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts, // Exporta la función de refresco
  };
}
