import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Hooks de navegación
import axios from 'axios';
import { ChevronLeft, ShoppingCart, Check, Truck, ShieldCheck, Ruler, Palette } from 'lucide-react';
import { API_URL } from '../lib/constants';
import useCart from '../hooks/useCart';
import toast from 'react-hot-toast';

const ProductPage = () => {
    // 1. OBTENER EL ID DE LA URL
    // useParams lee lo que hay después de /product/... en la barra de dirección.
    const { id } = useParams();
    const navigate = useNavigate();

    // 2. ESTADOS
    const [product, setProduct] = useState(null); // Guardará los datos del tejido
    const [loading, setLoading] = useState(true); // Para mostrar "Cargando..."
    const [quantity, setQuantity] = useState(1);  // Cantidad a comprar
    const [added, setAdded] = useState(false);    // Feedback visual

    // 3. HOOK DEL CARRITO
    const { addToCart, cart } = useCart();

    // 4. EFECTO: CARGAR EL PRODUCTO
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/product/${id}`);
                setProduct(data);
            } catch (error) {
                console.error("Error cargando producto:", error);
                toast.error("No pudimos cargar el producto");
                navigate('/'); // Si falla, lo mandamos a la Home
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]); // Se ejecuta cuando cambia el ID

    // 5. LÓGICA DE STOCK (Igual que en la tarjeta)
    // Si el producto aún no cargó, retornamos null para evitar errores
    if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    if (!product) return null;

    const cartItem = cart.find(item => item._id === product._id);
    const inCartQuantity = cartItem ? cartItem.quantity : 0;
    const availableStock = (product.stock || 0) - inCartQuantity;
    const isOutOfStock = availableStock <= 0;

    // Funciones de cantidad
    const handleIncrement = () => {
        if (quantity < availableStock) setQuantity(prev => prev + 1);
    };
    const handleDecrement = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    // Agregar al carrito
    const handleAddToCart = () => {
        if (isOutOfStock) return;
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
            {/* Contenedor Principal Centrado */}
            <div className="max-w-6xl mx-auto">

                {/* Botón Volver */}
                <Link to="/" className="inline-flex items-center text-stone-500 hover:text-stone-800 mb-6 transition-colors">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Volver a la tienda
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* --- COLUMNA IZQUIERDA: IMAGEN --- */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden relative shadow-sm">
                            <img
                                src={product.image}
                                alt={product.name}
                                className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-75' : ''}`}
                            />
                            {isOutOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <span className="bg-stone-900 text-white px-6 py-3 font-bold uppercase tracking-widest text-lg shadow-lg">
                                        Agotado
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- COLUMNA DERECHA: INFORMACIÓN --- */}
                    <div className="flex flex-col">

                        {/* Categoría y Título */}
                        <span className="text-yellow-600 font-bold uppercase tracking-wider text-sm mb-2">
                            {product.category}
                        </span>
                        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4 leading-tight">
                            {product.name}
                        </h1>

                        {/* Precio */}
                        <div className="text-4xl font-sans font-bold text-stone-900 mb-6 border-b border-stone-100 pb-6 tracking-tight">
                            ${product.price}
                        </div>

                        {/* Ficha Técnica (Grid de detalles) */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                                <span className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Material</span>
                                <span className="font-medium text-stone-800 flex items-center gap-2">
                                    🧶 {product.material || "No especificado"}
                                </span>
                            </div>
                            <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                                <span className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Color</span>
                                <span className="font-medium text-stone-800 flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-stone-400" />
                                    {product.color || "Único"}
                                </span>
                            </div>
                            <div className="col-span-2 bg-stone-50 p-3 rounded-lg border border-stone-100">
                                <span className="block text-xs text-stone-500 uppercase tracking-wide mb-1">Talle / Medidas</span>
                                <span className="font-medium text-stone-800 flex items-center gap-2">
                                    <Ruler className="w-4 h-4 text-stone-400" />
                                    {product.size || "Estándar"}
                                </span>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="prose prose-stone text-stone-600 mb-8">
                            <h3 className="text-lg font-bold text-stone-800 mb-2">Sobre este tejido</h3>
                            <p className="leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        {/* Controles de Compra */}
                        <div className="mt-auto bg-white p-6 border border-stone-100 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-medium text-stone-700">Cantidad:</span>
                                <div className="flex items-center border border-stone-200 rounded-lg">
                                    <button
                                        onClick={handleDecrement}
                                        disabled={quantity <= 1 || isOutOfStock}
                                        className="px-4 py-2 hover:bg-stone-50 text-stone-600 disabled:opacity-50"
                                    > - </button>
                                    <span className="w-12 text-center font-bold text-stone-900">{quantity}</span>
                                    <button
                                        onClick={handleIncrement}
                                        disabled={quantity >= availableStock || isOutOfStock}
                                        className="px-4 py-2 hover:bg-stone-50 text-stone-600 disabled:opacity-50"
                                    > + </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all
                                    ${added
                                        ? 'bg-green-600 text-white'
                                        : isOutOfStock
                                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                            : 'bg-stone-900 text-white hover:bg-yellow-700 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                {added ? <Check className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
                                {added ? '¡Agregado al carrito!' : (isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito')}
                            </button>

                            {/* Mensaje de stock bajo */}
                            {availableStock > 0 && availableStock < 5 && (
                                <p className="text-center text-amber-600 text-sm mt-3 font-medium">
                                    ¡Apúrate! Solo quedan {availableStock} unidades.
                                </p>
                            )}
                        </div>

                        {/* Info Extra (Estática pero útil) */}
                        <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-stone-500">
                            <div className="flex items-center gap-2">
                                <Truck className="w-5 h-5 text-yellow-600" />
                                <span>Envíos a todo el país</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-yellow-600" />
                                <span>Hecho a mano con amor</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;