import { useState, useEffect } from 'react';
import { Sliders, Plus, Search, Package, ArrowUpRight, ArrowDownLeft, Calendar, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function AjustesStockPage() {
  const [ajustes, setAjustes] = useState(() => {
    const guardados = localStorage.getItem('cris_motos_ajustes_stock');
    return guardados ? JSON.parse(guardados) : [
      {
        id: 1,
        producto: 'Kit de arrastre XR 150',
        tipo: 'Entrada',
        cantidad: 5,
        motivo: 'Compra a proveedor',
        fecha: '2026-03-30'
      }
    ];
  });

  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);

  // Estados del formulario para nuevo ajuste
  const [producto, setProducto] = useState('');
  const [tipo, setTipo] = useState('Entrada');
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');

  // Estados para el modal de eliminación personalizado
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  useEffect(() => {
    localStorage.setItem('cris_motos_ajustes_stock', JSON.stringify(ajustes));
  }, [ajustes]);

  const abrirModalNuevo = () => {
    setProducto('');
    setTipo('Entrada');
    setCantidad('');
    setMotivo('');
    setModalAbierto(true);
  };

  const handleGuardarAjuste = (e) => {
    e.preventDefault();
    if (!producto || !cantidad) return;

    const nuevo = {
      id: Date.now(),
      producto,
      tipo,
      cantidad: Number.parseInt(cantidad, 10) || 1,
      motivo: motivo || 'Ajuste manual de stock',
      fecha: new Date().toISOString().split('T')[0]
    };

    setAjustes([nuevo, ...ajustes]);
    setModalAbierto(false);
  };

  const confirmarEliminacion = (id) => {
    setIdAEliminar(id);
    setModalEliminarAbierto(true);
  };

  const ejecutarEliminacion = () => {
    setAjustes(ajustes.filter((a) => a.id !== idAEliminar));
    setModalEliminarAbierto(false);
    setIdAEliminar(null);
  };

  const ajustesFiltrados = ajustes.filter((a) =>
    a.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.motivo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex-1 p-8 bg-[#07090E] text-slate-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Ajustes de Stock</h1>
            <p className="text-sm text-slate-400">Control de entradas y salidas manuales de inventario en Cris-Motos.</p>
          </div>
          <button
            onClick={abrirModalNuevo}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus size={16} /> Nuevo Ajuste
          </button>
        </div>

        {/* Barra de Búsqueda */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Search size={18} className="text-slate-400 ml-2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por producto o motivo del ajuste..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
          />
        </div>

        {/* Tabla de Ajustes */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {ajustesFiltrados.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Sliders size={48} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No hay ajustes de stock registrados todavía.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/30">
                    <th className="p-4">Producto</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Cantidad</th>
                    <th className="p-4">Motivo</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {ajustesFiltrados.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-slate-400" />
                          <span className="font-semibold text-white">{a.producto}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border ${a.tipo === 'Entrada' ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400' : 'bg-rose-600/20 border-rose-500/30 text-rose-400'}`}>
                          {a.tipo === 'Entrada' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                          {a.tipo}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-semibold text-slate-300">
                        {a.tipo === 'Entrada' ? '+' : '-'}{a.cantidad} un.
                      </td>
                      <td className="p-4 text-xs text-slate-300">
                        <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                          {a.motivo}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-500" /> {a.fecha}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => confirmarEliminacion(a.id)}
                          className="p-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 rounded-xl transition-colors inline-flex items-center gap-1 text-xs"
                          title="Eliminar registro"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Nuevo Ajuste */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Registrar Ajuste de Stock</h3>
              <form onSubmit={handleGuardarAjuste} className="space-y-4">
                <div>
                  <label htmlFor="productoAjuste" className="block text-xs font-medium text-slate-400 mb-1">Producto *</label>
                  <input
                    id="productoAjuste"
                    type="text"
                    value={producto}
                    onChange={(e) => setProducto(e.target.value)}
                    placeholder="Nombre o código del repuesto"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tipoAjuste" className="block text-xs font-medium text-slate-400 mb-1">Tipo de Movimiento</label>
                    <select
                      id="tipoAjuste"
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    >
                      <option value="Entrada">Entrada</option>
                      <option value="Salida">Salida</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cantidadAjuste" className="block text-xs font-medium text-slate-400 mb-1">Cantidad *</label>
                    <input
                      id="cantidadAjuste"
                      type="number"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      placeholder="1"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="motivoAjuste" className="block text-xs font-medium text-slate-400 mb-1">Motivo del Ajuste</label>
                  <input
                    id="motivoAjuste"
                    type="text"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ej. Conteo físico / Merma / Compra"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
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
                    Guardar Ajuste
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
          message="Esta acción eliminará el registro de ajuste de stock de forma permanente."
          onClose={() => setModalEliminarAbierto(false)}
          onConfirm={ejecutarEliminacion}
        />
      </div>
    </div>
  );
}