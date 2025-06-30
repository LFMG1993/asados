// src/types/product.types.ts

// Define los posibles valores para baseStockUnit
export type BaseStockUnit = 'unidades' | 'libras' | 'porciones';

// Define la interfaz Product
export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl?: string;    // Opcional
    stockUnit: BaseStockUnit; // Usamos el tipo BaseStockUnit
    currentStock: number;
    active: boolean;
    description: string;
    createdAt?: Date; // Opcional: Timestamp de creación
    updatedAt?: Date; // Opcional: Timestamp de última actualización
}
