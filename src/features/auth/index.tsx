// src/features/auth/index.ts

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { LoginForm } from "./components/LoginForm";
import { loginWithEmail } from "./services/authService";
import { useAuth } from "./contexts/AuthContext";

export function LoginFeature() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Este useEffect "observará" la variable 'user'.
  useEffect(() => {
    // Si en algún momento 'user' deja de ser nulo, significa que el login
    // fue exitoso y el estado global ya se actualizó.
    if (user) {
      // Ahora es el momento seguro para navegar.
      navigate('/sales', { replace: true });
    }
  }, [user, navigate]); // Se ejecuta cada vez que 'user' o 'navigate' cambian.

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success('¡Inicio de sesión exitoso!', { autoClose: 1500 });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Usamos el componente como una etiqueta JSX
  return (
    <LoginForm
      onSubmit={handleLogin}
      isLoading={isLoading}
    />
  );
}