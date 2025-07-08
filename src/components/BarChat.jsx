import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    BarElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale
} from 'chart.js'
import api from "../services/api"

ChartJS.register(
    BarElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale
)

function BarChart() {
    const [chartData, setChartData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [timeRange, setTimeRange] = useState('week') // 'week', 'month', 'year'

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    font: {
                        size: 14,
                        family: "'Inter', sans-serif",
                        weight: 500
                    },
                    usePointStyle: true,
                    color: '#4B5563'
                },
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || ''
                        const value = context.raw || 0
                        return ` ${label}: ${value}`
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
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        family: "'Inter', sans-serif"
                    }
                }
            },
            y: {
                grid: {
                    color: '#E5E7EB',
                    drawBorder: false
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        family: "'Inter', sans-serif"
                    },
                    stepSize: 5
                }
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await api.get(`/stats?range=${timeRange}`)
                
                const data = {
                    labels: response.data.labels,
                    datasets: [
                        {
                            label: 'Scans réussis',
                            data: response.data.successfulScans,
                            backgroundColor: '#3B82F6',
                            borderColor: '#3B82F6',
                            borderWidth: 0,
                            borderRadius: 6,
                            hoverBackgroundColor: '#2563EB',
                            barPercentage: 0.7,
                            categoryPercentage: 0.8
                        },
                        {
                            label: 'Scans échoués',
                            data: response.data.failedScans,
                            backgroundColor: '#EF4444',
                            borderColor: '#EF4444',
                            borderWidth: 0,
                            borderRadius: 6,
                            hoverBackgroundColor: '#DC2626',
                            barPercentage: 0.7,
                            categoryPercentage: 0.8
                        }
                    ]
                }
                
                setChartData(data)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchData()
    }, [timeRange])

    const handleTimeRangeChange = (range) => {
        setTimeRange(range)
    }

    const getTitle = () => {
        switch (timeRange) {
            case 'week': return 'Répartition hebdomadaire'
            case 'month': return 'Répartition mensuelle'
            case 'year': return 'Répartition annuelle'
            default: return 'Répartition hebdomadaire'
        }
    }

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex justify-center items-center h-80 text-red-500">
                    <p>Erreur: {error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Activité des scans</h2>
                    <p className="text-sm text-gray-500">{getTitle()}</p>
                </div>
                <div className="flex space-x-2">
                    <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                        <span className="text-xs text-gray-600">Réussis</span>
                    </span>
                    <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                        <span className="text-xs text-gray-600">Échoués</span>
                    </span>
                </div>
            </div>
            
            <div className="relative h-80 w-full">
                {chartData && <Bar options={options} data={chartData} />}
            </div>
            
            <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                <p>Mis à jour: {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => handleTimeRangeChange('week')}
                        className={`px-2 py-1 text-xs rounded-md hover:bg-gray-200 ${
                            timeRange === 'week' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100'
                        }`}
                    >
                        Semaine
                    </button>
                    <button 
                        onClick={() => handleTimeRangeChange('month')}
                        className={`px-2 py-1 text-xs rounded-md hover:bg-gray-200 ${
                            timeRange === 'month' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100'
                        }`}
                    >
                        Mois
                    </button>
                    <button 
                        onClick={() => handleTimeRangeChange('year')}
                        className={`px-2 py-1 text-xs rounded-md hover:bg-gray-200 ${
                            timeRange === 'year' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100'
                        }`}
                    >
                        Année
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BarChart