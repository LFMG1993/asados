// src/features/sales/components/ProductCard.tsx

import { useState } from 'react';
// Importa solo el tipo Product, y BaseStockUnit si es necesario
import type { Product } from '../../../types/product.types';
// Importa componentes necesarios (Button, Form, InputGroup, Badge)
import { Button, Form, InputGroup, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify'; // Si usas toast para mensajes de stock


interface ProductCardProps {
  // La función onAddToCart ahora solo espera Product y quantity
  onAddToCart: (product: Product, quantity: number) => void;
  product: Product; // Asegúrate de que este tipo Product es el nuevo sin variants
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // ** Elimina el estado selectedVariant **
  // const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(...);

  const [quantity, setQuantity] = useState(1);

  // --- Usa el stock actual del producto ---
  const currentStock = product.currentStock || 0; // Usa 0 como valor por defecto

  // --- Manejo del caso sin stock ---
  // Un producto está "no disponible" para añadir si currentStock <= 0

  const handleAdd = () => {
    // ** Lógica de validación de stock y cantidad para el nuevo tipo Product **
    if (quantity <= 0) {
        toast.info("La cantidad debe ser al menos 1.");
        return;
    }
    if (currentStock < quantity) {
        toast.info(`No hay suficiente stock disponible. Stock actual: ${currentStock} ${product.stockUnit}`);
        return;
    }

    // ** Llama a onAddToCart con product y quantity solamente **
    if (onAddToCart) { // Asegura que onAddToCart existe
       onAddToCart(product, quantity);
       setQuantity(1); // Reset quantity after adding
    }
  };

   // Deshabilitar el botón de agregar si no hay stock suficiente o cantidad inválida
   const isAddDisabled = quantity <= 0 || currentStock < quantity;


  // --- RENDERIZADO ---
  return (
    <div className="card h-100 position-relative">

      {/* ** INSIGNIA (BADGE) DE STOCK ACTUAL ** */}
      <Badge pill bg={currentStock > 0 ? "success" : "danger"} className="position-absolute top-0 start-100 translate-middle rounded-circle border border-light p-2">
         {currentStock}
         <span className="visually-hidden">Stock</span>
      </Badge>

      {/* Imagen del producto */}
      <img src={product.imageUrl || 'https://via.placeholder.com/150'} className="card-img-top" alt={product.name} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        {/* Muestra la descripción o un mensaje si es opcional */}
        <p className="card-text">{product.description || 'Sin descripción'}</p>
        {/* ** Mostrar Categoría y Unidad de Medida si lo deseas ** */}
         <p className="card-text"><small className="text-muted">Categoría: {product.category}</small></p>
         <p className="card-text"><small className="text-muted">Unidad: {product.stockUnit}</small></p>


        <div className="mt-auto">

          {/* ** Elimina completamente la sección de selector de variantes ** */}
          {/* Si tu nuevo tipo Product NO tiene variants, este bloque no debe existir */}
          {/*
          {product.variants && product.variants.length > 0 && (
            <div className="mb-2">
              <select ... variantes ... </select>
            </div>
          )}
          */}


          {/* SECCIÓN DE CANTIDAD Y BOTÓN AGREGAR */}
          <div className="input-group mb-3">
            <input
              type="number"
              className="form-control"
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value, 10) || 1)}
              min="1"
              // Puedes establecer el máximo basado en el stock actual
              max={currentStock > 0 ? currentStock : 1} // Permite al menos 1 si el stock es 0
            />

            <button className="btn btn-primary" onClick={handleAdd} disabled={isAddDisabled}>Agregar</button>
          </div>
          {/* FIN SECCIÓN CANTIDAD */}

        </div>
      </div>
    </div>
  );
}
