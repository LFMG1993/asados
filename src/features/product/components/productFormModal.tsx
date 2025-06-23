// src/features/sales/components/ProductFormModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import type { Product } from '../../../types'; // Asegúrate de la ruta correcta

// Define las propiedades que el modal espera recibir
interface ProductFormModalProps {
  show: boolean; // Booleano para controlar si el modal está visible
  onHide: () => void; // Función para cerrar el modal
  onSubmit: (productData: Omit<Product, 'id'> | Partial<Product>) => Promise<void>; // Función a llamar al enviar el formulario (añadir o editar)
  isEditing: boolean; // Booleano para saber si estamos editando o añadiendo
  initialData?: Product; // Datos iniciales del producto si estamos editando
  isLoading: boolean; // Estado de carga de la operación de submit
}

export function ProductFormModal({ show, onHide, onSubmit, isEditing, initialData, isLoading }: ProductFormModalProps) {
  // Estado local para los datos del formulario
  // Inicializa con los datos del producto si estamos editando, o con valores por defecto si añadimos
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    imageUrl: '',
    variants: [{ name: 'Default', price: 0, currentStock: 0 }], // Ejemplo: una variante por defecto
  });

  // Sincroniza el estado del formulario con los datos iniciales cuando el modal se abre para editar
  useEffect(() => {
    if (show && isEditing && initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        imageUrl: initialData.imageUrl,
        variants: initialData.variants.length > 0 ? initialData.variants : [{ name: 'Default', price: 0, currentStock: 0 }],
      });
    } else if (show && !isEditing) {
      // Reinicia el formulario si se abre para añadir un nuevo producto
       setFormData({
         name: '',
         description: '',
         imageUrl: '',
         variants: [{ name: 'Default', price: 0, stock: 0 }],
       });
    }
  }, [show, isEditing, initialData]); // Este efecto se ejecuta cuando show, isEditing o initialData cambian

  // Maneja cambios en los campos del formulario principal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Maneja cambios en los campos de las variantes
  const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newVariants = [...formData.variants];
    // Convierte a número si es price o stock
    (newVariants[index] as any)[name] = (name === 'price' || name === 'stock') ? parseFloat(value) || 0 : value;
    setFormData({ ...formData, variants: newVariants });
  };

  // Añade una nueva variante
  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: '', price: 0, stock: 0 }],
    });
  };

  // Elimina una variante
  const handleRemoveVariant = (index: number) => {
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
    setFormData({ ...formData, variants: newVariants });
  };


  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita el envío por defecto del formulario

    // Puedes añadir validación básica aquí si es necesario
    if (!formData.name.trim()) {
        alert('El nombre del producto es requerido.');
        return;
    }
    if (formData.variants.length === 0) {
         alert('Debe haber al menos una variante.');
         return;
    }
     // Validación básica para variantes
     for (const variant of formData.variants) {
         if (!variant.name.trim()) {
             alert('El nombre de la variante no puede estar vacío.');
             return;
         }
         if (isNaN(variant.price) || variant.price < 0) {
              alert('El precio de la variante debe ser un número positivo.');
              return;
         }
          if (isNaN(variant.stock) || variant.stock < 0) {
               alert('El stock de la variante debe ser un número positivo o cero.');
               return;
          }
     }


    // Llama a la función onSubmit pasada desde el padre
    // Si estamos editando, incluimos el ID del producto original
    const dataToSubmit = isEditing ? { ...formData, id: initialData?.id } : formData;

    await onSubmit(dataToSubmit); // La función onSubmit en el padre manejará la llamada a addProduct/updateProduct
    // El padre cerrará el modal después del envío exitoso
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Editar Producto' : 'Añadir Producto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Formulario del producto */}
        <Form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <Form.Group className="mb-3" controlId="formProductName">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce el nombre del producto"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required // Marcamos como requerido a nivel HTML
            />
          </Form.Group>

          {/* Campo Descripción */}
          <Form.Group className="mb-3" controlId="formProductDescription">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea" // Usa textarea para descripciones más largas
              rows={3}
              placeholder="Introduce una descripción del producto"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>

           {/* Campo URL de Imagen (opcional) */}
           <Form.Group className="mb-3" controlId="formProductImageUrl">
             <Form.Label>URL de Imagen (Opcional)</Form.Label>
             <Form.Control
               type="text"
               placeholder="https://..."
               name="imageUrl"
               value={formData.imageUrl}
               onChange={handleInputChange}
             />
           </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {/* Muestra texto diferente si estamos cargando */}
          {isLoading ? (isEditing ? 'Guardando Cambios...' : 'Añadiendo...') : (isEditing ? 'Guardar Cambios' : 'Añadir Producto')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
