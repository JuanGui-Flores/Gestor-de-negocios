import { useState, useEffect } from 'react';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Lock, Unlock } from 'lucide-react';

export default function CajaPage() {
  const [cajaAbierta, setCajaAbierta] = useState(false);
  const [turnoActual, setTurnoActual] = useState(null);
  const [montoInicialInput, setMontoInicialInput] = useState('');
  const [movimientos, setMovimientos] = useState([]);
  
  // Modal para ingresos/retiros manuales
  const [modalMovimiento, setModalMovimiento] = useState(false);
  const [tipoMov, setTipoMov] = useState('ingreso');
  const [montoMov, setMontoMov] = useState('');
  const [descMov, setDescMov] = useState('');

  useEffect(() => {
    // fetchEstadoCaja();
  }, []);

  const handleAbrirCaja = (e) => {
    e.preventDefault();
    if (!montoInicialInput || Number.isNaN(Number(montoInicialInput))) return;

    setCajaAbierta(true);
    setTurnoActual({
      id: 1,
      monto_inicial: Number.parseFloat(montoInicialInput),
      fecha_apertura: new Date().toLocaleTimeString()
    });
    setMontoInicialInput('');
  };

  const handleCerrarCaja = () => {
    if (window.confirm('¿Estás seguro de cerrar la caja de este turno?')) {
      setCajaAbierta(false);
      setTurnoActual(null);
      setMovimientos([]);
    }
  };

  const handleAgregarMovimiento = (e) => {
    e.preventDefault();
    if (!montoMov || !descMov) return;

    const nuevo = {
      id: Date.now(),
      tipo: tipoMov,
      monto: Number.parseFloat(montoMov),
      descripcion: descMov,
      fecha: new Date().toLocaleTimeString()
    };

    setMovimientos([nuevo, ...movimientos]);
    setMontoMov('');
    setDescMov('');
    setModalMovimiento(false);
  };

  return (
    <div className="flex-1 p-8 bg-[#07090E] text-slate-100 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Caja y Turnos</h1>
            <p className="text-sm text-slate-400">Control de efectivo, aperturas, cierres y movimientos del taller.</p>
          </div>
          <div>
            {cajaAbierta ? (
              <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
                <Unlock size={14} /> Caja Abierta
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
                <Lock size={14} /> Caja Cerrada
              </span>
            )}
          </div>
        </div>

        {!cajaAbierta ? (
          /* SECCIÓN: CAJA CERRADA (Apertura de Turno) */
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 max-w-md mx-auto shadow-xl text-center mt-12">
            <div className="w-16 h-16 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
              <DollarSign size={32} />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">No hay un turno activo</h2>
            <p className="text-slate-400 text-sm mb-6">
              Ingresa el monto inicial de efectivo disponible en la caja para comenzar a operar.
            </p>

            <form onSubmit={handleAbrirCaja} className="space-y-4 text-left">
              <div>
                <label htmlFor="montoInicialInput" className="block text-xs font-medium text-slate-400 mb-1">Monto Inicial en Efectivo ($)</label>
                <input
                  id="montoInicialInput"
                  type="number"
                  step="0.01"
                  value={montoInicialInput}
                  onChange={(e) => setMontoInicialInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
              >
                Abrir Caja
              </button>
            </form>
          </div>
        ) : (
          /* SECCIÓN: CAJA ABIERTA (Panel de Control y Movimientos) */
          <div className="space-y-6">
            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 block mb-1">Monto Inicial</span>
                <span className="text-xl font-bold text-white">$ {turnoActual?.monto_inicial.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Apertura: {turnoActual?.fecha_apertura}</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                <span className="text-xs text-slate-400 block mb-1">Total Movimientos</span>
                <span className="text-xl font-bold text-emerald-400">$ {movimientos.reduce((acc, m) => m.tipo === 'ingreso' ? acc + m.monto : acc - m.monto, 0).toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Ingresos / Retiros manuales</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Acciones Rápidas</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setModalMovimiento(true)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium py-2 rounded-xl transition-colors text-slate-200"
                  >
                    + / - Movimiento
                  </button>
                  <button
                    onClick={handleCerrarCaja}
                    className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-medium px-4 py-2 rounded-xl transition-colors"
                  >
                    Cerrar Caja
                  </button>
                </div>
              </div>
            </div>

            {/* Historial de Movimientos del Turno */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Movimientos de este Turno</h3>
              {movimientos.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No hay movimientos registrados en este turno todavía.
                </div>
              ) : (
                <div className="space-y-2">
                  {movimientos.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        {m.tipo === 'ingreso' ? (
                          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><ArrowUpCircle size={18} /></div>
                        ) : (
                          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg"><ArrowDownCircle size={18} /></div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">{m.descripcion}</p>
                          <p className="text-[10px] text-slate-500">{m.fecha}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${m.tipo === 'ingreso' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {m.tipo === 'ingreso' ? '+' : '-'}$ {m.monto.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal simple para Ingreso / Retiro */}
        {modalMovimiento && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Registrar Movimiento de Caja</h3>
              <form onSubmit={handleAgregarMovimiento} className="space-y-4">
                <div>
                  <label htmlFor="tipoMovSelect" className="block text-xs font-medium text-slate-400 mb-1">Tipo de Movimiento</label>
                  <select
                    id="tipoMovSelect"
                    value={tipoMov}
                    onChange={(e) => setTipoMov(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="ingreso">Ingreso de Dinero</option>
                    <option value="retiro">Retiro / Egreso de Dinero</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="montoMovInput" className="block text-xs font-medium text-slate-400 mb-1">Monto ($)</label>
                  <input
                    id="montoMovInput"
                    type="number"
                    step="0.01"
                    value={montoMov}
                    onChange={(e) => setMontoMov(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="descMovInput" className="block text-xs font-medium text-slate-400 mb-1">Motivo / Descripción</label>
                  <input
                    id="descMovInput"
                    type="text"
                    value={descMov}
                    onChange={(e) => setDescMov(e.target.value)}
                    placeholder="Ej. Pago de repuesto menor / Cambio"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalMovimiento(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/20"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}