import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Extract token from query params (e.g., ?token=xxxx)
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!password || !passwordConfirmation) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        if (password !== passwordConfirmation) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        if (!token) {
            setError('Token de réinitialisation manquant.');
            return;
        }

        setLoading(true);
        try {
            // Remplacez l'URL par celle de votre backend
            const response = await api.post('/reset-password', {
                token:token,
                email: query.get('email'), // Assurez-vous que l'email est passé dans les paramètres de la requête
                password: password,
                password_confirmation: passwordConfirmation
            });
            const data = await response.json();
            if (response) {
                setSuccess('Mot de passe réinitialisé avec succès !');
                setTimeout(() => navigate('/'), 2000);
            } else {
                setError(data.message || 'Erreur lors de la réinitialisation.');
            }
        } catch (err) {
            setError('Erreur serveur.', err);
        } finally {
            setLoading(false);
        }
    };

return (
    <div className="max-w-md mx-auto my-16 p-10 bg-white rounded-xl shadow-2xl">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Réinitialiser le mot de passe</h2>
            <p className="text-gray-500">Entrez votre nouveau mot de passe</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="••••••••"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                <input
                    type="password"
                    value={passwordConfirmation}
                    onChange={e => setPasswordConfirmation(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="••••••••"
                />
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                    {success}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Réinitialisation en cours...
                    </span>
                ) : 'Réinitialiser le mot de passe'}
            </button>
        </form>
    </div>
);
};

export default ResetPassword;