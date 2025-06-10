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

  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const parentDiv = event.target.closest('.form-floating-label-group');
    parentDiv?.classList.add('is-floating');
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const parentDiv = event.target.closest('.form-floating-label-group');
    if (event.target.value === '') {
      parentDiv?.classList.remove('is-floating');
    }
  };

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
    <div className="container py-5 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card shadow-2-strong login-card">
            <div className="card-body p-5 text-center">
              <h3 className="mb-5">Iniciar sesión</h3>

              <form onSubmit={handleLogin} className="text-start">
                <div className="form-floating-label-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingEmailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder="Correo Electrónico"
                  />
                  <label htmlFor="floatingEmailInput">Correo Electrónico</label>
                </div>
                <div className="form-floating-label-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPasswordInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                  />
                  <label htmlFor="floatingPasswordInput">Contraseña</label>
                </div>
                <div className="row mb-4">
                  <div className="col d-flex justify-content-center">
                    <div className="form-check ">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label" htmlFor="rememberMe">Recordarme
                      </label>
                    </div>
                  </div>
                  <div className="col text-center">
                    <a href="#" className="text-decoration-none">¿Olvidaste tu contraseña?</a>
                  </div>
                </div>
                {/* Wrap the button in a div to control its width */}
                <div className="form-floating-label-group mb-3"> {/* Use a similar container class for alignment */}
                  <button type="submit" className="btn btn-primary btn-lg btn-block w-100">INICIAR SESIÓN</button> {/* Add w-100 for full width within its container */}
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
