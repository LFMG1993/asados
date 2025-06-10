import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './firebase'; // Assuming auth is exported from firebase.ts

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Inicio de sesión exitoso!');
    } catch (error: any) {
      let userFriendlyMessage = 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo.';

      switch (error.code) {
        case 'auth/invalid-email':
          userFriendlyMessage = 'El formato del correo electrónico es inválido.';
          break;
        case 'auth/user-disabled':
          userFriendlyMessage = 'Este usuario ha sido deshabilitado.';
          break;
        case 'auth/user-not-found':
          userFriendlyMessage = 'No se encontró ningún usuario con este correo electrónico.';
          break;
        case 'auth/wrong-password':
          userFriendlyMessage = 'La contraseña es incorrecta.';
          break;
        // Agrega más casos según sea necesario para otros errores de Firebase Auth
      }
      toast.error(userFriendlyMessage);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 login-container">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow-lg login-card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>

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
      <ToastContainer />
    </div>
  )
}

export default App
