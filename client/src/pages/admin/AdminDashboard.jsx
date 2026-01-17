import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Truck,
    Check,
    Plus,
    Clock,
    MapPin,
    Ruler,    // Icono para Talle
    Palette   // Icono para Color
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import ProductTable from './ProductTable';
import ProductForm from '../../components/ProductForm';
import { API_URL } from '../../lib/constants';

// =================================================================
// 1. PESTAÑA DE RESUMEN (Overview)
// =================================================================
const OverviewTab = () => {
    const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/order/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error cargando estadísticas:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 animate-in fade-in duration-500">
            <h3 className="text-xl font-serif font-bold text-stone-800 mb-6 flex items-center gap-2">
                <LayoutDashboard className="text-yellow-600" /> Resumen del Negocio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                    <p className="text-stone-500 text-sm font-medium uppercase tracking-wider">Ingresos Totales</p>
                    <p className="text-3xl font-bold text-stone-800 mt-2">${stats.totalSales?.toLocaleString('es-AR')}</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                    <p className="text-yellow-700 text-sm font-medium uppercase tracking-wider">Pedidos Activos</p>
                    <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.totalOrders}</p>
                </div>
                <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                    <p className="text-stone-500 text-sm font-medium uppercase tracking-wider">Modelos en Catálogo</p>
                    <p className="text-3xl font-bold text-stone-800 mt-2">{stats.totalProducts}</p>
                </div>
            </div>
        </div>
    );
};

