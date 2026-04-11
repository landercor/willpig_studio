# Objetivo: Refactorizar Estilos Inline

El usuario ha solicitado analizar todas las vistas ([.ejs](file:///c:/Users/Napday/Desktop/willpig_studio/src/views/404.ejs)) y mover los estilos CSS que estén incrustados (inline style) a su archivo correspondiente ([style1.2.css](file:///c:/Users/Napday/Desktop/willpig_studio/public/css/style1.2.css)). También ha preguntado si es una buena práctica tener CSS dentro de archivos HTML.

## Plan de Implementación

### Análisis de la Práctica de Estilos en HTML (Respuesta al usuario)
Es una **mala práctica** mantener CSS inline (por ejemplo, `<div style="color: red;">`) en archivos HTML o EJS en proyectos a largo plazo por varias razones:
1. **Mantenibilidad:** Si quieres cambiar un color o un margen que se repite en muchas partes, tendrías que buscar y reemplazar en cada elemento HTML (es propenso a errores y muy laborioso).
2. **Reutilización:** Las clases de CSS (ej., `.text-red`) te permiten reciclar estilos en múltiples componentes sin repetir el mismo bloque de código CSS.
3. **Caché del navegador:** Los navegadores descargan el archivo [.css](file:///c:/Users/Napday/Desktop/willpig_studio/public/css/style1.2.css) externo una sola vez y lo almacenan en caché. Sin embargo, el CSS inline obliga al navegador a descargar el código cada vez que se carga la página HTML, lo que hace que la carga sea un poco más lenta y el archivo de respuesta mucho más pesado.
4. **Especificidad:** Los estilos inline tienen la jerarquía más alta en CSS. Esto hace que sea extremadamente difícil sobrescribirlos después haciendo uso de clases u hojas de estilos si necesitas variar el diseño.

**Cuándo es aceptable:** 
A veces es útil para estilos dinámicos calculados en tiempo de ejecución por JavaScript (por ejemplo, ancho de una barra de progreso progresiva: `style="width: ${progress}%;"`) o para correcciones visuales rápidas mientras desarrollas, pero siempre deben transferirse al archivo CSS antes de enviar a producción.

### Tareas de Refactorización

Reemplazaré los estilos inline con nombres de clases descriptivos en las siguientes vistas y añadiré ese CSS a [style1.2.css](file:///c:/Users/Napday/Desktop/willpig_studio/public/css/style1.2.css).

#### [MODIFY] src/views/principal.ejs
- **`style="margin-bottom: 3rem;"`** en `.featured-story` -> `.mb-3` o añadir el margen directamente a la clase.
- **`style="padding-left: 1rem; border-left: 4px solid var(--primary-color); font-size: 1.2rem;"`** en encabezados `h3` -> `.category-title`.
- **Botones `.scroll-btn` (left/right)** con `style="position: absolute;..."` -> Clases separadas en CSS.
- **`.library-item`** con estilo de flexbox forzado -> Nueva clase `.carousel-item`.
- **Botones genéricos y estados vacíos `.empty-state`** -> Mover estilos al CSS.

#### [MODIFY] src/views/profile.ejs
- Estilos inline como `style="margin-top: 1rem;"` y texto gris en mensajes de listas/obras vacías.

#### [MODIFY] src/views/busqueda.ejs
- Estilos top-level en `.library-page`, fuentes en `h1` y p, estilos de botón de "Volver al inicio" y mensajes de `.empty-state`.

#### [MODIFY] src/views/404.ejs
- Replicar limpieza que en [busqueda.ejs](file:///c:/Users/Napday/Desktop/willpig_studio/src/views/busqueda.ejs), moviendo tamaños de fuentes directos (6rem) y padding de layout a css.

#### [MODIFY] src/views/profile-views.ejs
- **Excepción Parcial:** Las imágenes de fondo tipo `style="background-image: url('<%= w.cover %>')"` se mantendrán inline porque dependen directamente del valor dinámico o datos de la base de datos de esa iteración en específico, que es exactamente un caso de uso válido para CSS inline.

#### [MODIFY] public/css/style1.2.css
- Crear una sección de propiedades utilitarias (e.g. `.text-center`, `.mt-1`, `.mb-2`, `.text-muted`) o especificar mediante selectores en los componentes respectivos para abarcar lo limpiado de los archivos [.ejs](file:///c:/Users/Napday/Desktop/willpig_studio/src/views/404.ejs).

## Plan de Verificación

Manual Verification
1. Ingresar en el navegador usando la ruta principal `/` para ver [principal.ejs](file:///c:/Users/Napday/Desktop/willpig_studio/src/views/principal.ejs) y comprobar que el carrusel y estilos no se hayan roto.
2. Ingresar a `/usuario/perfil` logeado para observar [profile.ejs](file:///c:/Users/Napday/Desktop/willpig_studio/src/views/profile.ejs).
3. Hacer una búsqueda vacía o que no genere resultados en `/buscar` para ver visualmente el [busqueda.ejs](file:///c:/Users/Napday/Desktop/willpig_studio/src/views/busqueda.ejs) y que los mensajes de estado vacío se vean igual que antes.
4. Ir a una ruta que no exista por ejemplo `/ruta-que-no-existe-xyz123` para ver [404.ejs](file:///c:/Users/Napday/Desktop/willpig_studio/src/views/404.ejs) con sus estilos correctos.
