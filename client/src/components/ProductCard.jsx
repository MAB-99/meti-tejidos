import { useState, useEffect } from 'react';
import { ShoppingCart, AlertTriangle, Check, Ruler, Palette } from 'lucide-react'; // Agregué iconos de Regla y Paleta
import useCart from '../hooks/useCart';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    // 1. ESTADOS LOCALES
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false); // Para el feedback visual "¡Agregado!"

    // 2. HOOK DEL CARRITO
    // Traemos la función para agregar y el carrito actual para verificar stock
    const { addToCart, cart } = useCart();

    // 3. LÓGICA DE STOCK (Muy importante)
    // Buscamos si este producto ya está en el carrito
    const cartItem = cart.find(item => item._id === product._id);
    const inCartQuantity = cartItem ? cartItem.quantity : 0;

    // Calculamos cuánto stock REAL queda disponible para este usuario
    const initialStock = product.stock || 0;
    const availableStock = initialStock - inCartQuantity;

    const isOutOfStock = availableStock <= 0;
    const isLowStock = availableStock > 0 && availableStock < 3; // Avisar si quedan menos de 3

    // Efecto: Si el usuario tiene 5 en el carrito y solo quedan 5, reseteamos el contador a 0 o 1
    useEffect(() => {
        if (quantity > availableStock && availableStock > 0) {
            setQuantity(availableStock);
        }
    }, [availableStock, quantity]);

    // Funciones para los botones + y -
    const handleIncrement = () => {
        if (quantity < availableStock) setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    // Función principal: Agregar al carrito
    const handleAddToCart = () => {
        if (isOutOfStock) return;

        addToCart(product, quantity);

        // Feedback visual temporal
        setAdded(true);
        setTimeout(() => setAdded(false), 2000); // Vuelve a la normalidad en 2 seg
        setQuantity(1); // Reseteamos el contador
    };

    return (
        <div className="group flex flex-col w-full bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300">

            {/* --- 1. SECCIÓN DE IMAGEN --- */}
            <div className="relative aspect-square bg-stone-100 overflow-hidden">
                <Link to={`/producto/${product._id}`}>
                    <img
                        src={product.image || 'https://via.placeholder.com/300'}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                    />
                </Link>

                {/* Badges (Etiquetas flotantes sobre la imagen) */}
                {/* Stock Agotado */}
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                        <span className="bg-stone-800 text-white px-4 py-2 rounded-none text-xs font-bold tracking-widest uppercase shadow-lg border border-white/20">
                            {initialStock === 0 ? 'Agotado' : 'Máximo alcanzado'}
                        </span>
                    </div>
                )}

                {/* Poco Stock */}
                {isLowStock && (
                    <div className="absolute top-2 right-2">
                        <span className="bg-amber-500 text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Últimos {availableStock}
                        </span>
                    </div>
                )}

                {/* Categoría (Badge pequeño) */}
                <div className="absolute top-2 left-2">
                    <span className="bg-white/90 backdrop-blur-sm text-stone-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {product.category}
                    </span>
                </div>
            </div>

            {/* --- 2. CONTENIDO --- */}
            <div className="p-4 flex-grow flex flex-col">

                {/* Título elegante */}
                <h3 className="text-lg font-bold text-stone-800 font-serif leading-tight mb-2 line-clamp-2 group-hover:text-yellow-700 transition-colors">
                    {product.name}
                </h3>

                {/* DETALLES DEL TEJIDO (Nuevo bloque) */}
                <div className="flex flex-wrap gap-2 mb-4 text-xs text-stone-500">
                    {/* Solo mostramos si existen los datos */}
                    {product.size && (
                        <span className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded border border-stone-100">
                            <Ruler className="w-3 h-3" /> {product.size}
                        </span>
                    )}
                    {product.color && (
                        <span className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded border border-stone-100">
                            <Palette className="w-3 h-3" /> {product.color}
                        </span>
                    )}
                    {/* Material: Si es muy largo lo cortamos */}
                    {product.material && (
                        <span className="bg-stone-50 px-2 py-1 rounded border border-stone-100">
                            🧶 {product.material}
                        </span>
                    )}
                </div>

                {/* Precio y Contador */}
                <div className="mt-auto pt-3 border-t border-stone-100 space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-sans font-bold text-stone-900 tracking-tight">
                            ${product.price}
                        </span>

                        {/* Selector de cantidad compacto */}
                        <div className="flex items-center border border-stone-200 rounded bg-white h-8">
                            <button
                                className="px-2 h-full hover:bg-stone-100 text-stone-600 disabled:opacity-30 transition-colors"
                                onClick={handleDecrement}
                                disabled={isOutOfStock || quantity <= 1}
                            > - </button>
                            <span className="w-8 text-center text-sm font-medium text-stone-800">{quantity}</span>
                            <button
                                className="px-2 h-full hover:bg-stone-100 text-stone-600 disabled:opacity-30 transition-colors"
                                onClick={handleIncrement}
                                disabled={isOutOfStock || quantity >= availableStock}
                            > + </button>
                        </div>
                    </div>

                    {/* Botón de Acción Principal */}
                    <button
                        className={`w-full h-10 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm
                            ${isOutOfStock
                                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                : added
                                    ? 'bg-green-600 text-white shadow-green-200 hover:shadow-none translate-y-0.5' // Efecto presionado
                                    : 'bg-stone-900 text-white hover:bg-yellow-700 hover:shadow-md'
                            }`}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                    >
                        {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                        {added ? '¡Listo!' : (isOutOfStock ? 'Sin Stock' : 'Agregar al carrito')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;