import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { Package, Plus, Search, Edit, Trash2, AlertTriangle, Check, X, RefreshCw, Layers } from 'lucide-react';export default function InventarioPage() {
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [mensaje, setMensaje] = useState(null);

  // Estado para el modal de crear/editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [repuestoActual, setRepuestoActual] = useState({
    id_repuesto: null,
    codigo: '',
    nombre: '',
    descripcion: '',
    stock: '',
    precio_compra: '',
    precio_venta: '',
  });

  // Estados para el modal de confirmación de eliminación personalizado
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  // Extraer el array de la respuesta del backend de forma segura
  const obtenerLista = (res) => {
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  };

  // Cargar repuestos desde la API
  const cargarRepuestos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/repuestos');
      setRepuestos(obtenerLista(res));
    } catch (err) {
      console.error('Error al cargar repuestos:', err.message);
      setRepuestos([]);
      setMensaje({ tipo: 'error', texto: 'No se pudo cargar el inventario.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const res = await api.get('/repuestos');
        if (active) {
          setRepuestos(obtenerLista(res));
        }
      } catch (err) {
        if (active) {
          console.error('Error al cargar repuestos:', err.message);
          setRepuestos([]);
          setMensaje({ tipo: 'error', texto: 'No se pudo conectar con el servicio de inventario.' });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [cargarRepuestos]);

  // Abrir modal para crear
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setRepuestoActual({
      id_repuesto: null,
      codigo: '',
      nombre: '',
      descripcion: '',
      stock: '',
      precio_compra: '',
      precio_venta: '',
    });
    setModalAbierto(true);
  };

  // Abrir modal para editar
  const abrirModalEditar = (item) => {
    setModoEdicion(true);
    setRepuestoActual({
      id_repuesto: item.id_repuesto,
      codigo: item.codigo || '',
      nombre: item.nombre || '',
      descripcion: item.descripcion || '',
      stock: item.stock ?? '',
      precio_compra: item.precio_compra ?? '',
      precio_venta: item.precio_venta ?? '',
    });
    setModalAbierto(true);
  };

  // Preparar la eliminación abriendo el modal personalizado
  const eliminarRepuesto = (id) => {
    setIdAEliminar(id);
    setModalEliminarAbierto(true);
  };

  // Ejecutar la eliminación real tras confirmar en el modal
  const confirmarEliminacion = async () => {
    try {
      await api.delete(`/repuestos/${idAEliminar}`);
      setMensaje({ tipo: 'éxito', texto: 'Repuesto eliminado correctamente.' });
      cargarRepuestos();
    } catch (err) {
      console.error('Error al eliminar repuesto:', err.message);
      setMensaje({
        tipo: 'error',
        texto: err.response?.data?.error || 'Error al eliminar el repuesto.',
      });
    } finally {
      setModalEliminarAbierto(false);
      setIdAEliminar(null);
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  // Guardar (Crear o Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await api.put(`/repuestos/${repuestoActual.id_repuesto}`, repuestoActual);
        setMensaje({ tipo: 'éxito', texto: 'Repuesto actualizado correctamente.' });
      } else {
        await api.post('/repuestos', repuestoActual);
        setMensaje({ tipo: 'éxito', texto: 'Nuevo repuesto registrado correctamente.' });
      }
      setModalAbierto(false);
      cargarRepuestos();
    } catch (err) {
      console.error('Error al guardar repuesto:', err.message);
      setMensaje({
        tipo: 'error',
        texto: err.response?.data?.error || 'Error al guardar el repuesto.',
      });
    } finally {
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  // Filtrado seguro
  const repuestosFiltrados = (Array.isArray(repuestos) ? repuestos : []).filter(
    (item) =>
      item?.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
      item?.codigo?.toLowerCase().includes(filtro.toLowerCase()) ||
      item?.descripcion?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-100 space-y-6">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Package className="text-blue-500" /> Control de Inventario
          </h1>
          <p className="text-slate-400 text-sm">Gestiona el stock, precios y repuestos disponibles en el taller.</p>
        </div>

        <button
          onClick={abrirModalCrear}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={18} /> Nuevo Repuesto
        </button>
      </div>

      {/* Alerta flotante */}
      {mensaje && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold ${
            mensaje.tipo === 'éxito'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}
        >
          {mensaje.tipo === 'éxito' ? <Check size={20} /> : <AlertTriangle size={20} />}
          {mensaje.texto}
        </div>
      )}

      {/* Filtro y Recarga */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-md">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Buscar por código, nombre o descripción..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={cargarRepuestos}
          className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 transition-all flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      {/* Tabla de Repuestos */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-4">Código</th>
                <th className="p-4">Nombre / Repuesto</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Precio Compra</th>
                <th className="p-4">Precio Venta</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    Cargando inventario...
                  </td>
                </tr>
              )}

              {!loading && repuestosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No se encontraron repuestos registrados.
                  </td>
                </tr>
              )}

              {!loading &&
                repuestosFiltrados.map((item) => (
                  <tr key={item.id_repuesto} className="hover:bg-slate-700/30">
                    <td className="p-4 font-mono font-bold text-blue-400">
                      {item.codigo || 'S/C'}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{item.nombre}</div>
                      <div className="text-xs text-slate-400 truncate max-w-xs">
                        {item.descripcion || 'Sin descripción'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          Number(item.stock) <= 5
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        <Layers size={12} /> {item.stock_actual} un.
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-semibold">
                      ${Number(item.precio_compra || 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-emerald-400 font-bold">
                      ${Number(item.precio_venta || 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => abrirModalEditar(item)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all"
                          title="Editar repuesto"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => eliminarRepuesto(item.id_repuesto)}
                          className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all"
                          title="Eliminar repuesto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR / EDITAR */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-lg font-bold text-white">
                {modoEdicion ? 'Editar Repuesto' : 'Nuevo Repuesto'}
              </h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rep_codigo" className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Código *
                  </label>
                  <input
                    id="rep_codigo"
                    type="text"
                    required
                    value={repuestoActual.codigo}
                    onChange={(e) =>
                      setRepuestoActual({ ...repuestoActual, codigo: e.target.value })
                    }
                    placeholder="Ej: REP-001"
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="rep_stock" className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Stock Inicial *
                  </label>
                  <input
                    id="rep_stock"
                    type="number"
                    required
                    min="0"
                    value={repuestoActual.stock}
                    onChange={(e) =>
                      setRepuestoActual({ ...repuestoActual, stock: e.target.value })
                    }
                    placeholder="0"
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="rep_nombre" className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Nombre del Repuesto *
                </label>
                <input
                  id="rep_nombre"
                  type="text"
                  required
                  value={repuestoActual.nombre}
                  onChange={(e) =>
                    setRepuestoActual({ ...repuestoActual, nombre: e.target.value })
                  }
                  placeholder="Ej: Pastillas de freno delanteras"
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rep_pcompra" className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Precio Compra
                  </label>
                  <input
                    id="rep_pcompra"
                    type="number"
                    step="0.01"
                    min="0"
                    value={repuestoActual.precio_compra}
                    onChange={(e) =>
                      setRepuestoActual({ ...repuestoActual, precio_compra: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="rep_pventa" className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Precio Venta *
                  </label>
                  <input
                    id="rep_pventa"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={repuestoActual.precio_venta}
                    onChange={(e) =>
                      setRepuestoActual({ ...repuestoActual, precio_venta: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="rep_descripcion" className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Descripción
                </label>
                <textarea
                  id="rep_descripcion"
                  rows="2"
                  value={repuestoActual.descripcion}
                  onChange={(e) =>
                    setRepuestoActual({ ...repuestoActual, descripcion: e.target.value })
                  }
                  placeholder="Detalles adicionales del repuesto..."
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg"
                >
                  {modoEdicion ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PERSONALIZADO DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 text-center">
            
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">¿Estás seguro?</h3>
              <p className="text-slate-400 text-sm mt-1">
                Esta acción eliminará el repuesto del inventario de forma permanente y no se podrá deshacer.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalEliminarAbierto(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold transition-all w-1/2"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarEliminacion}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg w-1/2"
              >
                Sí, eliminar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}