// =================================================================
// 2. PESTAÑA DE PRODUCTOS
// =================================================================
const ProductsTab = () => {
    const [view, setView] = useState('table'); // 'table' o 'form'
    const [editingProduct, setEditingProduct] = useState(null);

    const handleNew = () => { setEditingProduct(null); setView('form'); };
    const handleEdit = (product) => { setEditingProduct(product); setView('form'); };
    const handleSuccess = () => { setView('table'); };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold text-stone-800">
                    {view === 'table' ? 'Mis Tejidos' : (editingProduct ? 'Editar Tejido' : 'Nuevo Tejido')}
                </h2>
                {view === 'table' && (
                    <button onClick={handleNew} className="bg-stone-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-yellow-700 transition shadow-md font-medium">
                        <Plus className="w-4 h-4" /> Agregar Diseño
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-1">
                {view === 'table' ? (
                    <ProductTable onEdit={handleEdit} />
                ) : (
                    <ProductForm productToEdit={editingProduct} onSuccess={handleSuccess} onCancel={() => setView('table')} />
                )}
            </div>
        </div>
    );
};

// =================================================================
// 3. PESTAÑA DE ÓRDENES (RENOVADA)
// =================================================================
const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/order`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            // Ordenar: Las más nuevas primero
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedData);
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
            toast.error("No se pudieron cargar los pedidos");
            setLoading(false);
        }
    };

    const handleDeliver = async (orderId) => {
        if (window.confirm('¿Confirmar que el pedido fue despachado?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/order/${orderId}/deliver`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    toast.success('¡Pedido marcado como despachado! 🚚');
                    fetchOrders();
                }
            } catch (error) {
                toast.error('Error de conexión');
            }
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    if (loading) return <div className="text-center p-10 text-stone-500">Cargando pedidos...</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 animate-in fade-in duration-500">
            <h3 className="text-xl font-serif font-bold text-stone-800 mb-6 flex items-center gap-2">
                <ShoppingBag className="text-yellow-600" /> Gestión de Pedidos
            </h3>

            {orders.length === 0 ? (
                <div className="text-center text-stone-400 py-12 bg-stone-50 rounded-lg border border-dashed border-stone-200">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Aún no tienes pedidos registrados.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 text-stone-600 text-xs uppercase tracking-wider border-b border-stone-200">
                                <th className="p-4 font-semibold">Pedido #</th>
                                <th className="p-4 font-semibold">Cliente</th>
                                <th className="p-4 font-semibold w-1/3">Detalle (A preparar)</th>
                                <th className="p-4 font-semibold">Estado</th>
                                <th className="p-4 font-semibold">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-yellow-50/30 transition-colors text-sm">
                                    <td className="p-4 align-top">
                                        <span className="font-mono text-stone-500 block">#{order._id.slice(-6)}</span>
                                        <span className="text-xs text-stone-400 mt-1 block">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="font-bold text-stone-800 mt-2 block">${order.totalPrice}</span>
                                    </td>

                                    <td className="p-4 align-top">
                                        <div className="font-bold text-stone-800">{order.user?.name || "Eliminado"}</div>
                                        <div className="text-stone-500 text-xs mb-2">{order.user?.email}</div>
                                        {order.shippingAddress && (
                                            <div className="bg-stone-50 p-2 rounded text-xs text-stone-600 border border-stone-200 flex items-start gap-1">
                                                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    {order.shippingAddress.address}<br />
                                                    {order.shippingAddress.city}
                                                </span>
                                            </div>
                                        )}
                                    </td>

                                    <td className="p-4 align-top">
                                        <div className="space-y-2">
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex gap-3 items-center bg-white border border-stone-100 p-2 rounded-lg shadow-sm">
                                                    <img src={item.image} alt="prod" className="w-10 h-10 rounded object-cover bg-stone-200" />
                                                    <div>
                                                        <div className="font-medium text-stone-800">
                                                            {item.qty}x {item.name}
                                                        </div>
                                                        <div className="flex gap-2 text-xs text-stone-500 mt-0.5">
                                                            {(item.size || item.product?.size) && (
                                                                <span className="flex items-center gap-0.5 bg-stone-100 px-1.5 rounded">
                                                                    <Ruler className="w-3 h-3" /> {item.size || item.product?.size}
                                                                </span>
                                                            )}
                                                            {(item.color || item.product?.color) && (
                                                                <span className="flex items-center gap-0.5 bg-stone-100 px-1.5 rounded">
                                                                    <Palette className="w-3 h-3" /> {item.color || item.product?.color}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="p-4 align-top space-y-2">
                                        <div>
                                            {order.isPaid ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                    <Check className="w-3 h-3" /> Pagado
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                                    <Clock className="w-3 h-3" /> Pendiente
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            {order.isDelivered ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                                                    <Truck className="w-3 h-3" /> Enviado
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-500">
                                                    En proceso
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="p-4 align-top">
                                        {!order.isDelivered && (
                                            <button
                                                onClick={() => handleDeliver(order._id)}
                                                className="w-full bg-stone-800 text-white px-3 py-2 rounded text-xs font-bold hover:bg-yellow-600 transition flex flex-col items-center gap-1"
                                            >
                                                <Truck className="w-4 h-4" /> Despachar
                                            </button>
                                        )}
                                        {order.isDelivered && (
                                            <div className="text-xs text-center text-green-600 font-bold mt-2">¡Listo!</div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// =================================================================
// 4. LAYOUT PRINCIPAL
// =================================================================
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { auth, cargando } = useAuth();
    const navigate = useNavigate();

    // --- PROTECCIÓN DE RUTA MEJORADA ---
    useEffect(() => {
        if (!cargando) {
            // 1. Si no hay usuario, fuera.
            if (!auth._id) {
                navigate('/login');
                return;
            }

            // 2. Comprobación flexible: Acepta 'admin' o 'isAdmin'
            const esAdmin = auth.admin === true || auth.isAdmin === true;

            if (!esAdmin) {
                console.warn("Acceso denegado. Rol de admin no detectado en:", auth);
                navigate('/');
            }
        }
    }, [auth, cargando, navigate]);

    if (cargando) return <div className="p-10 text-center">Cargando panel...</div>;
    // Doble chequeo visual
    const esAdminRender = auth?.admin === true || auth?.isAdmin === true;
    if (!esAdminRender) return null;

    return (
        <>
            <Helmet><title>Admin - Meti Tejidos</title></Helmet>
            <div className="min-h-screen bg-stone-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* SIDEBAR */}
                        <aside className="w-full lg:w-64 flex-shrink-0">
                            <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden sticky top-24">
                                <div className="p-6 border-b border-stone-50 bg-stone-900 text-white">
                                    <h2 className="text-lg font-serif font-bold tracking-wide">Meti Tejidos</h2>
                                    <p className="text-xs text-stone-400 mt-1">Panel de Control</p>
                                </div>
                                <nav className="p-3 space-y-1">
                                    {[
                                        { id: 'overview', icon: LayoutDashboard, label: 'Resumen' },
                                        { id: 'products', icon: Package, label: 'Mis Tejidos' },
                                        { id: 'orders', icon: ShoppingBag, label: 'Pedidos' },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === item.id
                                                    ? 'bg-yellow-50 text-yellow-800 shadow-sm border border-yellow-100'
                                                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                                                }`}
                                        >
                                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-yellow-600' : 'text-stone-400'}`} />
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>
                                <div className="p-4 border-t border-stone-100 text-xs text-center text-stone-400">
                                    Usuario: {auth.name}
                                </div>
                            </div>
                        </aside>

                        {/* CONTENIDO PRINCIPAL */}
                        <main className="flex-1">
                            {activeTab === 'overview' && <OverviewTab />}
                            {activeTab === 'products' && <ProductsTab />}
                            {activeTab === 'orders' && <OrdersTab />}
                        </main>

                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;