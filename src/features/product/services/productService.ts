// src/features/sales/services/productService.ts

import {
  collection,
  getDocs,
  query,
  doc,
  addDoc,
  updateDoc,
  deleteDoc
  // Importa getDoc si necesitas leer un documento antes de eliminar su imagen
  // import { getDoc } from 'firebase/firestore';
} from 'firebase/firestore';
import { db } from '../../../lib/firebase'; // VERIFICA esta ruta

// ** Importaciones de Firebase Storage **
// Asegúrate de que tu archivo firebase.ts exporta 'storage'
import { storage } from '../../../lib/firebase'; // VERIFICA esta ruta
import {
  ref,             // Para crear referencias en Storage
  uploadBytesResumable, // Para subir archivos con progreso
  getDownloadURL, // Para obtener la URL de descarga después de subir
  deleteObject      // Para eliminar archivos de Storage
} from 'firebase/storage';

// ** Importa el tipo Product actualizado **
import type { Product } from '../../../types/product.types'; // VERIFICA esta ruta

const productsCollectionRef = collection(db, 'products');

// ** READ (Asegúrate de que el mapeo coincide con tu tipo Product actual) **
export const getProducts = async (): Promise<Product[]> => {
  console.log("Service: Calling getProducts"); // Log para depuración
  try {
    const q = query(productsCollectionRef);
    const querySnapshot = await getDocs(q);
    console.log("Service: Query snapshot obtained:", querySnapshot.docs.length, "documents found."); // Log conteo

    const products: Product[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // ** ASEGÚRATE DE QUE ESTE MAPEO COINCIDE CON TU ÚLTIMO TIPO `Product` **
      // Tu último tipo Product que me mostraste tenía: id, name, description?, category, imageUrl?, baseStockUnit, currentStock
      // El mapeo que tienes ahora incluye: stockUnit, price, isDivisible, active
      // ¡Debes asegurarte de que el mapeo coincide con la DEFINICIÓN REAL de tu tipo Product!
      console.log(`Service: Mapping document ID: ${doc.id}, Data:`, data); // Log datos crudos

      return {
        id: doc.id,
        name: data.name,
        description: data.description || '', // description es opcional
        category: data.category, // category (parece que ahora tienes baseStockUnit en lugar de category en el tipo?) REVISA TIPO
        imageUrl: data.imageUrl || '',       // imageUrl es opcional
        // Los siguientes campos estaban en tu último código, pero ¿están en tu TIPO `Product`?
        stockUnit: data.stockUnit, // ¿stockUnit vs baseStockUnit?
        currentStock: data.currentStock,
        price: data.price, // ¿price a nivel de producto?
        isDivisible: data.isDivisible, // ¿isDivisible en tipo?
        active: data.active, // ¿active en tipo?
      } as Product; // Añade type assertion si el IDE lo sugiere
    });

    console.log("Service: Mapped products array before returning:", products); // Log arreglo final
    return products;
  } catch (error: any) {
    console.error("Service: Error fetching products:", error); // Log errores
    throw error; // Re-lanza
  }
};

// ** Funciones para Firebase Storage **

// Función para subir una imagen a Storage
// filename: el nombre que se le dará al archivo en Storage (ej. 'product_images/RodPvvb8VRDxm3iRAvFb_timestamp.jpg')
// file: el objeto File del input de archivo
// onProgress: una función opcional para reportar el progreso (0-100)
export const uploadProductImage = async (filename: string, file: File, onProgress?: (progress: number) => void): Promise<string> => {
  console.log("Service: Starting image upload for filename:", filename); // Log inicio subida

  // Crea una referencia a la ubicación en Storage donde se guardará la imagen
  const storageRef = ref(storage, `product_images/${filename}`);
  // Crea la tarea de subida
  const uploadTask = uploadBytesResumable(storageRef, file);

  // Devuelve una Promesa para manejar el resultado de la subida de forma asíncrona
  return new Promise((resolve, reject) => {
    // Escucha los eventos de estado de la subida
    uploadTask.on('state_changed',
      (snapshot) => {
        // Calcula y reporta el progreso
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress); // Llama al callback de progreso si se proporciona
        }
        console.log('Service: Upload progress ' + progress.toFixed(0) + '% done'); // Log progreso
        // Puedes añadir lógica aquí basada en snapshot.state ('paused', 'running')
      },
      (error) => {
        // Maneja errores de subida
        console.error("Service: Error uploading image:", error); // Log error
        reject(error); // Rechaza la promesa
      },
      async () => {
        // Cuando la subida se completa exitosamente
        console.log('Service: Upload complete'); // Log subida completa
        try {
          // Obtiene la URL de descarga del archivo subido
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('Service: File available at', downloadURL); // Log URL
          resolve(downloadURL); // Resuelve la promesa con la URL
        } catch (error) {
          console.error("Service: Error getting download URL:", error); // Log error URL
          reject(error); // Rechaza la promesa
        }
      }
    );
  });
};

