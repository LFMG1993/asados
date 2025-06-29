// src/features/sales/components/ProductFormModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'; // No necesitamos InputGroup si no usamos variantes
import type { Product, BaseStockUnit } from '../../../types/product.types'; // Importa BaseStockUnit
import { toast } from 'react-toastify'; // Asegúrate de importar toast

// Define los posibles valores para la unidad de stock (para el selector en el formulario)
const stockUnitOptions: BaseStockUnit[] = ['unidades', 'libras', 'porciones'];

// Define las propiedades que el modal espera recibir
interface ProductFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (productData: Omit<Product, 'id'> | Partial<Product>) => Promise<void>;
  isEditing: boolean;
  initialData?: Product;
  isLoading: boolean;
}

export function ProductFormModal({ show, onHide, onSubmit, isEditing, initialData, isLoading }: ProductFormModalProps) {
  // Estado local para los datos del formulario
  // Inicializa con las nuevas propiedades y sin variantes
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: '', // Nueva propiedad
    imageUrl: '',
    stockUnit: 'unidades', // Nueva propiedad, valor por defecto
    currentStock: 0, // Nueva propiedad, valor por defecto
  });

  // Sincroniza el estado del formulario con los datos iniciales cuando el modal se abre
  useEffect(() => {
    if (show) {
      if (isEditing && initialData) {
        // Si es edición, carga los datos del producto existente
        setFormData({
          name: initialData.name,
          description: initialData.description || '',
          price: initialData.price, // Asegura string vacío si es undefined
          category: initialData.category,
          imageUrl: initialData.imageUrl || '',
          stockUnit: initialData.stockUnit,
          currentStock: initialData.currentStock,
        });
      } else {
        // Si es añadir, reinicia el formulario a valores por defecto
         setFormData({
           name: '',
           description: '',
           price: 0,
           category: '',
           imageUrl: '',
           stockUnit: 'unidades',
           currentStock: 0,
         });
      }
    }
  }, [show, isEditing, initialData]); // Este efecto se ejecuta cuando show, isEditing o initialData cambian

  // Maneja cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Convierte currentStock a número
    const updatedValue = name === 'currentStock' ? parseFloat(value) || 0 : value;
    setFormData({ ...formData, [name]: updatedValue });
  };


  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita el envío por defecto del formulario

    // ** Validaciones **
    if (!formData.name.trim()) {
        toast.error('El nombre del producto es requerido.');
        return;
    }
     if (!formData.category.trim()) {
         toast.error('La categoría es requerida.');
         return;
     }
     if (isNaN(formData.currentStock) || formData.currentStock < 0) {
          toast.error('El stock actual debe ser un número positivo o cero.');
          return;
     }
     // Puedes añadir validación para baseStockUnit si quieres asegurar que sea uno de los valores permitidos

    // Prepara los datos a enviar
    // Si es edición, incluimos el ID y los datos completos del formulario
    // Si es añadir, solo enviamos los datos del formulario
    const dataToSubmit = isEditing ? { ...formData, id: initialData?.id } : formData;


    // Llama a la función onSubmit pasada desde el padre
    // El padre manejará la llamada a addProduct/updateProduct y cerrará el modal
    await onSubmit(dataToSubmit);
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
              required
            />
          </Form.Group>

           {/* Campo Categoría */}
           <Form.Group className="mb-3" controlId="formProductCategory">
             <Form.Label>Categoría</Form.Label>
             <Form.Control
               type="text"
               placeholder="Introduce la categoría"
               name="category"
               value={formData.category}
               onChange={handleInputChange}
               required
             />
           </Form.Group>


          {/* Campo Descripción */}
          <Form.Group className="mb-3" controlId="formProductDescription">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
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

            {/* Campos de Stock */}
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="formProductBaseStockUnit">
                        <Form.Label>Unidad de Medida</Form.Label>
                        <Form.Control
                            as="select" // Usa un selector
                            name="baseStockUnit"
                            value={formData.stockUnit}
                            onChange={handleInputChange}
                            required
                        >
                            {/* Mapea las opciones del tipo BaseStockUnit */}
                            {stockUnitOptions.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formProductCurrentStock">
                        <Form.Label>Stock Actual</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="0"
                            name="currentStock"
                            value={formData.currentStock} // El valor debe ser un número o cadena numérica
                            onChange={handleInputChange}
                            required
                            min="0" // Stock no negativo
                        />
                    </Form.Group>
                </Col>
            </Row>

           {/* La sección de Variantes ha sido eliminada */}

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (isEditing ? 'Guardando Cambios...' : 'Añadiendo...') : (isEditing ? 'Guardar Cambios' : 'Añadir Producto')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
