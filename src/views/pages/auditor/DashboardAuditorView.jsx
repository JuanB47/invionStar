import React, { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { KpiCard } from '../../components/common/KpiCard';
import { ChatIAView } from './ChatIAView';

export const DashboardAuditorView = ({ user, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Generar iniciales dinámicas para el avatar
  const getUserInitials = (name) => {
    if (!name) return 'AU';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Definición del menú exclusivo para el Auditor
  const auditorMenuItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Chat IA', icon: '🤖' },
    { name: 'Precios y Bodega', icon: '🏷️' },
    { name: 'Reportes y Métricas', icon: '📊' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#070F18] text-white' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* Botón Menú Móvil */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#0B1726] text-white p-2.5 rounded-lg shadow-lg"
      >
        ☰
      </button>

      {/* Sidebar Reusable */}
      <Sidebar
        menuItems={auditorMenuItems}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onLogout={onLogout}
      />

      {/* Overlay Móvil */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)} 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Contenido Principal */}
      <main className="md:ml-60 p-4 md:p-8 pt-16 md:pt-8 transition-all">
        
        {/* Header Superior */}
        <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{activeMenu}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Panel de Control Estratégico e Inteligencia</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${
                isDarkMode ? 'bg-[#0D1B2A] text-white border-slate-700' : 'bg-white text-slate-800 border-slate-200'
              }`}
            >
              {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#16B3B0] flex items-center justify-center text-white font-bold text-sm">
                {getUserInitials(user?.name)}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold leading-tight">{user?.name || 'Auditor'}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Auditor General</div>
              </div>
            </div>
          </div>
        </header>

        {/* Renderizado Dinámico según el Submenú Seleccionado */}
        {activeMenu === 'Dashboard' && (
          <>
            {/* Tarjetas KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KpiCard title="STOCK TOTAL" value="1.256" isDarkMode={isDarkMode} />
              <KpiCard title="ENTRADAS (HOY)" value="325" isDarkMode={isDarkMode} />
              <KpiCard title="SALIDAS (HOY)" value="217" isDarkMode={isDarkMode} />
              <KpiCard title="PÉRDIDAS (HOY)" value="12" isDarkMode={isDarkMode} />
            </div>

            {/* Sección Gráficos y Porcentajes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">RESUMEN DE INVENTARIO</h3>
                <div className="h-44 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 font-medium">
                  📈 [Gráfico de Tendencia]
                </div>
              </div>

              <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">PORCENTAJE POR CATEGORÍA</h3>
                <div className="space-y-3">
                  {[
                    { cat: 'Alimentos', pct: '40%', color: 'bg-[#16B3B0]' },
                    { cat: 'Bebidas', pct: '25%', color: 'bg-[#0B1726]' },
                    { cat: 'Limpieza', pct: '20%', color: 'bg-sky-400' },
                    { cat: 'Otros', pct: '15%', color: 'bg-slate-400' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                        <span>{item.cat}</span>
                      </div>
                      <span className="font-bold">{item.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tablas Inferiores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Productos Bajo Stock */}
              <div className={`p-5 rounded-2xl border overflow-x-auto ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">PRODUCTOS BAJO STOCK</h3>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                      <th className="pb-2 font-semibold">Producto</th>
                      <th className="pb-2 font-semibold">Stock</th>
                      <th className="pb-2 font-semibold">Mínimo</th>
                      <th className="pb-2 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {[
                      { name: 'Arroz 1Kg', stock: 12, min: 50, status: 'Crítico', color: 'bg-red-500' },
                      { name: 'Aceite 1L', stock: 8, min: 30, status: 'Crítico', color: 'bg-red-500' },
                      { name: 'Leche 1L', stock: 6, min: 20, status: 'Bajo', color: 'bg-amber-500' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="py-3 font-medium">{row.name}</td>
                        <td className="py-3">{row.stock}</td>
                        <td className="py-3">{row.min}</td>
                        <td className="py-3">
                          <span className={`${row.color} text-white px-2 py-0.5 rounded-md text-xs font-bold`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Movimientos Recientes */}
              <div className={`p-5 rounded-2xl border overflow-x-auto ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">MOVIMIENTOS RECIENTES</h3>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                      <th className="pb-2 font-semibold">Tipo</th>
                      <th className="pb-2 font-semibold">Producto</th>
                      <th className="pb-2 font-semibold">Cant.</th>
                      <th className="pb-2 font-semibold">Usuario</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {[
                      { type: 'Entrada', prod: 'Aceite 1L', cant: '50 Und', user: 'Carlos' },
                      { type: 'Salida', prod: 'Arroz 1Kg', cant: '20 Und', user: 'María' },
                      { type: 'Pérdida', prod: 'Leche 1L', cant: '5 Und', user: 'Juan' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="py-3 font-medium">{row.type}</td>
                        <td className="py-3">{row.prod}</td>
                        <td className="py-3">{row.cant}</td>
                        <td className="py-3">{row.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Vista del Chat IA */}
        {activeMenu === 'Chat IA' && (
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
            <ChatIAView 
              messages={[
                { sender: 'assistant', text: 'Hola Auditor. Estoy conectado a la Base de Datos y a los Google Sheets. ¿Qué deseas consultar hoy?' }
              ]}
              inputQuery=""
              onInputChange={() => {}}
              onSend={(e) => e.preventDefault()}
            />
          </div>
        )}

        {/* Vista de Edición de Precios y Bodega */}
        {activeMenu === 'Precios y Bodega' && (
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
            <h2 className="text-lg font-bold mb-2">Gestión de Precios y Ajuste de Bodega</h2>
            <p className="text-sm text-slate-400 mb-4">Módulo exclusivo para actualización de precios de lista y reasignación de stock en bodega.</p>
            <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-slate-400">
              ⚙️ Formulario de edición de precios en construcción.
            </div>
          </div>
        )}

      </main>
    </div>
  );
};