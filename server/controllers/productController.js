import Product from '../models/Product.js'; // Importamos el "Molde" (Modelo) para poder interactuar con la Base de Datos

// =================================================================
// 1. AGREGAR UN PRODUCTO
// =================================================================
const agregarProducto = async (req, res) => {
    // 'req.body' contiene los datos que el usuario envió desde el formulario (nombre, precio, color, etc.)
    // Creamos una nueva instancia del modelo Product con esos datos.
    const producto = new Product(req.body);

    try {
        // .save() es una operación asíncrona (tarda un poco), por eso usamos 'await'.
        // Esto guarda el producto definitivamente en MongoDB.
        const productoGuardado = await producto.save();

        // Si todo sale bien, respondemos al frontend con el producto creado (formato JSON).
        res.json(productoGuardado);
    } catch (error) {
        console.log(error);
        // Si falla (ej: falta un campo obligatorio), enviamos error 400 (Bad Request).
        res.status(400).json({ msg: 'Hubo un error al guardar el producto' });
    }
};

// =================================================================
// 2. OBTENER TODOS LOS PRODUCTOS
// =================================================================
const obtenerProductos = async (req, res) => {
    // .find() sin argumentos busca TODOS los documentos en la colección de productos.
    const productos = await Product.find();

    // Devolvemos la lista completa al frontend (para mostrarla en la Home o Tienda).
    res.json(productos);
};

// =================================================================
// 3. OBTENER UN SOLO PRODUCTO (Por su ID)
// =================================================================
const obtenerProducto = async (req, res) => {
    const { id } = req.params; // Extraemos el ID que viene en la URL (ej: /api/productos/12345)

    try {
        // Buscamos en la DB por ese ID específico.
        const producto = await Product.findById(id);

        // Si no existe (es null), cortamos la ejecución y devolvemos error 404 (Not Found).
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Si existe, lo enviamos.
        res.json(producto);
    } catch (error) {
        console.log(error);
        // Este catch suele saltar si el ID tiene un formato inválido para MongoDB.
        res.status(404).json({ msg: 'ID no válido o producto no encontrado' });
    }
};

// =================================================================
// 4. ACTUALIZAR UN PRODUCTO (Aquí están los nuevos campos)
// =================================================================
const actualizarProducto = async (req, res) => {
    const { id } = req.params; // ID de la URL

    // Primero: Buscamos el producto que queremos editar.
    const producto = await Product.findById(id);

    // Validación de seguridad: Si no existe, error.
    if (!producto) {
        return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // --- ACTUALIZACIÓN DE CAMPOS ---
    // La lógica aquí es: "Usa el valor nuevo que viene en req.body O (||) quédate con el que ya tenías".
    // Esto evita que si el usuario solo edita el precio, se borre el nombre por accidente.

    producto.name = req.body.name || producto.name;
    producto.price = req.body.price || producto.price;
    producto.description = req.body.description || producto.description;
    producto.image = req.body.image || producto.image;
    producto.stock = req.body.stock || producto.stock;
    producto.category = req.body.category || producto.category;

    // --- NUEVOS CAMPOS DE TEJIDO ---
    // Aquí es donde conectamos los nuevos inputs del frontend con la base de datos.
    producto.material = req.body.material || producto.material; // Ej: Lana, Hilo
    producto.size = req.body.size || producto.size;             // Ej: S, M, L
    producto.color = req.body.color || producto.color;          // Ej: Mostaza

    try {
        // Guardamos los cambios en la DB.
        const productoActualizado = await producto.save();
        res.json(productoActualizado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al actualizar el producto' });
    }
};

// =================================================================
// 5. ELIMINAR UN PRODUCTO
// =================================================================
const eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Product.findById(id);

        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // .deleteOne() borra este documento específico de la base de datos.
        await producto.deleteOne();
        res.json({ msg: 'Producto eliminado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: 'Error al eliminar' });
    }
};

// Exportamos las funciones para usarlas en el archivo de rutas (productRoutes.js)
export {
    agregarProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto
};