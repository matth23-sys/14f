(function() {
    const screen4 = document.getElementById('screen4');
    const letter = screen4.querySelector('.letter');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añadimos la clase para que la carta suba y aparezca
                letter.classList.add('reveal');
            }
        });
    }, { threshold: 0.5 });

    observer.observe(screen4);

    // Pequeño efecto extra: vibración suave al hacer click en el corazón
    const heartBtn = screen4.querySelector('.heartCta');
    if (heartBtn) {
        heartBtn.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(50);
        });
    }
})();