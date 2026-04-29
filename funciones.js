// Base de datos de películas organizadas por categorías.
// Puedes agregar, modificar o eliminar películas aquí.
// Solo necesitas poner el título que quieras que aparezca y el link de YouTube.
const peliculasData = {
    "Inicio": [
        { title: "Van Damme, The Legend", url: "https://www.youtube.com/watch?v=6I_OjNEAoOk" },
        { title: "¿La Peor Película de Superhéroes Jamás Hecha?", url: "https://www.youtube.com/watch?v=8qDEZw9uOkY" },
        { title: "Distrito 13", url: "https://www.youtube.com/watch?v=aXHeBlO6MxQ" },
        { title: "Van Damme - Corazón de León", url: "https://www.youtube.com/watch?v=9d0f8JdLPZY" }
    ],
    "Terror": [
        { title: "La Llorona", url: "https://www.youtube.com/watch?v=nVcwrOLHNGQ&t=12s" },
        { title: "Jack en la Caja Maldita 3: El Ascenso", url: "https://www.youtube.com/watch?v=IU1JnOIKyQs" },
        { title: "La Posesión (2016)", url: "https://www.youtube.com/watch?v=xVeyZ5tFK44" }
    ],
    "Acción": [
        { title: "Hitman - El Rey de Asesinos", url: "https://www.youtube.com/watch?v=OZzZqSmYEvI" },
        { title: "Imparable", url: "https://www.youtube.com/watch?v=X7jNJM50IX8" },
        { title: "Apocalypto", url: "https://www.youtube.com/watch?v=tlIYTYFKv24" }
    ],
    "Suspenso": [
        { title: "El Ojo del Miedo", url: "https://www.youtube.com/watch?v=HHVqV3idWLg" },
        { title: "ACTIVIDAD PARANORMAL 1", url: "https://www.youtube.com/watch?v=bT8Ez3z0mrU&t=20s" },
        { title: "El Aro", url: "https://www.youtube.com/watch?v=8Mq46dwT9Ww&t=15s" }
    ],
    "Romance": [
        { title: "Un Paraiso Real", url: "https://www.youtube.com/watch?v=RJJ1OElsBUc" },
        { title: "Love Rosie", url: "https://www.youtube.com/watch?v=atpblJBS-W8" },
        { title: "Amor por Conveniencia", url: "https://www.youtube.com/watch?v=HJm8dqnb6hY" }
    ],
    "Comedia": [
        { title: "El Ultimo Cura del mundo", url: "https://www.youtube.com/watch?v=IKYg5Vz2DVk" },
        { title: "Los Colegas del Barrio", url: "https://www.youtube.com/watch?v=VluxfdNr3hk" },
        { title: "Super Rápidos y Mega Furiosos", url: "https://www.youtube.com/watch?v=e01NVCveGkg" },
        { title: "¿La Peor Película de Superhéroes Jamás Hecha?", url: "https://www.youtube.com/watch?v=8qDEZw9uOkY" }
    ]
};

