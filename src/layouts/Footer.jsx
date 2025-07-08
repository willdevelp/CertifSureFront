import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaCertificate } from "react-icons/fa";
import { motion } from "framer-motion";

function Footer() {
    const currentYear = new Date().getFullYear();
    
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };
    
    const socialIconVariants = {
        hover: {
            y: -5,
            scale: 1.1,
            color: "#FFD166",
            transition: { duration: 0.2 }
        }
    };

    return (
        <footer className="bg-gradient-to-r from-[#1B5299] to-[#2E86AB] text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={containerVariants}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
                >
                    {/* Brand section */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <FaCertificate className="text-3xl text-[#FFD166]" />
                            <span className="text-2xl font-bold">CertiSure</span>
                        </div>
                        <p className="text-gray-200">
                            Vérifiez l'authenticité de vos certifications en ligne avec notre technologie blockchain.
                        </p>
                    </motion.div>

                    {/* Quick links */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg font-semibold mb-4 border-b border-[#FFD166] pb-2 inline-block">Liens Rapides</h3>
                        <ul className="space-y-3">
                            {[
                                { path: "/", name: "Accueil" },
                                { path: "/dashboard", name: "Dashboard" },
                                { path: "/certification", name: "Certificats" },
                                { path: "/verify", name: "Vérifier" }
                            ].map((item) => (
                                <li key={item.path}>
                                    <Link 
                                        to={item.path} 
                                        className="text-gray-200 hover:text-[#FFD166] transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Legal links */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-lg font-semibold mb-4 border-b border-[#FFD166] pb-2 inline-block">Légal</h3>
                        <ul className="space-y-3">
                            {[
                                { path: "/privacy", name: "Confidentialité" },
                                { path: "/terms", name: "Conditions" },
                                { path: "/cookies", name: "Cookies" },
                                { path: "/contact", name: "Contact" }
                            ].map((item) => (
                                <li key={item.path}>
                                    <Link 
                                        to={item.path} 
                                        className="text-gray-200 hover:text-[#FFD166] transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Social media */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h3 className="text-lg font-semibold border-b border-[#FFD166] pb-2 inline-block">Nous Suivre</h3>
                        <div className="flex space-x-4">
                            {[
                                { icon: <FaGithub />, url: "https://github.com/certisure" },
                                { icon: <FaLinkedin />, url: "https://linkedin.com/company/certisure" },
                                { icon: <FaTwitter />, url: "https://twitter.com/certisure" }
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variants={socialIconVariants}
                                    whileHover="hover"
                                    className="text-2xl text-white"
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                        <div className="pt-4">
                            <p className="text-gray-200">Abonnez-vous à notre newsletter</p>
                            <div className="mt-2 flex">
                                <input 
                                    type="email" 
                                    placeholder="Votre email" 
                                    className="px-3 py-2 rounded-l text-gray-800 focus:outline-none w-full"
                                />
                                <button className="bg-[#FFD166] text-gray-900 px-4 py-2 rounded-r font-medium hover:bg-yellow-400 transition-colors">
                                    OK
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Copyright */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="border-t border-gray-600 pt-6 text-center text-gray-300"
                >
                    <p>© {currentYear} CertiSure. Tous droits réservés.</p>
                    <p className="text-sm mt-2">Conçu avec ❤️ pour une meilleure vérification des certifications</p>
                </motion.div>
            </div>
        </footer>
    );
}

export default Footer;