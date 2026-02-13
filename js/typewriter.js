(function() {
    const typewriterEl = document.getElementById('typewriter-text');
    const typewriterText = "Cada momento a tu lado es único. Gracias por tantas sonrisas y por ser parte de mi universo.";
    let hasStarted = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasStarted) {
                hasStarted = true;
                startTyping();
            }
        });
    }, { threshold: 0.6 });

    observer.observe(document.getElementById('screen2'));

    function startTyping() {
        let i = 0;
        const speed = 70; // milisegundos por letra

        function type() {
            if (i < typewriterText.length) {
                typewriterEl.textContent += typewriterText.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Lógica del botón "Mira aquí" (Show Carousel)
    const showBtn = document.getElementById('show-carousel');
    if (showBtn) {
        showBtn.addEventListener('click', () => {
            const carouselScreen = document.getElementById('valentine-carousel');
            if (carouselScreen) {
                carouselScreen.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
})();