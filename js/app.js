/**
 * APP.JS - Controlador Global de Navegación
 * Maneja el cambio de pantallas, scroll, swipe y sonidos.
 */

(() => {
    const screens = [...document.querySelectorAll(".screen")];
    let idx = 0;
    let locked = false;

    // Detectar si el usuario prefiere reducir animaciones
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function vibrate(ms = 20) {
        if (navigator.vibrate) navigator.vibrate(ms);
    }

    /**
     * Función principal para cambiar de pantalla
     * @param {number} i - Índice de la pantalla 
     */
    function show(i) {
        // Asegurar que el índice esté dentro del rango
        const newIdx = Math.max(0, Math.min(screens.length - 1, i));
        if (newIdx === idx && i !== 0) return; // Evitar disparos repetidos en la misma pantalla

        idx = newIdx;

        // Navegación fluida por scroll
        screens[idx].scrollIntoView({
            behavior: prefersReduce ? "auto" : "smooth",
            block: "start"
        });

        // Actualizar clase activa para animaciones CSS
        screens.forEach((s, index) => {
            s.classList.toggle("active", index === idx);
        });

        vibrate(15);
        console.log(`Cambiado a pantalla: ${idx + 1}`);
    }

    // --- MANEJO DE EVENTOS ---

    // 1. Clics en botones [data-next]
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-next]");
        if (btn) {
            const targetScreen = parseInt(btn.getAttribute("data-next")) - 1;
            show(targetScreen);
        }
    });

    // 2. Control de Rueda de Mouse (Wheel)
    let wheelTimer;
    window.addEventListener("wheel", (e) => {
        // Prevenir scroll natural para usar nuestra lógica
        if (locked) return;
        
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => {
            if (e.deltaY > 50) { // Scroll abajo
                show(idx + 1);
            } else if (e.deltaY < -50) { // Scroll arriba
                show(idx - 1);
            }
        }, 100); // Debounce para evitar saltos bruscos
    }, { passive: false });

    // 3. Swipe Móvil (Vertical)
    let touchStartY = 0;
    let touchEndY = 0;

    window.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
        touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 70) { // Umbral de swipe
            if (diff > 0) {
                show(idx + 1); // Swipe arriba -> Siguiente
            } else {
                show(idx - 1); // Swipe abajo -> Anterior
            }
        }
    }, { passive: true });

    // 4. Botón especial "Ver recuerdos" de la Pantalla 2
    const showCarouselBtn = document.getElementById('show-carousel');
    if (showCarouselBtn) {
        showCarouselBtn.addEventListener('click', () => {
            show(0); // Regresa a la Pantalla 1 (Carrusel)
        });
    }

    // Inicializar en la primera pantalla
    // Un pequeño delay ayuda a que el navegador procese los estilos antes del scroll
    setTimeout(() => show(0), 100);

})();