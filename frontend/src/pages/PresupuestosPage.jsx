import { useState } from 'react';
import { FileText, Plus, Search, User, Calendar, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState([
    {
      id: 1,
      cliente: 'Juan Pérez',
      fecha: '2026-03-30',
      total: 45000.00,
      estado: 'Pendiente'
    }
  ]);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);

  // Estados del formulario para nuevo presupuesto
  const [cliente, setCliente] = useState('');
  const [total, setTotal] = useState('');

  // Estados para el modal de eliminación personalizado
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  const abrirModalNuevo = () => {
    setCliente('');
    setTotal('');
    setModalAbierto(true);
  };

  const handleGuardarPresupuesto = (e) => {
    e.preventDefault();
    if (!cliente) return;

    const nuevo = {
      id: Date.now(),
      cliente,
      fecha: new Date().toISOString().split('T')[0],
      total: Number.parseFloat(total) || 0,
      estado: 'Pendiente'
    };

    setPresupuestos([nuevo, ...presupuestos]);
    setModalAbierto(false);
  };

  const confirmarEliminacion = (id) => {
    setIdAEliminar(id);
    setModalEliminarAbierto(true);
  };

  const ejecutarEliminacion = () => {
    setPresupuestos(presupuestos.filter((p) => p.id !== idAEliminar));
    setModalEliminarAbierto(false);
    setIdAEliminar(null);
  };

  return (
    <div className="flex-1 p-8 bg-[#07090E] text-slate-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Gestión de Presupuestos</h1>
            <p className="text-sm text-slate-400">Emisión y control de cotizaciones para clientes y talleres.</p>
          </div>
          <button
            onClick={abrirModalNuevo}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus size={16} /> Nuevo Presupuesto
          </button>
        </div>

        {/* Barra de Búsqueda */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Search size={18} className="text-slate-400 ml-2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por cliente o número de presupuesto..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
          />
        </div>

        {/* Tabla de Presupuestos */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {presupuestos.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <FileText size={48} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No hay presupuestos registrados todavía.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/30">
                    <th className="p-4"># ID / Cliente</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4">Total Estimado</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {presupuestos.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-400" />
                          <div>
                            <p className="font-semibold text-white">Presupuesto #{p.id.toString().slice(-4)}</p>
                            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <User size={12} /> {p.cliente}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-500" /> {p.fecha}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-semibold text-emerald-400">
                        $ {p.total.toFixed(2)}
                      </td>
                      <td className="p-4 text-xs">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium ${
                          p.estado === 'Aprobado' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {p.estado === 'Aprobado' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {p.estado}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => confirmarEliminacion(p.id)}
                          className="p-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 rounded-xl transition-colors inline-flex items-center gap-1 text-xs"
                          title="Eliminar presupuesto"
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

        {/* Modal de Nuevo Presupuesto */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Crear Nuevo Presupuesto</h3>
              <form onSubmit={handleGuardarPresupuesto} className="space-y-4">
                <div>
                  <label htmlFor="clientePresupuesto" className="block text-xs font-medium text-slate-400 mb-1">Cliente *</label>
                  <input
                    id="clientePresupuesto"
                    type="text"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Nombre del cliente o taller"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="totalPresupuesto" className="block text-xs font-medium text-slate-400 mb-1">Total Estimado ($) *</label>
                  <input
                    id="totalPresupuesto"
                    type="number"
                    step="0.01"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    required
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
                    Guardar Presupuesto
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
          message="Esta acción eliminará el presupuesto de forma permanente y no se podrá deshacer."
          onClose={() => setModalEliminarAbierto(false)}
          onConfirm={ejecutarEliminacion}
        />
      </div>
    </div>
  );
}