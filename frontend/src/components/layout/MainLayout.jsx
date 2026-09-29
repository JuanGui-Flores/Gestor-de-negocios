import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-[#07090E] overflow-hidden">
      {/* Barra lateral fija a la izquierda */}
      <Sidebar />

      {/* Contenedor dinámico de las páginas a la derecha */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};