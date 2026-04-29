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

// Generar un texto descriptivo genérico si no lo hay
function generarSinopsisGenerica(titulo) {
    return `"${titulo}" es una increíble película que te mantendrá al borde del asiento. Sumérgete en esta gran historia llena de emociones, perfecta para disfrutar en la mejor calidad en Pelis Sigma.`;
}

// --- FAVORITOS ---
function getFavoritos() {
    return JSON.parse(localStorage.getItem('favoritos')) || [];
}

function toggleFavorito(videoID, btnFav, event) {
    event.stopPropagation(); // Evitar que abra el modal
    let favs = getFavoritos();
    
    if (favs.includes(videoID)) {
        favs = favs.filter(id => id !== videoID);
        btnFav.classList.remove('active');
        
        // Si estamos viendo "Mi Lista", desaparecer la tarjeta con animación
        const tituloSeccion = document.querySelector('.category-title');
        if (tituloSeccion && tituloSeccion.textContent === 'Mi Lista') {
            const card = btnFav.closest('.movie-card');
            if (card) {
                card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
                card.style.opacity = "0";
                card.style.transform = "scale(0.8)";
                
                setTimeout(() => {
                    if (card.parentNode) card.parentNode.removeChild(card);
                    
                    // Si ya no quedan tarjetas, mostrar mensaje de vacío
                    const container = document.querySelector('.movies-container-vertical');
                    if (container && container.children.length === 0) {
                        container.innerHTML = '<p style="font-size:1.2rem; color:#aaa; margin-left:1.5rem;">No tienes películas en tu lista aún.</p>';
                    }
                }, 300);
            }
        }
    } else {
        favs.push(videoID);
        btnFav.classList.add('active');
    }
    localStorage.setItem('favoritos', JSON.stringify(favs));
}

// --- HERO BANNER ---
const heroPeliculas = [
    { title: "Imparable", tag: "Acción", desc: "Un tren fuera de control lleno de químicos tóxicos amenaza con destruir todo a su paso. Dos valientes ferroviarios intentarán detenerlo.", videoID: "X7jNJM50IX8" },
    { title: "Hitman - El Rey de Asesinos", tag: "Acción", desc: "Un asesino a sueldo genéticamente modificado se ve envuelto en una conspiración internacional en la que él es el objetivo principal.", videoID: "OZzZqSmYEvI" },
    { title: "La Llorona", tag: "Terror", desc: "Una antigua maldición cobra vida. Una aparición horripilante atormenta a una familia que deberá sobrevivir a su ira.", videoID: "nVcwrOLHNGQ" }
];
let heroInterval;

function renderHeroBanner(mainContent) {
    const bannerContainer = document.createElement('div');
    bannerContainer.className = 'hero-banner';
    
    let html = '';
    heroPeliculas.forEach((p, index) => {
        const thumb = getYouTubeThumbnail(p.videoID);
        html += `
            <div class="hero-slide ${index === 0 ? 'active' : ''}" id="hero-slide-${index}">
                <img src="${thumb}" class="hero-backdrop" alt="${p.title}">
                <div class="hero-gradient"></div>
                <div class="hero-info">
                    <span class="hero-tag">${p.tag}</span>
                    <h1 class="hero-title">${p.title}</h1>
                    <p class="hero-synopsis">${p.desc}</p>
                    <button class="btn-primary hero-play-btn" data-video="${p.videoID}" data-title="${p.title}" data-desc="${p.desc}" data-thumb="${thumb}">
                        <svg viewBox="0 0 24 24" class="play-icon-svg"><path d="M8 5v14l11-7z"/></svg>
                        Reproducir
                    </button>
                </div>
            </div>
        `;
    });

    html += '<div class="hero-indicators">';
    heroPeliculas.forEach((_, index) => {
        html += `<div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`;
    });
    html += '</div>';
    
    bannerContainer.innerHTML = html;
    mainContent.appendChild(bannerContainer);

    // Rotación automática
    let currentSlide = 0;
    const slides = bannerContainer.querySelectorAll('.hero-slide');
    const dots = bannerContainer.querySelectorAll('.dot');

    const showSlide = (index) => {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    };

    if (heroInterval) clearInterval(heroInterval);
    heroInterval = setInterval(() => {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }, 3500);

    // Clics en botones Play
    bannerContainer.querySelectorAll('.hero-play-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const videoID = btn.getAttribute('data-video');
            const detailsModal = document.getElementById('details-modal');
            document.getElementById('details-backdrop-img').src = btn.getAttribute('data-thumb');
            document.getElementById('details-title').textContent = btn.getAttribute('data-title');
            document.getElementById('details-synopsis').textContent = btn.getAttribute('data-desc');
            document.getElementById('details-year').textContent = new Date().getFullYear();
            
            const playBtn = document.getElementById('btn-play-movie');
            playBtn.dataset.videoId = videoID;
            detailsModal.classList.add('show');
        });
    });

    // Clics en puntos
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            clearInterval(heroInterval);
            showSlide(parseInt(e.target.getAttribute('data-index')));
            heroInterval = setInterval(() => {
                let next = (currentSlide + 1) % slides.length;
                showSlide(next);
            }, 3500);
        });
    });
}

