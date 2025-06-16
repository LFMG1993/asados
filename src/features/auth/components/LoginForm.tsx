// src/features/auth/components/LoginForm.tsx

import { useState } from 'react';

// Definimos la INTERFAZ para los props
export interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
}

// Exportamos la FUNCIÓN del componente de forma NOMBRADA
export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="card shadow-2-strong" style={{ borderRadius: '1rem', minWidth: '380px' }}>
      <div className="card-body p-5 text-center">
        <h3 className="mb-5">Iniciar sesión</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-4">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              disabled={isLoading}
            />
            <label htmlFor="floatingInput">Correo Electrónico</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              disabled={isLoading}
            />
            <label htmlFor="floatingPassword">Contraseña</label>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="form1Example3" />
              <label className="form-check-label" htmlFor="form1Example3">Recordarme</label>
            </div>
            <a href="#!" className="text-body">¿Olvidaste tu contraseña?</a>
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isLoading}>
            {isLoading ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>
      </div>
    </div>
  );
}