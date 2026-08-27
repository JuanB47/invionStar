import React, { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { KpiCard } from '../../components/common/KpiCard';

export const GestionStockView = ({ user, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Stock Físico');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Todos');

  // Estado del inventario editable
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Arroz 1Kg', category: 'Alimentos', location: 'Estantería A1', stock: 12, min: 50, price: '$4.500' },
    { id: 2, name: 'Aceite 1L', category: 'Alimentos', location: 'Bodega Central', stock: 8, min: 30, price: '$9.200' },
    { id: 3, name: 'Leche 1L', category: 'Lácteos', location: 'Estantería B3', stock: 6, min: 20, price: '$4.100' },
    { id: 4, name: 'Detergente 500g', category: 'Limpieza', location: 'Bodega Central', stock: 45, min: 15, price: '$6.800' },
    { id: 5, name: 'Jabón Multiuso', category: 'Limpieza', location: 'Estantería C2', stock: 28, min: 10, price: '$2.500' },
  ]);

  // Modal para registro manual
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movementType, setMovementType] = useState('Entrada');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');

  // Menú exclusivo del Surtidor
  const surtidorMenuItems = [
    { name: 'Stock Físico', icon: '📦' },
    { name: 'Registrar Movimiento', icon: '📝' },
    { name: 'Auditoría Estantes', icon: '🔍' },
  ];

  // Ajuste directo de stock
  const handleStockAdjust = (id, delta) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          return { ...item, stock: newStock };
        }
        return item;
      })
    );
  };

  // Registrar movimiento desde el formulario
  const handleSaveMovement = (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity || quantity <= 0) return;

    const qtyNum = parseInt(quantity, 10);
    setInventory((prev) =>
      prev.map((item) => {
        if (item.name === selectedProduct) {
          const adjustment = movementType === 'Entrada' ? qtyNum : -qtyNum;
          return { ...item, stock: Math.max(0, item.stock + adjustment) };
        }
        return item;
      })
    );

    setIsModalOpen(false);
    setQuantity('');
    setSelectedProduct('');
  };

  // Filtrado dinámico
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'Todos' || item.location.includes(selectedLocation);
    return matchesSearch && matchesLocation;
  });

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
        menuItems={surtidorMenuItems}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="md:ml-60 p-4 md:p-8 pt-16 md:pt-8 transition-all">
        
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{activeMenu}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Control operativo e inventario físico en tiempo real</p>
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
              <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
                SU
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold leading-tight">{user?.name || 'Surtidor'}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Gestor de Stock</div>
              </div>
            </div>
          </div>
        </header>

        {/* Tarjetas Informativas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <KpiCard title="TOTAL PRODUCTOS" value={inventory.length.toString()} isDarkMode={isDarkMode} />
          <KpiCard title="CRÍTICOS EN ESTANTE" value={inventory.filter(i => i.stock < i.min).length.toString()} isDarkMode={isDarkMode} />
          <KpiCard title="BODEGA CENTRAL" value={inventory.filter(i => i.location.includes('Bodega')).length.toString()} isDarkMode={isDarkMode} />
        </div>

        {activeMenu === 'Stock Físico' && (
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
            
            {/* Barra de Filtros y Acciones */}
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
              <div className="flex flex-wrap gap-3 flex-1">
                <input
                  type="text"
                  placeholder="🔍 Buscar por nombre o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`px-4 py-2 rounded-xl border text-sm outline-none min-w-[240px] ${
                    isDarkMode ? 'bg-[#070F18] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className={`px-4 py-2 rounded-xl border text-sm outline-none ${
                    isDarkMode ? 'bg-[#070F18] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="Todos">📍 Todas las ubicaciones</option>
                  <option value="Estantería">🏪 Estanterías</option>
                  <option value="Bodega">🏬 Bodega Central</option>
                </select>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 bg-[#16B3B0] hover:bg-[#139693] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                ➕ Nuevo Movimiento Manual
              </button>
            </div>

            {/* Tabla de Control de Stock */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Producto</th>
                    <th className="pb-3 font-semibold">Categoría</th>
                    <th className="pb-3 font-semibold">Ubicación</th>
                    <th className="pb-3 font-semibold text-center">Stock Actual</th>
                    <th className="pb-3 font-semibold">Estado</th>
                    <th className="pb-3 font-semibold text-center">Ajuste Rápido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredInventory.map((item) => {
                    const isLow = item.stock < item.min;
                    return (
                      <tr key={item.id} className="hover:bg-slate-500/5 transition-colors">
                        <td className="py-3 font-bold">{item.name}</td>
                        <td className="py-3 text-slate-400">{item.category}</td>
                        <td className="py-3">
                          <span className="px-2 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800 font-medium">
                            {item.location}
                          </span>
                        </td>
                        <td className="py-3 text-center font-extrabold text-base">{item.stock}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isLow ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          }`}>
                            {isLow ? 'Surtir urgente' : 'Óptimo'}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleStockAdjust(item.id, -1)}
                              className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleStockAdjust(item.id, 1)}
                              className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Registro de Movimiento Manual */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${
              isDarkMode ? 'bg-[#0D1B2A] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold">Registrar Movimiento Físico</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveMovement} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tipo de Movimiento</label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                      isDarkMode ? 'bg-[#070F18] border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="Entrada">📥 Entrada / Reabastecimiento</option>
                    <option value="Salida">📤 Salida / Despacho</option>
                    <option value="Merma">⚠️ Merma / Mermado o Dañado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Producto</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                      isDarkMode ? 'bg-[#070F18] border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                    required
                  >
                    <option value="">Selecciona un producto...</option>
                    {inventory.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name} (Actual: {item.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej: 10"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                      isDarkMode ? 'bg-[#070F18] border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold rounded-xl text-slate-400 hover:bg-slate-500/10"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#16B3B0] hover:bg-[#139693] text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Guardar Movimiento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sección Auditoría */}
        {activeMenu !== 'Stock Físico' && (
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
            <h2 className="text-lg font-bold mb-2">{activeMenu}</h2>
            <p className="text-sm text-slate-400 mb-4">Sección operativa de revisión de estantes y reposición.</p>
            <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-slate-400">
              🛠️ Módulo en desarrollo.
            </div>
          </div>
        )}
      </main>
    </div>
  );
};