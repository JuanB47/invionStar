import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { KpiCard } from '../../components/common/KpiCard';
import { ChatIAView } from './ChatIAView';

// URL de la Web App desplegada en Google Apps Script
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz1rsUY7qAMesAQrgaAT80ckpAk4DVUf7txthyWNkQ_WHCcO6kxugEXAbHnnDfgK5tsXg/exec';

export const DashboardAuditorView = ({ user, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // ESTADOS Y MANEJO DEL CHAT IA
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hola Auditor. Estoy conectado al Kardex Consolidado de Google Sheets. ¿Qué deseas consultar hoy?' }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // ESTADOS PARA LA AUDITORÍA TOTAL DE MERMAS Y KPI REALES
  const [auditoria, setAuditoria] = useState({
    totalStock: "0",
    totalEntradas: "0",
    totalSalidas: "0",
    totalPerdidaDinero: "$0",
    totalFaltantes: 0,
    totalDanados: 0,
    itemsAfectados: []
  });
  const [loadingAuditoria, setLoadingAuditoria] = useState(false);

  const LOOKER_STUDIO_URL = "https://datastudio.google.com/embed/reporting/0a8e78c8-f83c-4489-bb10-ff8c3202c7f2/page/ht79F";

  const getUserInitials = (name) => {
    if (!name) return 'AU';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const auditorMenuItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Chat IA', icon: '🤖' },
    { name: 'Precios y Bodega', icon: '🏷️' },
    { name: 'Reportes y Métricas', icon: '📊' },
  ];

  // Función con trazabilidad completa en consola para la auditoría total y KPIs
  const fetchAuditoriaTotal = async () => {
    setLoadingAuditoria(true);
    console.group("🔍 [INVIONSTAR FRONTEND] Auditoría Total");
    console.log("⏱️ Timestamp:", new Date().toISOString());
    console.log("🌐 URL destino:", APPS_SCRIPT_URL);
    
    try {
      const payload = { action: "OBTENER_AUDITORIA_TOTAL" };
      console.log("📦 Payload enviado:", payload);

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      });

      const responseText = await response.text();
      console.log("📄 Respuesta cruda del servidor:", responseText);

      if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
        console.error("❌ ERROR CRÍTICO: El servidor devolvió HTML (Fallo de permisos en SpreadsheetApp.openById).");
        throw new Error("El backend devolvió una página HTML de error. Revisa los permisos de Google Sheets.");
      }

      const result = JSON.parse(responseText);
      console.log("✅ JSON parseado con éxito:", result);

      if (result.success) {
        setAuditoria(result);
      } else {
        console.warn("⚠️ El backend respondió con éxito falso:", result.message);
      }
    } catch (error) {
      console.error("🔥 Error capturado en el bloque catch:", error.message);
    } finally {
      console.groupEnd();
      setLoadingAuditoria(false);
    }
  };

  // Cargar datos de auditoría al iniciar el Dashboard
  useEffect(() => {
    if (activeMenu === 'Dashboard') {
      fetchAuditoriaTotal();
    }
  }, [activeMenu]);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoadingChat) return;

    const userMessage = inputQuery.trim();
    setInputQuery('');

    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setIsLoadingChat(true);

    try {
      const payload = {
        action: "CHAT_KARDEX",
        pregunta: userMessage
      };

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      });

      const responseText = await response.text();
      if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
        throw new Error("El backend devolvió HTML de error en el chat.");
      }

      const result = JSON.parse(responseText);

      if (result.status === 'error' || result.success === false) {
        throw new Error(result.message || 'Error en la respuesta del backend');
      }

      setMessages((prev) => [...prev, { sender: 'assistant', text: result.respuesta }]);
    } catch (error) {
      console.error('Error en el chat:', error);
      setMessages((prev) => [
        ...prev, 
        { sender: 'assistant', text: `⚠️ Error al consultar el Kardex: ${error.message}` }
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#070F18] text-white' : 'bg-slate-100 text-slate-900'}`}>
      
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#0B1726] text-white p-2.5 rounded-lg shadow-lg"
      >
        ☰
      </button>

      <Sidebar
        menuItems={auditorMenuItems}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onLogout={onLogout}
      />

      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)} 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <main className="md:ml-60 p-4 md:p-8 pt-16 md:pt-8 transition-all">
        
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

        {activeMenu === 'Dashboard' && (
          <>
            {/* TARJETAS KPI ENLAZADAS AL KARDEX CONSOLIDADO REAL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KpiCard title="STOCK TOTAL" value={auditoria.totalStock} isDarkMode={isDarkMode} />
              <KpiCard title="ENTRADAS TOTALES" value={auditoria.totalEntradas} isDarkMode={isDarkMode} />
              <KpiCard title="SALIDAS TOTALES" value={auditoria.totalSalidas} isDarkMode={isDarkMode} />
              <KpiCard title="PÉRDIDAS TOTALES" value={auditoria.totalPerdidaDinero} isDarkMode={isDarkMode} />
            </div>

            <div className={`p-5 rounded-2xl border mb-6 ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AUDITORÍA DE MERMAS, FALTANTES Y DAÑADOS (KARDEX CONSOLIDADO)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Total ítems afectados: {auditoria.itemsAfectados?.length || 0}</p>
                </div>
                <button
                  onClick={fetchAuditoriaTotal}
                  disabled={loadingAuditoria}
                  className="text-xs text-[#16B3B0] font-bold hover:underline flex items-center gap-1"
                >
                  {loadingAuditoria ? '⏳ Actualizando...' : '🔄 Actualizar Datos'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Código / Producto</th>
                      <th className="pb-3 font-semibold text-center">Faltantes</th>
                      <th className="pb-3 font-semibold text-center">Dañados</th>
                      <th className="pb-3 font-semibold">Observación</th>
                      <th className="pb-3 font-semibold text-right">Pérdida Total ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {loadingAuditoria ? (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-slate-400 text-xs">Cargando auditoría desde Supabase y Google Sheets...</td>
                      </tr>
                    ) : !auditoria.itemsAfectados || auditoria.itemsAfectados.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-slate-400 text-xs">No hay mermas ni faltantes registrados con valores mayores a 0.</td>
                      </tr>
                    ) : (
                      auditoria.itemsAfectados.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-500/5 transition-colors">
                          <td className="py-3">
                            <div className="font-bold">{item.nombre_producto}</div>
                            <div className="text-xs text-slate-400 font-mono">{item.codigo_item}</div>
                          </td>
                          <td className="py-3 text-center font-semibold text-amber-500">{item.faltantes}</td>
                          <td className="py-3 text-center font-semibold text-red-500">{item.danados}</td>
                          <td className="py-3 text-slate-400 text-xs">{item.observaciones || 'Sin observaciones'}</td>
                          <td className="py-3 text-right font-extrabold text-red-500">
                            ${Number(item.perdida_subtotal || 0).toLocaleString('es-CO')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* CHAT IA */}
        {activeMenu === 'Chat IA' && (
          <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
            <ChatIAView 
              messages={messages}
              inputQuery={inputQuery}
              onInputChange={(e) => setInputQuery(e.target.value)}
              onSend={handleSendChat}
              isLoading={isLoadingChat}
            />
          </div>
        )}

        {/* PRECIOS Y BODEGA */}
        {activeMenu === 'Precios y Bodega' && (
          <PreciosBodegaModule isDarkMode={isDarkMode} />
        )}

        {/* REPORTES Y MÉTRICAS */}
        {activeMenu === 'Reportes y Métricas' && (
          <div className={`p-4 md:p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
            <div className="mb-4">
              <h2 className="text-lg font-bold">Informe Ejecutivo de Auditoría</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Visualización consolidada en tiempo real de Kardex, faltantes y mercancía dañada.
              </p>
            </div>
            
            <div className="w-full h-[750px] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 bg-white">
              <iframe
                src={LOOKER_STUDIO_URL}
                title="INVIONSTAR - Reporte Looker Studio"
                className="w-full h-full border-none"
                allowFullScreen
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

// =========================================================
// MÓDULO PRECIOS Y BODEGA
// =========================================================
function PreciosBodegaModule({ isDarkMode }) {
  const [activeTab, setActiveTab] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formProd, setFormProd] = useState({ codigo_item: '', nombre: '', categoria: '', precio: '' });
  const [formBodega, setFormBodega] = useState({ id: '', nombre: '', direccion: '', telefono: '', encargado: '' });

  const callBackend = async (payload) => {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
    });
    const text = await res.text();
    if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
      throw new Error("El backend devolvió HTML de error (Revisar permisos de ejecución).");
    }
    return JSON.parse(text);
  };

  const cargarDatosBD = async () => {
    setLoading(true);
    try {
      const data = await callBackend({ action: "OBTENER_DATOS_PB" });
      if (data.success) {
        setProductos(data.productos || []);
        setBodegas(data.bodegas || []);
      } else {
        alert("Error al cargar datos desde Supabase: " + (data.message || JSON.stringify(data)));
      }
    } catch (err) {
      console.error("Error consultando la BD:", err);
      alert("Error al conectar con la base de datos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosBD();
  }, []);

  const handleGuardarProducto = async (e) => {
    e.preventDefault();
    if (!formProd.codigo_item || !formProd.nombre || !formProd.precio) {
      alert("Por favor completa los campos del producto.");
      return;
    }

    setLoading(true);
    try {
      const res = await callBackend({
        action: "GUARDAR_PRODUCTO_PB",
        producto: formProd
      });

      if (res.success) {
        setFormProd({ codigo_item: '', nombre: '', categoria: '', precio: '' });
        await cargarDatosBD();
      } else {
        alert("Error al guardar producto: " + res.message);
      }
    } catch (err) {
        alert("Error al guardar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarProducto = (prod) => {
    setFormProd(prod);
  };

  const handleEliminarProducto = async (codigoItem) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el producto ${codigoItem}?`)) return;

    setLoading(true);
    try {
      const res = await callBackend({
        action: "ELIMINAR_PRODUCTO_PB",
        codigoItem: codigoItem
      });

      if (res.success) {
        await cargarDatosBD();
      } else {
        alert("Error al eliminar producto: " + res.message);
      }
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarBodega = async (e) => {
    e.preventDefault();
    if (!formBodega.nombre || !formBodega.direccion) {
      alert("Por favor completa el nombre y la dirección de la bodega.");
      return;
    }

    const payloadBodega = {
      ...formBodega,
      id: formBodega.id ? Number(formBodega.id) : undefined
    };

    setLoading(true);
    try {
      const res = await callBackend({
        action: "GUARDAR_BODEGA_PB",
        bodega: payloadBodega
      });

      if (res.success) {
        setFormBodega({ id: '', nombre: '', direccion: '', telefono: '', encargado: '' });
        await cargarDatosBD();
      } else {
        alert("Error al guardar bodega: " + res.message);
      }
    } catch (err) {
      alert("Error al guardar bodega: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarBodega = (bod) => {
    setFormBodega(bod);
  };

  const handleEliminarBodega = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta bodega?")) return;

    setLoading(true);
    try {
      const res = await callBackend({
        action: "ELIMINAR_BODEGA_PB",
        idBodega: id
      });

      if (res.success) {
        await cargarDatosBD();
      } else {
        alert("Error al eliminar bodega: " + res.message);
      }
    } catch (err) {
      alert("Error al eliminar bodega: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* PESTAÑAS (TABS) */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('productos')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'productos'
                ? 'bg-[#16B3B0] text-white shadow-md'
                : isDarkMode ? 'bg-[#0D1B2A] text-slate-400 hover:text-white' : 'bg-white text-slate-600'
            }`}
          >
            <span>🏷️</span> Productos
          </button>

          <button
            onClick={() => setActiveTab('bodegas')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'bodegas'
                ? 'bg-[#16B3B0] text-white shadow-md'
                : isDarkMode ? 'bg-[#0D1B2A] text-slate-400 hover:text-white' : 'bg-white text-slate-600'
            }`}
          >
            <span>🏢</span> Bodegas Registradas
          </button>
        </div>

        <button
          onClick={cargarDatosBD}
          disabled={loading}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#16B3B0] hover:text-white hover:border-[#16B3B0]'
          } ${isDarkMode ? 'bg-[#0D1B2A] text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-300 shadow-sm'}`}
        >
          <span>{loading ? '⏳' : '🔄'}</span>
          <span>{loading ? 'Cargando BD...' : 'Actualizar de BD'}</span>
        </button>
      </div>

      {/* PESTAÑA PRODUCTOS */}
      {activeTab === 'productos' && (
        <div className="space-y-6">
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">REGISTRAR O ACTUALIZAR PRODUCTO</h3>
            <form onSubmit={handleGuardarProducto} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Código Item (Ej: ART-011)"
                value={formProd.codigo_item}
                onChange={(e) => setFormProd({ ...formProd, codigo_item: e.target.value })}
                className={`p-2.5 rounded-xl border text-xs outline-none ${isDarkMode ? 'bg-[#070F18] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                required
              />
              <input
                type="text"
                placeholder="Nombre del Producto"
                value={formProd.nombre}
                onChange={(e) => setFormProd({ ...formProd, nombre: e.target.value })}
                className={`p-2.5 rounded-xl border text-xs outline-none ${isDarkMode ? 'bg-[#070F18] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                required
              />
              <input
                type="text"
                placeholder="Categoría"
                value={formProd.categoria}
                onChange={(e) => setFormProd({ ...formProd, categoria: e.target.value })}
                className={`p-2.5 rounded-xl border text-xs outline-none ${isDarkMode ? 'bg-[#070F18] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
              />
              <input
                type="text"
                placeholder="Precio (Ej: $5.000)"
                value={formProd.precio}
                onChange={(e) => setFormProd({ ...formProd, precio: e.target.value })}
                className={`p-2.5 rounded-xl border text-xs outline-none ${isDarkMode ? 'bg-[#070F18] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#16B3B0] hover:bg-[#139693] text-white font-bold text-xs rounded-xl py-2.5 transition-all shadow-sm"
              >
                {formProd.codigo_item && productos.some(p => p.codigo_item === formProd.codigo_item) ? 'Actualizar Producto' : 'Crear Producto'}
              </button>
            </form>
          </div>

          <div className={`p-5 rounded-2xl border overflow-x-auto ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">LISTADO DE PRODUCTOS EN SUPABASE ({productos.length})</h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                  <th className="pb-2 font-semibold">Código</th>
                  <th className="pb-2 font-semibold">Nombre</th>
                  <th className="pb-2 font-semibold">Categoría</th>
                  <th className="pb-2 font-semibold">Precio</th>
                  <th className="pb-2 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {productos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400 text-xs">No hay productos registrados en la base de datos.</td>
                  </tr>
                ) : (
                  productos.map((prod) => (
                    <tr key={prod.codigo_item}>
                      <td className="py-3 font-bold">{prod.codigo_item}</td>
                      <td className="py-3">{prod.nombre}</td>
                      <td className="py-3 text-slate-400">{prod.categoria}</td>
                      <td className="py-3 font-extrabold text-[#16B3B0]">{prod.precio}</td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => handleEditarProducto(prod)}
                          className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold hover:bg-amber-500 hover:text-white transition-all"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminarProducto(prod.codigo_item)}
                          className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PESTAÑA BODEGAS */}
      {activeTab === 'bodegas' && (
        <div className="space-y-6">
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">REGISTRAR O ACTUALIZAR BODEGA</h3>
            <form onSubmit={handleGuardarBodega} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Nombre de la Bodega"
                value={formBodega.nombre}
                onChange={(e) => setFormBodega({ ...formBodega, nombre: e.target.value })}
                className={`p-2.5 rounded-xl border text-xs outline-none ${isDarkMode ? 'bg-[#070F18] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                required
              />
              <input
                type="text"
                placeholder="Dirección"
                value={formBodega.direccion}
                onChange={(e) => setFormBodega({ ...formBodega, direccion: e.target.value })}
                className={`p-2.5 rounded-xl border text-xs outline-none ${isDarkMode ? 'bg-[#070F18] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                required
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={formBodega.telefono}
                onChange={(e) => setFormBodega({ ...formBodega, telefono: e.target.value })}
                className={`p-2.5 rounded-xl border text-xs outline-none ${isDarkMode ? 'bg-[#070F18] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
              />
              <input
                type="text"
                placeholder="Encargado"
                value={formBodega.encargado}
                onChange={(e) => setFormBodega({ ...formBodega, encargado: e.target.value })}
                className={`p-2.5 rounded-xl border text-xs outline-none ${isDarkMode ? 'bg-[#070F18] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#16B3B0] hover:bg-[#139693] text-white font-bold text-xs rounded-xl py-2.5 transition-all shadow-sm"
              >
                {formBodega.id ? 'Actualizar Bodega' : 'Crear Bodega'}
              </button>
            </form>
          </div>

          <div className={`p-5 rounded-2xl border overflow-x-auto ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">BODEGAS REGISTRADAS EN SUPABASE ({bodegas.length})</h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                  <th className="pb-2 font-semibold">ID</th>
                  <th className="pb-2 font-semibold">Nombre</th>
                  <th className="pb-2 font-semibold">Dirección</th>
                  <th className="pb-2 font-semibold">Teléfono</th>
                  <th className="pb-2 font-semibold">Encargado</th>
                  <th className="pb-2 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {bodegas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-400 text-xs">No hay bodegas registradas en la base de datos.</td>
                  </tr>
                ) : (
                  bodegas.map((bod) => (
                    <tr key={bod.id || bod.nombre}>
                      <td className="py-3 font-bold">{bod.id || 'N/A'}</td>
                      <td className="py-3 font-bold text-[#16B3B0]">{bod.nombre}</td>
                      <td className="py-3">{bod.direccion}</td>
                      <td className="py-3 text-slate-400">{bod.telefono || 'N/A'}</td>
                      <td className="py-3 text-slate-400">{bod.encargado || 'N/A'}</td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => handleEditarBodega(bod)}
                          className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold hover:bg-amber-500 hover:text-white transition-all"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminarBodega(bod.id)}
                          className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}