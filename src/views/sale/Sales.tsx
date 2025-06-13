import React, { useEffect, useState } from 'react';
import SliderBar from "../../components/dashboard/slider";
import { getProducts, updateProductStock } from '../../models/salesService';
import "../../styles/sales.css"; // Import the CSS file

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

interface SaleItem extends ProductData {
    quantity: number;
    subtotal: number;
}

export function Sales() {
    const [productsData, setProductsData] = useState<ProductData[]>([]); // Estado para los datos de productos
    const [currentSale, setCurrentSale] = useState<SaleItem[]>([]); // Estado para la venta actual
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState<string | null>(null); // Estado de error

    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                setLoading(true);
                const productsList = await getProducts(); // Llama a la función del servicio
                setProductsData(productsList);
                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching products data:", err);
                setError("Error al cargar los datos de productos.");
                setLoading(false);
            }
        };
        fetchProductsData();
    }, []);

    const handleAddToSale = (product: ProductData, quantity: number): void => {
        // Asegura que la cantidad sea un número positivo para agregar o reemplazar
        if (quantity <= 0) return;

        const existingItemIndex = currentSale.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            // Si el producto ya existe, crea una copia de la venta actual
            const updatedSale = [...currentSale];
            // Reemplaza la cantidad existente con la nueva cantidad
            updatedSale[existingItemIndex].quantity = quantity;
            updatedSale[existingItemIndex].subtotal = updatedSale[existingItemIndex].quantity * product.price;
            setCurrentSale(updatedSale);
        } else {
            // Si el producto no existe, verifica si la cantidad inicial excede el stock
            if (quantity > product.currentStock) {
                alert("La cantidad a agregar excede el stock disponible.");
                return; // No agregar el ítem si la cantidad excede el stock
            }
            const newItem: SaleItem = {
                ...product,
                // Asegúrate de no agregar más cantidad de la disponible en stock
                quantity: quantity,
                subtotal: quantity * product.price,
            };
            setCurrentSale([...currentSale, newItem]);
        }
    };

    const handleFinalizeSale = async (): Promise<void> => {

        if (currentSale.length === 0) {
            alert("No hay artículos en la venta para finalizar.");
            return;
        }

        try {
            await updateProductStock(currentSale); // Llama a la función del servicio

            alert("Venta finalizada con éxito.");
            setCurrentSale([]); // Limpiar la venta actual después de finalizar
        } catch (error) {
            console.error("Error al finalizar la venta:", error);
            alert("Hubo un error al finalizar la venta.");
        }
    };

    // Renderizar mientras se carga o si hay un error
    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>Error: {error}</p>;

    // Renderizar las tarjetas con los datos de los productos
    return (
        <SliderBar>
            <h2>Listado de Productos</h2> {/* Título ajustado */}
            <div className="sales-container">
                <div className="product-list-container product-list-style">
                    {productsData.map(product => ( // Cambiado a productsData.map
                        <div className="card" style={{ width: '30%' }} key={product.id}>
                            {/* Usa la imagen del producto si existe, de lo contrario usa un placeholder */}
                            {/* <img src={product.imageUrl || 'https://via.placeholder.com/150'} className="card-img-top" alt={`Imagen de ${product.name}`} /> */}

                            <div className="card-body">
                                {/* Mostrar el nombre del producto */}
                                <h5 className="card-title">{product.name}</h5>

                                {/* Mostrar la descripción */}
                                <p className="card-text">{product.description}</p>

                                {/* Puedes mostrar otros campos aquí si lo deseas */}
                                <p className="card-text">Precio: ${product.price}</p>
                                <p className="card-text">Stock: {product.currentStock}</p>
                                <p className="card-text">
                                    Stock Unitario:{' '}
                                    {product.stockUnit}
                                </p>
                                <p className="card-text">Categoría: {product.category}</p>

                                {/* Selector de Cantidad */}
                                <div className="mb-3">
                                    <label htmlFor={`quantity-${product.id}`} className="form-label">Cantidad:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id={`quantity-${product.id}`}
                                        defaultValue={1}
                                        min={1}
                                        max={product.currentStock}
                                    // Puedes agregar un estado local para manejar la cantidad si necesitas validación en tiempo real
                                    />
                                </div>

                                {/* Botón para agregar a la venta */}
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        const quantityInput = document.getElementById(`quantity-${product.id}`) as HTMLInputElement;
                                        const quantity = parseInt(quantityInput.value, 10);
                                        handleAddToSale(product, quantity);
                                    }}
                                >
                                    Agregar a Venta
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Vista en tiempo real de la venta */}
                <div className="sale-view-card sale-view-card">
                    {/* Contenedor para el contenido de la venta (tabla y total) */}
                    <div style={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        marginBottom: '1rem'
                    }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Venta Actual</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th className="text-center">Cantidad</th>
                                    <th className="text-end">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSale.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-center">No hay productos en la venta.</td>
                                    </tr>
                                ) : (
                                    currentSale.map(item => (
                                        <tr key={item.id}> {/* Aquí se esperaba la etiqueta de cierre </tr> */}
                                            <td>{item.name}</td>
                                            <td className="text-end">
                                                {item.quantity} {/* Display quantity as plain text */}
                                            </td>
                                            <td className="text-end">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.subtotal)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="text-end fw-bold fs-5 mt-3">
                            Total: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(currentSale.reduce((sum, item) => sum + item.subtotal, 0))}
                        </div>
                    </div>
                    {/* Botón Finalizar Venta */}
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}> {/* Added marginTop for separation */}
                        <button
                            className="btn btn-success" // Clase para botón de Bootstrap
                            onClick={handleFinalizeSale}
                            disabled={currentSale.length === 0} // Deshabilita si no hay productos en la venta
                            style={{
                                padding: '10px 20px',
                                fontSize: '1.1em'
                            }}
                        >
                            Finalizar Venta
                        </button>
                    </div>
                </div>
            </div>

        </SliderBar>
    );
}

export default Sales;
