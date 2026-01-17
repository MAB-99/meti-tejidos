import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom'; // Importamos useLocation para leer la URL
import axios from 'axios';
import { Search, FilterX, SlidersHorizontal, ShoppingBag, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { API_URL } from '../lib/constants';

const Shop = () => {
    // 1. ESTADOS
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation(); // Hook para leer si vienen parámetros desde la Home

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortOption, setSortOption] = useState('newest');

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // 2. EFECTO: Leer URL al cargar (Para cuando vienen de la Home)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('cat'); // Busca si hay ?cat=algo en la URL
        if (cat) {
            setCategoryFilter(cat);
        }
    }, [location]);

    // 3. FETCH DE PRODUCTOS
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/product`);
                setProducts(data);
            } catch (error) {
                console.error("Error cargando productos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // 4. LÓGICA DE FILTRADO
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Filtro Texto
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

            // Filtro Categoría
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

            // Filtro Precio
            const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
            const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
            const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

            return matchesSearch && matchesCategory && matchesPrice;
        }).sort((a, b) => {
            // Ordenamiento
            if (sortOption === 'price-asc') return a.price - b.price;
            if (sortOption === 'price-desc') return b.price - a.price;
            if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
            // Default: newest
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }, [products, searchTerm, categoryFilter, priceRange, sortOption]);

    // 5. COMPONENTE SIDEBAR (Estilizado Boutique)
    const FilterSidebar = () => (
        <div className="space-y-6">
            {/* Buscador */}
            <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Buscar</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar tejido..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-stone-700 bg-stone-50 focus:bg-white transition-colors"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                </div>
            </div>

            {/* Categorías (Actualizadas para Meti Tejidos) */}
            <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Categoría</label>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white text-stone-700 cursor-pointer"
                >
                    <option value="all">Ver Todas</option>
                    <option value="indumentaria">Indumentaria</option>
                    <option value="accesorios">Accesorios</option>
                    <option value="deco">Deco & Hogar</option>
                    <option value="amigurumis">Amigurumis</option>
                    <option value="otros">Otros</option>
                </select>
            </div>

            {/* Precio */}
            <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Precio ($)</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Mín"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-1/2 p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-stone-50 focus:bg-white text-sm"
                    />
                    <input
                        type="number"
                        placeholder="Máx"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-1/2 p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-stone-50 focus:bg-white text-sm"
                    />
                </div>
            </div>

            {/* Botón Reset */}
            <button
                onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setPriceRange({ min: '', max: '' });
                    setSortOption('newest');
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-stone-500 border border-stone-200 rounded-lg hover:bg-stone-100 hover:text-stone-800 transition"
            >
                <FilterX className="w-4 h-4" /> Limpiar Filtros
            </button>
        </div>
    );

    return (
        <>
            <Helmet><title>Tienda - Meti Tejidos</title></Helmet>

            <div className="min-h-screen bg-stone-50 py-10">
                <div className="container mx-auto px-4">

                    {/* Header de la Tienda */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-serif font-bold text-stone-800 mb-2">Catálogo Completo</h1>
                        <p className="text-stone-500">Descubre piezas únicas tejidas a mano.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                        {/* Sidebar Escritorio */}
                        <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-xl border border-stone-100 shadow-sm self-start sticky top-24">
                            <h2 className="text-lg font-serif font-bold mb-6 text-stone-800 border-b border-stone-100 pb-2">Filtrar por</h2>
                            <FilterSidebar />
                        </aside>

                        {/* Contenido Principal */}
                        <main className="lg:col-span-3">

                            {/* Barra Superior Móvil y Ordenamiento */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-4 rounded-xl border border-stone-100 shadow-sm">

                                {/* Botón Filtros Móvil */}
                                <button
                                    className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 rounded-lg bg-stone-50 text-stone-700 hover:bg-stone-100 transition"
                                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                                >
                                    <SlidersHorizontal className="w-4 h-4" /> Filtros
                                </button>

                                {/* Contador y Ordenar */}
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto ml-auto">
                                    <p className="text-stone-500 whitespace-nowrap text-sm font-medium">
                                        Mostrando {filteredProducts.length} tejidos
                                    </p>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <span className="text-xs text-stone-400 font-bold uppercase hidden sm:inline">Ordenar:</span>
                                        <select
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                            className="w-full sm:w-auto p-2 border border-stone-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-yellow-500 outline-none cursor-pointer text-stone-700"
                                        >
                                            <option value="newest">Lo más nuevo</option>
                                            <option value="price-asc">Precio: Menor a Mayor</option>
                                            <option value="price-desc">Precio: Mayor a Menor</option>
                                            <option value="name-asc">Nombre: A-Z</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Menú Filtros Móvil (Desplegable) */}
                            {isMobileFilterOpen && (
                                <div className="lg:hidden w-full bg-white p-4 rounded-xl border border-stone-200 mb-6 shadow-sm animate-in slide-in-from-top-2">
                                    <FilterSidebar />
                                </div>
                            )}

                            {/* Grid de Productos */}
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="w-10 h-10 animate-spin text-yellow-600" />
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-stone-200">
                                    <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShoppingBag className="w-10 h-10 text-stone-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-stone-600 font-serif">No encontramos tejidos</h3>
                                    <p className="text-stone-400 mt-2">Intenta cambiar los filtros de búsqueda.</p>
                                    <button
                                        onClick={() => {
                                            setCategoryFilter('all');
                                            setSearchTerm('');
                                        }}
                                        className="mt-4 text-yellow-700 font-bold hover:underline text-sm"
                                    >
                                        Ver todos los productos
                                    </button>
                                </div>
                            )}

                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shop;