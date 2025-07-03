// src/features/suppliers/components/SupplierFormModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form} from 'react-bootstrap';
import { toast } from 'react-toastify';

import type { Supplier } from '../../../types/supplier.types';


interface SupplierFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'> | Partial<Omit<Supplier, 'createdAt'>>) => Promise<void>;
  isEditing: boolean;
  initialData?: Supplier;
  isLoading: boolean;
}

export function SupplierFormModal({ show, onHide, onSubmit, isEditing, initialData, isLoading }: SupplierFormModalProps) {
  console.log("SupplierFormModal component is rendering. Show:", show, "IsEditing:", isEditing);
  console.log("SupplierFormModal received initialData:", initialData);


  const [formData, setFormData] = useState<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (show) {
      if (isEditing && initialData) {
        setFormData({
          name: initialData.name,
          contactPerson: initialData.contactPerson || '',
          phone: initialData.phone || '',
          email: initialData.email || '',
          address: initialData.address || '',
          notes: initialData.notes || '',
        });
      } else {
         setFormData({
           name: '', contactPerson: '', phone: '', email: '', address: '', notes: '',
         });
      }
    }
     if (!show) {
         setFormData({
            name: '', contactPerson: '', phone: '', email: '', address: '', notes: '',
         });
     }

  }, [show, isEditing, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ** Validaciones de UI (usando toast) - Nombre es requerido **
    if (!formData.name.trim()) {
        toast.error('El nombre del proveedor es requerido.');
        return;
    }
    // ... otras validaciones ...


    const dataToSubmit = isEditing ? { id: initialData?.id, ...formData } : formData;

    console.log("SupplierFormModal: FormData before submit:", formData);
    console.log("SupplierFormModal: DataToSubmit:", dataToSubmit);

    await onSubmit(dataToSubmit as any);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Proveedor' : 'Añadir Proveedor'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Campo Nombre (Obligatorio) */}
          <Form.Group className="mb-3" controlId="formSupplierName">
            {/* ** CAMBIO AQUÍ: Añade asterisco y elimina "(Obligatorio)" ** */}
            <Form.Label>Nombre del Proveedor <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce el nombre del proveedor"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </Form.Group>

          {/* Campo Persona de Contacto */}
          <Form.Group className="mb-3" controlId="formSupplierContactPerson">
            {/* ** CAMBIO AQUÍ: Elimina "(Opcional)" ** */}
            <Form.Label>Persona de Contacto</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre de la persona de contacto"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </Form.Group>

           {/* Campo Teléfono */}
           <Form.Group className="mb-3" controlId="formSupplierPhone">
             {/* ** CAMBIO AQUÍ: Elimina "(Opcional)" ** */}
             <Form.Label>Teléfono</Form.Label>
             <Form.Control
               type="tel"
               placeholder="Ej: +1234567890"
               name="phone"
               value={formData.phone}
               onChange={handleInputChange}
               disabled={isLoading}
             />
           </Form.Group>

            {/* Campo Email */}
            <Form.Group className="mb-3" controlId="formSupplierEmail">
              {/* ** CAMBIO AQUÍ: Elimina "(Opcional)" ** */}
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ej: contacto@proveedor.com"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </Form.Group>

             {/* Campo Dirección */}
             <Form.Group className="mb-3" controlId="formSupplierAddress">
               {/* ** CAMBIO AQUÍ: Elimina "(Opcional)" ** */}
               <Form.Label>Dirección</Form.Label>
               <Form.Control
                 as="textarea"
                 rows={2}
                 placeholder="Dirección completa"
                 name="address"
                 value={formData.address}
                 onChange={handleInputChange}
                 disabled={isLoading}
               />
             </Form.Group>

             {/* Campo Notas */}
             <Form.Group className="mb-3" controlId="formSupplierNotes">
               {/* ** CAMBIO AQUÍ: Elimina "(Opcional)" ** */}
               <Form.Label>Notas</Form.Label>
               <Form.Control
                 as="textarea"
                 rows={3}
                 placeholder="Notas adicionales sobre el proveedor"
                 name="notes"
                 value={formData.notes}
                 onChange={handleInputChange}
                 disabled={isLoading}
               />
             </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Añadir Proveedor')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
