(function() {
    const btnNo = document.getElementById('btn-no');
    const btnSi = document.getElementById('btn-si');
    let siScale = 1;
    let noScale = 1;

    // Lógica para que el botón "NO" se escape
    btnNo.addEventListener('mouseover', moveButton);
    btnNo.addEventListener('click', moveButton);

    function moveButton() {
        // Reducir tamaño del No
        noScale -= 0.1;
        if (noScale < 0.3) noScale = 0.3; // Límite de pequeñez
        btnNo.style.transform = `scale(${noScale})`;

        // Aumentar tamaño del Sí
        siScale += 0.15;
        btnSi.style.transform = `scale(${siScale})`;

        // Mover a posición aleatoria
        const x = Math.random() * (window.innerWidth - btnNo.offsetWidth);
        const y = Math.random() * (window.innerHeight - btnNo.offsetHeight);
        
        btnNo.style.position = 'fixed';
        btnNo.style.left = x + 'px';
        btnNo.style.top = y + 'px';
    }

    // Lógica al hacer click en "SÍ"
    btnSi.addEventListener('click', () => {
        btnNo.style.display = 'none';
        
        // Celebración de corazones
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // Confeti de corazones
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#ff4d6d', '#ff758f', '#ffb3c1']
            }));
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#ff4d6d', '#ff758f', '#ffb3c1']
            }));
        }, 250);

        // Pasar a la pantalla del Ticket tras 3 segundos de celebración
        setTimeout(() => {
            document.getElementById('screen6').scrollIntoView({ behavior: 'smooth' });
        }, 3000);
    });
})();