// src/features/suppliers/types/supplier.types.ts

export interface Supplier {
    id: string;         // ID único de Firestore
    name: string;       // Nombre del proveedor (ej. "Distribuidora El Sol")
    contactPerson?: string; // Nombre de la persona de contacto (opcional)
    phone?: string;      // Teléfono de contacto (opcional)
    email?: string;      // Email de contacto (opcional)
    address?: string;    // Dirección (opcional)
    notes?: string;      // Notas adicionales (opcional)
    createdAt: Date;    // Fecha de creación (timestamp)
    updatedAt: Date;    // Fecha de última actualización (timestamp)
  }
  