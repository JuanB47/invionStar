import React, { useState } from 'react';
import { LoginView, authenticateUser } from './views/pages/auth/LoginView';
import { DashboardAuditorView } from './views/pages/auditor/DashboardAuditorView';
import { CargaImagenesView } from './views/pages/operator/CargaImagenesView';
import { GestionStockView } from './views/pages/surtidor/GestionStockView';

export function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const auth = authenticateUser(credentials.email, credentials.password);
    if (auth.success) {
      setCurrentUser(auth.user);
    } else {
      setError(auth.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCredentials({ email: '', password: '' });
  };

  if (!currentUser) {
    return (
      <LoginView
        credentials={credentials}
        onChange={handleChange}
        onSubmit={handleSubmit}
        error={error}
      />
    );
  }

  switch (currentUser.role?.toLowerCase()) {
    case 'auditor':
      return <DashboardAuditorView user={currentUser} onLogout={handleLogout} />;

    case 'operador':
      return <CargaImagenesView user={currentUser} onLogout={handleLogout} />;

    case 'surtidor':
      return <GestionStockView user={currentUser} onLogout={handleLogout} />;

    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Rol no reconocido</h2>
            <p className="text-slate-400 text-sm mb-4">El rol asignado no tiene una vista correspondiente.</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl text-xs"
            >
              Volver al Login
            </button>
          </div>
        </div>
      );
  }
}

export default App;