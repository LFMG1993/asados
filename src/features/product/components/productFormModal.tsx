// src/features/sales/components/ProductFormModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, ProgressBar, InputGroup } from 'react-bootstrap'; // Asegúrate de importar InputGroup y ProgressBar
import type { Product, BaseStockUnit } from '../../../types/product.types'; // Asegúrate de la ruta correcta a tus tipos
import { toast } from 'react-toastify';

// Define los posibles valores para la unidad de stock
const stockUnitOptions: BaseStockUnit[] = ['unidades', 'libras', 'porciones'];

// Define las propiedades que el modal espera recibir
interface ProductFormModalProps {
  show: boolean;
  onHide: () => void;
  // onSubmit espera los datos del producto CON la URL de la imagen (si se subió)
  onSubmit: (productData: Omit<Product, 'id'> | Partial<Product>) => Promise<void>;
  isEditing: boolean;
  initialData?: Product;
  // ** Recibe la función de subida de imagen y sus estados del hook **
  // uploadProductImage: (file: File, productId?: string, onProgress?: (progress: number) => void) => Promise<string>; // La función con callback de progreso
  uploadProductImage: (file: File, productId?: string) => Promise<string>; // Puedes usar esta versión si el hook ya gestiona el progreso internamente
  isUploadingImage: boolean;
  uploadProgress: number;
  // Estado de carga general del formulario (submit)
  isLoading: boolean;
  // Opcional: Función para eliminar una imagen existente (si la implementas)
  // onDeleteImage?: (imageUrl: string) => Promise<void>;
}

