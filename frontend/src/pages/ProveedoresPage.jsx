import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { Users, Plus, Search, Edit, Trash2, AlertTriangle, Check, X, RefreshCw, Phone, Mail, MapPin, UserCheck } from 'lucide-react';

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [mensaje, setMensaje] = useState(null);

  // Estado para el modal de crear/editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [proveedorActual, setProveedorActual] = useState({
    id_proveedor: null,
    nombre_empresa: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
  });

  // Estados para el modal de confirmación de eliminación personalizado
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  // Extraer el array de la respuesta del backend de forma segura
  const obtenerLista = (res) => {
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  };

  // Cargar proveedores desde la API
  const cargarProveedores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/proveedores');
      setProveedores(obtenerLista(res));
    } catch (err) {
      console.error('Error al cargar proveedores:', err.message);
      setProveedores([]);
      setMensaje({ tipo: 'error', texto: 'No se pudo cargar el listado de proveedores.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const res = await api.get('/proveedores');
        if (active) {
          setProveedores(obtenerLista(res));
        }
      } catch (err) {
        if (active) {
          console.error('Error al cargar proveedores:', err.message);
          setProveedores([]);
          setMensaje({ tipo: 'error', texto: 'No se pudo conectar con el servicio de proveedores.' });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [cargarProveedores]);

  // Abrir modal para crear
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setProveedorActual({
      id_proveedor: null,
      nombre_empresa: '',
      contacto: '',
      telefono: '',
      email: '',
      direccion: '',
    });
    setModalAbierto(true);
  };

  // Abrir modal para editar
  const abrirModalEditar = (item) => {
    setModoEdicion(true);
    setProveedorActual({
      id_proveedor: item.id_proveedor,
      nombre_empresa: item.nombre_empresa || '',
      contacto: item.contacto || '',
      telefono: item.telefono || '',
      email: item.email || '',
      direccion: item.direccion || '',
    });
    setModalAbierto(true);
  };

  // Preparar la eliminación abriendo el modal personalizado
  const eliminarProveedor = (id) => {
    setIdAEliminar(id);
    setModalEliminarAbierto(true);
  };

  // Ejecutar la eliminación real tras confirmar en el modal
  const confirmarEliminacion = async () => {
    try {
      await api.delete(`/proveedores/${idAEliminar}`);
      setMensaje({ tipo: 'éxito', texto: 'Proveedor eliminado correctamente.' });
      cargarProveedores();
    } catch (err) {
      console.error('Error al eliminar proveedor:', err.message);
      setMensaje({
        tipo: 'error',
        texto: err.response?.data?.error || 'Error al eliminar el proveedor.',
      });
    } finally {
      setModalEliminarAbierto(false);
      setIdAEliminar(null);
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  // Guardar (Crear o Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await api.put(`/proveedores/${proveedorActual.id_proveedor}`, proveedorActual);
        setMensaje({ tipo: 'éxito', texto: 'Proveedor actualizado correctamente.' });
      } else {
        await api.post('/proveedores', proveedorActual);
        setMensaje({ tipo: 'éxito', texto: 'Nuevo proveedor registrado correctamente.' });
      }
      setModalAbierto(false);
      cargarProveedores();
    } catch (err) {
      console.error('Error al guardar proveedor:', err.message);
      setMensaje({
        tipo: 'error',
        texto: err.response?.data?.error || 'Error al guardar el proveedor.',
      });
    } finally {
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  // Filtrado seguro usando los campos nombre_empresa y contacto
  const proveedoresFiltrados = (Array.isArray(proveedores) ? proveedores : []).filter(
    (item) =>
      item?.nombre_empresa?.toLowerCase().includes(filtro.toLowerCase()) ||
      item?.contacto?.toLowerCase().includes(filtro.toLowerCase()) ||
      item?.email?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-100 space-y-6">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Users className="text-blue-500" /> Gestión de Proveedores
          </h1>
          <p className="text-slate-400 text-sm">Administra la libreta de contactos y proveedores del taller.</p>
        </div>

        <button
          onClick={abrirModalCrear}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={18} /> Nuevo Proveedor
        </button>
      </div>

      {/* Alerta flotante */}
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

      {/* Filtro y Recarga */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-md">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Buscar por empresa, persona de contacto o email..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={cargarProveedores}
          className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 transition-all flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      {/* Tabla de Proveedores */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-4">Empresa / Razón Social</th>
                <th className="p-4">Persona de Contacto</th>
                <th className="p-4">Teléfono / Email</th>
                <th className="p-4">Dirección</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    Cargando proveedores...
                  </td>
                </tr>
              )}

              {!loading && proveedoresFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    No se encontraron proveedores registrados.
                  </td>
                </tr>
              )}

              {!loading &&
                proveedoresFiltrados.map((item) => (
                  <tr key={item.id_proveedor} className="hover:bg-slate-700/30">
                    <td className="p-4 font-bold text-white">
                      {item.nombre_empresa}
                    </td>
                    <td className="p-4 text-slate-300">
                      {item.contacto ? (
                        <div className="flex items-center gap-1.5">
                          <UserCheck size={14} className="text-blue-400" /> {item.contacto}
                        </div>
                      ) : (
                        <span className="text-slate-500">No especificado</span>
                      )}
                    </td>
                    <td className="p-4 space-y-1 text-xs">
                      {item.telefono && (
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Phone size={12} className="text-blue-400" /> {item.telefono}
                        </div>
                      )}
                      {item.email && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Mail size={12} className="text-emerald-400" /> {item.email}
                        </div>
                      )}
                      {!item.telefono && !item.email && <span className="text-slate-500">Sin contacto</span>}
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {item.direccion ? (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-purple-400" /> {item.direccion}
                        </div>
                      ) : (
                        'No especificada'
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => abrirModalEditar(item)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all"
                          title="Editar proveedor"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => eliminarProveedor(item.id_proveedor)}
                          className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all"
                          title="Eliminar proveedor"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR / EDITAR */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-lg font-bold text-white">
                {modoEdicion ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="prov_empresa" className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Nombre de la Empresa *
                </label>
                <input
                  id="prov_empresa"
                  type="text"
                  required
                  value={proveedorActual.nombre_empresa}
                  onChange={(e) =>
                    setProveedorActual({ ...proveedorActual, nombre_empresa: e.target.value })
                  }
                  placeholder="Ej: Distribuidora Motos Repuestos S.A."
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="prov_contacto" className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Persona / Nombre de Contacto
                </label>
                <input
                  id="prov_contacto"
                  type="text"
                  value={proveedorActual.contacto}
                  onChange={(e) =>
                    setProveedorActual({ ...proveedorActual, contacto: e.target.value })
                  }
                  placeholder="Ej: Juan Pérez"
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prov_telefono" className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Teléfono
                  </label>
                  <input
                    id="prov_telefono"
                    type="text"
                    value={proveedorActual.telefono}
                    onChange={(e) =>
                      setProveedorActual({ ...proveedorActual, telefono: e.target.value })
                    }
                    placeholder="Ej: +54 11 4433-2211"
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="prov_email" className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    id="prov_email"
                    type="email"
                    value={proveedorActual.email}
                    onChange={(e) =>
                      setProveedorActual({ ...proveedorActual, email: e.target.value })
                    }
                    placeholder="contacto@empresa.com"
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="prov_direccion" className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Dirección
                </label>
                <input
                  id="prov_direccion"
                  type="text"
                  value={proveedorActual.direccion}
                  onChange={(e) =>
                    setProveedorActual({ ...proveedorActual, direccion: e.target.value })
                  }
                  placeholder="Ej: Av. Córdoba 1234, CABA"
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg"
                >
                  {modoEdicion ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PERSONALIZADO DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 text-center">
            
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">¿Estás seguro?</h3>
              <p className="text-slate-400 text-sm mt-1">
                Esta acción eliminará el proveedor de forma permanente y no se podrá deshacer.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalEliminarAbierto(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold transition-all w-1/2"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarEliminacion}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg w-1/2"
              >
                Sí, eliminar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}