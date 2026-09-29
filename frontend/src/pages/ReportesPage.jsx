import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { 
  BarChart3, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Calendar, 
  Trash2, 
  AlertTriangle, 
  Check, 
  RefreshCw,
  CreditCard,
  Banknote,
  ArrowUpDown
} from 'lucide-react';

export default function ReportesPage() {
  const [ventas, setVentas] = useState([]);
  const [topRepuestos, setTopRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  // Filtro de fechas
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Modal para confirmar anulación
  const [ventaAAnular, setVentaAAnular] = useState(null);

  // Cargar métricas e historial de ventas desde el backend
  const cargarReportes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (fechaInicio) params.inicio = fechaInicio;
      if (fechaFin) params.fin = fechaFin;

      const [resVentas, resTop] = await Promise.all([
        api.get('/reportes/ventas', { params }),
        api.get('/reportes/top-repuestos', { params })
      ]);

      if (resVentas.data.success) {
        setVentas(resVentas.data.data);
      }
      if (resTop.data.success) {
        setTopRepuestos(resTop.data.data);
      }
    } catch (err) {
      console.error('Error al cargar reportes:', err.message);
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los datos del reporte.' });
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const [resVentas, resTop] = await Promise.all([
          api.get('/reportes/ventas'),
          api.get('/reportes/top-repuestos')
        ]);

        if (active) {
          if (resVentas.data.success) setVentas(resVentas.data.data);
          if (resTop.data.success) setTopRepuestos(resTop.data.data);
        }
      } catch (err) {
        if (active) {
          console.error('Error inicial de reportes:', err.message);
          setMensaje({ tipo: 'error', texto: 'Error al conectar con el servicio de reportes.' });
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  // Anular venta (Endpoint transaccional DELETE)
  const ejecutarAnulacion = async () => {
    if (!ventaAAnular) return;

    try {
      const res = await api.delete(`/ventas/${ventaAAnular.id_venta}`);
      if (res.data.success) {
        setMensaje({ tipo: 'éxito', texto: `Venta #${ventaAAnular.id_venta} anulada. Stock repuesto correctamente.` });
        setVentaAAnular(null);
        cargarReportes();
      }
    } catch (err) {
      console.error('Error al anular venta:', err.message);
      setMensaje({ 
        tipo: 'error', 
        texto: err.response?.data?.error || 'No se pudo anular la venta.' 
      });
    } finally {
      setTimeout(() => setMensaje(null), 4000);
    }
  };

  // Cálculo de KPIs
  const totalIngresos = ventas.reduce((acc, v) => acc + Number(v.total || 0), 0);
  const totalOperaciones = ventas.length;

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-100 space-y-6">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <BarChart3 className="text-blue-500" /> Dashboard y Reportes
          </h1>
          <p className="text-slate-400 text-sm">Resumen financiero, métricas de ventas y control de operaciones.</p>
        </div>

        <button
          onClick={cargarReportes}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 transition-all flex items-center justify-center gap-2 text-xs font-semibold shadow-md"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualizar Datos
        </button>
      </div>

      {/* Alertas */}
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

      {/* Filtros de Fecha */}
      <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
          <Calendar size={18} /> Filtrar Rango:
        </div>
        
        <div className="flex items-center gap-2">
          <label htmlFor="fecha_inicio" className="text-xs text-slate-400">Desde:</label>
          <input
            id="fecha_inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="fecha_fin" className="text-xs text-slate-400">Hasta:</label>
          <input
            id="fecha_fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={cargarReportes}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
        >
          Filtrar
        </button>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Ingresos Totales</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">
              ${totalIngresos.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Ventas Realizadas</p>
            <h3 className="text-2xl font-black text-blue-400 mt-1">
              {totalOperaciones}
            </h3>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Promedio por Venta</p>
            <h3 className="text-2xl font-black text-purple-400 mt-1">
              ${totalOperaciones > 0 ? Math.round(totalIngresos / totalOperaciones).toLocaleString() : 0}
            </h3>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Sección Top Repuestos */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <ArrowUpDown size={18} className="text-blue-500" /> Top Repuestos Más Vendidos
        </h2>

        {topRepuestos.length === 0 ? (
          <p className="text-slate-500 text-sm italic">No hay datos de repuestos vendidos en este período.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topRepuestos.slice(0, 3).map((item, index) => (
              <div key={item.id_repuesto || index} className="bg-slate-900 border border-slate-700/60 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xs text-blue-400 font-bold uppercase">#{index + 1} Más Vendido</p>
                  <p className="font-bold text-white text-sm mt-0.5">{item.nombre}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.total_vendido} unidades vendidas</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Recaudado</p>
                  <p className="font-bold text-emerald-400 text-sm">${Number(item.recaudado || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabla Historial de Ventas */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/40">
          <h2 className="font-bold text-white text-base">Historial de Operaciones</h2>
          <span className="text-xs text-slate-400">{ventas.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-4">N° Venta</th>
                <th className="p-4">Fecha y Hora</th>
                <th className="p-4">Forma de Pago</th>
                <th className="p-4 text-center">Total</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    Cargando historial de ventas...
                  </td>
                </tr>
              )}

              {!loading && ventas.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    No se registraron ventas en el período seleccionado.
                  </td>
                </tr>
              )}

              {!loading &&
                ventas.map((v) => (
                  <tr key={v.id_venta} className="hover:bg-slate-700/30">
                    <td className="p-4 font-mono font-bold text-blue-400">
                      #{v.id_venta}
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      {new Date(v.fecha).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
                        {v.forma_pago === 'EFECTIVO' ? <Banknote size={14} className="text-emerald-400" /> : <CreditCard size={14} className="text-blue-400" />}
                        {v.forma_pago}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-emerald-400">
                      ${Number(v.total).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setVentaAAnular(v)}
                        className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all"
                        title="Anular venta y devolver stock"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE ANULACIÓN */}
      {ventaAAnular && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 bg-rose-500/20 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">¿Anular Venta #{ventaAAnular.id_venta}?</h3>
                <p className="text-xs text-slate-400">Esta acción repondrá el stock en el inventario.</p>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-xs space-y-1">
              <p className="text-slate-300"><span className="text-slate-500">Monto:</span> ${Number(ventaAAnular.total).toLocaleString()}</p>
              <p className="text-slate-300"><span className="text-slate-500">Método:</span> {ventaAAnular.forma_pago}</p>
              <p className="text-slate-300"><span className="text-slate-500">Fecha:</span> {new Date(ventaAAnular.fecha).toLocaleString()}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setVentaAAnular(null)}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold text-sm transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={ejecutarAnulacion}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all shadow-lg"
              >
                Anular Operación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}