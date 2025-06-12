import React, { useEffect, useState } from 'react';
import SliderBar from "../../components/dashboard/slider";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../models/firebase'; // Asumiendo la ruta correcta

// Interfaz ajustada
interface ProductData {
    id: string; // El ID del documento de Firestore
    category: string;
    currentStock: number;
    description: string;
    isDivisible: boolean;
    name: string; // Este es el nombre del producto
    price: number;
    stockUnit: string;
    // Si tienes una URL de imagen, agrégala
    // imagenUrl?: string;
}

export function Sales() {
    const [productsData, setProductsData] = useState<ProductData[]>([]); // Cambiado a productsData
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductsData = async () => { // Cambiado el nombre de la función
            try {
                setLoading(true);
                // Cambia 'ventas' al nombre de tu colección de productos
                const productsCollection = collection(db, 'products'); // <-- ¡Verifica el nombre de tu colección!
                const productsSnapshot = await getDocs(productsCollection);
                const productsList = productsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    // Asegúrate de que los nombres de campo aquí coincidan exactamente con Firestore
                    category: doc.data().category,
                    currentStock: doc.data().currentStock,
                    description: doc.data().description,
                    isDivisible: doc.data().isDivisible,
                    name: doc.data().name, // <-- Usar el campo 'name'
                    price: doc.data().price,
                    stockUnit: doc.data().stockUnit,
                    // Si tienes imagenUrl, tráela aquí:
                    // imagenUrl: doc.data().imagenUrl,
                }));
                setProductsData(productsList); // Actualiza el estado con los datos de productos
                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching products data:", err); // Mensaje de error ajustado
                setError("Error al cargar los datos de productos."); // Mensaje de error ajustado
                setLoading(false);
            }
        };

        fetchProductsData(); // Ejecutar la función

    }, []);

    // Renderizar mientras se carga o si hay un error
    if (loading) {
        return (
            <SliderBar>
                <div>Cargando datos de productos...</div> {/* Mensaje de carga ajustado */}
            </SliderBar>
        );
    }

    if (error) {
        return (
            <SliderBar>
                <div style={{ color: 'red' }}>Error: {error}</div>
            </SliderBar>
        );
    }

    // Renderizar las tarjetas con los datos de los productos
    return (
        <SliderBar>
            <h2>Listado de Productos</h2> {/* Título ajustado */}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {productsData.map(product => ( // Cambiado a productsData.map
                    <div className="card" style={{ width: '18rem' }} key={product.id}>
                        {/* Usa la imagen del producto si existe, de lo contrario usa un placeholder */}
                        {/* <img src={product.imagenUrl || 'https://via.placeholder.com/150'} className="card-img-top" alt={`Imagen de ${product.name}`} /> */}

                        <div className="card-body">
                            {/* Mostrar el nombre del producto */}
                            <h5 className="card-title">{product.name}</h5>

                            {/* Mostrar la descripción */}
                            <p className="card-text">{product.description}</p>

                            {/* Puedes mostrar otros campos aquí si lo deseas */}
                            <p className="card-text">Precio: ${product.price}</p>
                            <p className="card-text">Stock: {product.currentStock}</p>
                            <p className="card-text">Stock Unitario:{product.stockUnit}</p>
                            <p className="card-text">Categoría: {product.category}</p>

                            {/* Botón u otro elemento de acción */}
                            <a href="#" className="btn btn-primary">Ver Detalles</a>
                        </div>
                    </div>
                ))}
            </div>
        </SliderBar>
    );
}

export default Sales;
