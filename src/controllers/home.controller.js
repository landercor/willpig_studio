// controllers/homeController.js
import { supabaseAdmin as supabase } from "../config/db.js";
import { historiaService } from '../services/historia.service.js';

export const verBiblioteca = async (req, res) => {
    try {
        const { data: historias, error } = await supabase
            .from('cuentos')
            .select(`
        *,
        cuenta_usuario ( id_cuenta_usuario, username, avatar_url )
      `)
            .eq('estado', 'publicado') // Agrega un filtro para que los libro publicados se muestren
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.render('biblioteca', {
            tituloPagina: 'Biblioteca | Willpig Studio',
            historias: historias || [],
            loggerUser: req.session.user
        });

    } catch (error) {
        console.error('Error cargando cuentos:', error);
        res.render('biblioteca', {
            tituloPagina: 'Biblioteca | Willpig Studio',
            historias: [],
            loggerUser: req.session.user
        });
    }
};

export const verPrincipal = async (req, res) => {
    try {
        // Fetch stories for the grid
        const { data: historias, error } = await supabase
            .from('cuentos')
            .select(`
                *,
                cuenta_usuario ( id_cuenta_usuario, username, avatar_url ),
                categorias ( nombre )
            `)
            .eq('estado', 'publicado') // Agrega un filtro para que los libro publicados nunca se muestren la pantalla principal siendo un borrador  
            .order('created_at', { ascending: false })
            .limit(40);

        if (error) throw error;

        // Obtener la Historia Destacada (con más vistas)
        const { data: cuentoDestacado } = await supabase
            .from('cuentos')
            .select(`*`)
            .eq('estado', 'publicado')
            .order('vistas', { ascending: false })
            .limit(1)
            .maybeSingle();

        // Obtener Tendencias (Top 10 más vistos global)
        const { data: tendenciasData } = await supabase
            .from('cuentos')
            .select(`*, cuenta_usuario ( id_cuenta_usuario, username, avatar_url )`)
            .eq('estado', 'publicado')
            .order('vistas', { ascending: false })
            .limit(10);

        // Agrupar por categoría para las filas tipo Netflix
        const historiasPorCategoria = {};
        if (historias) {
            historias.forEach(c => {
                const catName = c.categorias?.nombre || 'General';
                if (!historiasPorCategoria[catName]) historiasPorCategoria[catName] = [];
                historiasPorCategoria[catName].push(c);
            });
        }

        // Los últimos 10 para la pestaña de "Nuevas Historias"
        const ultimasHistorias = historias ? historias.slice(0, 10) : [];


        // Configurar datos del Carrusel (Top 5 historias o fallback)
        let carruselData = [];
        if (historias && historias.length > 0) {
            // Filtrar cuentos que tengan alguna portada
            const cuentosConPortada = historias.filter(c => c.portada_url);
            if (cuentosConPortada.length > 0) {
                carruselData = cuentosConPortada.slice(0, 5).map(c => ({
                    titulo: c.titulo,
                    imagen: c.portada_url,
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
        }

        res.render('principal', {
            tituloPagina: 'Inicio | Willpig Studio',
            historias: ultimasHistorias,
            tendencias: tendenciasData || [],
            historiasPorCategoria: historiasPorCategoria,
            loggerUser: req.session.user, // usuario logueado
            carrusel: carruselData,
            historiaDestacada: cuentoDestacado || null
        });

    } catch (error) {
        console.error('Error cargando principal:', error);
        res.render('principal', {
            tituloPagina: 'Inicio | Willpig Studio',
            historias: [],
            tendencias: [],
            historiasPorCategoria: {},
            carrusel: [],
            historiaDestacada: null,
            loggerUser: req.session.user
        });
    }
};

export const verBusqueda = async (req, res) => {
    const q = req.query.q || '';
    const autor = req.query.autor || '';
    const categoria_id = req.query.categoria_id || '';
    const audiencia = req.query.audiencia || '';
    const sort = req.query.sort || 'fecha';
    const page = parseInt(req.query.page) || 1;

    try {
        const result = await historiaService.searchHistorias(q, page, 20, { autor, categoria_id, audiencia, sort });

        res.render('busqueda', {
            tituloPagina: `Resultados de búsqueda | Willpig Studio`,
            resultados: result.resultados || [],
            query: req.query,
            page,
            totalPages: result.totalPages,
            loggerUser: req.session.user
        });
    } catch (error) {
        console.error('Error en búsqueda:', error);
        res.render('busqueda', {
            tituloPagina: 'Búsqueda | Willpig Studio',
            resultados: [],
            query: req.query,
            page: 1,
            totalPages: 0,
            loggerUser: req.session.user
        });
    }
};

export const verCategoria = async (req, res) => {
    const nombreCategoriaInput = req.params.nombre || '';
    try {
        // 1. Obtener todas las categorías para buscar coincidencia normalizada (sin acentos, minúsculas)
        const { data: categoriasData, error: catError } = await supabase
            .from('categorias')
            .select('*');

        if (catError) throw catError;

        const normalizeStr = (str) => 
            str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const targetNorm = normalizeStr(nombreCategoriaInput);
        
        // Filtrar categorías cuyo nombre normalizado coincida
        const matchingCats = (categoriasData || []).filter(c => normalizeStr(c.nombre) === targetNorm);

        if (matchingCats.length === 0) {
            return res.status(404).render('404', { 
                message: `Categoría "${nombreCategoriaInput}" no encontrada.`,
                loggerUser: req.session.user 
            });
        }

        // Obtener ids de las categorías coincidentes (para juntar duplicados como Fantasía/Fantasia)
        const catIds = matchingCats.map(c => c.id_categoria);
        const nombreDisplay = matchingCats[0].nombre;

        // 2. Traer todos los cuentos de estas categorías
        const { data: historias, error: storiesError } = await supabase
            .from('cuentos')
            .select(`
                *,
                cuenta_usuario ( id_cuenta_usuario, username, avatar_url ),
                categorias ( nombre )
            `)
            .in('categoria_id', catIds)
            .eq('estado', 'publicado')
            .eq('visibilidad', 'publica')
            .order('created_at', { ascending: false });

        if (storiesError) throw storiesError;

        res.render('categoria', {
            tituloPagina: `${nombreDisplay} | Willpig Studio`,
            categoriaNombre: nombreDisplay,
            historias: historias || [],
            loggerUser: req.session.user
        });

    } catch (error) {
        console.error('Error al ver categoría:', error);
        res.status(500).render('404', {
            message: 'Ocurrió un error al cargar la categoría.',
            loggerUser: req.session.user
        });
    }
};

