export const CONTACT_INFO = {
    FULL_ADDRESS: "Chubut 832, Córdoba",
    PHONE: "+54 9 351 6780206",
    EMAIL: "contacto@metitejidos.com",
    INSTAGRAM: "@metitejidos",
    INSTAGRAM_URL: "https://instagram.com/metitejidos",
    CITY: 'Córdoba Capital',
    MAP_URL: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4040.553211739757!2d-64.21683852365466!3d-31.378121994403863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x943298e197b77e09%3A0x3979e968f9e32bd6!2sFacundo%20Quiroga%202894%2C%20X5009MCH%20C%C3%B3rdoba!5e1!3m2!1ses-419!2sar!4v1766776982970!5m2!1ses-419!2sar',
    WHATSAPP_URL: 'https://wa.me/5493516780206'
};

export const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

// --- AGREGA ESTO AL FINAL ---
export const IMAGES = {
    // Logo (Si no tienes uno online, usa este placeholder o sube el tuyo a public/logo.png)
    LOGO: "https://res.cloudinary.com/dkgohh1ds/image/upload/v1767729084/Logo_yp6xcm.png", // Icono de ovillo temporal

    // Home
    HERO_BG: "https://res.cloudinary.com/dkgohh1ds/image/upload/v1767733245/unnamed_uw2bw5.jpg", // Lanas oscuras

    // Categorías
    CAT_INDUMENTARIA: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=2072&auto=format&fit=crop", // Sweater
    CAT_DECO: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop", // Manta sofá
    CAT_ACCESORIOS: "https://images.unsplash.com/photo-1520013329661-f3b600985556?q=80&w=2089&auto=format&fit=crop", // Bufanda/Gorro

    // About (Sobre Nosotros)
    ABOUT_HERO: "https://res.cloudinary.com/dkgohh1ds/image/upload/v1767993978/Bordando_kdxxmg.jpg", // Primer plano tejido
    ABOUT_STORY: "https://res.cloudinary.com/dkgohh1ds/image/upload/v1767991939/Cosiendo_cierre_rth8wa.jpg", // Manos tejiendo

    // Placeholder por si falla un producto
    PLACEHOLDER: "https://placehold.co/600x600/e7e5e4/a8a29e?text=Meti+Tejidos"
};