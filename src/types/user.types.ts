import { FieldValue } from 'firebase/firestore';

export type UserRole = 'root' | 'admin' | 'supervisor' | 'cajero';

export interface User {
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: FieldValue;
}