import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
// Cambié los iconos para que encajen con lo artesanal
import { Heart, Star, Leaf, Clock } from 'lucide-react';
import { IMAGES } from '../lib/constants';

const About = () => {
    const values = [
        {
            icon: Heart,
            title: 'Hecho a Mano',
            description: 'Cada prenda es tejida con dedicación, poniendo el corazón en cada punto.',
        },
        {
            icon: Leaf, // Nuevo icono para naturaleza
            title: 'Materiales Nobles',
            description: 'Seleccionamos lanas y algodones naturales que cuidan tu piel.',
        },
        {
            icon: Star, // Nuevo icono para exclusividad
            title: 'Diseños Únicos',
            description: 'Piezas exclusivas pensadas para perdurar en el tiempo.',
        },
        {
            icon: Clock,
            title: 'Slow Fashion',
            description: 'Respetamos los tiempos de producción para garantizar la máxima calidad.',
        },
    ];

    return (
        <>
            <Helmet>
                <title>Sobre Nosotros - Meti Tejidos</title>
                <meta name="description" content="Conoce la historia de Meti Tejidos. Pasión por lo artesanal, diseño sustentable y calidez en cada prenda." />
            </Helmet>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-stone-50 min-h-screen"
            >
                {/* HERO SECTION */}
                <section className="relative h-[400px] overflow-hidden">
                    <img
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Manos tejiendo con lana suave"
                        // Foto de lanas/tejido
                        src={IMAGES.ABOUT_HERO}
                        loading="lazy"
                    />
                    {/* Overlay oscuro para que se lea el texto */}
                    <div className="absolute inset-0 bg-stone-900/50" />

                    <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-white max-w-3xl"
                        >
                            <span className="uppercase tracking-widest text-sm font-bold text-yellow-400 mb-2 block">Nuestra Esencia</span>
                            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Tejiendo Historias</h1>
                            <p className="text-xl text-stone-200 font-light">
                                Calidez, diseño y tradición en cada prenda.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* HISTORIA */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">

                            {/* Texto Historia */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-4xl font-serif font-bold text-stone-800 mb-6">El Origen</h2>
                                <div className="space-y-6 text-stone-600 text-lg leading-relaxed">
                                    <p>
                                        Meti Tejidos nació de la pasión por crear cosas con las manos. Lo que comenzó como un pasatiempo,
                                        entre ovillos y agujas en la sala de estar, se transformó poco a poco en un proyecto de vida.
                                    </p>
                                    <p>
                                        Creemos en el valor de lo artesanal. En un mundo que va demasiado rápido, nosotros elegimos detenernos
                                        y disfrutar del proceso de creación. Cada bufanda, cada suéter y cada accesorio cuenta una historia diferente.
                                    </p>
                                    <p>
                                        Hoy, seguimos trabajando con la misma ilusión del primer día, buscando siempre las texturas más suaves
                                        y los colores que transmitan esa sensación de hogar que tanto nos gusta.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Imagen Historia */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="relative">
                                    {/* Marco decorativo */}
                                    <div className="absolute -inset-0 border-2 border-yellow-600/20 rounded-2xl transform bg-stone-700 overflow-hidden"></div>
                                    <img
                                        className="relative rounded-2xl shadow-xl w-full object-cover h-[500px] opacity-70"
                                        alt="Detalle de tejido artesanal"
                                        // Foto de detalle de prenda
                                        src={IMAGES.ABOUT_STORY}
                                        loading="lazy"
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* VALORES */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">Nuestros Valores</h2>
                            <p className="text-stone-500 text-lg max-w-2xl mx-auto">
                                Los pilares que sostienen cada una de nuestras creaciones.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                            {values.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center border border-stone-100"
                                >
                                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-700">
                                        <value.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">{value.title}</h3>
                                    <p className="text-stone-500 leading-relaxed">{value.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </motion.div>
        </>
    );
};

export default About;