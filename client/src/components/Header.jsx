import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, LogOut, Shield, ChevronDown, Bell } from 'lucide-react';
import NotificationMenu from './NotificationMenu';
import useNotifications from '../hooks/useNotification';
import { IMAGES } from '../lib/constants';

// Hooks personalizados
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // 1. Hooks
    const { auth, cerrarSesion } = useAuth();
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const { itemsCount, toggleCart } = useCart();

    // 2. Menú de Navegación (LIMPIO: Sin Peluquería)
    const navItems = [
        { name: 'Inicio', path: '/' },
        { name: 'Tienda', path: '/tienda' },
        { name: 'Nosotros', path: '/nosotros' }, // Antes "Sobre Nosotros"
        { name: 'Contacto', path: '/contacto' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        cerrarSesion();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    const user = auth || {};
    // Verificación segura de Admin
    const esAdmin = user.admin === true || user.isAdmin === true;

    return (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm transition-all">
            <nav className="container mx-auto px-2 py-1">
                <div className="flex items-center justify-between">

                    {/* --- LOGO --- */}
                    <Link to="/" className="flex items-center space-x-1 group">
                        <img
                            src={IMAGES.LOGO}
                            alt="METI Logo"
                            className="h-20 w-auto transform group-hover:scale-110 transition-transform duration-300"
                        />
                    </Link>

                    {/* --- NAV ESCRITORIO --- */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link key={item.path} to={item.path}>
                                <button
                                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive(item.path)
                                        ? 'text-stone-900 font-bold'
                                        : 'text-stone-500 hover:text-yellow-700 hover:bg-stone-50'
                                        }`}
                                >
                                    {item.name}
                                    {isActive(item.path) && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-1 left-3 right-3 h-0.5 bg-yellow-600 rounded-full"
                                            initial={false}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </button>
                            </Link>
                        ))}
                    </div>

                    {/* --- ICONOS LADO DERECHO --- */}
                    <div className="flex items-center space-x-3">

                        {/* 🔔 NOTIFICACIONES */}
                        {user._id && (
                            <div className="relative">
                                <button
                                    className="relative p-2 text-stone-500 hover:bg-stone-100 rounded-full transition-colors"
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isNotifOpen && (
                                        <NotificationMenu
                                            notifications={notifications}
                                            markAsRead={markAsRead}
                                            onClose={() => setIsNotifOpen(false)}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* 🛒 CARRITO */}
                        <button
                            className="relative p-2 text-stone-700 hover:bg-yellow-50 hover:text-yellow-700 rounded-full transition-colors"
                            onClick={toggleCart}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {itemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-yellow-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                                    {itemsCount}
                                </span>
                            )}
                        </button>

                        {/* 👤 USUARIO / LOGIN */}
                        {user._id ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 p-1 pr-2 rounded-full border border-stone-200 hover:bg-stone-50 transition-all ml-2"
                                >
                                    <div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold font-serif border border-stone-200">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-stone-400" />
                                </button>

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-100 py-2 overflow-hidden z-50 origin-top-right"
                                        >
                                            <div className="px-4 py-3 border-b border-stone-50 bg-stone-50/50">
                                                <p className="text-sm font-bold text-stone-800 truncate">{user.name}</p>
                                                <p className="text-xs text-stone-500 truncate">{user.email}</p>
                                            </div>

                                            <div className="p-1">
                                                <Link to="/perfil" className="flex items-center px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition" onClick={() => setIsUserMenuOpen(false)}>
                                                    <User className="mr-3 h-4 w-4 text-stone-400" /> Mi Perfil
                                                </Link>

                                                {esAdmin && (
                                                    <Link to="/admin" className="flex items-center px-3 py-2 text-sm text-yellow-700 bg-yellow-50/50 hover:bg-yellow-100 rounded-lg transition font-medium" onClick={() => setIsUserMenuOpen(false)}>
                                                        <Shield className="mr-3 h-4 w-4" /> Panel Admin
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="border-t border-stone-100 my-1"></div>

                                            <div className="p-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <LogOut className="mr-3 h-4 w-4" /> Cerrar Sesión
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className="hidden md:flex bg-stone-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-yellow-700 transition-colors shadow-sm">
                                    Ingresar
                                </button>
                                {/* Icono solo móvil */}
                                <button className="md:hidden p-2 text-stone-700">
                                    <User className="h-5 w-5" />
                                </button>
                            </Link>
                        )}

                        {/* TOGGLE MENÚ MÓVIL */}
                        <button
                            className="md:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-md"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* --- MENÚ MÓVIL --- */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-stone-100 mt-3 pt-2 overflow-hidden bg-white rounded-b-xl"
                        >
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-lg text-base font-medium mb-1 transition-colors ${isActive(item.path)
                                        ? 'bg-yellow-50 text-yellow-700 font-bold'
                                        : 'text-stone-600 hover:bg-stone-50'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {!user._id && (
                                <div className="p-4 mt-2 border-t border-stone-50">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                        <button className="w-full bg-stone-900 text-white py-3 rounded-lg font-bold shadow-md">
                                            Ingresar / Registrarse
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default Header;