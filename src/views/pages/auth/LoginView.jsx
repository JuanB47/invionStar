import React, { useState } from 'react';

export const LogoHexagon = () => (
  <img 
    src="/logo.png" 
    alt="INVIONSTAR Logo" 
    style={{ width: '110px', height: '110px', objectFit: 'contain' }} 
  />
);

export const LoginView = ({ credentials, onChange, onSubmit, error }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = {
    bgPage: isDarkMode ? '#070F18' : '#E2E8F0',
    cardOuterBg: isDarkMode ? '#0D1B2A' : '#FFFFFF',
    cardOuterBorder: isDarkMode ? '1px solid #102A43' : '1px solid #CBD5E1',
    cardOuterShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.08)',
    titleColor: isDarkMode ? '#FFFFFF' : '#0D1B2A',
    cardInnerBg: isDarkMode ? '#F8FAFC' : '#F1F5F9',
    inputBg: isDarkMode ? '#EEF2F6' : '#E2E8F0',
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: theme.bgPage,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Montserrat, system-ui, sans-serif',
      padding: '24px 16px',
      boxSizing: 'border-box',
      overflowY: 'auto',
      zIndex: 9999,
      transition: 'background-color 0.3s ease'
    }}>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        type="button"
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          backgroundColor: isDarkMode ? '#0D1B2A' : '#FFFFFF',
          color: isDarkMode ? '#F8FAFC' : '#0D1B2A',
          border: '1px solid #16B3B0',
          borderRadius: '20px',
          padding: '8px 14px',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 10000
        }}
      >
        {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
      </button>

      <div style={{
        backgroundColor: theme.cardOuterBg,
        width: '100%',
        maxWidth: '400px',
        borderRadius: '24px',
        padding: '36px 24px',
        boxShadow: theme.cardOuterShadow,
        border: theme.cardOuterBorder,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxSizing: 'border-box',
        margin: 'auto'
      }}>
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
          <LogoHexagon />
        </div>

        <h1 style={{
          color: theme.titleColor,
          fontSize: 'clamp(24px, 5vw, 30px)',
          fontWeight: '900',
          letterSpacing: '2px',
          margin: '0 0 4px 0',
          textTransform: 'uppercase'
        }}>
          INVION<span style={{ color: '#16B3B0' }}>STAR</span>
        </h1>

        <p style={{
          color: isDarkMode ? '#94A3B8' : '#64748B',
          fontSize: '13px',
          fontWeight: '600',
          margin: '0 0 24px 0',
          letterSpacing: '0.5px'
        }}>
          Iniciar sesión
        </p>

        <form onSubmit={onSubmit} style={{
          backgroundColor: theme.cardInnerBg,
          width: '100%',
          borderRadius: '20px',
          padding: '20px 16px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ position: 'relative', width: '100%' }}>
            {/* Agregado pointerEvents: 'none' para deshabilitar el bloqueo del clic */}
            <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748B', fontSize: '14px', pointerEvents: 'none' }}>👤</span>
            <input
              type="email"
              name="email"
              placeholder="Usuario"
              value={credentials?.email || ''}
              onChange={onChange}
              style={{
                width: '100%',
                padding: '12px 12px 12px 38px',
                backgroundColor: theme.inputBg,
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                color: '#0D1B2A',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ position: 'relative', width: '100%' }}>
            {/* Agregado pointerEvents: 'none' */}
            <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748B', fontSize: '14px', pointerEvents: 'none' }}>🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={credentials?.password || ''}
              onChange={onChange}
              style={{
                width: '100%',
                padding: '12px 12px 12px 38px',
                backgroundColor: theme.inputBg,
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                color: '#0D1B2A',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && <p style={{ color: '#EF4444', fontSize: '12px', margin: '0', fontWeight: 'bold' }}>{error}</p>}

          <button
            type="submit"
            style={{
              backgroundColor: '#16B3B0',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '4px',
              boxShadow: '0 4px 12px rgba(22, 179, 176, 0.3)'
            }}
          >
            Ingresar
          </button>

          <a href="#forgot" style={{ color: '#16B3B0', fontSize: '12px', textDecoration: 'none', fontWeight: '600', marginTop: '4px' }}>
            ¿Olvidaste tu contraseña?
          </a>
        </form>
      </div>
    </div>
  );
};

export const authenticateUser = (email, password) => {
  const masterPassword = import.meta.env.VITE_AUTH_PASS;

  if (password !== masterPassword) {
    return { success: false, message: 'Contraseña incorrecta' };
  }

  const emailClean = email.trim().toLowerCase();

  switch (emailClean) {
    case (import.meta.env.VITE_USER_AUDITOR || '').toLowerCase():
      return {
        success: true,
        user: { email: emailClean, role: 'auditor', name: 'Alejandro (Auditor)' }
      };

    case (import.meta.env.VITE_USER_OPERADOR || '').toLowerCase():
      return {
        success: true,
        user: { email: emailClean, role: 'operador', name: 'Alejandro (Operador)' }
      };

    case (import.meta.env.VITE_USER_SURTIDOR || '').toLowerCase():
      return {
        success: true,
        user: { email: emailClean, role: 'surtidor', name: 'Alejandro (Surtidor)' }
      };

    default:
      return { success: false, message: 'Usuario no registrado' };
  }
};