import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Boxes, 
  Truck, 
  DollarSign, 
  FileText, 
  RotateCcw, 
  Sliders, 
  Users, 
  UserCheck, 
  BookOpen, 
  Building2, 
  BarChart3, 
  LogOut 
} from 'lucide-react'; // Asegúrate de tener instalado lucide-react

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica para cerrar sesión (limpiar token, etc.)
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-slate-800 flex flex-col h-screen text-slate-300 select-none">
      {/* Logo / Encabezado */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white tracking-wide">Cris-Motos - Sistema de Gestión</h1>
        <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">Admin</span>
      </div>

      {/* Menú de Navegación (con scroll interno si excede la altura) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        <div className="text-xs font-semibold text-slate-500 px-3 mb-2 uppercase tracking-wider">Gestión</div>
        
        <NavItem to="/pos" icon={<ShoppingCart size={18} />} label="Punto de Venta" />
        <NavItem to="/productos" icon={<Package size={18} />} label="Productos" />
        <NavItem to="/inventario" icon={<Boxes size={18} />} label="Inventario" />
        <NavItem to="/proveedores" icon={<Truck size={18} />} label="Proveedores" />
        
        <div className="text-xs font-semibold text-slate-500 px-3 mt-6 mb-2 uppercase tracking-wider">Operaciones</div>
        <NavItem to="/caja" icon={<DollarSign size={18} />} label="Caja / Turnos" />
        <NavItem to="/presupuestos" icon={<FileText size={18} />} label="Presupuestos" />
        <NavItem to="/devoluciones" icon={<RotateCcw size={18} />} label="Devoluciones" />
        <NavItem to="/ajustes-stock" icon={<Sliders size={18} />} label="Ajustes de Stock" />

        <div className="text-xs font-semibold text-slate-500 px-3 mt-6 mb-2 uppercase tracking-wider">Administración</div>
        <NavItem to="/usuarios" icon={<Users size={18} />} label="Usuarios" />
        <NavItem to="/clientes" icon={<UserCheck size={18} />} label="Clientes" />
        <NavItem to="/cta-corrientes" icon={<BookOpen size={18} />} label="Cta. Corriente" /> 

        <div className="text-xs font-semibold text-slate-500 px-3 mt-6 mb-2 uppercase tracking-wider">Sistema</div>
        <NavItem to="/analitica" icon={<BarChart3 size={18} />} label="Analítica" />
        <NavItem to="/reportes" icon={<Building2 size={18} />} label="Reportes" />
      </div>

      {/* Widget inferior: Estado de Caja */}
      <div className="p-3 mx-3 mb-3 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-slate-400">Mi Caja</span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Abierta</span>
        </div>
        <div className="text-sm font-bold text-white mb-2">$ 0</div>
        <button 
          onClick={() => alert('Gestionar caja')}
          className="w-full py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
        >
          Gestionar Caja
        </button>
      </div>

      {/* Perfil y Salir */}
      <div className="p-3 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-xs">
            A
          </div>
          <div className="truncate">
            <p className="text-xs font-medium text-white truncate">Administrador</p>
            <p className="text-[10px] text-slate-500 truncate">admin@mvmotos.com</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          title="Salir"
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

// Subcomponente auxiliar para los enlaces del menú
const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};