// Función para eliminar una imagen de Storage por su URL
// ** Importante:** Eliminar por URL es menos robusto que por path de Storage.
// Considera guardar el path de Storage (ej. 'product_images/nombre_archivo.jpg') en Firestore
// y usar ese path para eliminar.
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
    console.log("Service: Attempting to delete image with URL:", imageUrl); // Log eliminación

    // ** Esta lógica para obtener la referencia desde la URL puede necesitar ajuste **
    // dependiendo del formato de tus URLs y si el path de Storage se guarda en la URL.
    // Un enfoque más seguro es guardar el path real de Storage (ej. 'product_images/...') en Firestore.
    try {
        // Intenta crear una referencia de Storage a partir de la URL
        // Esto podría fallar si la URL no es el formato esperado.
        // Si guardaste el path real en Firestore, úsalo así:
        // const imagePath = product.imagePath; // Asumiendo que product.imagePath está en Firestore
        // const storageRef = ref(storage, imagePath);
        const storageRef = ref(storage, imageUrl); // Esto podría necesitar ajuste

        await deleteObject(storageRef); // Elimina el objeto en Storage
        console.log("Service: Image deleted successfully for URL:", imageUrl); // Log éxito
    } catch (error: any) {
        // Maneja errores (ej. archivo no encontrado, permisos)
        console.warn("Service: Could not delete image or image did not exist:", error); // Usa warn si no es un error crítico
        // No lances un error si la eliminación de la imagen falla, ya que la operación principal
        // (ej. eliminar el producto) puede continuar.
    }
};


// ** CREATE **
// productData debe incluir todos los campos del tipo Product, incluyendo 'imageUrl' (puede ser "" o la URL de Storage)
export const addProduct = async (productData: Omit<Product, 'id'>): Promise<string> => {
  console.log("Service: addProduct called with data (expecting imageUrl):", productData); // Log datos
  try {
    // Asegúrate de que productData.imageUrl está presente (incluso como "")
    const dataToSave = { ...productData, imageUrl: productData.imageUrl || '' }; // Asegura que imageUrl no es undefined
    const docRef = await addDoc(productsCollectionRef, dataToSave); // Añade a Firestore
    console.log("Service: Product added with ID:", docRef.id); // Log ID
    return docRef.id; // Devuelve el ID
  } catch (error) {
    console.error("Service: Error adding product:", error); // Log error
    throw error; // Re-lanza
  }
};

// ** UPDATE **
// updateData puede ser parcial, puede incluir 'imageUrl' si la imagen cambió/eliminó
export const updateProduct = async (productId: string, updateData: Partial<Product>): Promise<void> => {
  console.log(`Service: updateProduct called for ID: ${productId}, Data:`, updateData); // Log datos
  try {
    // Asegúrate de que updateData.imageUrl si existe, no es undefined (puede ser "" o la nueva URL)
    // Permite undefined si imageUrl no se está actualizando.
     const dataToUpdate = { ...updateData, imageUrl: updateData.imageUrl === undefined ? undefined : updateData.imageUrl || '' };
    const productDocRef = doc(db, 'products', productId); // Referencia al documento
    await updateDoc(productDocRef, dataToUpdate); // Actualiza en Firestore
    console.log("Service: Product updated with ID:", productId); // Log éxito
  } catch (error) {
    console.error("Service: Error updating product:", error); // Log error
    throw error; // Re-lanza
  }
};

// ** DELETE **
export const deleteProduct = async (productId: string): Promise<void> => {
  console.log("Service: deleteProduct called for ID:", productId); // Log ID
  try {
    // ** Opcional: Eliminar la imagen de Storage al eliminar el producto **
    // Para hacer esto, necesitas leer el documento de Firestore antes de eliminarlo
    // para obtener la imageUrl.
    // Agrega import { getDoc } from 'firebase/firestore'; arriba.
    // const productDoc = await getDoc(doc(db, 'products', productId));
    // if (productDoc.exists() && productDoc.data()?.imageUrl) {
    //    await deleteProductImage(productDoc.data()?.imageUrl); // Llama a la función de eliminación
    // }

    const productDocRef = doc(db, 'products', productId); // Referencia al documento
    await deleteDoc(productDocRef); // Elimina el documento de Firestore
    console.log("Service: Product deleted with ID:", productId); // Log éxito
  } catch (error) {
    console.error("Service: Error deleting product:", error); // Log error
    throw error; // Re-lanza
  }
};
