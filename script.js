// Three.js setup
const container = document.getElementById('container');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 200;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Galaxy background
const starsGeometry = new THREE.BufferGeometry();
const starCount = 2000;
const starVertices = [];

for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;
  starVertices.push(x, y, z);
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0x8888ff, size: 1 });
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

// Heart shape formula
function heartShape(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return new THREE.Vector3(x, y, 0);
}

// Create heart particles
const particles = new THREE.BufferGeometry();
const positions = [];
for (let i = 0; i < 2000; i++) {
  const t = Math.random() * Math.PI * 2;
  const p = heartShape(t);
  const z = (Math.random() - 0.5) * 20; // độ sâu 3D
  positions.push(p.x * 5, p.y * 5, z);
}
particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({
  color: 0x00ffff,
  size: 2,
  transparent: true,
  blending: THREE.AdditiveBlending
});
const heart = new THREE.Points(particles, material);
scene.add(heart);

// Animation
function animate() {
  requestAnimationFrame(animate);
  heart.rotation.y += 0.01; // xoay 360 độ
  starField.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Music button
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
musicBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.textContent = "⏸️";
  } else {
    bgMusic.pause();
    musicBtn.textContent = "🎵";
  }
});
