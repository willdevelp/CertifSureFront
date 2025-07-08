import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import api from "../services/api";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale
);

function PieChart() {
    const [validCount, setValidCount] = useState(0);
    const [invalidCount, setInvalidCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchScanStats = async () => {
        try {
            const response = await api.get('/scan-stats');
            if (response.data.success) {
                setValidCount(response.data.data.valid);
                setInvalidCount(response.data.data.invalid);
            } else {
                setError('Erreur lors de la récupération des statistiques');
            }
        } catch (err) {
            setError('Erreur de communication avec le serveur');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScanStats();
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 16,
                    font: {
                        size: 14,
                        family: "'Inter', sans-serif",
                        weight: 500
                    },
                    usePointStyle: true,
                    color: '#4B5563',
                    boxWidth: 8,
                    boxHeight: 8
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                },
                backgroundColor: 'rgba(31, 41, 55, 0.95)',
                titleFont: {
                    size: 14,
                    weight: '600',
                    family: "'Inter', sans-serif"
                },
                bodyFont: {
                    size: 13,
                    family: "'Inter', sans-serif"
                },
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                boxPadding: 6,
            },
        },
        cutout: '65%',
    };

    const data = {
        labels: ['Valides', 'Invalides'],
        datasets: [
            {
                data: [validCount, invalidCount],
                backgroundColor: [
                    '#10B981',
                    '#EF4444'
                ],
                borderWidth: 0,
                hoverBackgroundColor: [
                    '#059669',
                    '#DC2626'
                ],
                hoverOffset: 8,
                spacing: 2
            },
        ],
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Statut des scans</h2>
                    <p className="text-sm text-gray-500">Répartition globale</p>
                </div>
                <div className="flex space-x-2">
                    <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                        <span className="text-xs text-gray-600">Valides</span>
                    </span>
                    <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                        <span className="text-xs text-gray-600">Invalides</span>
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="h-80 flex items-center justify-center">
                    <p className="text-red-500">{error}</p>
                </div>
            ) : (
                <>
                    <div className="relative h-64 w-full">
                        <Pie options={options} data={data} />
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-green-800">Valides</span>
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                    {validCount > 0 ? Math.round((validCount / (validCount + invalidCount)) * 100) : 0}%
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-green-600 mt-1">{validCount}</p>
                            <p className="text-xs text-green-500 mt-1">+2% vs dernier mois</p>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-red-800">Invalides</span>
                                <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                                    {invalidCount > 0 ? Math.round((invalidCount / (validCount + invalidCount)) * 100) : 0}%
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-red-600 mt-1">{invalidCount}</p>
                            <p className="text-xs text-red-500 mt-1">-1% vs dernier mois</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default PieChart;