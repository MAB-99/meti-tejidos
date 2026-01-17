import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Agregué LogOut, Ruler y Palette a los iconos
import { User, Package, Calendar, MapPin, Loader2, LogOut, Ruler, Palette } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { API_URL } from '../lib/constants';
import toast from 'react-hot-toast';

const Profile = () => {
    // Traemos cerrarSesion del hook para el botón de salir
    const { auth, cargando, cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // 1. SEGURIDAD
    useEffect(() => {
        if (!cargando && !auth._id) {
            navigate('/login');
        }
    }, [auth, cargando, navigate]);

    // 2. CARGAR COMPRAS
    useEffect(() => {
        const fetchOrders = async () => {
            if (!auth._id) return;

            try {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                };
                const { data } = await axios.get(`${API_URL}/api/order/myorders`, config);
                // Ordenamos: Lo más nuevo arriba
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedData);
            } catch (error) {
                console.error("Error cargando órdenes:", error);
                toast.error("No pudimos cargar tu historial");
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, [auth]);

    // Manejador para cerrar sesión
    const handleLogout = () => {
        cerrarSesion(); // Limpia el estado y localStorage
        navigate('/');
    };

    if (cargando) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-10 w-10 text-yellow-600" /></div>;

    return (
        <>
            <Helmet><title>Mi Perfil - Meti Tejidos</title></Helmet>

            <div className="min-h-screen bg-stone-50 py-10 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                        {/* --- COLUMNA 1: TARJETA DE USUARIO --- */}
                        <aside className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden sticky top-24">
                                {/* Cabecera decorativa */}
                                <div className="h-24 bg-stone-900 relative">
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                                        <div className="w-20 h-20 bg-white rounded-full p-1 shadow-md">
                                            <div className="w-full h-full bg-yellow-50 rounded-full flex items-center justify-center text-2xl font-bold text-yellow-700 font-serif">
                                                {auth.name?.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-12 pb-6 px-6 text-center">
                                    <h2 className="text-xl font-bold text-stone-800 font-serif">{auth.name}</h2>
                                    <p className="text-stone-500 text-sm mb-6">{auth.email}</p>

                                    <div className="text-left space-y-3 pt-6 border-t border-stone-100">
                                        <div className="flex items-center text-sm text-stone-600">
                                            <User className="w-4 h-4 mr-3 text-yellow-600" />
                                            <span>Cliente Frecuente</span>
                                        </div>
                                        <div className="flex items-center text-sm text-stone-600">
                                            <MapPin className="w-4 h-4 mr-3 text-yellow-600" />
                                            <span>Argentina</span>
                                        </div>

                                        {/* Botón Cerrar Sesión */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full mt-4 flex items-center justify-center gap-2 border border-stone-200 text-stone-600 py-2 rounded-lg text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* --- COLUMNA 2: HISTORIAL DE PEDIDOS --- */}
                        <main className="lg:col-span-3">
                            <h2 className="text-2xl font-bold font-serif text-stone-800 mb-6 flex items-center gap-2">
                                <Package className="text-yellow-600" /> Mis Compras
                            </h2>

                            {loadingOrders ? (
                                <div className="text-center py-10 bg-white rounded-xl border border-stone-100">
                                    <Loader2 className="animate-spin h-8 w-8 mx-auto text-stone-400" />
                                </div>
                            ) : orders.length === 0 ? (
                                // ESTADO VACÍO
                                <div className="bg-white p-10 rounded-xl shadow-sm border border-stone-100 text-center">
                                    <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package className="w-10 h-10 text-stone-300" />
                                    </div>
                                    <h3 className="text-lg font-medium text-stone-800 font-serif">Aún no tienes pedidos</h3>
                                    <p className="text-stone-500 mb-6 max-w-md mx-auto">
                                        Nuestros tejidos están esperando por ti. Explora la colección y encuentra algo único.
                                    </p>
                                    <button onClick={() => navigate('/')} className="bg-stone-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-700 transition shadow-md">
                                        Ver Colección
                                    </button>
                                </div>
                            ) : (
                                // LISTA DE PEDIDOS
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">

                                            {/* Cabecera del Pedido */}
                                            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 pb-4 border-b border-stone-50">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                                                            Orden #{order._id.substring(order._id.length - 6)}
                                                        </span>
                                                        <span className="text-xs text-stone-400">•</span>
                                                        <div className="flex items-center text-xs text-stone-500">
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-2 md:mt-0 flex items-center gap-3">
                                                    {/* Badge de Pago */}
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.isPaid
                                                        ? 'bg-green-50 text-green-700 border-green-100'
                                                        : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                        }`}>
                                                        {order.isPaid ? 'Pagado' : 'Pendiente Pago'}
                                                    </span>
                                                    {/* Badge de Envío */}
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.isDelivered
                                                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                        : 'bg-stone-100 text-stone-600 border-stone-200'
                                                        }`}>
                                                        {order.isDelivered ? 'Enviado' : 'En Preparación'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Lista de Items */}
                                            <div className="space-y-3">
                                                {order.orderItems.map((item, index) => (
                                                    <div key={index} className="flex items-start gap-4">
                                                        {/* Imagen */}
                                                        <div className="w-16 h-16 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200">
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>

                                                        {/* Info del Item */}
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="text-sm font-bold text-stone-800 font-serif">{item.name}</h4>
                                                                <span className="text-sm font-medium text-stone-900">${item.price * item.qty}</span>
                                                            </div>
                                                            <p className="text-xs text-stone-500 mb-1">Cantidad: {item.qty}</p>

                                                            {/* DETALLES DE TALLE Y COLOR (Lo nuevo) */}
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {(item.size || (item.product && item.product.size)) && (
                                                                    <span className="inline-flex items-center text-[10px] bg-stone-50 px-2 py-0.5 rounded text-stone-600 border border-stone-100">
                                                                        <Ruler className="w-3 h-3 mr-1" />
                                                                        {item.size || item.product.size}
                                                                    </span>
                                                                )}
                                                                {(item.color || (item.product && item.product.color)) && (
                                                                    <span className="inline-flex items-center text-[10px] bg-stone-50 px-2 py-0.5 rounded text-stone-600 border border-stone-100">
                                                                        <Palette className="w-3 h-3 mr-1" />
                                                                        {item.color || item.product.color}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Footer del Pedido */}
                                            <div className="mt-4 pt-4 border-t border-stone-50 flex justify-between items-center">
                                                <span className="text-sm text-stone-500">Total de la compra</span>
                                                <span className="text-xl font-bold text-stone-800 font-serif">${order.totalPrice}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;