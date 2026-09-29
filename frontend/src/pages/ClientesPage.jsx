import { useState, useEffect } from 'react';
import { Users, Plus, Search, Phone, Mail, MapPin, Edit2, Trash2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);

  // Estados para el formulario (crear / editar)
  const [clienteEnEdicion, setClienteEnEdicion] = useState(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');

  // Estados para el modal de eliminación personalizado
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  useEffect(() => {
    // Aquí puedes conectar el fetch a tu API: /api/clientes
  }, []);

  const abrirModalNuevo = () => {
    setClienteEnEdicion(null);
    setNombre('');
    setTelefono('');
    setEmail('');
    setDireccion('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (cli) => {
    setClienteEnEdicion(cli);
    setNombre(cli.nombre || '');
    setTelefono(cli.telefono || '');
    setEmail(cli.email || '');
    setDireccion(cli.direccion || '');
    setModalAbierto(true);
  };

  const confirmarEliminacion = (id) => {
    setIdAEliminar(id);
    setModalEliminarAbierto(true);
  };

  const ejecutarEliminacion = () => {
    setClientes(clientes.filter((c) => c.id !== idAEliminar));
    setModalEliminarAbierto(false);
    setIdAEliminar(null);
  };

  const handleGuardarCliente = (e) => {
    e.preventDefault();
    if (!nombre) return;

    if (clienteEnEdicion) {
      setClientes(clientes.map((c) => (
        c.id === clienteEnEdicion.id
          ? { ...c, nombre, telefono, email, direccion }
          : c
      )));
    } else {
      const nuevo = {
        id: Date.now(),
        nombre,
        telefono,
        email,
        direccion
      };
      setClientes([nuevo, ...clientes]);
    }

    setModalAbierto(false);
  };

  return (
    <div className="flex-1 p-8 bg-[#07090E] text-slate-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Gestión de Clientes</h1>
            <p className="text-sm text-slate-400">Directorio de clientes y datos de contacto de MV Motos.</p>
          </div>
          <button
            onClick={abrirModalNuevo}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus size={16} /> Nuevo Cliente
          </button>
        </div>

        {/* Barra de Búsqueda */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Search size={18} className="text-slate-400 ml-2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, teléfono o correo..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
          />
        </div>

        {/* Tabla de Clientes */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {clientes.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Users size={48} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No hay clientes registrados todavía.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/30">
                    <th className="p-4">Nombre / Correo</th>
                    <th className="p-4">Teléfono</th>
                    <th className="p-4">Dirección</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {clientes.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-white">{c.nombre}</p>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail size={12} /> {c.email || 'Sin correo'}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-300">
                        <span className="flex items-center gap-1">
                          <Phone size={12} className="text-slate-400" /> {c.telefono || 'Sin teléfono'}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-300">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" /> {c.direccion || 'Sin dirección'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirModalEditar(c)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors inline-flex items-center gap-1 text-xs"
                            title="Editar cliente"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => confirmarEliminacion(c.id)}
                            className="p-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 rounded-xl transition-colors inline-flex items-center gap-1 text-xs"
                            title="Eliminar cliente"
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

        {/* Modal de Crear / Editar Cliente */}
        {modalAbierto && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">
                {clienteEnEdicion ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
              </h3>
              <form onSubmit={handleGuardarCliente} className="space-y-4">
                <div>
                  <label htmlFor="nombreCliente" className="block text-xs font-medium text-slate-400 mb-1">Nombre Completo *</label>
                  <input
                    id="nombreCliente"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="telCliente" className="block text-xs font-medium text-slate-400 mb-1">Teléfono</label>
                    <input
                      id="telCliente"
                      type="text"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="Ej. 3815000000"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="emailCliente" className="block text-xs font-medium text-slate-400 mb-1">Correo Electrónico</label>
                    <input
                      id="emailCliente"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="dirCliente" className="block text-xs font-medium text-slate-400 mb-1">Dirección</label>
                  <input
                    id="dirCliente"
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Ej. Av. Belgrano 1200"
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
                    {clienteEnEdicion ? 'Guardar Cambios' : 'Guardar Cliente'}
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
          message="Esta acción eliminará el cliente de forma permanente y no se podrá deshacer."
          onClose={() => setModalEliminarAbierto(false)}
          onConfirm={ejecutarEliminacion}
        />
      </div>
    </div>
  );
}