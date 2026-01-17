import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Heart } from 'lucide-react';
// Asegúrate de que en constants tengas los datos actualizados, o edítalos aquí directo
import { CONTACT_INFO } from '../lib/constants';

const Footer = () => {
    return (
        <footer className="bg-stone-800 text-stone-300 border-t border-stone-800">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Columna 1: Marca y Propósito */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            {/* Logo: Si tienes imagen, ponla aquí. Si no, texto elegante */}
                            <span className="text-2xl font-serif font-bold text-white tracking-tight">
                                Meti Tejidos
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-stone-400">
                            Tejidos artesanales hechos a mano con fibras naturales.
                            Diseños únicos pensados para abrazarte con calidez y estilo.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a
                                href={CONTACT_INFO.INSTAGRAM_URL || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Columna 2: Explorar */}
                    <div>
                        <h4 className="text-white font-bold mb-6 font-serif">Explorar</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to="/" className="hover:text-yellow-600 transition-colors">Inicio</Link>
                            </li>
                            <li>
                                <Link to="/tienda" className="hover:text-yellow-600 transition-colors">Catálogo Completo</Link>
                            </li>
                            <li>
                                <Link to="/tienda?cat=indumentaria" className="hover:text-yellow-600 transition-colors">Indumentaria</Link>
                            </li>
                            <li>
                                <Link to="/tienda?cat=deco" className="hover:text-yellow-600 transition-colors">Deco & Hogar</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Información */}
                    <div>
                        <h4 className="text-white font-bold mb-6 font-serif">Ayuda</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to="/nosotros" className="hover:text-yellow-600 transition-colors">Sobre Nosotros</Link>
                            </li>
                            <li>
                                <Link to="/contacto" className="hover:text-yellow-600 transition-colors">Contacto</Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-yellow-600 transition-colors">Envíos y Devoluciones</Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-yellow-600 transition-colors">Cuidado de las prendas</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 4: Contacto */}
                    <div>
                        <h4 className="text-white font-bold mb-6 font-serif">Contacto</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-yellow-600 shrink-0" />
                                <span>{CONTACT_INFO.FULL_ADDRESS || 'Córdoba, Argentina'}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-yellow-600 shrink-0" />
                                <span>{CONTACT_INFO.PHONE || '+54 9 351 ...'}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-yellow-600 shrink-0" />
                                <span>{CONTACT_INFO.EMAIL || 'hola@metitejidos.com'}</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="border-t border-stone-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-300">
                    <p>© 2026 Meti Tejidos. Todos los derechos reservados.</p>
                    <p className="flex items-center gap-1 mt-2 md:mt-0">
                        Hecho con <Heart className="w-4 h-4 text-red-500 fill-current" /> en Córdoba
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;