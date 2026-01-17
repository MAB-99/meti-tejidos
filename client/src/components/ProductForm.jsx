import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, X, Loader2, Upload } from 'lucide-react'; // Iconos bonitos
import uploadImage from '../lib/uploadImage'; // Tu función auxiliar para Cloudinary
import { API_URL } from '../lib/constants';
import toast from 'react-hot-toast'; // Para las notificaciones flotantes

const ProductForm = ({ productToEdit, onSuccess, onCancel }) => {
    // 1. ESTADO DEL FORMULARIO (State)
    // Aquí definimos qué datos va a manejar este formulario.
    // Inicializamos todo vacío, excepto la categoría por defecto.
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
        category: 'indumentaria',
        image: '',
        material: '',
        size: '',
        color: ''
    });

    const [loading, setLoading] = useState(false); // Para mostrar el círculo girando al guardar
    const [uploading, setUploading] = useState(false); // Para saber si se está subiendo una foto

    // 2. EFECTO: CARGAR DATOS SI ES EDICIÓN
    // useEffect se ejecuta automáticamente cuando el componente aparece o cuando cambia 'productToEdit'.
    useEffect(() => {
        if (productToEdit) {
            // Si nos pasaron un producto para editar, llenamos el formulario con sus datos.
            setFormData({
                name: productToEdit.name,
                price: productToEdit.price,
                description: productToEdit.description || '',
                stock: productToEdit.stock,
                category: productToEdit.category,
                image: productToEdit.image,
                // Rellenamos también los campos nuevos (si existen en ese producto)
                material: productToEdit.material || '',
                size: productToEdit.size || '',
                color: productToEdit.color || ''
            });
        }
    }, [productToEdit]); // La dependencia [productToEdit] dice: "Ejecútate cada vez que esto cambie"

    // 3. MANEJAR CAMBIOS EN LOS INPUTS
    // Esta función es genérica. Sirve para CUALQUIER input (nombre, precio, color...).
    // Usa el atributo 'name' del input para saber qué campo del estado actualizar.
    const handleChange = (e) => {
        const { name, value } = e.target;
        // ...formData significa: "Copia todo lo que ya había en el formulario"
        // [name]: value significa: "Y actualiza solo el campo que cambió"
        setFormData({ ...formData, [name]: value });
    };

    // 4. SUBIDA DE IMAGEN (A Cloudinary)
    const handleImageChange = async (e) => {
        const file = e.target.files[0]; // El archivo que seleccionó el usuario
        if (file) {
            setUploading(true); // Activamos el estado "Subiendo..."
            const url = await uploadImage(file); // Esperamos a que tu función auxiliar haga la magia
            setUploading(false); // Terminó de subir

            if (url) {
                // Si todo salió bien, guardamos la URL en el estado del formulario
                setFormData({ ...formData, image: url });
            }
        }
    };

    // 5. ENVIAR EL FORMULARIO (Submit)
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue (comportamiento por defecto de HTML)     
        setLoading(true); // Activamos el spinner de carga

        // Preparamos el token para que el servidor sepa que tenemos permiso
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        };

        try {
            if (productToEdit) {
                // CASO A: EDITAR (Usamos PUT y el ID del producto)
                await axios.put(`${API_URL}/api/product/${productToEdit._id}`, formData, config);
                toast.success('Producto actualizado correctamente');
            } else {
                // CASO B: CREAR NUEVO (Usamos POST)
                await axios.post(`${API_URL}/api/product`, formData, config);
                toast.success('Producto creado correctamente');
            }
            onSuccess(); // Avisamos al componente padre (Tienda) que actualice la lista
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar: ' + (error.response?.data?.msg || error.message));
        } finally {
            setLoading(false); // Pase lo que pase (éxito o error), apagamos el spinner
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* CABECERA DEL FORMULARIO */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-800 font-serif">
                    {productToEdit ? 'Editar Tejido' : 'Nuevo Tejido'}
                </h3>
                <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* --- COLUMNA IZQUIERDA: DATOS --- */}
                <div className="space-y-4">

                    {/* Nombre del Producto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text" name="name" required
                            value={formData.name} onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                            placeholder="Ej: Suéter Nórdico..."
                        />
                    </div>

                    {/* Precio y Stock (En una misma fila) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                            <input
                                type="number" name="price" required min="0"
                                value={formData.price} onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                type="number" name="stock" required min="0"
                                value={formData.stock} onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Categoría (Actualizada para Tejidos) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                            name="category"
                            value={formData.category} onChange={handleChange}
                            className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 outline-none"
                        >
                            <option value="indumentaria">Indumentaria</option>
                            <option value="accesorios">Accesorios (Bufandas, Gorros)</option>
                            <option value="deco">Decoración (Mantas, Almohadones)</option>
                            <option value="amigurumis">Amigurumis</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>

                    {/* --- NUEVA SECCIÓN: DETALLES ESPECÍFICOS --- */}
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 space-y-3">
                        <h4 className="text-sm font-bold text-yellow-800 mb-2">Detalles del Tejido</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                                <input
                                    type="text" name="color"
                                    value={formData.color} onChange={handleChange}
                                    placeholder="Ej: Mostaza"
                                    className="w-full p-2 border rounded border-gray-300 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Talle / Medidas</label>
                                <input
                                    type="text" name="size"
                                    value={formData.size} onChange={handleChange}
                                    placeholder="Ej: M, L, o 40x40cm"
                                    className="w-full p-2 border rounded border-gray-300 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Material</label>
                            <input
                                type="text" name="material"
                                value={formData.material} onChange={handleChange}
                                placeholder="Ej: Lana Merino, Hilo de Algodón..."
                                className="w-full p-2 border rounded border-gray-300 text-sm"
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            name="description" rows="3"
                            value={formData.description} onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                            placeholder="Cuenta un poco sobre la prenda..."
                        />
                    </div>
                </div>

                {/* --- COLUMNA DERECHA: IMAGEN --- */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Foto del Producto</label>

                    <div className="flex items-center gap-4">
                        {/* Previsualización (Cuadrado con la imagen) */}
                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 relative">
                            {uploading ? (
                                <div className="flex flex-col items-center">
                                    <Loader2 className="animate-spin text-yellow-600 mb-1" />
                                    <span className="text-xs text-yellow-600 font-bold">Subiendo...</span>
                                </div>
                            ) : formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-2">
                                    <Upload className="text-gray-400 w-8 h-8 mx-auto mb-1" />
                                    <span className="text-xs text-gray-400">Sin foto</span>
                                </div>
                            )}
                        </div>

                        {/* Controles de Imagen */}
                        <div className="flex-1 space-y-3">
                            {/* Input para seleccionar archivo */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={uploading}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-yellow-100 file:text-yellow-700
                                hover:file:bg-yellow-200
                                cursor-pointer"
                            />

                            {/* Input Manual de URL (por si acaso) */}
                            <div>
                                <p className="text-xs text-gray-400 mb-1">O pega el enlace directo:</p>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange} // Reutilizamos handleChange
                                    className="w-full border-b border-gray-300 text-xs py-1 focus:outline-none focus:border-yellow-500"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BOTONES DEL FINAL --- */}
                <div className="lg:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button" onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit" disabled={loading || uploading}
                        className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                        {productToEdit ? 'Actualizar' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;