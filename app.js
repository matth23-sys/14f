(() => {
  const screens = [...document.querySelectorAll(".screen")];
  let idx = 0;
  let locked = false;

  const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function vibrate(ms=20){
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  function show(i){
    idx = Math.max(0, Math.min(screens.length - 1, i));
    screens.forEach(s => s.classList.remove("is-active"));
    screens[idx].classList.add("is-active");

    // hooks por pantalla
    if(idx === 1) startTypewriter();
    if(idx === 2) ensureAudio();
  }

  function next(){
    if(locked) return;
    locked = true;
    show(idx + 1);
    vibrate(15);
    setTimeout(() => locked = false, 420);
  }

  function prev(){
    if(locked) return;
    locked = true;
    show(idx - 1);
    vibrate(10);
    setTimeout(() => locked = false, 420);
  }

  // Botones next
  document.addEventListener("click", (e) => {
    const n = e.target.closest("[data-next]");
    if(n) next();
  });

  // Scroll lock: avanzamos por wheel, no por scroll real
  let wheelT = 0;
  window.addEventListener("wheel", (e) => {
    e.preventDefault();
    const now = Date.now();
    if(now - wheelT < 650) return;
    wheelT = now;
    if(e.deltaY > 0) next();
    else prev();
  }, { passive:false });

  // Swipe móvil (vertical)
  let sy = 0, ey = 0;
  window.addEventListener("touchstart", (e) => { sy = e.touches[0].clientY; }, {passive:true});
  window.addEventListener("touchend", (e) => {
    ey = (e.changedTouches && e.changedTouches[0].clientY) || sy;
    const d = sy - ey;
    if(Math.abs(d) < 35) return;
    if(d > 0) next(); else prev();
  }, {passive:true});

  // Typewriter (P2)
  const twEl = document.getElementById("typewriter");
  const p2Carousel = document.getElementById("p2Carousel");
  const p2RevealBtn = document.getElementById("p2RevealBtn");

  let typed = false;
  const twText = "Tengo algo que decirte… y lo quiero decir bonito, como tú mereces.";

  function startTypewriter(){
    if(!twEl || typed || prefersReduce) {
      if(twEl && !typed && prefersReduce) twEl.textContent = twText;
      return;
    }
    typed = true;
    let i = 0;
    const tick = () => {
      twEl.textContent = twText.slice(0, i++);
      if(i <= twText.length) requestAnimationFrame(tick);
    };
    tick();
  }

  p2RevealBtn?.addEventListener("click", () => {
    p2Carousel?.classList.add("is-show");
    vibrate(18);
  });

  // Audio auto (P3)
  const audio = document.getElementById("bgAudio");
  const playBtn = document.getElementById("audioPlayBtn");

  async function ensureAudio(){
    if(!audio) return;
    try{
      // intentamos autoplay
      await audio.play();
      if(playBtn) playBtn.style.display = "none";
    }catch{
      if(playBtn) playBtn.style.display = "inline-flex";
    }
  }

  playBtn?.addEventListener("click", async () => {
    try{
      await audio.play();
      playBtn.style.display = "none";
      vibrate(22);
    }catch{}
  });

  // P5: botón NO troll
  const noBtn = document.getElementById("noBtn");
  const yesBtn = document.getElementById("yesBtn");
  const celebrate = document.getElementById("celebrate");

  let noCount = 0;
  function moveNo(){
    if(!noBtn) return;
    const card = noBtn.closest(".p5-card");
    const rect = card.getBoundingClientRect();

    const pad = 18;
    const x = Math.random() * (rect.width - noBtn.offsetWidth - pad*2) + pad;
    const y = Math.random() * (rect.height - noBtn.offsetHeight - pad*2) + pad;

    noBtn.style.position = "absolute";
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;

    noCount++;
    if(noCount >= 2) noBtn.textContent = "¿Estás segura?";
    if(noCount >= 4) noBtn.style.transform = "scale(.92)";
    if(noCount >= 6) noBtn.style.transform = "scale(.84)";
    vibrate(12);
  }

  noBtn?.addEventListener("mouseenter", moveNo);
  noBtn?.addEventListener("click", (e) => { e.preventDefault(); moveNo(); });

  yesBtn?.addEventListener("click", () => {
    celebrate?.classList.add("is-show");
    vibrate([25, 40, 25]);
  });

  // Init
  show(0);
})();
