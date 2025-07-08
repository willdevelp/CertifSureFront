import axios from 'axios';
import { createContext, useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom'; // Correction ici

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            const auth_token = localStorage.getItem('auth_token');
            if (!auth_token) {
                setIsLoading(false);
                return;
            }

            try {
                const res = await axios.get('http://localhost:8000/api/user', {
                    headers: { Authorization: `Bearer ${auth_token}`, Accept: 'application/json' }
                });
                setUser(res.data);
            } catch (error) {
                console.error("Erreur de vérification: Impossible de récupérer les informations de l'utilisateur.", error.response ? error.response.data : error.message);
                localStorage.removeItem('auth_token');
            } finally {
                setIsLoading(false);
            }
        };

        verifyAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const res = await axios.post('http://localhost:8000/api/login', credentials);
            localStorage.setItem('auth_token', res.data.token);
            setUser(res.data.user);
        } catch (error) {
            console.error("Erreur de connexion:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
            });
        } catch (error) {
            console.error("Erreur de déconnexion:", error);
        } finally {
            localStorage.removeItem('auth_token');
            setUser(null);

        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
};