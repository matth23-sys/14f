(function(){

  const track = document.getElementById("rcTrack");
  if(!track) return;

  const imgs = track.querySelectorAll(".rc-img");
  if(!imgs.length) return;

  const total = imgs.length;
  const step = 360 / total;

  let angle = 0;
  let speed = 0.08;
  let spinning = true;
  let frameId = null;

  const mqMobile = window.matchMedia("(max-width:640px)");

  function getZ(){
    return mqMobile.matches ? 260 : 340;
  }

  function update(){
    const z = getZ();

    imgs.forEach((img,i)=>{
      const rot = step * i + angle;
      img.style.transform =
        `translate(-50%,-50%) rotateY(${rot}deg) translateZ(${z}px)`;
    });
  }

  function animate(){
    if(!spinning){
      frameId = null;
      return;
    }

    angle += speed;
    update();
    frameId = requestAnimationFrame(animate);
  }

  update();
  frameId = requestAnimationFrame(animate);

  /* =========================
     DRAG / TOUCH ROTATION
  ========================= */

  let isDown = false;
  let lastX = 0;

  function start(x){
    isDown = true;
    lastX = x;
    spinning = false;
  }

  function move(x){
    if(!isDown) return;
    const delta = x - lastX;
    angle += delta * 0.3;
    update();
    lastX = x;
  }

  function end(){
    isDown = false;
    spinning = true;
    if(frameId === null){
      frameId = requestAnimationFrame(animate);
    }
  }

  // mouse
  window.addEventListener("mousedown",e=>start(e.clientX));
  window.addEventListener("mousemove",e=>move(e.clientX));
  window.addEventListener("mouseup",end);

  // touch
  window.addEventListener("touchstart",e=>start(e.touches[0].clientX));
  window.addEventListener("touchmove",e=>move(e.touches[0].clientX));
  window.addEventListener("touchend",end);

})();


/* ===============================
   💘 LIGHTBOX FUNCTIONALITY
================================ */

(function(){

  const lightbox = document.getElementById("rcLightbox");
  const lbImg = document.getElementById("rcLbImg");
  const closeBtn = lightbox?.querySelector(".rc-lightbox-close");
  const backdrop = lightbox?.querySelector(".rc-lightbox-backdrop");
  const images = document.querySelectorAll(".rc-img");

  if(!lightbox || !lbImg || !images.length) return;

  function openLightbox(src, alt){
    lbImg.src = src;
    lbImg.alt = alt || "";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox(){
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  // click en fotos
  images.forEach(img=>{
    img.addEventListener("click", (e)=>{
      e.stopPropagation();
      openLightbox(img.src, img.alt);
    });
  });

  // cerrar con X
  closeBtn?.addEventListener("click", closeLightbox);

  // cerrar tocando fondo
  backdrop?.addEventListener("click", closeLightbox);

  // cerrar con ESC
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && lightbox.classList.contains("is-open")){
      closeLightbox();
    }
  });

})();
