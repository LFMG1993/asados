export interface ProductVariant {
    name: string;
    price: number;
    stockConsumption: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    imageUrl?: string;
    baseStockUnit: 'unidades' | 'libras' | 'porciones';
    currentStock: number;
    /** Un array de las diferentes maneras en que se puede vender este producto. */
    variants: ProductVariant[];
}