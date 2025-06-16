import { useState } from 'react';
import type { Product, ProductVariant } from '../../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // --- CAMBIO 1: INICIALIZACIÓN SEGURA ---
  // Usamos optional chaining (?.) para obtener la primera variante de forma segura.
  // Si product.variants no existe o está vacío, selectedVariant será `undefined`.
  // Por eso, el tipo del estado ahora puede ser ProductVariant o undefined.
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);

  // --- CAMBIO 2: MANEJO DEL CASO SIN VARIANTES ---
  // Si un producto no tiene variantes, no podemos venderlo.
  // Mostramos una versión deshabilitada de la tarjeta.
  if (!selectedVariant) {
    return (
      <div className="card h-100 opacity-50">
        <img src={product.imageUrl || 'https://via.placeholder.com/150'} className="card-img-top" alt={product.name} />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text text-danger">Producto no disponible (sin variantes configuradas).</p>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    // Nos aseguramos de que la variante esté seleccionada antes de agregar
    if (selectedVariant) {
      onAddToCart(product, selectedVariant, quantity);
      setQuantity(1); // Reset quantity after adding
    }
  };
  
  return (
    <div className="card h-100">
      <img src={product.imageUrl || 'https://via.placeholder.com/150'} className="card-img-top" alt={product.name} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <div className="mt-auto">
          <div className="mb-2">
            <select 
              className="form-select" 
              value={selectedVariant.name} 
              onChange={e => setSelectedVariant(product.variants.find(v => v.name === e.target.value)!)}
            >
              {product.variants.map(v => <option key={v.name} value={v.name}>{v.name} - ${v.price.toLocaleString()}</option>)}
            </select>
          </div>
          <div className="input-group mb-3">
            <input 
              type="number" 
              className="form-control" 
              value={quantity} 
              onChange={e => setQuantity(parseInt(e.target.value, 10))} 
              min="1" 
            />
            <button className="btn btn-primary" onClick={handleAdd}>Agregar</button>
          </div>
        </div>
      </div>
    </div>
  );
}