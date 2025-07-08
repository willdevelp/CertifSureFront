import React, { useState, useEffect } from 'react';
import api from "../services/api";
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';

export default function Certification() {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [results, setResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const fetchCertifs = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/certifs');
            if (response.data.success) {
                setResults(response.data.data);
            } else {
                setError('Failed to fetch certificates');
            }
        } catch (err) {
            setError('Server communication error');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCertifs();
    }, []);

    const handleFileChange = (e) => {
        const fileList = e.target.files;
        if (!fileList) return;
        setFiles(Array.from(fileList));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) {
            setError('Please select at least one file');
            return;
        }

        const formData = new FormData();
        files.forEach((file) => formData.append('files[]', file));

        try {
            setUploadProgress(0);
            const response = await api.post('/upload-files', formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            setResults((prevResults) => [...prevResults, ...response.data.files]);
            setError('');
            setFiles([]);
            setUploadProgress(0);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload error');
            setUploadProgress(0);
        }
    };

    const handleDelete = async (referenceNumber) => {
        if (!window.confirm('Are you sure you want to delete this certificate?')) return;
        
        try {
            await api.delete(`/delete-file/${referenceNumber}`);
            setResults(results.filter(file => file.reference_number !== referenceNumber));
        } catch (err) {
            setError('Error deleting file');
            console.error(err);
        }
    };

    const filteredResults = results.filter((result) =>
        result.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.reference_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            <Header />
            
            <main className="flex-1 px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                            <h1 className="text-3xl font-bold">Management des Certificats</h1>
                            <p className="opacity-90 mt-1">Ajouter et manager vos documents </p>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition hover:border-blue-400">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Drag and drop</span> files here or
                                        </p>
                                        <label className="cursor-pointer">
                                            <span className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                                                Browse files
                                            </span>
                                            <input 
                                                type="file" 
                                                multiple 
                                                onChange={handleFileChange} 
                                                className="hidden" 
                                                accept=".pdf"
                                            />
                                        </label>
                                    </div>
                                    {files.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-gray-700">Selected files:</p>
                                            <ul className="mt-1 space-y-1">
                                                {files.map((file, index) => (
                                                    <li key={index} className="text-sm text-gray-600 flex items-center">
                                                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                        </svg>
                                                        {file.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                
                                {uploadProgress > 0 && (
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                )}
                                
                                <button
                                    type="submit"
                                    disabled={files.length === 0 || uploadProgress > 0}
                                    className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition duration-200 ${files.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}
                                >
                                    {uploadProgress > 0 ? `Ajout en cours... ${uploadProgress}%` : 'Ajouter'}
                                </button>
                            </form>

                            {error && (
                                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                                    <p>{error}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Tableau de Certificats</h2>
                                <p className="text-sm text-gray-500">Manager vos certifcats ajoutés</p>
                            </div>
                            <div className="relative w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search certificates..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {isLoading ? (
                                <div className="p-8 flex justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : filteredResults.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Number</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredResults.map((f, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{f.original_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{f.reference_number}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-4">
                                                        <a
                                                            href={`http://localhost:8000/storage/${f.processed_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-900 flex items-center"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                            </svg>
                                                            Voir
                                                        </a>
                                                        <a
                                                            href={`http://localhost:8000/api/download-file/${f.reference_number}`}
                                                            download={f.original_name}
                                                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                                            </svg>
                                                            Télécharger
                                                        </a>
                                                        <button
                                                            onClick={() => handleDelete(f.reference_number)}
                                                            className="text-red-600 hover:text-red-900 flex items-center"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                            </svg>
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-8 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates found</h3>
                                    <p className="mt-1 text-sm text-gray-500">Upload some certificates to get started</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}