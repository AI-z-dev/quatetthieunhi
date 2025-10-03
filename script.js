// === Setup cơ bản ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 3000);
camera.position.set(0, 0, 520);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('container').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === Ánh sáng ===
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const pl = new THREE.PointLight(0xffffff, 1.2);
pl.position.set(300, 300, 300);
scene.add(pl);

// === Hàm trái tim (parametric) ===
function heartFormula(t) {
  // parametric heart (classic)
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return new THREE.Vector3(x * 8, y * 8, (Math.random() - 0.5) * 40);
}

// === Particle setup (spiral -> target heart) ===
const particleCount = 3000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const targets = new Float32Array(particleCount * 3);
const startX = new Float32Array(particleCount);
const startY = new Float32Array(particleCount);
const startZ = new Float32Array(particleCount);
const startAngle = new Float32Array(particleCount);
const startRadius = new Float32Array(particleCount);
const progress = new Float32Array(particleCount);
const speed = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
  // target on heart
  const t = Math.random() * Math.PI * 2;
  const pt = heartFormula(t);
  targets[i * 3] = pt.x;
  targets[i * 3 + 1] = pt.y;
  targets[i * 3 + 2] = pt.z;

  // start somewhere dưới, theo vòng xoáy (để tạo spiral)
  startAngle[i] = Math.random() * Math.PI * 8;
  startRadius[i] = 80 + Math.random() * 300;
  startX[i] = startRadius[i] * Math.cos(startAngle[i]) + (Math.random() - 0.5) * 30;
  startY[i] = -600 - Math.random() * 300;
  startZ[i] = startRadius[i] * Math.sin(startAngle[i]) + (Math.random() - 0.5) * 30;

  // init positions = start
  positions[i * 3] = startX[i];
  positions[i * 3 + 1] = startY[i];
  positions[i * 3 + 2] = startZ[i];

  // progress and speed (stagger)
  progress[i] = -Math.random() * 1.5; // start negative -> delayed entrance
  speed[i] = 0.003 + Math.random() * 0.008;
}

const material = new THREE.PointsMaterial({
  size: 2.2,
  sizeAttenuation: true,
  color: 0xff66b3,
  transparent: true,
  opacity: 0.95
});
const particles = new THREE.Points(geometry, material);
scene.add(particles);

// === Text (1 dòng, dày, centered) ===
let textMesh = null;
const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
  const txt = 'Chuc ban Tran Binh Trung Thu am ap nhaa<3'; // không dấu để chắc chắn hiển thị
  const geo = new THREE.TextGeometry(txt, {
    font: font,
    size: 36,
    height: 8,
    curveSegments: 8,
    bevelEnabled: true,
    bevelThickness: 1.2,
    bevelSize: 1.0,
    bevelSegments: 3
  });
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const xOffset = (bb.max.x + bb.min.x) / 2;
  const yOffset = (bb.max.y + bb.min.y) / 2;
  geo.translate(-xOffset, -yOffset - 220, 0); // đặt thấp hơn tim

  const mat = new THREE.MeshPhongMaterial({ color: 0xffdd66, shininess: 120 });
  textMesh = new THREE.Mesh(geo, mat);
  scene.add(textMesh);
});

// === Animation loop: particle spiral -> heart ===
function animateParticles() {
  const pos = geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    // advance progress
    progress[i] += speed[i];
    if (progress[i] > 1) progress[i] = 1;

    // spiral params reduce with progress
    const p = progress[i];
    const ang = startAngle[i] + p * 12.0; // spin faster while approaching
    const r = startRadius[i] * (1 - p) * 0.8;

    // spiral offset (decays as p->1)
    const sx = r * Math.cos(ang);
    const sz = r * Math.sin(ang);

    // lerp from start -> target with extra spiral offset
    const tx = targets[i * 3];
    const ty = targets[i * 3 + 1];
    const tz = targets[i * 3 + 2];

    const x = THREE.MathUtils.lerp(startX[i] + sx * 0.6, tx, p);
    const y = THREE.MathUtils.lerp(startY[i], ty, p);
    const z = THREE.MathUtils.lerp(startZ[i] + sz * 0.6, tz, p);

    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;

    // optional: change size/alpha by p (requires shader or varying sizes) - skip for simplicity
  }
  geometry.attributes.position.needsUpdate = true;
}

// === Main loop ===
function loop() {
  requestAnimationFrame(loop);
  animateParticles();

  // rotate whole cloud slowly
  particles.rotation.y += 0.0025;

  // text rotation & subtle pulse
  if (textMesh) {
    textMesh.rotation.y += 0.008;
    const s = 1 + 0.02 * Math.sin(performance.now() * 0.003);
    textMesh.scale.set(s, s, s);
  }

  controls.update();
  renderer.render(scene, camera);
}
loop();

// === Resize handler ===
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
