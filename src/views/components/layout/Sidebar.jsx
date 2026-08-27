import React from 'react';

export const LogoHexagon = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" fill="#0D1B2A" stroke="#16B3B0" strokeWidth="6"/>
    <circle cx="50" cy="50" r="22" fill="#16B3B0" />
    <circle cx="50" cy="50" r="12" fill="#7FD9D6" />
    <circle cx="50" cy="50" r="6" fill="#0D1B2A" />
  </svg>
);

export const Sidebar = ({ 
  menuItems = [], 
  activeMenu, 
  setActiveMenu, 
  isMobileOpen, 
  setIsMobileOpen, 
  onLogout 
}) => {
  return (
    <aside className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-[#0B1726] text-white flex flex-col p-6 transition-transform duration-300 md:translate-x-0 ${
      isMobileOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex items-center gap-3 mb-8 pl-2">
        <LogoHexagon />
        <span className="text-lg font-black tracking-wider text-white">INVIONSTAR</span>
      </div>

      <nav className="flex flex-col gap-1.5 flex-1">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.name;
          return (
            <button
              key={item.name}
              onClick={() => {
                setActiveMenu(item.name);
                setIsMobileOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
                isActive 
                  ? 'bg-[#16B3B0] text-white font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="mt-auto w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-all"
      >
        Cerrar Sesión
      </button>
    </aside>
  );
};