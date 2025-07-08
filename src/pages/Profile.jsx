import React, { useState, useEffect } from 'react';
import api from "../services/api";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

function Profile() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchUser = async () => {
        try {
            const response = await api.get('/user');
            if (response.data) {
                setUser(response.data);
            } else {
                setError('Impossible de récupérer les informations utilisateur');
            }
        } catch (err) {
            setError('Erreur de communication avec le serveur');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await api.put('/update', user);
            if (response.data) {
                setSuccess('Informations mises à jour avec succès');
                // Effacer les champs de mot de passe après une mise à jour réussie
                setUser({...user, password: '', password_confirmation: ''});
            } else {
                setError('Erreur lors de la mise à jour des informations');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de communication avec le serveur');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Mon Profil
                    </h1>
                    <p className="mt-3 text-xl text-gray-500">
                        Gérez vos informations personnelles et votre sécurité
                    </p>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/3 bg-gradient-to-b from-indigo-600 to-indigo-500 p-8 text-white">
                            <div className="text-center mb-6">
                                <div className="mx-auto h-24 w-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold">{user.name || 'Utilisateur'}</h2>
                                <p className="text-indigo-100">{user.email}</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs font-semibold tracking-wider text-indigo-200 uppercase">Membre depuis</h3>
                                    <p className="text-sm">Janvier 2023</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold tracking-wider text-indigo-200 uppercase">Dernière connexion</h3>
                                    <p className="text-sm">Il y a 2 heures</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-2/3 p-8">
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    {success && (
                                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-green-700">{success}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={user.name}
                                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                                            <input
                                                id="phone"
                                                type="text"
                                                value={user.phone}
                                                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                                                <input
                                                    id="password"
                                                    type="password"
                                                    value={user.password}
                                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder="••••••••"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirmation</label>
                                                <input
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={user.password_confirmation}
                                                    onChange={(e) => setUser({ ...user, password_confirmation: e.target.value })}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-6 border-t border-gray-200">
                                        <button
                                            type="submit"
                                            className="ml-3 inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                        >
                                            Enregistrer les modifications
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
    );
}

export default Profile;