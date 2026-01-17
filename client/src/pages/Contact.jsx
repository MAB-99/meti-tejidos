import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Instagram } from 'lucide-react';
import { CONTACT_INFO } from '../lib/constants';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setStatus({ type: 'error', text: 'Por favor completa los campos obligatorios.' });
            return;
        }

        // Mensaje personalizado para Tejidos
        const whatsappMessage = `¡Hola Meti Tejidos! 👋\n\nMi nombre es ${formData.name}.\nTe escribo por lo siguiente:\n${formData.message}\n\nMi email es: ${formData.email}`;

        // Abrir WhatsApp
        window.open(`${CONTACT_INFO.WHATSAPP_URL || 'https://wa.me/5493510000000'}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');

        setStatus({ type: 'success', text: '¡Abriendo WhatsApp para enviar tu mensaje!' });
        setFormData({ name: '', email: '', phone: '', message: '' });

        setTimeout(() => setStatus(null), 5000);
    };

    return (
        <>
            <Helmet>
                <title>Contacto - Meti Tejidos</title>
                <meta name="description" content="Contáctanos para pedidos personalizados o consultas sobre nuestros tejidos." />
            </Helmet>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-stone-50 min-h-screen"
            >
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-6xl">

                        {/* Encabezado */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <span className="text-yellow-600 font-bold uppercase tracking-widest text-sm">Hablemos</span>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-4 mt-2">Estamos para ayudarte</h1>
                            <p className="text-stone-500 text-lg max-w-2xl mx-auto">
                                ¿Tienes dudas sobre un talle? ¿Quieres un diseño personalizado?
                                Escríbenos y te responderemos con gusto.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

                            {/* Formulario */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
                                    <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">Envíanos un mensaje</h2>

                                    {status && (
                                        <div className={`mb-6 p-4 rounded-lg text-sm font-medium flex items-center justify-center ${status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                                            {status.text}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-bold text-stone-600 mb-1">Nombre *</label>
                                            <input
                                                id="name" name="name"
                                                value={formData.name} onChange={handleChange}
                                                placeholder="Tu nombre"
                                                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all bg-stone-50 focus:bg-white"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-bold text-stone-600 mb-1">Email *</label>
                                                <input
                                                    id="email" name="email" type="email"
                                                    value={formData.email} onChange={handleChange}
                                                    placeholder="tu@email.com"
                                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all bg-stone-50 focus:bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-bold text-stone-600 mb-1">Teléfono</label>
                                                <input
                                                    id="phone" name="phone"
                                                    value={formData.phone} onChange={handleChange}
                                                    placeholder="Opcional"
                                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all bg-stone-50 focus:bg-white"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-bold text-stone-600 mb-1">Mensaje *</label>
                                            <textarea
                                                id="message" name="message"
                                                value={formData.message} onChange={handleChange}
                                                placeholder="Cuéntanos qué necesitas..."
                                                rows={5}
                                                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition-all bg-stone-50 focus:bg-white resize-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-yellow-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                        >
                                            <Send className="h-5 w-5" />
                                            Enviar a WhatsApp
                                        </button>
                                    </form>
                                </div>
                            </motion.div>

                            {/* Información de Contacto */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <div className="grid gap-6">
                                    {[
                                        { icon: MapPin, title: 'Taller / Showroom', lines: [CONTACT_INFO.ADDRESS || 'Barrio General Paz', (CONTACT_INFO.CITY || 'Córdoba') + ', Argentina'] },
                                        { icon: Phone, title: 'WhatsApp', lines: [CONTACT_INFO.PHONE || '+54 9 351 ...'], note: 'Consultas rápidas' },
                                        { icon: Mail, title: 'Email', lines: [CONTACT_INFO.EMAIL || 'hola@metitejidos.com'], note: 'Pedidos especiales' },
                                        { icon: Instagram, title: 'Instagram', lines: [CONTACT_INFO.INSTAGRAM || '@metitejidos'], link: CONTACT_INFO.INSTAGRAM_URL, note: 'Mira nuestros trabajos' },
                                        { icon: Clock, title: 'Horarios de Atención', lines: ['Lunes a Viernes: 9:00 - 18:00', 'Sábados: Con cita previa'] }
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-stone-100 flex items-start gap-4 group">
                                            <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center flex-shrink-0 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-stone-800 mb-1 font-serif">{item.title}</h3>
                                                {item.link ? (
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-yellow-600 font-medium transition-colors block">
                                                        {item.lines[0]}
                                                    </a>
                                                ) : (
                                                    item.lines.map((line, i) => <p key={i} className="text-stone-600 text-sm">{line}</p>)
                                                )}
                                                {item.note && <p className="text-xs text-stone-400 mt-1">{item.note}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Mapa (Opcional - Si no tienes dirección exacta, puedes quitar este bloque) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100"
                        >
                            <div className="h-[300px] w-full bg-stone-200 relative">
                                <iframe
                                    src={CONTACT_INFO.MAP_URL || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108977.01948332997!2d-64.2764326462796!3d-31.40277800720498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432985f478f5b69%3A0xb0a24f9a5366b092!2zQ8OzcmRvYmE!5e0!3m2!1ses-419!2sar!4v1709230000000!5m2!1ses-419!2sar"}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Mapa de ubicación"
                                    className="grayscale hover:grayscale-0 transition-all duration-700" // Efecto blanco y negro elegante
                                />
                            </div>
                        </motion.div>

                    </div>
                </section>
            </motion.div>
        </>
    );
};

export default Contact;