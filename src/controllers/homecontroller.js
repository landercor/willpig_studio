// controllers/homeController.js
import { supabaseAdmin as supabase } from "../config/db.js";

export const verBiblioteca = async (req, res) => {
    try {
        const { data: cuentos, error } = await supabase
            .from('cuentos')
            .select(`
        *,
        cuenta_usuario ( username, avatar_url )
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.render('biblioteca', {
            tituloPagina: 'Biblioteca | Willpig Studio',
            libros: cuentos || []
        });

    } catch (error) {
        console.error('Error cargando cuentos:', error);
        res.render('biblioteca', {
            tituloPagina: 'Biblioteca | Willpig Studio',
            libros: []
        });
    }
};

export const verPrincipal = async (req, res) => {
    try {
        // Fetch stories for the grid
        const { data: cuentos, error } = await supabase
            .from('cuentos')
            .select(`
                *,
<<<<<<< HEAD
                cuenta_usuario ( username, avatar_url )
            `)
            .order('created_at', { ascending: false }) // Se muestran los mas recientes
            .limit(10);

        if (error) throw error;

        // Dummy carousel data (fallback) within dynamic logic
        let carruselData = [
            { titulo: 'Bienvenido a Willpig', imagen: '/img/img.ico/fondo_register2.jpg', link: '#' },
            { titulo: 'Descubre nuevas historias', imagen: '/img/img.ico/fondo_login3.jpg', link: '/principal/biblioteca' }
        ];

        // 1. Prepare Carousel Data (Top 5 viewed stories)
        if (cuentos && cuentos.length > 0) {
            carruselData = cuentos.slice(0, 5).map(c => ({
                titulo: c.titulo,
                imagen: c.portada_url || '/img/default-bg.jpg',
                link: `/historias/${c.id_cuento}`
            }));
        }

        // If we have stories, maybe use them in carousel?
        if (cuentos && cuentos.length > 0) {
            // Optional: Add logic here to promote specific stories to carousel
=======
                cuenta_usuario ( username, avatar_url ),
                categorias ( nombre )
            `)
            .order('created_at', { ascending: false }) // Se muestran los mas recientes
            .limit(50); // Get more to group them

        if (error) throw error;

        // Obtener la Historia Destacada (con más vistas)
        const { data: cuentoDestacado } = await supabase
            .from('cuentos')
            .select(`*`)
            .order('vistas', { ascending: false })
            .limit(1)
            .maybeSingle();

        // Obtener Tendencias (Top 10 más vistos global)
        const { data: tendenciasData } = await supabase
            .from('cuentos')
            .select(`*, cuenta_usuario ( username, avatar_url )`)
            .order('vistas', { ascending: false })
            .limit(10);

        // Agrupar por categoría para las filas tipo Netflix
        const librosPorCategoria = {};
        if (cuentos) {
            cuentos.forEach(c => {
                const catName = c.categorias?.nombre || 'General';
                if (!librosPorCategoria[catName]) librosPorCategoria[catName] = [];
                librosPorCategoria[catName].push(c);
            });
        }

        // Los últimos 10 para la pestaña de "Nuevas Historias"
        const ultimosCuentos = cuentos ? cuentos.slice(0, 10) : [];


        // Configurar datos del Carrusel (Top 5 historias o fallback)
        let carruselData = [];
        if (cuentos && cuentos.length > 0) {
            // Filtrar cuentos que tengan alguna portada
            const cuentosConPortada = cuentos.filter(c => c.portada_url || c.portada);
            if (cuentosConPortada.length > 0) {
                carruselData = cuentosConPortada.slice(0, 5).map(c => ({
                    titulo: c.titulo,
                    imagen: c.portada_url || c.portada,
                    link: `/historias/${c.id_cuento}`
                }));
            }
        }

        // Fallback si no hay suficientes historias con imagen
        if (carruselData.length === 0) {
            carruselData = [
                { titulo: 'Bienvenido a Willpig', imagen: '/img/img.ico/fondo_register2.jpg', link: '#' },
                { titulo: 'Descubre nuevas historias', imagen: '/img/img.ico/fondo_login3.jpg', link: '/principal/biblioteca' }
            ];
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
        }

        res.render('principal', {
            tituloPagina: 'Inicio | Willpig Studio',
<<<<<<< HEAD
            libros: cuentos || [],

            loggerUser: req.session.user, // usuario logueado
            carrusel: carruselData
=======
            libros: ultimosCuentos,
            tendencias: tendenciasData || [],
            librosPorCategoria: librosPorCategoria,
            loggerUser: req.session.user, // usuario logueado
            carrusel: carruselData,
            historiaDestacada: cuentoDestacado || null
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
        });

    } catch (error) {
        console.error('Error cargando principal:', error);
        res.render('principal', {
            tituloPagina: 'Inicio | Willpig Studio',
            libros: [],
<<<<<<< HEAD
            carrusel: [],
=======
            tendencias: [],
            librosPorCategoria: {},
            carrusel: [],
            historiaDestacada: null,
            loggerUser: req.session.user
        });
    }
};

export const verBusqueda = async (req, res) => {
    const q = req.query.q || '';
    try {
        const { data: resultados, error } = await supabase
            .from('cuentos')
            .select(`
                *,
                cuenta_usuario ( username, avatar_url )
            `)
            .ilike('titulo', `%${q}%`)
            .order('created_at', { ascending: false });

        res.render('busqueda', {
            tituloPagina: `Resultados para: ${q} | Willpig Studio`,
            resultados: resultados || [],
            query: q,
            loggerUser: req.session.user
        });
    } catch (error) {
        console.error('Error en búsqueda:', error);
        res.render('busqueda', {
            tituloPagina: 'Búsqueda | Willpig Studio',
            resultados: [],
            query: q,
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
            loggerUser: req.session.user
        });
    }
};
