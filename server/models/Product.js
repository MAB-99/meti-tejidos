import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://via.placeholder.com/150"
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['indumentaria', 'accesorios', 'deco', 'amigurumis', 'otros'],
        default: 'otros'
    },
    material: {
        type: String,
        required: false,
        trim: true
    },
    size: {
        type: String,
        required: false,
        default: "Único"
    },
    color: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
export default Product;