// Renderizar una categoría o búsqueda dinámicamente en el DOM
function renderCategoria(categoriaBuscada, query = "") {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Limpiar el contenedor
    if (heroInterval) clearInterval(heroInterval);

    let peliculasA_mostrar = [];
    let tituloSeccion = "";

    if (query !== "") {
        tituloSeccion = `Resultados para "${query}"`;
        // Buscar en todas las categorías
        Object.values(peliculasData).forEach(catPelis => {
            catPelis.forEach(peli => {
                if (peli.title.toLowerCase().includes(query.toLowerCase())) {
                    if (!peliculasA_mostrar.find(p => p.url === peli.url)) {
                        peliculasA_mostrar.push(peli);
                    }
                }
            });
        });
    } else if (categoriaBuscada.toLowerCase() === 'milista') {
        tituloSeccion = "Mi Lista";
        const favs = getFavoritos();
        Object.values(peliculasData).forEach(catPelis => {
            catPelis.forEach(peli => {
                const vid = getYouTubeID(peli.url);
                if (vid && favs.includes(vid) && !peliculasA_mostrar.find(p => getYouTubeID(p.url) === vid)) {
                    peliculasA_mostrar.push(peli);
                }
            });
        });
    } else {
        // Buscar los datos de la categoría
        const categoriaKey = Object.keys(peliculasData).find(k =>
            k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
            categoriaBuscada.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        );
        if (!categoriaKey) return;
        peliculasA_mostrar = peliculasData[categoriaKey];
        tituloSeccion = categoriaKey;

        // Mostrar Hero Banner solo si es Inicio y no hay búsqueda
        if (categoriaKey.toLowerCase() === 'inicio') {
            renderHeroBanner(mainContent);
        }
    }

    // Crear sección
    const section = document.createElement('section');
    section.className = 'category-section vertical-layout';
    
    // Título de la categoría
    const title = document.createElement('h2');
    title.className = 'category-title';
    title.textContent = tituloSeccion;
    section.appendChild(title);

    // Contenedor de las películas
    const container = document.createElement('div');
    container.className = 'movies-container-vertical';

    if (peliculasA_mostrar.length === 0) {
        container.innerHTML = '<p style="font-size:1.2rem; color:#aaa; margin-left:1.5rem;">No se encontraron películas.</p>';
        section.appendChild(container);
        mainContent.appendChild(section);
        return;
    }

    // 1. Mostrar Skeletons
    for (let i = 0; i < peliculasA_mostrar.length; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.className = 'movie-card vertical-card skeleton-container';
        skeletonCard.innerHTML = `
            <div class="skeleton-img skeleton"></div>
            <div class="skeleton-text skeleton"></div>
        `;
        container.appendChild(skeletonCard);
    }
    
    section.appendChild(container);
    mainContent.appendChild(section);

    // 2. Reemplazar Skeletons por películas reales después de 600ms
    setTimeout(() => {
        container.innerHTML = ''; // Quitar skeletons

        const favs = getFavoritos();

        peliculasA_mostrar.forEach(pelicula => {
            const videoID = getYouTubeID(pelicula.url);
            const thumbUrl = videoID ? getYouTubeThumbnail(videoID) : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=640&auto=format&fit=crop';
            
            const card = document.createElement('div');
            card.className = 'movie-card vertical-card';
            if (videoID) card.dataset.videoId = videoID;

            const fallbackImage = videoID ? `https://img.youtube.com/vi/${videoID}/hqdefault.jpg` : thumbUrl;
            const isFav = videoID && favs.includes(videoID);

            card.innerHTML = `
                <div class="thumbnail-container">
                    <img src="${thumbUrl}" alt="${pelicula.title}" onerror="this.onerror=null;this.src='${fallbackImage}';">
                    <button class="btn-fav ${isFav ? 'active' : ''}" data-video="${videoID || ''}" title="Añadir a Mi Lista">
                        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
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
            
            // Botón Favorito
            const btnFav = card.querySelector('.btn-fav');
            btnFav.addEventListener('click', (e) => toggleFavorito(videoID, btnFav, e));
            
            // Evento click para abrir el MODAL DE DETALLES
            card.addEventListener('click', () => {
                if (videoID) {
                    const detailsModal = document.getElementById('details-modal');
                    
                    // Llenar datos
                    document.getElementById('details-backdrop-img').src = thumbUrl;
                    document.getElementById('details-title').textContent = pelicula.title;
                    document.getElementById('details-synopsis').textContent = pelicula.description || generarSinopsisGenerica(pelicula.title);
                    document.getElementById('details-year').textContent = pelicula.year || new Date().getFullYear();
                    
                    // Pasar el videoID al botón de reproducir
                    const playBtn = document.getElementById('btn-play-movie');
                    playBtn.dataset.videoId = videoID;
                    
                    detailsModal.classList.add('show');
                } else {
                    alert("Esta película no tiene un enlace de YouTube válido.");
                }
            });

            container.appendChild(card);
        });
    }, 600); // 600ms de animación de carga
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

    // Buscador
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                navLinks.forEach(l => l.classList.remove('active'));
                renderCategoria("", query);
            } else {
                const inicioLink = document.querySelector('.nav-links a[href="#inicio"]');
                if (inicioLink) inicioLink.click();
            }
        });
    }
}

// Configurar el modal de video y sus controles
function setupModal() {
    // --- Modal de Detalles ---
    const detailsModal = document.getElementById('details-modal');
    const closeDetailsBtn = document.getElementById('close-details-modal');
    const btnPlayMovie = document.getElementById('btn-play-movie');
    const btnCloseDetails = document.getElementById('btn-close-details');

    const closeDetails = () => {
        detailsModal.classList.remove('show');
    };

    closeDetailsBtn.addEventListener('click', closeDetails);
    btnCloseDetails.addEventListener('click', closeDetails);

    btnPlayMovie.addEventListener('click', () => {
        const videoID = btnPlayMovie.dataset.videoId;
        if (videoID) {
            // Ocultar detalles y mostrar video
            detailsModal.classList.remove('show');
            
            const videoModal = document.getElementById('video-modal');
            currentVideoId = videoID;
            
            // Si el reproductor ya está listo, cargamos el video
            if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
                ytPlayer.loadVideoById(videoID);
            }
            
            videoModal.classList.add('show');
        }
    });

    // --- Modal de Video ---
    const videoModal = document.getElementById('video-modal');
    const closeVideoBtn = document.getElementById('close-modal');
    const btnRewind = document.getElementById('btn-rewind');
    const btnForward = document.getElementById('btn-forward');

    // Función para cerrar el modal de video y detenerlo
    const closeVideoModal = () => {
        videoModal.classList.remove('show');
        if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
            ytPlayer.stopVideo();
        }
    };

    closeVideoBtn.addEventListener('click', closeVideoModal);

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
