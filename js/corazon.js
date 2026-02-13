(function() {
    const audio = document.getElementById('bgAudio');
    const playBtn = document.getElementById('audioPlayBtn');
    let isPlaying = false;

    // Función para vibrar el móvil (efecto latido)
    function heartVibration() {
        if (isPlaying && navigator.vibrate) {
            // Patrón de latido: vibrar, pausa corta, vibrar, pausa larga
            navigator.vibrate([100, 50, 100, 1000]);
        }
    }

    let vibrationInterval;

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (!isPlaying) {
                audio.play()
                    .then(() => {
                        isPlaying = true;
                        playBtn.innerHTML = '<span class="icon">⏸</span> Pausar música';
                        // Iniciar efecto de vibración sincronizado
                        vibrationInterval = setInterval(heartVibration, 1300);
                    })
                    .catch(err => {
                        console.log("Error al reproducir audio:", err);
                        alert("Por favor, asegúrate de que 'assets/audio/song.mp3' existe.");
                    });
            } else {
                audio.pause();
                isPlaying = false;
                playBtn.innerHTML = '<span class="icon">▶</span> Activar música';
                clearInterval(vibrationInterval);
            }
        });
    }

    // Detener música si el usuario sale de la pestaña (opcional)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isPlaying) {
            audio.pause();
        } else if (!document.hidden && isPlaying) {
            audio.play();
        }
    });
})();