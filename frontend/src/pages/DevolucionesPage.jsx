import { useState, useEffect } from 'react';
import { RotateCcw, Plus, Search, User, Calendar, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function DevolucionesPage() {
  const [devoluciones, setDevoluciones] = useState(() => {
    const guardadas = localStorage.getItem('cris_motos_devoluciones');
    return guardadas ? JSON.parse(guardadas) : [
      {
        id: 1,
        cliente: 'Juan Pérez',
        producto: 'Kit de arrastre XR 150',
        cantidad: 1,
        motivo: 'Defectuoso de fábrica',
        fecha: '2026-03-30'
      }
    ];
  });

  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);

  // Estados del formulario para nueva devolución
  const [cliente, setCliente] = useState('');
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');

  // Estados para el modal de eliminación personalizado
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  useEffect(() => {
    localStorage.setItem('cris_motos_devoluciones', JSON.stringify(devoluciones));
  }, [devoluciones]);

  const abrirModalNuevo = () => {
    setCliente('');
    setProducto('');
    setCantidad('');
    setMotivo('');
    setModalAbierto(true);
  };

  const handleGuardarDevolucion = (e) => {
    e.preventDefault();
    if (!cliente || !producto) return;

    const nueva = {
      id: Date.now(),
      cliente,
      producto,
      cantidad: Number.parseInt(cantidad, 10) || 1,
      motivo: motivo || 'Sin motivo especificado',
      fecha: new Date().toISOString().split('T')[0]
    };

    setDevoluciones([nueva, ...devoluciones]);
    setModalAbierto(false);
  };

  const confirmarEliminacion = (id) => {
    setIdAEliminar(id);
    setModalEliminarAbierto(true);
  };

  const ejecutarEliminacion = () => {
    setDevoluciones(devoluciones.filter((d) => d.id !== idAEliminar));
    setModalEliminarAbierto(false);
    setIdAEliminar(null);
  };

  const devolucionesFiltradas = devoluciones.filter((d) =>
    d.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex-1 p-8 bg-[#07090E] text-slate-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Gestión de Devoluciones</h1>
            <p className="text-sm text-slate-400">Control de artículos devueltos por garantía o cambios en Cris-Motos.</p>
          </div>
          <button
            onClick={abrirModalNuevo}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus size={16} /> Nueva Devolución
          </button>
        </div>

        {/* Barra de Búsqueda */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Search size={18} className="text-slate-400 ml-2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por cliente o producto devuelto..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
          />
        </div>

        {/* Tabla de Devoluciones */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {devolucionesFiltradas.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <RotateCcw size={48} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No hay devoluciones registradas todavía.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/30">
                    <th className="p-4">Cliente / Producto</th>
                    <th className="p-4">Cantidad</th>
                    <th className="p-4">Motivo</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {devolucionesFiltradas.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <RotateCcw size={16} className="text-blue-400" />
                          <div>
                            <p className="font-semibold text-white">{d.producto}</p>
                            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <User size={12} /> {d.cliente}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-semibold text-slate-300">
                        {d.cantidad} un.
                      </td>
                      <td className="p-4 text-xs text-slate-300">
                        <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                          {d.motivo}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-500" /> {d.fecha}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => confirmarEliminacion(d.id)}
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

        {/* Modal de Nueva Devolución */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Registrar Nueva Devolución</h3>
              <form onSubmit={handleGuardarDevolucion} className="space-y-4">
                <div>
                  <label htmlFor="clienteDev" className="block text-xs font-medium text-slate-400 mb-1">Cliente *</label>
                  <input
                    id="clienteDev"
                    type="text"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Nombre del cliente"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="productoDev" className="block text-xs font-medium text-slate-400 mb-1">Producto *</label>
                  <input
                    id="productoDev"
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
                    <label htmlFor="cantidadDev" className="block text-xs font-medium text-slate-400 mb-1">Cantidad</label>
                    <input
                      id="cantidadDev"
                      type="number"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      placeholder="1"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                      min="1"
                    />
                  </div>
                  <div>
                    <label htmlFor="motivoDev" className="block text-xs font-medium text-slate-400 mb-1">Motivo</label>
                    <input
                      id="motivoDev"
                      type="text"
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder="Ej. Garantía / Cambio"
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
                    Guardar Devolución
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
          message="Esta acción eliminará el registro de devolución de forma permanente."
          onClose={() => setModalEliminarAbierto(false)}
          onConfirm={ejecutarEliminacion}
        />
      </div>
    </div>
  );
}