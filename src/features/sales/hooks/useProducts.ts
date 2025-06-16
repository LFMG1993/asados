import { useState, useEffect, useMemo } from 'react';
import type { Product } from '../../../types';
import { getProducts } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productList = await getProducts();
        setProducts(productList);
        
        // Extraer categorías únicas de los productos
        const uniqueCategories = ['Todos', ...new Set(productList.map(p => p.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError('Error al cargar productos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Usamos useMemo para no recalcular el filtrado en cada render, solo si cambia la selección o los productos
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return products;
    }
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return { products, filteredProducts, categories, selectedCategory, setSelectedCategory, loading, error };
};