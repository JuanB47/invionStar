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
        user: { email: emailClean, role: 'auditorstar', name: 'Alejandro (Auditor)' }
      };

    case (import.meta.env.VITE_USER_OPERADOR || '').toLowerCase():
      return {
        success: true,
        user: { email: emailClean, role: 'operadorstar', name: 'Alejandro (Operador)' }
      };

    case (import.meta.env.VITE_USER_SURTIDOR || '').toLowerCase():
      return {
        success: true,
        user: { email: emailClean, role: 'surtidorstar', name: 'Alejandro (Surtidor)' }
      };

    default:
      return { success: false, message: 'Usuario no registrado' };
  }
};