// Función para extraer el ID del video de YouTube a partir de diferentes formatos de URL
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Función para generar la URL de la miniatura de YouTube en alta calidad
function getYouTubeThumbnail(videoID) {
    return `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;
}

// Renderizar una categoría específica dinámicamente en el DOM
function renderCategoria(categoriaBuscada) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Limpiar el contenedor antes de inyectar nuevo contenido

    // Buscar los datos de la categoría (ignorando mayúsculas/minúsculas y acentos)
    const categoriaKey = Object.keys(peliculasData).find(k =>
        k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
        categoriaBuscada.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );

    if (!categoriaKey) return;

    const peliculas = peliculasData[categoriaKey];

    // Crear sección para la categoría
    const section = document.createElement('section');
    section.className = 'category-section vertical-layout'; // Añadimos clase para el diseño vertical
    const sectionId = categoriaKey.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    section.id = sectionId;

    // Título de la categoría
    const title = document.createElement('h2');
    title.className = 'category-title';
    title.textContent = categoriaKey;
    section.appendChild(title);

    // Contenedor de las películas
    const container = document.createElement('div');
    container.className = 'movies-container-vertical'; // Nuevo contenedor vertical

    peliculas.forEach(pelicula => {
        const videoID = getYouTubeID(pelicula.url);
        // Fallback en caso de que la URL no sea de YouTube válida
        const thumbUrl = videoID ? getYouTubeThumbnail(videoID) : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=640&auto=format&fit=crop';

        // Crear la tarjeta de la película
        const card = document.createElement('div');
        card.className = 'movie-card vertical-card'; // Añadimos clase vertical
        // Guardamos el videoID en un atributo para usarlo al hacer clic
        if (videoID) {
            card.dataset.videoId = videoID;
        }

        // hqdefault.jpg actúa como imagen de respaldo si maxresdefault.jpg no existe
        const fallbackImage = videoID ? `https://img.youtube.com/vi/${videoID}/hqdefault.jpg` : thumbUrl;

        card.innerHTML = `
            <div class="thumbnail-container">
                <img src="${thumbUrl}" alt="${pelicula.title}" onerror="this.onerror=null;this.src='${fallbackImage}';">
                <div class="play-overlay">
                    <div class="play-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${pelicula.title}</h3>
            </div>
        `;
        
        // Añadir evento click para abrir el modal
        card.addEventListener('click', () => {
            if (videoID) {
                const modal = document.getElementById('video-modal');
                currentVideoId = videoID;
                
                // Si el reproductor ya está listo, cargamos el video
                if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
                    ytPlayer.loadVideoById(videoID);
                }
                
                modal.classList.add('show');
            } else {
                alert("Esta película no tiene un enlace de YouTube válido.");
            }
        });

        container.appendChild(card);
    });

    section.appendChild(container);
    mainContent.appendChild(section);
}

// Lógica para manejar los clics en el Navbar
function setupNavbar() {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Evitar el salto por defecto del ancla

            // Quitar clase active de todos y ponerla en el clickeado
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Obtener la categoría del href (ej: "#accion" -> "accion")
            const targetCategory = link.getAttribute('href').substring(1);

            // Renderizar solo esa categoría
            renderCategoria(targetCategory);

            // Hacer scroll suave hacia arriba
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Configurar el modal de video y sus controles
function setupModal() {
    const modal = document.getElementById('video-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const btnRewind = document.getElementById('btn-rewind');
    const btnForward = document.getElementById('btn-forward');

    // Función para cerrar el modal y detener el video
    const closeModal = () => {
        modal.classList.remove('show');
        if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
            ytPlayer.stopVideo();
        }
    };

    // Cerrar al hacer clic en la "X"
    closeModalBtn.addEventListener('click', closeModal);

    // Controles de tiempo
    btnRewind.addEventListener('click', () => {
        if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
            const currentTime = ytPlayer.getCurrentTime();
            ytPlayer.seekTo(currentTime - 10, true);
        }
    });

    btnForward.addEventListener('click', () => {
        if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
            const currentTime = ytPlayer.getCurrentTime();
            ytPlayer.seekTo(currentTime + 10, true);
        }
    });
}

// --- YouTube IFrame API ---
let ytPlayer;
let currentVideoId = null;

// Cargar la API de YouTube asincrónicamente
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
if (firstScriptTag) {
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
} else {
    document.head.appendChild(tag);
}

// Esta función es llamada automáticamente por la API de YouTube cuando está lista
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('video-iframe', {
        height: '100%',
        width: '100%',
        videoId: currentVideoId || '', // Cargar video si ya se hizo clic en uno
        playerVars: {
            'autoplay': 1,
            'rel': 0,
            'enablejsapi': 1,
            'modestbranding': 1,
            'fs': 1,
            'playsinline': 1
        }
    });
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
    setupModal();
    // Iniciar renderizando la primera categoría (Inicio) por defecto
    renderCategoria('inicio');
});