export function ProductFormModal({
    show,
    onHide,
    onSubmit,
    isEditing,
    initialData,
    uploadProductImage, // Función para subir imagen (viene del hook)
    isUploadingImage, // Estado de carga de la subida (viene del hook)
    uploadProgress, // Progreso de la subida (viene del hook)
    isLoading // Estado de carga general del submit (viene del componente padre)
}: ProductFormModalProps) {
  // Estado local para los datos del formulario (reflejando la estructura de Product sin id)
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    category: '',
    imageUrl: '', // Aquí se almacenará la URL de descarga de Storage
    stockUnit: 'unidades',
    currentStock: 0,
    price: 0,
    active: true,
  });

  // ** Estado local para el archivo de imagen seleccionado por el usuario **
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  // ** Estado local para la URL de vista previa de la imagen (puede ser URL de Storage o URL de datos) **
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // ** Estado local para indicar si se ha marcado la imagen existente para eliminar **
  // Esto es útil si quieres un checkbox "Eliminar imagen" en modo edición
  // const [deleteExistingImage, setDeleteExistingImage] = useState(false);


  // Sincroniza el estado del formulario con los datos iniciales cuando el modal se abre
  useEffect(() => {
    if (show) {
      if (isEditing && initialData) {
        // Si es edición, carga los datos del producto existente
        setFormData({
          name: initialData.name,
          description: initialData.description || '',
          category: initialData.category,
          imageUrl: initialData.imageUrl || '', // Carga la URL existente de la BD
          stockUnit: initialData.stockUnit,
          currentStock: initialData.currentStock,
          price: initialData.price,
          active: initialData.active,
        });
        // Establece la vista previa inicial con la URL existente
        setImagePreviewUrl(initialData.imageUrl || null);
        // setDeleteExistingImage(false); // Reinicia el estado de eliminar imagen
      } else {
        // Si es añadir, reinicia el formulario a valores por defecto
         setFormData({
           name: '',
           description: '',
           category: '',
           imageUrl: '', // Sin URL inicial al añadir
           stockUnit: 'unidades',
           price: 0,
           active: true,
           currentStock: 0,
         });
         // Reinicia también los estados de imagen seleccionada y vista previa
         setSelectedImageFile(null);
         setImagePreviewUrl(null);
         // setDeleteExistingImage(false);
      }
    }
     // Limpiar la vista previa y archivo seleccionado al cerrar el modal
     if (!show) {
         setSelectedImageFile(null);
         setImagePreviewUrl(null);
         // setDeleteExistingImage(false);
     }

  }, [show, isEditing, initialData]); // Depende de show, isEditing o initialData


  // Effect para crear la URL de vista previa para el archivo seleccionado localmente
  useEffect(() => {
    if (selectedImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string); // Establece la URL de datos para vista previa
      };
      reader.readAsDataURL(selectedImageFile); // Lee el archivo como URL de datos (para mostrar en el navegador)
    } else {
      // Si no hay archivo seleccionado
      // Si estamos editando y no se seleccionó un nuevo archivo, usamos la URL original para la vista previa
       if (isEditing) {
          setImagePreviewUrl(initialData?.imageUrl || null);
       } else {
         // Si estamos añadiendo y no hay archivo, la vista previa es nula
         setImagePreviewUrl(null);
       }
    }
  }, [selectedImageFile, isEditing, initialData?.imageUrl]); // Depende del archivo seleccionado y de la URL original en edición


  // Maneja cambios en los campos del formulario principal (texto, select, number)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Convierte currentStock a número
    const updatedValue = name === 'currentStock' ? parseFloat(value) || 0 : value;
    setFormData({ ...formData, [name]: updatedValue });
  };

   // ** Maneja el cambio en el campo de archivo de imagen **
   const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       const file = e.target.files?.[0]; // Obtiene el primer archivo seleccionado
       if (file) {
           setSelectedImageFile(file); // Almacena el objeto File
           // setDeleteExistingImage(false); // Si existía un checkbox, desmarcarlo
       } else {
           setSelectedImageFile(null); // Limpia si no se seleccionó archivo
           // La vista previa se manejará en el useEffect
       }
   };

   // Función para eliminar la imagen seleccionada o marcar la existente para eliminación
   const handleRemoveImage = () => {
       setSelectedImageFile(null); // Limpia el archivo seleccionado
       setImagePreviewUrl(null); // Limpia la vista previa
       // Si estamos editando y había una imagen existente, marcamos para eliminar o vaciamos la URL
       if (isEditing && initialData?.imageUrl) {
           // Opción 1: Marcar para eliminar (si tienes un checkbox)
           // setDeleteExistingImage(true);
           // Opción 2: Vaciar la URL en el estado del formulario (esto indica que la imagen antigua debe ser eliminada/ignorada al guardar)
            setFormData(prev => ({ ...prev, imageUrl: '' }));
       } else {
           // Si no es edición o no había imagen, simplemente aseguramos que imageUrl esté vacío
           setFormData(prev => ({ ...prev, imageUrl: '' }));
       }
       // NOTA: La eliminación REAL de Firebase Storage se gestionará al guardar el formulario en handleSubmit
   };


  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ** Validaciones (usando toast) **
    if (!formData.name.trim()) { toast.error('El nombre del producto es requerido.'); return; }
    if (!formData.category.trim()) { toast.error('La categoría es requerida.'); return; }
    if (isNaN(formData.currentStock) || formData.currentStock < 0) { toast.error('El stock actual debe ser un número positivo o cero.'); return; }

    // Bloquea el botón de submit si ya estamos subiendo una imagen o realizando la operación principal
    if (isUploadingImage || isLoading) {
        return;
    }

    let finalImageUrl = formData.imageUrl; // Empieza con la URL actual del estado (puede ser vacía o la URL vieja)

    // ** Lógica de Subida de Imagen ANTES de enviar los datos del producto a Firestore **
    if (selectedImageFile) {
        // Si el usuario seleccionó un nuevo archivo, lo subimos
        try {
            console.log("Modal: Subiendo nueva imagen...");
            // Llama a la función de subida del hook. El hook gestiona los estados isUploadingImage/uploadProgress.
            const url = await uploadProductImage(selectedImageFile, initialData?.id); // Pasa initialData?.id si es edición para el nombre del archivo
            finalImageUrl = url; // La URL final será la que nos dé Storage

            // Opcional: Si estamos editando y había una imagen existente (initialData.imageUrl)
            // que NO ha sido marcada para eliminación (si usas checkbox) y seleccionamos una NUEVA imagen,
            // podrías querer eliminar la imagen antigua de Storage aquí o en el servicio updateProduct.
            // Esto requiere una función para eliminar por URL/path y saber la URL antigua.
            // await deleteProductImage(initialData.imageUrl); // Requeriría pasar esta función

            console.log("Modal: Subida de imagen completa. URL:", finalImageUrl);

        } catch (err: any) {
            console.error("Modal: Error al subir imagen:", err);
            toast.error(`Error al subir imagen: ${err.message}`);
            // Si falla la subida de imagen, NO procedemos con el submit del formulario
            return;
        }
    } else if (isEditing && initialData?.imageUrl && formData.imageUrl === '') {
         // Caso de edición: Si no se seleccionó un nuevo archivo PERO formData.imageUrl está vacío
         // y *había* una initialData.imageUrl, significa que el usuario usó el botón "Quitar Imagen".
         // En este caso, la URL final es "", y la imagen antigua DEBERÍA eliminarse de Storage.
         // Esto se puede hacer aquí o en el updateProduct del servicio/hook.
         // Si lo haces aquí: await deleteProductImage(initialData.imageUrl); // Necesitarías la función
         finalImageUrl = ''; // La URL en Firestore será vacía
          console.log("Modal: Imagen existente marcada para eliminación.");

    }
     // Si selectedImageFile es null Y no es el caso de "quitar imagen" en edición,
     // finalImageUrl mantiene el valor de formData.imageUrl (la URL original o "")

    // Prepara los datos a enviar para Firestore
    // Incluye la finalImageUrl obtenida (ya sea nueva URL, URL vieja, o "")
    const dataToSubmit = isEditing ?
        { ...formData, id: initialData?.id, imageUrl: finalImageUrl } // Incluye el ID y la URL final
        : { ...formData, imageUrl: finalImageUrl }; // Incluye la URL final (que puede ser "" si no hay imagen)


    // Llama a la función onSubmit pasada desde el padre
    // El padre manejará la llamada a addProduct/updateProduct y cerrará el modal
    console.log("Modal: Calling onSubmit with data:", dataToSubmit);
    await onSubmit(dataToSubmit);
    // El padre cerrará el modal después del éxito
  };

  // Deshabilita los botones de acción si se está subiendo una imagen o la operación general
  const isSubmitting = isUploadingImage || isLoading;


  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static" keyboard={false}> {/* Modal más grande y no cerrable al hacer clic fuera/Esc */}
      <Modal.Header closeButton={!isSubmitting}> {/* Oculta el botón de cerrar si está subiendo/cargando */}
        <Modal.Title>{isEditing ? 'Editar Producto' : 'Añadir Producto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Formulario del producto */}
        <Form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <Form.Group className="mb-3" controlId="formProductName">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control type="text" placeholder="Introduce el nombre" name="name" value={formData.name} onChange={handleInputChange} required disabled={isSubmitting} />
          </Form.Group>

           {/* Campo Categoría */}
           <Form.Group className="mb-3" controlId="formProductCategory">
             <Form.Label>Categoría</Form.Label>
             <Form.Control type="text" placeholder="Introduce la categoría" name="category" value={formData.category} onChange={handleInputChange} required disabled={isSubmitting} />
           </Form.Group>

          {/* Campo Descripción */}
          <Form.Group className="mb-3" controlId="formProductDescription">
            <Form.Label>Descripción (Opcional)</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Introduce una descripción" name="description" value={formData.description} onChange={handleInputChange} disabled={isSubmitting} />
          </Form.Group>

           {/* Campo URL de Imagen (Ahora gestionado por subida) */}
           <Form.Group className="mb-3" controlId="formProductImageFile">
             <Form.Label>Imagen del Producto</Form.Label>
             {/* InputGroup permite agrupar el input file con el botón de quitar si usas uno al lado */}
             <InputGroup>
                 <Form.Control type="file" accept="image/*" onChange={handleImageFileChange} disabled={isSubmitting || isUploadingImage} /> {/* Deshabilita si está subiendo o cargando */}
                  {/* Si quieres un botón de quitar al lado del input: */}
                  {/* <Button variant="outline-secondary" onClick={handleRemoveImage} disabled={!selectedImageFile && !imagePreviewUrl || isSubmitting}>Quitar</Button> */}
             </InputGroup>


             {/* ** Vista previa de la imagen y botón de quitar ** */}
              {(imagePreviewUrl || isUploadingImage) && ( // Muestra el div si hay preview o subiendo
                  <div className="mt-3 d-flex align-items-center"> {/* Alinea la imagen y el botón */}
                      {imagePreviewUrl && (
                          <img src={imagePreviewUrl} alt="Vista previa" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} className="img-thumbnail me-2" />
                      )}
                       {/* Botón para eliminar la imagen seleccionada/existente */}
                       {/* Muestra el botón si hay preview Y NO se está subiendo o cargando */}
                       {imagePreviewUrl && !isSubmitting && !isUploadingImage && (
                           <Button variant="outline-danger" size="sm" onClick={handleRemoveImage}>
                              Quitar Imagen
                           </Button>
                       )}
                       {/* Mensaje o Spinner si se está subiendo */}
                        {isUploadingImage && <span className="text-muted ms-2">Subiendo imagen...</span>}
                  </div>
              )}
               {/* Mensaje de ayuda si no hay imagen seleccionada/existente ni subiendo */}
               {!selectedImageFile && !imagePreviewUrl && !isUploadingImage && (
                   <Form.Text muted>Selecciona una imagen para el producto (archivos .jpg, .png, etc.).</Form.Text>
               )}

               {/* Indicador de carga de la subida de imagen */}
               {isUploadingImage && (
                   <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-2" />
               )}
           </Form.Group>

            {/* Campos de Stock */}
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="formProductBaseStockUnit">
                        <Form.Label>Unidad de Medida</Form.Label>
                        <Form.Control as="select" name="baseStockUnit" value={formData.stockUnit} onChange={handleInputChange} required disabled={isSubmitting} >
                            {stockUnitOptions.map(unit => (<option key={unit} value={unit}>{unit}</option>))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formProductCurrentStock">
                        <Form.Label>Stock Actual</Form.Label>
                        <Form.Control type="number" placeholder="0" name="currentStock" value={formData.currentStock} onChange={handleInputChange} required min="0" disabled={isSubmitting} />
                    </Form.Group>
                </Col>
            </Row>

           {/* La sección de Variantes ha sido eliminada */}

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}> {/* Deshabilita si está subiendo o cargando */}
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}> {/* Deshabilita si está subiendo o cargando */}
          {isSubmitting ? (isUploadingImage ? 'Subiendo Imagen...' : 'Guardando...') : (isEditing ? 'Guardar Cambios' : 'Añadir Producto')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
