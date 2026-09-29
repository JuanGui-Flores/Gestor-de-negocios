import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Users, ShieldAlert } from 'lucide-react';

export default function AnaliticaPage() {
  const [metricas] = useState(() => {
    // Obtenemos información real de los módulos en localStorage
    const productos = JSON.parse(localStorage.getItem('cris_motos_productos') || '[]');
    const clientes = JSON.parse(localStorage.getItem('cris_motos_clientes') || '[]');
    const devoluciones = JSON.parse(localStorage.getItem('cris_motos_devoluciones') || '[]');
    const cuentas = JSON.parse(localStorage.getItem('cris_motos_cuentas_corrientes') || '[]');

    const deudasTotales = cuentas
      .filter((c) => c.tipo === 'Deuda')
      .reduce((acc, curr) => acc + (curr.monto || 0), 0);

    return {
      totalProductos: productos.length,
      totalClientes: clientes.length,
      totalDevoluciones: devoluciones.length,
      deudaPendiente: deudasTotales
    };
  });

  return (
    <div className="flex-1 p-8 bg-[#07090E] text-slate-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-wide">Analítica Avanzada</h1>
          <p className="text-sm text-slate-400">Resumen general y métricas del rendimiento del negocio en Cris-Motos.</p>
        </div>

        {/* Cuadrícula de Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Productos Activos</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metricas.totalProductos}</h3>
              <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp size={12} /> Stock sincronizado
              </span>
            </div>
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
              <Package size={24} />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Clientes Registrados</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metricas.totalClientes}</h3>
              <span className="text-xs text-blue-400 flex items-center gap-1 mt-1 font-medium">
                <Users size={12} /> Cartera activa
              </span>
            </div>
            <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <Users size={24} />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Devoluciones</p>
              <h3 className="text-2xl font-bold text-white mt-1">{metricas.totalDevoluciones}</h3>
              <span className="text-xs text-amber-400 flex items-center gap-1 mt-1 font-medium">
                <ShieldAlert size={12} /> Garantías / Cambios
              </span>
            </div>
            <div className="p-3 bg-amber-600/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <BarChart3 size={24} />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Deuda en Cuentas</p>
              <h3 className="text-2xl font-bold text-white mt-1">$ {metricas.deudaPendiente.toFixed(2)}</h3>
              <span className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">
                <DollarSign size={12} /> Saldo pendiente
              </span>
            </div>
            <div className="p-3 bg-rose-600/20 text-rose-400 rounded-2xl border border-rose-500/30">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        {/* Panel Secundario / Gráfico Simulado */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Rendimiento Operativo Reciente</h3>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-xl border border-slate-700">Tiempo Real</span>
          </div>
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
            <BarChart3 size={48} className="mb-2 opacity-40 text-blue-500" />
            <p className="text-sm font-medium text-slate-400">Métricas y estadísticas detalladas listas para operar.</p>
            <p className="text-xs text-slate-600 mt-1">Los datos se actualizan automáticamente según la actividad de los módulos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}