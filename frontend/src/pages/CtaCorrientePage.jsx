import { useState, useEffect } from 'react';
import { Wallet, Plus, Search, User, Calendar, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function CtaCorrientePage() {
  const [cuentas, setCuentas] = useState(() => {
    const guardadas = localStorage.getItem('cris_motos_cuentas_corrientes');
    return guardadas ? JSON.parse(guardadas) : [
      {
        id: 1,
        cliente: 'Juan Pérez',
        tipo: 'Deuda',
        monto: 15000,
        detalle: 'Compra de repuestos a plazos',
        fecha: '2026-03-30'
      }
    ];
  });

  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);

  // Estados del formulario
  const [cliente, setCliente] = useState('');
  const [tipo, setTipo] = useState('Deuda');
  const [monto, setMonto] = useState('');
  const [detalle, setDetalle] = useState('');

  // Estados para el modal de eliminación personalizado
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  useEffect(() => {
    localStorage.setItem('cris_motos_cuentas_corrientes', JSON.stringify(cuentas));
  }, [cuentas]);

  const abrirModalNuevo = () => {
    setCliente('');
    setTipo('Deuda');
    setMonto('');
    setDetalle('');
    setModalAbierto(true);
  };

  const handleGuardarCuenta = (e) => {
    e.preventDefault();
    if (!cliente || !monto) return;

    const nueva = {
      id: Date.now(),
      cliente,
      tipo,
      monto: Number.parseFloat(monto) || 0,
      detalle: detalle || 'Movimiento de cuenta corriente',
      fecha: new Date().toISOString().split('T')[0]
    };

    setCuentas([nueva, ...cuentas]);
    setModalAbierto(false);
  };

  const confirmarEliminacion = (id) => {
    setIdAEliminar(id);
    setModalEliminarAbierto(true);
  };

  const ejecutarEliminacion = () => {
    setCuentas(cuentas.filter((c) => c.id !== idAEliminar));
    setModalEliminarAbierto(false);
    setIdAEliminar(null);
  };

  const cuentasFiltradas = cuentas.filter((c) =>
    c.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.detalle.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex-1 p-8 bg-[#07090E] text-slate-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Cuentas Corrientes</h1>
            <p className="text-sm text-slate-400">Control de saldos, deudas y pagos pendientes de clientes en Cris-Motos.</p>
          </div>
          <button
            onClick={abrirModalNuevo}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus size={16} /> Nuevo Movimiento
          </button>
        </div>

        {/* Barra de Búsqueda */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Search size={18} className="text-slate-400 ml-2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por cliente o detalle..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
          />
        </div>

        {/* Tabla de Cuentas Corrientes */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {cuentasFiltradas.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Wallet size={48} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No hay registros en cuentas corrientes todavía.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/30">
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Monto</th>
                    <th className="p-4">Detalle</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {cuentasFiltradas.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-blue-400" />
                          <span className="font-semibold text-white">{c.cliente}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border ${c.tipo === 'Deuda' ? 'bg-rose-600/20 border-rose-500/30 text-rose-400' : 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400'}`}>
                          {c.tipo}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-semibold text-white">
                        $ {c.monto.toFixed(2)}
                      </td>
                      <td className="p-4 text-xs text-slate-300">
                        <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                          {c.detalle}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-500" /> {c.fecha}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => confirmarEliminacion(c.id)}
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

        {/* Modal de Nuevo Movimiento */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Registrar Movimiento en Cta. Corriente</h3>
              <form onSubmit={handleGuardarCuenta} className="space-y-4">
                <div>
                  <label htmlFor="clienteCta" className="block text-xs font-medium text-slate-400 mb-1">Cliente *</label>
                  <input
                    id="clienteCta"
                    type="text"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Nombre del cliente"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tipoCta" className="block text-xs font-medium text-slate-400 mb-1">Tipo</label>
                    <select
                      id="tipoCta"
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    >
                      <option value="Deuda">Deuda</option>
                      <option value="Pago">Pago</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="montoCta" className="block text-xs font-medium text-slate-400 mb-1">Monto ($) *</label>
                    <input
                      id="montoCta"
                      type="number"
                      step="0.01"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="detalleCta" className="block text-xs font-medium text-slate-400 mb-1">Detalle / Concepto</label>
                  <input
                    id="detalleCta"
                    type="text"
                    value={detalle}
                    onChange={(e) => setDetalle(e.target.value)}
                    placeholder="Ej. Entrega parcial / Compra fiada"
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
                    Guardar Registro
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
          message="Esta acción eliminará el registro de la cuenta corriente de forma permanente."
          onClose={() => setModalEliminarAbierto(false)}
          onConfirm={ejecutarEliminacion}
        />
      </div>
    </div>
  );
}