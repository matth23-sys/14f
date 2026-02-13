const canvas = document.getElementById("galaxyCanvas");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias:true,
  alpha:true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

/* ⭐ ESTRELLAS */

const starGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const positions = new Float32Array(starCount * 3);

for(let i=0;i<starCount*3;i++){
  positions[i]=(Math.random()-0.5)*200;
}

starGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions,3)
);

const starMaterial = new THREE.PointsMaterial({
  size:0.7,
  color:0xffffff
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

/* 🎬 ANIMATE */

function animate(){
  requestAnimationFrame(animate);
  stars.rotation.y += 0.0005;
  scene.rotation.y += 0.0008;
  renderer.render(scene,camera);
}
animate();

/* 📱 RESPONSIVE */

window.addEventListener("resize",()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});





(function initGalaxy() {
    const canvas = document.getElementById('galaxyCanvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Partículas (Nebulosa central)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        const radius = 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i+1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i+2] = radius * Math.cos(phi);
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.08,
        color: 0xffaaff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 10;

    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0002;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();