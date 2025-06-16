import { FieldValue } from 'firebase/firestore';

export interface Supplier {
    id?: string;
    name: string;
    contactName: string;
    phone: string;
    email?: string;
    productsSupplied: string[];
    createdAt: FieldValue;
}