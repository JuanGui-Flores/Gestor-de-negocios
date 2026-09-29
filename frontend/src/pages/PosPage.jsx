import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { ShoppingCart, Barcode, Search, Trash2, Plus, Minus, CreditCard, CheckCircle, AlertCircle, MapPin } from 'lucide-react';

export default function PosPage() {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [efectivoRecibido, setEfectivoRecibido] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const barcodeRef = useRef(null);

  useEffect(() => {
    barcodeRef.current?.focus();
  }, []);

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    try {
      const res = await api.get(`/repuestos/buscar/${encodeURIComponent(barcodeInput.trim())}`);
      if (res.data.success && res.data.data.length > 0) {
        addToCart(res.data.data[0]);
        setMensaje({ tipo: 'éxito', texto: `Añadido: ${res.data.data[0].nombre}` });
      } else {
        setMensaje({ tipo: 'error', texto: 'Producto no encontrado por código de barras' });
      }
    } catch (err) {
      console.error('Error al buscar el código de barras:', err.message);
      setMensaje({ tipo: 'error', texto: 'Error al buscar el código de barras' });
    } finally {
      setBarcodeInput('');
      setTimeout(() => setMensaje(null), 2500);
    }
  };

  const handleSearchName = async (val) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/repuestos/buscar/${encodeURIComponent(val.trim())}`);
      if (res.data.success) {
        setSearchResults(res.data.data);
      }
    } catch (err) {
      console.error('Error en búsqueda por nombre:', err.message);
    }
  };

  const addToCart = (repuesto) => {
    if (repuesto.stock_actual <= 0) {
      setMensaje({ tipo: 'error', texto: `Sin stock disponible para "${repuesto.nombre}"` });
      setTimeout(() => setMensaje(null), 2500);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id_repuesto === repuesto.id_repuesto);
      if (existing) {
        if (existing.cantidad + 1 > repuesto.stock_actual) {
          setMensaje({ tipo: 'error', texto: `Máximo stock disponible alcanzado (${repuesto.stock_actual})` });
          setTimeout(() => setMensaje(null), 2500);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id_repuesto === repuesto.id_repuesto
            ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * Number(item.precio_venta) }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id_repuesto: repuesto.id_repuesto,
          nombre: repuesto.nombre,
          precio_venta: Number(repuesto.precio_venta),
          cantidad: 1,
          subtotal: Number(repuesto.precio_venta),
          stock_actual: repuesto.stock_actual,
          ubicacion: repuesto.ubicacion || 'Depósito Gral.',
        },
      ];
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const updateQuantity = (id_repuesto, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id_repuesto === id_repuesto) {
            const nuevaCant = item.cantidad + delta;
            if (nuevaCant > item.stock_actual) {
              setMensaje({ tipo: 'error', texto: `Stock máximo superado (${item.stock_actual})` });
              setTimeout(() => setMensaje(null), 2500);
              return item;
            }
            return nuevaCant > 0
              ? { ...item, cantidad: nuevaCant, subtotal: nuevaCant * item.precio_venta }
              : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id_repuesto) => {
    setCart((prevCart) => prevCart.filter((item) => item.id_repuesto !== id_repuesto));
  };

  const totalVenta = cart.reduce((acc, item) => acc + item.subtotal, 0);

  const recibidoNum = Number.parseFloat(efectivoRecibido) || 0;
  const vuelto = (totalVenta > 0 && recibidoNum >= totalVenta) ? recibidoNum - totalVenta : 0;
  const falta = (totalVenta > 0 && recibidoNum < totalVenta) ? totalVenta - recibidoNum : 0;

  const handleFinalizarVenta = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const payload = {
        metodo_pago: metodoPago,
        detalles: cart.map((item) => ({
          id_repuesto: item.id_repuesto,
          cantidad: item.cantidad,
        })),
      };

      const res = await api.post('/ventas', payload);

      if (res.data.success) {
        setMensaje({ tipo: 'éxito', texto: `¡Venta #${res.data.data.id_venta} registrada con éxito!` });
        setCart([]);
        setEfectivoRecibido('');
      }
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err.response?.data?.error || 'Error al procesar la venta',
      });
    } finally {
      setLoading(false);
      barcodeRef.current?.focus();
      setTimeout(() => setMensaje(null), 3500);
    }
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Punto de Venta</h1>
          <p className="text-xs text-slate-400">Sistema POS - MV Motos</p>
        </div>
      </div>

      {mensaje && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold shadow-lg ${
            mensaje.tipo === 'éxito'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {mensaje.tipo === 'éxito' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {mensaje.texto}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Buscar Producto</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              <div className="relative md:col-span-7">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre o descripción..."
                  value={searchQuery}
                  onChange={(e) => handleSearchName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />

                {searchResults.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    {searchResults.map((item) => (
                      <button
                        key={item.id_repuesto}
                        onClick={() => addToCart(item)}
                        className="w-full px-4 py-3 text-left hover:bg-slate-800/60 flex justify-between items-center border-b border-slate-800/50 last:border-0 transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-white text-sm">{item.nombre}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>Stock: {item.stock_actual}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-amber-400">
                              <MapPin size={12} /> {item.ubicacion || 'Sin estante'}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-400 text-sm">${Number(item.precio_venta).toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleBarcodeSubmit} className="relative md:col-span-5">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Barcode size={18} />
                </div>
                <input
                  ref={barcodeRef}
                  type="text"
                  placeholder="Escanear código..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </form>

            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-95">
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShoppingCart size={18} className="text-blue-500" /> Carrito
              </h2>
              <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-400 font-medium">
                {cart.length} ítem(s)
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center my-auto">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-center text-slate-600 mb-3 shadow-inner">
                  <ShoppingCart size={28} />
                </div>
                <p className="text-sm font-bold text-slate-300">Carrito vacío</p>
                <p className="text-xs text-slate-500 mt-1">Busca productos o escanea un código para agregar al carrito.</p>
              </div>
            ) : (
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Producto / Ubicación</th>
                      <th className="p-4 text-center">Precio Unit.</th>
                      <th className="p-4 text-center">Cantidad</th>
                      <th className="p-4 text-right">Subtotal</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {cart.map((item) => (
                      <tr key={item.id_repuesto} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-white text-sm">{item.nombre}</div>
                          <div className="text-xs text-amber-400/90 flex items-center gap-1 mt-0.5">
                            <MapPin size={12} /> Ubicación: <span className="font-medium">{item.ubicacion}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center text-slate-400">${item.precio_venta.toLocaleString()}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => updateQuantity(item.id_repuesto, -1)}
                              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-white transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center font-bold text-white text-sm">{item.cantidad}</span>
                            <button
                              onClick={() => updateQuantity(item.id_repuesto, 1)}
                              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-white transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-emerald-400">
                          ${item.subtotal.toLocaleString()}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => removeFromCart(item.id_repuesto)}
                            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-xl h-fit">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-5 border-b border-slate-800 pb-3 flex items-center gap-2">
              <CreditCard size={18} className="text-emerald-400" /> Resumen de Pago
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Método de Pago
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {['efectivo', 'tarjeta', 'transferencia'].map((metodo) => (
                    <button
                      key={metodo}
                      type="button"
                      onClick={() => setMetodoPago(metodo)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl capitalize transition-all border ${
                        metodoPago === metodo
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                      }`}
                    >
                      {metodo}
                    </button>
                  ))}
                </div>
              </div>

              {metodoPago === 'efectivo' && (
                <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <div>
                    <label htmlFor="efectivoRecibidoInput" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Efectivo Recibido
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold">$</span>
                      <input
                        id="efectivoRecibidoInput"
                        type="number"
                        value={efectivoRecibido}
                        onChange={(e) => setEfectivoRecibido(e.target.value)}
                        placeholder="0"
                        className="w-full pl-7 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-sm">
                    <span className="text-slate-400 text-xs font-medium">Vuelto a entregar:</span>
                    <span className={`font-bold text-base ${vuelto > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      ${vuelto.toLocaleString()}
                    </span>
                  </div>

                  {falta > 0 && recibidoNum > 0 && (
                    <div className="text-[11px] text-rose-400 font-medium text-right">
                      Faltan ${falta.toLocaleString()} para completar
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-2">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Subtotal</span>
                <span>${totalVenta.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white text-lg font-black pt-2 border-t border-slate-800/50">
                <span>Total a Cobrar</span>
                <span className="text-emerald-400">${totalVenta.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleFinalizarVenta}
            disabled={cart.length === 0 || loading || (metodoPago === 'efectivo' && recibidoNum < totalVenta)}
            className={`w-full mt-8 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-xl flex justify-center items-center gap-2 transition-all ${
              cart.length === 0 || loading || (metodoPago === 'efectivo' && recibidoNum < totalVenta)
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
            }`}
          >
            {loading ? 'Procesando Venta...' : 'Completar y Cobrar'}
          </button>
        </div>

      </div>
    </div>
  );
}