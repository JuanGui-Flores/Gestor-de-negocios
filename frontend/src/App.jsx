import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';

// Páginas existentes
import PosPage from './pages/PosPage';
import InventarioPage from './pages/InventarioPage';
import ProveedoresPage from './pages/ProveedoresPage';
import ReportesPage from './pages/ReportesPage';
import CajaPage from './pages/CajaPage';
import ClientesPage from './pages/ClientesPage';
import ProductosPage from './pages/ProductosPage';
import PresupuestosPage from './pages/PresupuestosPage';
import DevolucionesPage from './pages/DevolucionesPage';
import UsuariosPage from './pages/UsuariosPage';
import AjustesStockPage from './pages/AjustesStockPage';
import CtaCorrientePage from './pages/CtaCorrientePage';
import AnaliticaPage from './pages/AnaliticaPage';


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login (Sin barra lateral) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Protegidas que comparten el Sidebar y Layout principal */}
        <Route 
          element={
            <RutaPrivada>
              <MainLayout />
            </RutaPrivada>
          }
        >
          {/* Gestión */}
          <Route path="/pos" element={<PosPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/inventario" element={<InventarioPage />} />
          <Route path="/proveedores" element={<ProveedoresPage />} />
          
          {/* Operaciones */}
          <Route path="/caja" element={<CajaPage />} />
          <Route path="/presupuestos" element={<PresupuestosPage />} />
          <Route path="/devoluciones" element={<DevolucionesPage />} />
          <Route path="/ajustes-stock" element={<AjustesStockPage />} />

          {/* Administración */}
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/cta-corrientes" element={<CtaCorrientePage />} />
          
          {/* Sistema */}
          <Route path="/analitica" element={<AnaliticaPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/pos" replace />} />
      </Routes>
    </Router>
  );
}

// Componente auxiliar para proteger rutas
const RutaPrivada = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};