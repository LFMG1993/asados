import { signInWithEmailAndPassword } from 'firebase/auth';
import type {AuthError} from 'firebase/auth';
import { auth } from '../../../lib/firebase';

// Definimos una interfaz para nuestros errores, para manejarlos mejor
interface AuthResponseError {
  code: string;
  message: string;
}

// El servicio no muestra alertas, ni navega. Solo ejecuta la lógica y reporta.
export const loginWithEmail = async (email: string, password: string): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Si tiene éxito, no necesita devolver nada. Si falla, lanzará un error.
  } catch (error) {
    const authError = error as AuthError;
    let userFriendlyMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';

    switch (authError.code) {
      case 'auth/invalid-email':
        userFriendlyMessage = 'El formato del correo electrónico es inválido.';
        break;
      case 'auth/user-disabled':
        userFriendlyMessage = 'Este usuario ha sido deshabilitado.';
        break;
      case 'auth/user-not-found':
      case 'auth/invalid-credential': // Error común en v9+ para email/pass incorrectos
        userFriendlyMessage = 'Las credenciales son incorrectas.';
        break;
    }
    
    // Lanzamos un nuevo error con nuestro formato estandarizado
    throw { code: authError.code, message: userFriendlyMessage } as AuthResponseError;
  }
};