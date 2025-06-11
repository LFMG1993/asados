import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Login from './views/auth/login';
import SliderBar from './components/dashboard/slider';
import Home from './views/dashboard/Home';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
<<<<<<< HEAD
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SliderBar" element={<SliderBar />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
=======
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
>>>>>>> c82045b83b6f1d97add59c24ce1594d0d0447b75
      <ToastContainer />
    </>
  );
}

export default App
