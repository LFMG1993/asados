import { useProducts } from './hooks/useProducts';
import { useSaleCart } from './hooks/useSaleCart';
import { ProductCard } from './components/ProductCard';
import { finalizeSaleInTransaction } from './services/saleService';
import { toast } from 'react-toastify';

// Esqueleto de los componentes que faltan para que el código sea completo
function CategoryList({ categories, selected, onSelect }: { categories: string[], selected: string, onSelect: (cat: string) => void }) {
  return <div className="d-grid gap-2">{categories.map(c => <button key={c} className={`btn ${selected === c ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => onSelect(c)}>{c}</button>)}</div>;
}

function SaleSummary({ items, total, onFinalize, onClear, onRemove }: { items: any[], total: number, onFinalize: () => void, onClear: () => void, onRemove: (id: string, vName: string) => void }) {
  return <div className="card h-100"><div className="card-body"><h5 className="card-title">Resumen de Venta</h5><ul className="list-group list-group-flush">{items.map(i => <li key={i.productId + i.variantName} className="list-group-item d-flex justify-content-between align-items-center">{i.productName} ({i.variantName}) x{i.quantity} <span>${i.subtotal.toLocaleString()} <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => onRemove(i.productId, i.variantName)}>X</button></span></li>)}</ul><hr /><p className="fs-4 fw-bold">Total: ${total.toLocaleString()}</p><div className="d-grid gap-2"><button className="btn btn-success" onClick={onFinalize} disabled={items.length === 0}>Finalizar Venta</button><button className="btn btn-danger" onClick={onClear} disabled={items.length === 0}>Cancelar</button></div></div></div>
}

export function SalesFeature() {
  const { filteredProducts, categories, selectedCategory, setSelectedCategory, loading, error } = useProducts();
  const { items, addToCart, removeFromCart, clearCart, total } = useSaleCart();

  const handleFinalizeSale = async () => {
    if (items.length === 0) return;
    try {
      // Aquí necesitarías el ID y nombre del usuario logueado
      const saleData = { userId: 'cajero_user_id_example', userName: 'Cajero Principal', items, total, paymentMethod: 'efectivo' as const };
      await finalizeSaleInTransaction(saleData);
      toast.success("Venta finalizada con éxito");
      clearCart();
    } catch (err: any) {
      toast.error(err.message || "Error al finalizar la venta");
      console.error(err);
    }
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid mt-3">
      <div className="row g-3">
        {/* Columna de Categorías */}
        <div className="col-md-2">
          <h4>Categorías</h4>
          <CategoryList categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>
        
        {/* Columna de Productos */}
        <div className="col-md-7">
          <h4>Productos</h4>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            {filteredProducts.map(product => (
              <div className="col" key={product.id}>
                <ProductCard product={product} onAddToCart={addToCart} />
              </div>
            ))}
          </div>
        </div>

        {/* Columna de Resumen de Venta */}
        <div className="col-md-3">
          <div style={{ position: 'sticky', top: '1rem' }}>
            <SaleSummary items={items} total={total} onFinalize={handleFinalizeSale} onClear={clearCart} onRemove={removeFromCart} />
          </div>
        </div>
      </div>
    </div>
  );
}