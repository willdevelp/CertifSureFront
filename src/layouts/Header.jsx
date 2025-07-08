import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import profileImage from '../assets/team5.jpg';
import api from '../services/api';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const handleClick = async () => {
        try{
            const response = await api.post('/logout');
            localStorage.removeItem('token');
            if(response){
                navigate('/');
            }
        }
        catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };
    
    // Animation variants

    return (
        <header className="bg-gradient-to-r from-[#2E86AB] to-[#1B5299] text-white px-6 py-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo with animation */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                >
                    <Link to="/" className="text-3xl font-bold tracking-tight">
                        <span className="text-white">Certif</span>
                        <span className="text-[#FFD166]">Sure</span>
                    </Link>
                </motion.div>

                {/* Navigation Links */}
                <nav className="hidden md:flex space-x-8 items-center">
                    {[
                        { path: "/dashboard", name: "Dashboard" },
                        { path: "/certification", name: "Certificats" },
                        { path: "/profile", name: "Mon Profil" }
                    ].map((item) => (
                        <motion.div
                            key={item.path}
                            whileHover="hover"
                            className="relative"
                        >
                            <Link
                                to={item.path}
                                className={`px-1 py-2 font-medium transition-colors ${
                                    location.pathname === item.path ? "text-[#FFD166]" : "text-white hover:text-gray-200"
                                }`}
                            >
                                {item.name}
                            </Link>
                            {location.pathname === item.path && (
                                <motion.div
                                    layoutId="navUnderline"
                                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFD166]"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </motion.div>
                    ))}
                </nav>

                {/* Profile with dropdown */}
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                >
                    <button className="flex items-center space-x-2 focus:outline-none">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                            <img 
                                className="w-full h-full object-cover" 
                                src={profileImage} 
                                alt="Profile" 
                            />
                        </div>
                    </button>
                    
                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <Link 
                            to="/profile" 
                            className="block px-4 py-2 text-gray-800 hover:bg-[#2E86AB] hover:text-white"
                        >
                            Mon Profil
                        </Link>
                        <p 
                            className="block px-4 py-2 text-gray-800 hover:bg-[#2E86AB] hover:text-white"
                            onClick={handleClick}
                        >
                            Déconnexion
                        </p>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}

export default Header;