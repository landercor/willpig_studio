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
        }

        res.render('principal', {
            tituloPagina: 'Inicio | Willpig Studio',
            libros: cuentos || [],

            loggerUser: req.session.user, // usuario logueado
            carrusel: carruselData
        });

    } catch (error) {
        console.error('Error cargando principal:', error);
        res.render('principal', {
            tituloPagina: 'Inicio | Willpig Studio',
            libros: [],
            carrusel: [],
            loggerUser: req.session.user
        });
    }
};
