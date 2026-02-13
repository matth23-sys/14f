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


