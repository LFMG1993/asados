import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Login from './views/auth/login';
import SliderBar from './components/dashboard/slider';
import Home from './views/dashboard/Home';
import Sales from './views/sale/Sales';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SliderBar" element={<SliderBar />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Sales" element={<Sales />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App
