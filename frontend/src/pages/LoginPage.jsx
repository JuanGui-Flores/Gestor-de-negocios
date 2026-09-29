import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Lock, User, Check, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      const res = await api.post('/auth/login', { usuario, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));

      setMensaje({ tipo: 'éxito', texto: '¡Inicio de sesión exitoso!' });
      
      setTimeout(() => {
        navigate('/inventario');
      }, 1000);

    } catch (err) {
      console.error('Error de autenticación:', err);
      setMensaje({
        tipo: 'error',
        texto: err.response?.data?.error || 'Credenciales incorrectas o error en el servidor.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-white font-sans overflow-hidden bg-slate-950">
      
      {/* Columna Izquierda: Acercada todavía más hacia el centro */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 p-12 flex-col justify-center items-end relative">
        <div className="max-w-lg w-full pr-12 xl:pr-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold mb-6 border border-blue-500/20 shadow-inner">
            <ShieldCheck size={16} />
            Acceso corporativo seguro
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-5 leading-tight tracking-tight">
            Entrá a tu operación <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-blue-500 to-indigo-500">sin distracciones</span>
          </h1>
          <p className="text-slate-400 text-base mb-8 leading-relaxed">
            Inicio de sesión limpio, rápido y preparado para volver exactamente a donde dejaste tu negocio de repuestos y taller.
          </p>
          
          <ul className="space-y-3.5 text-slate-300 font-medium text-sm">
            <li className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-blue-500/20 text-blue-400 shadow-sm"><Check size={14} strokeWidth={3} /></div>
              Sesión segura con JWT y almacenamiento local optimizado
            </li>
            <li className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-blue-500/20 text-blue-400 shadow-sm"><Check size={14} strokeWidth={3} /></div>
              Control total de inventario, stock y repuestos
            </li>
            <li className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-blue-500/20 text-blue-400 shadow-sm"><Check size={14} strokeWidth={3} /></div>
              Punto de venta (POS) ágil para atención en mostrador
            </li>
          </ul>
        </div>
      </div>

      {/* Columna Derecha: Formulario más atractivo con efectos visuales */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-slate-950 relative">
        
        {/* Efecto de brillo de fondo detrás de la tarjeta para hacerla destacar */}
        <div className="absolute w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6">
          
          {/* Cabecera */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-linear-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30 border border-blue-400/30">
              <Lock size={30} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-wide">MV-Motos</h2>
              <div className="inline-flex items-center gap-1.5 text-blue-400 font-medium text-xs mt-1 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                <Sparkles size={12} />
                Hola de nuevo, inicia sesión
              </div>
            </div>
          </div>

          {/* Alerta */}
          {mensaje && (
            <div
              className={`p-3.5 rounded-xl flex items-center gap-3 text-sm font-semibold animate-fadeIn ${
                mensaje.tipo === 'éxito'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {mensaje.tipo === 'éxito' ? <Check size={20} /> : <AlertTriangle size={20} />}
              {mensaje.texto}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Usuario
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Nombre de usuario"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {/* Checkbox de Guardar contraseña */}
            <div className="flex items-center gap-2.5 pt-1">
              <input 
                type="checkbox" 
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer select-none hover:text-slate-300 transition-colors">
                Guardar contraseña en este dispositivo
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 text-sm active:scale-[0.99]"
            >
              {loading ? 'Verificando credenciales...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Pie de tarjeta informativo */}
          <div className="text-center pt-3 border-t border-slate-800/80">
            <span className="text-xs text-slate-500 font-medium">MV-Motos POS • Sistema de Gestión v1.0.0</span>
          </div>

        </div>
      </div>

    </div>
  );
}