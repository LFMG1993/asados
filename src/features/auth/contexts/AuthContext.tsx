import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';
import type { User as AppUser, UserRole } from '../../../types';
import { toast } from 'react-toastify';

// 1. Definimos la forma de los datos que compartirá nuestro contexto
interface AuthContextType {
    user: AppUser | null;
    role: UserRole | null;
    loading: boolean;
    logout: () => Promise<void>;
}

// 2. Creamos el contexto con un valor inicial
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    // --- RUTA FELIZ: El usuario existe en Auth y en Firestore ---
                    setUser({ uid: firebaseUser.uid, ...userDoc.data() } as AppUser);
                } else {
                    // --- RUTA DE ERROR: Autenticado pero sin perfil en la DB ---
                    // 1. Mostramos un mensaje claro al usuario.
                    toast.error('Tu cuenta no está configurada o no tiene permisos. Contacta al administrador.');

                    // 2. Dejamos un mensaje técnico en la consola para depuración.
                    console.error(`Error de configuración: El usuario con UID ${firebaseUser.uid} y email ${firebaseUser.email} no tiene un documento en la colección 'users'.`);

                    // 3. Forzamos el cierre de sesión para evitar un estado inconsistente.
                    await auth.signOut();

                    // 4. Aseguramos que el estado del usuario en la app sea nulo.
                    setUser(null);
                }
            } else {
                // No hay usuario logueado
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await auth.signOut();
    };

    const value = {
        user,
        role: user?.role || null,
        loading,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 4. Creamos un hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};