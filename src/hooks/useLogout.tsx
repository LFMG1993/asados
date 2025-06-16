// Hook para cerrar sesion y redireccionar a la pagina de login
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function useLogout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Sesión cerrada exitosamente', {
                autoClose: 2000,
            });
            navigate('/');
        } catch (error) {
            toast.error('Error al cerrar sesión', {
                autoClose: 4000,
            });
        }
    };
    return handleLogout;
}
