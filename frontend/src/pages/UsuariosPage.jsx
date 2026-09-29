import { useState, useEffect } from 'react';
import { Users, Plus, Search, Shield, Mail, Trash2, Edit2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState(() => {
    const guardados = localStorage.getItem('cris_motos_usuarios');
    return guardados ? JSON.parse(guardados) : [
      {
        id: 1,
        nombre: 'Administrador',
        email: 'admin@crismotos.com',
        rol: 'Admin'
      }
    ];
  });

  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);

  // Estados del formulario (crear / editar)
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('Empleado');

  // Estados para el modal de eliminación personalizado
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  useEffect(() => {
    localStorage.setItem('cris_motos_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  const abrirModalNuevo = () => {
    setUsuarioEnEdicion(null);
    setNombre('');
    setEmail('');
    setRol('Empleado');
    setModalAbierto(true);
  };

  const abrirModalEditar = (usu) => {
    setUsuarioEnEdicion(usu);
    setNombre(usu.nombre || '');
    setEmail(usu.email || '');
    setRol(usu.rol || 'Empleado');
    setModalAbierto(true);
  };

  const handleGuardarUsuario = (e) => {
    e.preventDefault();
    if (!nombre || !email) return;

    if (usuarioEnEdicion) {
      setUsuarios(usuarios.map((u) => (
        u.id === usuarioEnEdicion.id
          ? { ...u, nombre, email, rol }
          : u
      )));
    } else {
      const nuevo = {
        id: Date.now(),
        nombre,
        email,
        rol
      };
      setUsuarios([nuevo, ...usuarios]);
    }

    setModalAbierto(false);
  };

  const confirmarEliminacion = (id) => {
    setIdAEliminar(id);
    setModalEliminarAbierto(true);
  };

  const ejecutarEliminacion = () => {
    setUsuarios(usuarios.filter((u) => u.id !== idAEliminar));
    setModalEliminarAbierto(false);
    setIdAEliminar(null);
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex-1 p-8 bg-[#07090E] text-slate-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Gestión de Usuarios</h1>
            <p className="text-sm text-slate-400">Control de accesos y personal autorizado en Cris-Motos.</p>
          </div>
          <button
            onClick={abrirModalNuevo}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus size={16} /> Nuevo Usuario
          </button>
        </div>

        {/* Barra de Búsqueda */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Search size={18} className="text-slate-400 ml-2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o correo electrónico..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
          />
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {usuariosFiltrados.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Users size={48} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No hay usuarios registrados todavía.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/30">
                    <th className="p-4">Usuario</th>
                    <th className="p-4">Correo Electrónico</th>
                    <th className="p-4">Rol / Permisos</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usuariosFiltrados.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
                            {u.nombre.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-white">{u.nombre}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Mail size={12} className="text-slate-500" /> {u.email}
                        </span>
                      </td>
                      <td className="p-4 text-xs">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border ${u.rol === 'Admin' ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                          <Shield size={12} /> {u.rol}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirModalEditar(u)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors inline-flex items-center gap-1 text-xs"
                            title="Editar usuario"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => confirmarEliminacion(u.id)}
                            className="p-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 rounded-xl transition-colors inline-flex items-center gap-1 text-xs"
                            title="Eliminar usuario"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Crear / Editar Usuario */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">
                {usuarioEnEdicion ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
              </h3>
              <form onSubmit={handleGuardarUsuario} className="space-y-4">
                <div>
                  <label htmlFor="nombreUsu" className="block text-xs font-medium text-slate-400 mb-1">Nombre Completo *</label>
                  <input
                    id="nombreUsu"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="emailUsu" className="block text-xs font-medium text-slate-400 mb-1">Correo Electrónico *</label>
                  <input
                    id="emailUsu"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@crismotos.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rolUsu" className="block text-xs font-medium text-slate-400 mb-1">Rol / Permisos</label>
                  <select
                    id="rolUsu"
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Empleado">Empleado</option>
                  </select>
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
                    {usuarioEnEdicion ? 'Guardar Cambios' : 'Guardar Usuario'}
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
          message="Esta acción eliminará el acceso del usuario de forma permanente."
          onClose={() => setModalEliminarAbierto(false)}
          onConfirm={ejecutarEliminacion}
        />
      </div>
    </div>
  );
}