import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Assuming auth is exported from firebase.ts

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ content: string | null, type: 'success' | 'danger' | null }>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage({ content: 'Inicio de sesión exitoso!', type: 'success' });
    } catch (error: any) {
      setMessage({ content: error.message, type: 'danger' });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 login-container">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow-lg login-card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>
              {message && (
                <div className={`alert alert-${message.type}`} role="alert">{message.content}</div>
              )}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label visually-hidden">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Correo Electrónico"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
