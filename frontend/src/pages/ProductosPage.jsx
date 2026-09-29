import { useState, useEffect } from 'react';
import { Package, Plus, Search, Tag, Edit2, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);

  // Estados para el formulario (crear / editar)
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [stock, setStock] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');

  // Estados para el modal de eliminación personalizado
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  useEffect(() => {
    // Aquí puedes conectar el fetch a tu API: /api/productos
  }, []);

  const abrirModalNuevo = () => {
    setProductoEnEdicion(null);
    setCodigo('');
    setNombre('');
    setCategoria('');
    setPrecioCosto('');
    setPrecioVenta('');
    setStock('');
    setStockMinimo('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (prod) => {
    setProductoEnEdicion(prod);
    setCodigo(prod.codigo || '');
    setNombre(prod.nombre || '');
    setCategoria(prod.categoria || '');
    setPrecioCosto(prod.precio_costo ? prod.precio_costo.toString() : '');
    setPrecioVenta(prod.precio_venta ? prod.precio_venta.toString() : '');
    setStock(prod.stock ? prod.stock.toString() : '');
    setStockMinimo(prod.stock_minimo ? prod.stock_minimo.toString() : '');
    setModalAbierto(true);
  };

  const confirmarEliminacion = (id) => {
    setIdAEliminar(id);
    setModalEliminarAbierto(true);
  };

  const ejecutarEliminacion = () => {
    setProductos(productos.filter((p) => p.id !== idAEliminar));
    setModalEliminarAbierto(false);
    setIdAEliminar(null);
  };

  const handleGuardarProducto = (e) => {
    e.preventDefault();
    if (!nombre || !codigo) return;

    if (productoEnEdicion) {
      setProductos(productos.map((p) => (
        p.id === productoEnEdicion.id
          ? {
              ...p,
              codigo,
              nombre,
              categoria,
              precio_costo: Number.parseFloat(precioCosto) || 0,
              precio_venta: Number.parseFloat(precioVenta) || 0,
              stock: Number.parseInt(stock, 10) || 0,
              stock_minimo: Number.parseInt(stockMinimo, 10) || 5
            }
          : p
      )));
    } else {
      const nuevo = {
        id: Date.now(),
        codigo,
        nombre,
        categoria,
        precio_costo: Number.parseFloat(precioCosto) || 0,
        precio_venta: Number.parseFloat(precioVenta) || 0,
        stock: Number.parseInt(stock, 10) || 0,
        stock_minimo: Number.parseInt(stockMinimo, 10) || 5
      };
      setProductos([nuevo, ...productos]);
    }

    setModalAbierto(false);
  };

  return (
    <div className="flex-1 p-8 bg-[#07090E] text-slate-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Gestión de Productos</h1>
            <p className="text-sm text-slate-400">Catálogo general de repuestos, accesorios y precios de venta.</p>
          </div>
          <button
            onClick={abrirModalNuevo}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus size={16} /> Nuevo Producto
          </button>
        </div>

        {/* Barra de Búsqueda */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Search size={18} className="text-slate-400 ml-2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por código, nombre o categoría..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
          />
        </div>

        {/* Tabla de Productos */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {productos.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Package size={48} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No hay productos registrados todavía.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/30">
                    <th className="p-4">Código / Nombre</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Precios (Costo / Venta)</th>
                    <th className="p-4">Stock Actual</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {productos.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-white">{p.nombre}</p>
                        <span className="text-xs text-slate-400">Cód: {p.codigo}</span>
                      </td>
                      <td className="p-4 text-xs text-slate-300">
                        <span className="inline-flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                          <Tag size={12} className="text-slate-400" /> {p.categoria || 'General'}
                        </span>
                      </td>
                      <td className="p-4 text-xs">
                        <p className="text-slate-400">Costo: $ {p.precio_costo.toFixed(2)}</p>
                        <p className="font-semibold text-emerald-400">Venta: $ {p.precio_venta.toFixed(2)}</p>
                      </td>
                      <td className="p-4 text-xs">
                        <span className={`font-bold ${p.stock <= p.stock_minimo ? 'text-rose-400' : 'text-white'}`}>
                          {p.stock} unidades
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirModalEditar(p)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors inline-flex items-center gap-1 text-xs"
                            title="Editar producto"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => confirmarEliminacion(p.id)}
                            className="p-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 rounded-xl transition-colors inline-flex items-center gap-1 text-xs"
                            title="Eliminar producto"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Crear / Editar Producto */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">
                {productoEnEdicion ? 'Editar Producto' : 'Registrar Nuevo Producto'}
              </h3>
              <form onSubmit={handleGuardarProducto} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="codigoProd" className="block text-xs font-medium text-slate-400 mb-1">Código *</label>
                    <input
                      id="codigoProd"
                      type="text"
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value)}
                      placeholder="Ej. REP-001"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="categoriaProd" className="block text-xs font-medium text-slate-400 mb-1">Categoría</label>
                    <input
                      id="categoriaProd"
                      type="text"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      placeholder="Ej. Transmisión / Frenos"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="nombreProd" className="block text-xs font-medium text-slate-400 mb-1">Nombre del Producto *</label>
                  <input
                    id="nombreProd"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Kit de arrastre XR 150"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="precioCostoProd" className="block text-xs font-medium text-slate-400 mb-1">Precio de Costo ($)</label>
                    <input
                      id="precioCostoProd"
                      type="number"
                      step="0.01"
                      value={precioCosto}
                      onChange={(e) => setPrecioCosto(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="precioVentaProd" className="block text-xs font-medium text-slate-400 mb-1">Precio de Venta ($)</label>
                    <input
                      id="precioVentaProd"
                      type="number"
                      step="0.01"
                      value={precioVenta}
                      onChange={(e) => setPrecioVenta(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="stockProd" className="block text-xs font-medium text-slate-400 mb-1">Stock Inicial</label>
                    <input
                      id="stockProd"
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="stockMinimoProd" className="block text-xs font-medium text-slate-400 mb-1">Stock Mínimo de Alerta</label>
                    <input
                      id="stockMinimoProd"
                      type="number"
                      value={stockMinimo}
                      onChange={(e) => setStockMinimo(e.target.value)}
                      placeholder="5"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalAbierto(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/20"
                  >
                    {productoEnEdicion ? 'Guardar Cambios' : 'Guardar Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Confirmación Global de Eliminación */}
        <ConfirmModal
          isOpen={modalEliminarAbierto}
          title="¿Estás seguro?"
          message="Esta acción eliminará el producto de forma permanente y no se podrá deshacer."
          onClose={() => setModalEliminarAbierto(false)}
          onConfirm={ejecutarEliminacion}
        />
      </div>
    </div>
  );
}