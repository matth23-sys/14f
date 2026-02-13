// js/carrusel.js
(function() {
    const container = document.getElementById('valentine-carousel');
    if (!container) return;

    // ---- TUS FOTOS (con nombres exactos y extensiones .jpg) ----
    const items = [
        { 
            title: "Juntos", 
            desc: "Tu sonrisa ilumina mis días, tu mirada me llena de paz. Cada momento a tu lado es un tesoro.", 
            src: "assets/img/Fotojuntos.jpg" 
        },
        { 
            title: "Cómplices", 
            desc: "A tu lado todo es mejor. Caminar juntos, reír sin motivo, soñar despiertos... Eres mi mejor compañía.", 
            src: "assets/img/fotojuntos2.jpg" 
        },
        { 
            title: "Magia", 
            desc: "Hay magia en cada instante que compartimos. Como si el universo conspirara para que nuestras almas se encuentren.", 
            src: "assets/img/fotojuntos3.jpg" 
        },
        { 
            title: "Felicidad", 
            desc: "La felicidad no es un destino, es el camino que recorro a tu lado. Gracias por hacer mi vida más bonita.", 
            src: "assets/img/fotojuntos4.jpg" 
        },
        { 
            title: "Amor", 
            desc: "El amor no se busca, se encuentra. Y yo te encontré a ti, sin esperarlo, sin pedirlo, y ahora no concibo mi vida sin ti.", 
            src: "assets/img/fotojuntos5.jpg" 
        },
        { 
            title: "Siempre juntos", 
            desc: "Nuestras manos entrelazadas, prometiendo sin palabras que pase lo que pase, estaremos juntos. Por siempre.", 
            src: "assets/img/manos_juntas.jpg" 
        }
    ];

    // Elementos del DOM
    const stage = container.querySelector('[data-stage]');
    const world = container.querySelector('[data-world]');
    const cloud = container.querySelector('[data-cloud]');
    const titleEl = container.querySelector('[data-title]');
    const descEl = container.querySelector('[data-desc]');
    const featImg = container.querySelector('[data-feature-img]');
    const btnOpen = container.querySelector('[data-open]');
    const btnNext = container.querySelector('[data-next-photo]');
    const lb = container.querySelector('[data-lb]');
    const lbImg = container.querySelector('[data-lb-img]');
    const lbTitle = container.querySelector('[data-lb-title]');
    const lbClose = container.querySelector('[data-lb-close]');
    const lbLoader = container.querySelector('[data-lb-loader]');

    let rotX = -12, rotY = 18;
    let autoRotate = true;
    let raf = null;
    let dragging = false, capturing = false;
    let pointerId = null, startX = 0, startY = 0, startRotX = 0, startRotY = 0, moved = 0;
    let R = 300;
    let points = [];
    let activeIndex = 0;

    // Lightbox
    function openLightbox(item) {
        lb.setAttribute('data-open', 'true');
        lbTitle.textContent = item.title;
        lbImg.setAttribute('data-ready', 'false');
        lbImg.src = '';
        lbLoader.style.display = 'block';
        const img = new Image();
        img.onload = () => {
            lbImg.src = item.src;
            lbImg.setAttribute('data-ready', 'true');
            lbLoader.style.display = 'none';
        };
        img.src = item.src;
    }

    function closeLightbox() {
        lb.setAttribute('data-open', 'false');
        lbImg.src = '';
    }

    lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.getAttribute('data-open') === 'true') closeLightbox(); });

    // Cambiar foto destacada
    function setFeatured(index) {
        activeIndex = index;
        const it = items[index];
        titleEl.textContent = it.title;
        descEl.textContent = it.desc;
        featImg.src = it.src;
        featImg.alt = it.title;

        cloud.querySelectorAll('.tile').forEach((t, i) => {
            t.setAttribute('data-active', i === activeIndex ? 'true' : 'false');
        });
    }

    btnOpen.addEventListener('click', () => openLightbox(items[activeIndex]));
    btnNext.addEventListener('click', () => {
        const next = (activeIndex + 1) % items.length;
        setFeatured(next);
    });

    // Construir esfera de imágenes
    function buildSphere() {
        cloud.innerHTML = '';
        points = [];
        const n = items.length;
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));

        for (let i = 0; i < n; i++) {
            const y = 1 - (i / (n - 1)) * 2;
            const r = Math.sqrt(1 - y * y);
            const theta = goldenAngle * i;
            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;
            points.push({ x, y, z });

            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.setAttribute('data-active', 'false');
            tile.setAttribute('role', 'button');
            tile.setAttribute('tabindex', '0');

            const card = document.createElement('div');
            card.className = 'card';
            const img = document.createElement('img');
            img.src = items[i].src;
            img.alt = items[i].title;
            card.appendChild(img);
            tile.appendChild(card);
            cloud.appendChild(tile);

            tile.addEventListener('click', (e) => {
                e.stopPropagation();
                setFeatured(i);
                openLightbox(items[i]);
            });
            tile.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setFeatured(i);
                    openLightbox(items[i]);
                }
            });
        }
        setFeatured(0);
    }

    // Funciones de rotación y animación (igual que antes)
    function toRad(deg) { return (deg * Math.PI) / 180; }

    function rotateVec(v, ax, ay) {
        const x1 = v.x;
        const y1 = v.y * Math.cos(ax) - v.z * Math.sin(ax);
        const z1 = v.y * Math.sin(ax) + v.z * Math.cos(ax);
        const x2 = x1 * Math.cos(ay) + z1 * Math.sin(ay);
        const y2 = y1;
        const z2 = -x1 * Math.sin(ay) + z1 * Math.cos(ay);
        return { x: x2, y: y2, z: z2 };
    }

    function computeRadius() {
        const rect = world.getBoundingClientRect();
        const minSide = Math.min(rect.width, rect.height);
        const firstCard = cloud.querySelector('.card');
        const tileH = firstCard ? firstCard.getBoundingClientRect().height : 196;
        const safe = rect.width < 520 ? 14 : 24;
        R = Math.max(140, Math.min(320, (minSide / 2) - (tileH / 2) - safe));
    }

    function updateSphere() {
        const ax = toRad(rotX);
        const ay = toRad(rotY);
        const tiles = cloud.querySelectorAll('.tile');

        tiles.forEach((tile, i) => {
            const p = points[i];
            const pr = rotateVec(p, ax, ay);
            const tx = pr.x * R;
            const ty = pr.y * R;
            const tz = pr.z * R;
            tile.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px)`;

            const zn = (tz + R) / (2 * R);
            const scale = 0.84 + zn * 0.24;
            const opacity = 0.78 + zn * 0.22;
            const zIndex = Math.round(zn * 1000);
            tile.style.zIndex = zIndex;
            tile.style.opacity = opacity;

            const card = tile.querySelector('.card');
            card.style.transform = `translate(-50%, -50%) scale(${scale})`;

            const img = card.querySelector('img');
            const isActive = tile.getAttribute('data-active') === 'true';
            if (!isActive) {
                img.style.filter = `grayscale(${0.9 - zn * 0.45}) brightness(${0.92 + zn * 0.18}) contrast(${0.92 + zn * 0.18})`;
            } else {
                img.style.filter = 'grayscale(0) contrast(1.1) brightness(1.1)';
            }
        });
    }

    function tick() {
        if (autoRotate && !dragging) {
            rotY += 0.12;
            updateSphere();
        }
        raf = requestAnimationFrame(tick);
    }

    function stopAuto() { autoRotate = false; }
    function startAuto() { autoRotate = true; }

    // Eventos de arrastre
    stage.addEventListener('mouseenter', stopAuto);
    stage.addEventListener('mouseleave', startAuto);

    stage.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.tile, .lbShell')) return;
        dragging = true;
        capturing = false;
        pointerId = e.pointerId;
        moved = 0;
        startX = e.clientX;
        startY = e.clientY;
        startRotX = rotX;
        startRotY = rotY;
    });

    stage.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
        if (!capturing && moved > 8) {
            capturing = true;
            stage.setPointerCapture(pointerId);
            stopAuto();
        }
        if (!capturing) return;
        rotY = startRotY + dx * 0.18;
        rotX = startRotX - dy * 0.10;
        rotX = Math.max(-28, Math.min(14, rotX));
        updateSphere();
    });

    stage.addEventListener('pointerup', () => {
        dragging = false; capturing = false; pointerId = null; startAuto();
    });
    stage.addEventListener('pointercancel', () => {
        dragging = false; capturing = false; pointerId = null; startAuto();
    });

    window.addEventListener('resize', () => {
        computeRadius();
        updateSphere();
    });

    // Inicializar
    buildSphere();
    requestAnimationFrame(() => {
        computeRadius();
        updateSphere();
    });
    raf = requestAnimationFrame(tick);
})();