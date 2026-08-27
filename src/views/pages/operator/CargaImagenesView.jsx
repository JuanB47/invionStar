import React, { useState, useRef } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';

// NUEVA URL de la Web App desplegada en Google Apps Script
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwiawnomA7Sp3PRJhLSWPQZMqWomyDZofhDRSNm4TH78joMXHjXiSZoabh0H6oFKlLOqQ/exec';

// Utilidad para convertir File a Base64 puro
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const CargaImagenesView = ({ user, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Cargar Imágenes');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Estados para gestión de archivos
  const [selectedCategory, setSelectedCategory] = useState('Stock Estantería');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Menú del Operador
  const operatorMenuItems = [
    { name: 'Cargar Imágenes', icon: '📸' },
    { name: 'Historial Cargas', icon: '📋' },
    { name: 'Sincronización', icon: '🔄' },
  ];

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter((file) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    );

    const newEntries = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      category: selectedCategory,
      notes: '',
      status: 'Pendiente',
    }));

    setUploadedFiles((prev) => [...prev, ...newEntries]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id) => {
    setUploadedFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleNoteChange = (id, text) => {
    setUploadedFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes: text } : item))
    );
  };

  // Procesamiento y envío sincronizado con el backend y Supabase
  const handleProcessUploads = async () => {
    if (uploadedFiles.length === 0) return;
    setIsProcessing(true);

    try {
      for (const item of uploadedFiles) {
        const base64Data = await fileToBase64(item.file);

        // Payload alineado con el nuevo Google Apps Script
        const payload = {
          imagenBase64: base64Data,
          operador_id: user?.id || user?.name || 'operador_anonimo'
        };

        const response = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
        });

        const result = await response.json();

        // Validación basada en la nueva respuesta del backend
        if (result.status === 'error' || result.success === false) {
          throw new Error(result.message || 'Error en el procesamiento del backend');
        }

        console.log('Resultado del guardado en Supabase:', result);
      }

      alert('¡Planilla procesada y guardada en Supabase con éxito!');
      setUploadedFiles([]);
    } catch (error) {
      console.error('Error en el procesamiento:', error);
      alert(`Error al procesar: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

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
        menuItems={operatorMenuItems}
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
            <p className="text-sm text-slate-500 dark:text-slate-400">Captura y procesamiento visual de inventario</p>
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
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                OP
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold leading-tight">{user?.name || 'Operador'}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Captura de Campo</div>
              </div>
            </div>
          </div>
        </header>

        {activeMenu === 'Cargar Imágenes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Panel Izquierdo */}
            <div className="lg:col-span-1 space-y-4">
              <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tipo de Registro Visual
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                    isDarkMode ? 'bg-[#070F18] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="Stock Estantería">📦 Stock en Estantería</option>
                  <option value="Ingreso Bodega">📥 Ingreso a Bodega</option>
                  <option value="Salida / Venta">📤 Salida de Producto</option>
                  <option value="Merma / Pérdida">⚠️ Merma / Dañado</option>
                </select>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-[#16B3B0] bg-[#16B3B0]/10'
                    : isDarkMode
                    ? 'border-slate-700 bg-[#0D1B2A] hover:border-slate-500'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/jpeg, image/png, image/webp"
                  ref={fileInputRef}
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-[#16B3B0]/10 text-[#16B3B0] flex items-center justify-center text-2xl font-bold">
                  📁
                </div>
                <div>
                  <p className="text-sm font-bold">Arrastra tus fotos aquí</p>
                  <p className="text-xs text-slate-400 mt-1">Soporta JPG, PNG, WEBP</p>
                </div>
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-[#16B3B0] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#139693] transition-all"
                >
                  Examinar archivos
                </button>
              </div>
            </div>

            {/* Panel Derecho */}
            <div className="lg:col-span-2">
              <div className={`p-5 rounded-2xl border h-full flex flex-col ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Cola de Procesamiento ({uploadedFiles.length})
                  </h3>
                  {uploadedFiles.length > 0 && (
                    <button
                      onClick={() => setUploadedFiles([])}
                      className="text-xs text-red-500 hover:underline font-semibold"
                    >
                      Vaciar todo
                    </button>
                  )}
                </div>

                {uploadedFiles.length === 0 ? (
                  <div className="flex-1 min-h-[250px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 text-sm">
                    No hay imágenes cargadas para procesar.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 overflow-y-auto max-h-[450px] pr-1">
                    {uploadedFiles.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border flex gap-3 relative ${
                          isDarkMode ? 'bg-[#070F18] border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <img
                          src={item.preview}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded-lg bg-slate-200"
                        />
                        <div className="flex-1 flex flex-col justify-between text-xs">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded bg-[#16B3B0]/10 text-[#16B3B0] font-bold mb-1">
                              {item.category}
                            </span>
                            <p className="text-slate-400 truncate max-w-[120px]">{item.file.name}</p>
                          </div>
                          <input
                            type="text"
                            placeholder="Añadir nota rápida..."
                            value={item.notes}
                            onChange={(e) => handleNoteChange(item.id, e.target.value)}
                            className={`w-full p-1.5 rounded-lg border text-xs outline-none ${
                              isDarkMode ? 'bg-[#0D1B2A] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveFile(item.id)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={handleProcessUploads}
                    disabled={uploadedFiles.length === 0 || isProcessing}
                    className={`px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 ${
                      uploadedFiles.length === 0 || isProcessing
                        ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-[#16B3B0] hover:bg-[#139693] text-white'
                    }`}
                  >
                    {isProcessing ? '⚡ Procesando e insertando en Supabase...' : '🚀 Procesar e Enviar Registro'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Historial */}
        {activeMenu === 'Historial Cargas' && (
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#0D1B2A] border-[#1E293B]' : 'bg-white border-slate-200'}`}>
            <h2 className="text-lg font-bold mb-2">Historial de Capturas Recientes</h2>
            <p className="text-sm text-slate-400 mb-4">Registro de imágenes enviadas y su estado de sincronización.</p>
            <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-slate-400">
              📋 Lista de registros anteriores.
            </div>
          </div>
        )}
      </main>
    </div>
  );
};