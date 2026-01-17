import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// Iconos para la sección de beneficios (Trust Signals)
import { ArrowRight, Heart, ShieldCheck, Truck, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard'; // Importamos la tarjeta que mejoramos antes
import { API_URL } from '../lib/constants';
import toast from 'react-hot-toast';
import { IMAGES } from '../lib/constants';

const Home = () => {
    // 1. ESTADO: Aquí guardaremos los productos que traemos del Backend
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. EFECTO: Cargar productos al entrar a la página
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Pedimos todos los productos a la API 
                const { data } = await axios.get(`${API_URL}/api/product`);

                // OPCIONAL: Podríamos filtrar solo los que tienen stock o mostrar solo los últimos 4
                // Aquí tomamos los primeros 8 para la portada
                setProducts(data.slice(0, 8));
            } catch (error) {
                console.error("Error cargando productos:", error);
                toast.error("Hubo un problema cargando el catálogo");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="bg-stone-50 min-h-screen">

            {/* =================================================================
               SECCIÓN 1: HERO (Portada Principal)
               Es lo primero que ve el cliente. Debe ser impactante.
               ================================================================= */}
            <div className="relative bg-stone-900 text-white overflow-hidden">
                {/* Imagen de Fondo (Oscurecida para que se lea el texto) */}
                <div className="absolute inset-0">
                    <img
                        src={IMAGES.HERO_BG}
                        alt="Tejidos Artesanales"
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>

                {/* Contenido del Hero (Texto y Botón) */}
                <div className="relative container mx-auto px-4 py-32 flex flex-col items-center text-center">
                    <span className="text-yellow-500 font-bold tracking-widest uppercase text-sm mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Originales y únicos
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Tejidos con alma,<br /> calidez en cada punto.
                    </h1>
                    <p className="text-xl text-stone-200 mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        Prendas únicas hechas a mano con materiales naturales.
                        Diseños pensados para abrazarte en los días fríos.
                    </p>
                    <Link
                        to="/tienda"
                        className="bg-yellow-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-700 transition-all shadow-lg hover:shadow-yellow-900/50 flex items-center gap-2 animate-in fade-in zoom-in duration-1000 delay-200"
                    >
                        Ver Colección <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* =================================================================
               SECCIÓN 2: BENEFICIOS (Por qué elegirnos)
               Genera confianza en el cliente.
               ================================================================= */}
            <div className="py-16 bg-white border-b border-stone-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="bg-stone-100 p-4 rounded-full mb-4">
                                <Heart className="w-8 h-8 text-yellow-700" />
                            </div>
                            <h3 className="text-lg font-bold text-stone-800 font-serif mb-2">Hecho a Mano con Amor</h3>
                            <p className="text-stone-500 text-sm">Cada prenda es única y tejida dedicándole el tiempo que merece.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-stone-100 p-4 rounded-full mb-4">
                                <Star className="w-8 h-8 text-yellow-700" />
                            </div>
                            <h3 className="text-lg font-bold text-stone-800 font-serif mb-2">Fibras Naturales</h3>
                            <p className="text-stone-500 text-sm">Seleccionamos las lanas más suaves para cuidar tu piel.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-stone-100 p-4 rounded-full mb-4">
                                <Truck className="w-8 h-8 text-yellow-700" />
                            </div>
                            <h3 className="text-lg font-bold text-stone-800 font-serif mb-2">Envíos a todo el País</h3>
                            <p className="text-stone-500 text-sm">Recibe tu paquete listo para regalar (o regalarte).</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* =================================================================
               SECCIÓN 3: CATEGORÍAS (Navegación Visual)
               ================================================================= */}
            <div className="py-20 container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-stone-800">Explora por Categoría</h2>
                    <p className="text-stone-500 mt-2">Encuentra exactamente lo que buscas</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Categoría 1: Indumentaria */}
                    <Link to="/tienda?cat=indumentaria" className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
                        <img
                            src={IMAGES.CAT_INDUMENTARIA}
                            alt="Indumentaria"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <h3 className="text-white text-2xl font-serif font-bold border-2 border-    white/50 px-6 py-3 rounded backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all">
                                Indumentaria
                            </h3>
                        </div>
                    </Link>

                    {/* Categoría 2: Deco */}
                    <Link to="/tienda?cat=deco" className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
                        <img
                            src={IMAGES.CAT_DECO}
                            alt="Decoración"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <h3 className="text-white text-2xl font-serif font-bold border-2 border-white/50 px-6 py-3 rounded backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all">
                                Deco & Hogar
                            </h3>
                        </div>
                    </Link>

                    {/* Categoría 3: Accesorios */}
                    <Link to="/tienda?cat=accesorios" className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
                        <img
                            src={IMAGES.CAT_ACCESORIOS}
                            alt="Accesorios"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <h3 className="text-white text-2xl font-serif font-bold border-2 border-white/50 px-6 py-3 rounded backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all">
                                Accesorios
                            </h3>
                        </div>
                    </Link>
                </div>
            </div>

            {/* =================================================================
               SECCIÓN 4: DESTACADOS (Productos traídos de la BD)
               ================================================================= */}
            <div className="bg-white py-20 border-t border-stone-100">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <span className="text-yellow-600 font-bold uppercase tracking-wider text-sm">Recién Llegados</span>
                            <h2 className="text-3xl font-serif font-bold text-stone-800 mt-2">Nuestros Favoritos</h2>
                        </div>
                        <Link to="/tienda" className="hidden md:flex items-center gap-2 text-stone-500 hover:text-yellow-700 transition font-medium">
                            Ver todo el catálogo <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">Cargando tejidos hermosos...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.length > 0 ? (
                                products.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))
                            ) : (
                                <p className="col-span-4 text-center text-stone-400">Aún no hay productos cargados.</p>
                            )}
                        </div>
                    )}

                    {/* Botón móvil para ver todo */}
                    <div className="mt-10 text-center md:hidden">
                        <Link to="/tienda" className="bg-stone-900 text-white px-6 py-3 rounded-lg font-bold">
                            Ir a la Tienda
                        </Link>
                    </div>
                </div>
            </div>

            {/* =================================================================
               SECCIÓN 5: NEWSLETTER / FOOTER PREVIEW
               ================================================================= */}
            <div className="bg-stone-800 py-16 text-center text-white px-4">
                <h2 className="text-2xl font-serif font-bold mb-4">Únete a nuestra comunidad</h2>
                <p className="text-stone-400 mb-8 max-w-lg mx-auto">
                    Recibe novedades sobre nuevos diseños, talleres y promociones especiales directamente en tu correo.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Tu correo electrónico"
                        className="flex-1 px-4 py-3 rounded-lg text-stone-900 focus:ring-2 focus:ring-yellow-500 outline-none"
                    />
                    <button className="bg-yellow-600 px-6 py-3 rounded-lg font-bold hover:bg-yellow-700 transition">
                        Suscribirse
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;