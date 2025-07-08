import React, { useEffect, useState } from 'react';
import api from "../services/api";
import Header from '../layouts/Header';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChat';
import Footer from '../layouts/Footer';

function Dashboard() {
    const [name, setName] = useState('');
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalScans: 0,
        validScans: 0,
        invalidScans: 0
    });

    const fetchData = async () => {
        try {
            const response = await api.get('/user');
            if (response.data) {
                setName(response.data.name);
            }
        } catch (err) {
            setError(err);
        }
    };

    const fetchScans = async () => {
        try {
            const response = await api.get('/scans');
            if (response.data.success) {
                setScans(response.data.data);
                
                // Calculate statistics
                const total = response.data.data.length;
                const valid = response.data.data.filter(scan => scan.status === 'valide').length;
                setStats({
                    totalScans: total,
                    validScans: valid,
                    invalidScans: total - valid
                });
            } else {
                setError('Erreur lors de la récupération des données');
            }
        } catch (err) {
            setError('Erreur de communication avec le serveur');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchScans();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Welcome Section */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">Bonjour, {name}</h1>
                        <p className="text-gray-600">Tableau de bord analytique</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow p-6 border-t-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total des scans</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalScans}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-50">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">Toutes les analyses effectuées</p>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow p-6 border-t-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Certificats valides</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.validScans}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-green-50">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-green-600 mt-3">
                                +{(stats.totalScans ? (stats.validScans/stats.totalScans*100).toFixed(1) : 0)}% du total
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow p-6 border-t-4 border-red-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Certificats invalides</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.invalidScans}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-red-50">
                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-red-600 mt-3">
                                {(stats.totalScans ? (stats.invalidScans/stats.totalScans*100).toFixed(1) : 0)}% du total
                            </p>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <BarChart />
                        <PieChart />
                    </div>

                    {/* Recent Scans Table */}
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Derniers scans</h2>
                                <p className="text-sm text-gray-500">Les 10 dernières analyses effectuées</p>
                            </div>
                            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Voir tout
                            </button>
                        </div>
                        
                        {loading ? (
                            <div className="p-6 flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : error ? (
                            <div className="p-6">
                                <p className="text-red-500">{error}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certification</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {scans.map((scan, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i+1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{scan.certif_name || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        scan.status === 'valide' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {scan.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(scan.scanned_at).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button className="text-blue-600 hover:text-blue-800">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}

export default Dashboard;