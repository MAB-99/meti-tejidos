import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Agregué Ruler y Palette para los iconos de talle y color
import { X, ShoppingCart, Trash2, Loader2, CreditCard, Banknote, Ruler, Palette, ChevronRight } from 'lucide-react';
import axios from 'axios';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { API_URL } from '../lib/constants';
import toast from 'react-hot-toast';

const CartDrawer = () => {
    const navigate = useNavigate();
    // Traemos todo lo necesario del hook useCart
    const { cart, removeFromCart, updateQuantity, total, clearCart, handlePayment, isCartOpen, closeCart } = useCart();
    const { auth } = useAuth();

    const [step, setStep] = useState('cart'); // 'cart' o 'checkout'
    const [loading, setLoading] = useState(false);

    // Datos para el envío (solo en caso de pago manual)
    const [formData, setFormData] = useState({
        address: '',
        city: 'Córdoba',
        postalCode: '',
        country: 'Argentina'
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Iniciar proceso de checkout manual (Efectivo)
    const handleManualCheckoutClick = () => {
        if (!auth._id) {
            toast.error("Debes iniciar sesión para comprar");
            closeCart();
            navigate('/login');
            return;
        }
        setStep('checkout');
    };

    // Enviar la orden manual al backend
    const handleSubmitManualOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            orderItems: cart.map(item => ({
                product: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                qty: item.quantity,
                // IMPORTANTE: Enviamos también los detalles si los tienes guardados en el carrito
                // Si no, el backend los sacará del producto original
            })),
            shippingAddress: formData,
            paymentMethod: 'Efectivo',
            itemsPrice: total,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: total
        };

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };
            const { data } = await axios.post(`${API_URL}/api/order`, orderData, config);

            toast.success(`¡Gracias! Orden #${data._id.slice(-6)} creada.`);
            clearCart();
            setStep('cart');
            closeCart();

        } catch (error) {
            console.error(error);
            toast.error("Error al procesar: " + (error.response?.data?.msg || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* FONDO OSCURO (Backdrop) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-stone-900/60 z-50 backdrop-blur-sm"
                    />

                    {/* PANEL LATERAL (Drawer) */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-stone-100"
                    >
                        {/* 1. CABECERA */}
                        <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-stone-50">
                            <h2 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-3">
                                <ShoppingCart className="h-5 w-5 text-yellow-700" />
                                {step === 'cart' ? 'Tu Bolsa de Compras' : 'Datos de Envío'}
                            </h2>
                            <button onClick={closeCart} className="p-2 hover:bg-stone-200 rounded-full transition text-stone-500">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* 2. CUERPO (Scrollable) */}
                        <div className="flex-1 overflow-y-auto p-5 bg-white">
                            {step === 'cart' && (
                                <>
                                    {cart.length === 0 ? (
                                        // CARRITO VACÍO
                                        <div className="flex flex-col items-center justify-center h-full text-stone-400 space-y-4">
                                            <div className="bg-stone-50 p-6 rounded-full">
                                                <ShoppingCart className="h-12 w-12 text-stone-300" />
                                            </div>
                                            <p className="font-medium">Tu bolsa está vacía</p>
                                            <button onClick={closeCart} className="text-yellow-700 font-bold hover:underline text-sm">
                                                Ver colección
                                            </button>
                                        </div>
                                    ) : (
                                        // LISTA DE PRODUCTOS
                                        <div className="space-y-6">
                                            {cart.map((item) => (
                                                <div key={item._id} className="flex gap-4 border-b border-stone-100 pb-6 last:border-0">
                                                    {/* Imagen */}
                                                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <h3 className="font-serif font-bold text-stone-800 text-lg leading-tight mb-1">
                                                                {item.name}
                                                            </h3>

                                                            {/* Detalles Técnicos (Talle/Color) */}
                                                            <div className="flex flex-wrap gap-2 mb-2">
                                                                {item.size && (
                                                                    <span className="inline-flex items-center text-xs text-stone-500 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">
                                                                        <Ruler className="w-3 h-3 mr-1" /> {item.size}
                                                                    </span>
                                                                )}
                                                                {item.color && (
                                                                    <span className="inline-flex items-center text-xs text-stone-500 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">
                                                                        <Palette className="w-3 h-3 mr-1" /> {item.color}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="text-stone-900 font-medium">${item.price}</p>
                                                        </div>

                                                        {/* Controles Cantidad + Borrar */}
                                                        <div className="flex items-center justify-between mt-2">
                                                            <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 h-8">
                                                                <button
                                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                                    className="px-2 h-full hover:bg-stone-200 text-stone-600 disabled:opacity-30"
                                                                    disabled={item.quantity <= 1}
                                                                >-</button>
                                                                <span className="w-8 text-center text-sm font-medium text-stone-800">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                                    className="px-2 h-full hover:bg-stone-200 text-stone-600 disabled:opacity-30"
                                                                    disabled={item.quantity >= item.stock}
                                                                >+</button>
                                                            </div>

                                                            <button
                                                                onClick={() => removeFromCart(item._id)}
                                                                className="text-stone-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-full"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* FORMULARIO DE CHECKOUT (Igual que antes pero con estilo 'stone') */}
                            {step === 'checkout' && (
                                <form id="manual-checkout-form" onSubmit={handleSubmitManualOrder} className="space-y-5 animate-in slide-in-from-right duration-300">
                                    <div className="bg-yellow-50 p-4 rounded-xl text-sm text-yellow-800 border border-yellow-100 flex gap-3">
                                        <Banknote className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold mb-1">Pago a Convenir</p>
                                            <p>Completa tus datos. Nos pondremos en contacto contigo para coordinar el pago y la entrega.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 mb-1">Dirección de Entrega</label>
                                            <input
                                                required name="address"
                                                value={formData.address} onChange={handleInputChange}
                                                placeholder="Calle y Número..."
                                                className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-1">Ciudad</label>
                                                <input
                                                    required name="city"
                                                    value={formData.city} onChange={handleInputChange}
                                                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-1">Cód. Postal</label>
                                                <input
                                                    required name="postalCode"
                                                    value={formData.postalCode} onChange={handleInputChange}
                                                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setStep('cart')}
                                        className="text-sm text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1 w-full py-2"
                                    >
                                        &larr; Volver al carrito
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* 3. FOOTER (Totales y Botones) */}
                        {cart.length > 0 && (
                            <div className="p-6 bg-stone-50 border-t border-stone-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-stone-600 font-medium">Subtotal</span>
                                    <span className="text-2xl font-sans font-extrabold text-stone-900 tracking-tight">${total}</span>
                                </div>

                                {step === 'cart' ? (
                                    <div className="space-y-3">
                                        {/* Botón MercadoPago */}
                                        <button
                                            onClick={handlePayment}
                                            className="w-full bg-[#009EE3] hover:bg-[#008ED6] text-white py-3.5 rounded-xl font-bold shadow-sm flex justify-center items-center gap-2 transition-transform active:scale-[0.98]"
                                        >
                                            <span>Pagar con MercadoPago</span>
                                            <CreditCard className="w-5 h-5" />
                                        </button>

                                        {/* Separador */}
                                        <div className="relative flex py-1 items-center">
                                            <div className="flex-grow border-t border-stone-300"></div>
                                            <span className="flex-shrink-0 mx-3 text-stone-400 text-xs font-medium uppercase tracking-widest">o efectivo</span>
                                            <div className="flex-grow border-t border-stone-300"></div>
                                        </div>

                                        {/* Botón Efectivo */}
                                        <button
                                            onClick={handleManualCheckoutClick}
                                            className="w-full bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 py-3.5 rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2"
                                        >
                                            <span>Acordar pago y entrega</span>
                                            <Banknote className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="submit"
                                        form="manual-checkout-form"
                                        disabled={loading}
                                        className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-yellow-700 transition flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                            <>
                                                Confirmar Pedido <ChevronRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;