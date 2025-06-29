// src/types/product.types.ts

// Define los posibles valores para baseStockUnit
export type BaseStockUnit = 'unidades' | 'libras' | 'porciones';

// Define la interfaz Product
export interface Product {
    id: string;
    name: string;
    description?: string; // Opcional
    price: number;
    category: string;
    imageUrl?: string;    // Opcional
    stockUnit: BaseStockUnit; // Usamos el tipo BaseStockUnit
    currentStock: number;
}

// Si tenías el tipo ProductVariant, puedes eliminarlo si ya no lo necesitas
// export interface ProductVariant { ... }
