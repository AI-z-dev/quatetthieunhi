// === Setup ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 2000);
camera.position.set(0,0,400);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// === Light ===
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(200,200,200);
scene.add(pointLight);

// === Heart Particles ===
const particleCount = 4000;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount*3);
const targets = [];

function heartFormula(t){
  const x = 16 * Math.pow(Math.sin(t),3);
  const y = 13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t);
  return new THREE.Vector3(x*8, y*8, (Math.random()-0.5)*30);
}

// target positions (heart shape)
for(let i=0;i<particleCount;i++){
  const t = Math.random()*Math.PI*2;
  const pt = heartFormula(t);
  targets.push(pt);

  // start random dưới + loạn
  positions[i*3] = (Math.random()-0.5)*400;
  positions[i*3+1] = -500 - Math.random()*500;
  positions[i*3+2] = (Math.random()-0.5)*400;
}

particles.setAttribute('position', new THREE.BufferAttribute(positions,3));
const mat = new THREE.PointsMaterial({color:0xff6699, size:2});
const pointCloud = new THREE.Points(particles, mat);
scene.add(pointCloud);

// === Text (1 dòng) ===
const loader = new THREE.FontLoader();
let textMesh;
loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', font=>{
  const geo = new THREE.TextGeometry('Chuc ban Tran Binh Trung Thu am ap nhaa<3', {
    font: font,
    size: 20,
    height: 5,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 3
  });
  geo.center();
  const mat = new THREE.MeshPhongMaterial({color:0xffff66, shininess:150});
  textMesh = new THREE.Mesh(geo, mat);
  textMesh.position.set(0, -150, 0);
  scene.add(textMesh);
});

// === Animation ===
function animate(){
  requestAnimationFrame(animate);

  // update particles
  const pos = particles.attributes.position.array;
  for(let i=0;i<particleCount;i++){
    const target = targets[i];
    pos[i*3] += (target.x - pos[i*3])*0.02;
    pos[i*3+1] += (target.y - pos[i*3+1])*0.02;
    pos[i*3+2] += (target.z - pos[i*3+2])*0.02;
  }
  particles.attributes.position.needsUpdate = true;

  // rotate text slowly
  if(textMesh){
    textMesh.rotation.y += 0.01;
  }

  pointCloud.rotation.y += 0.002;
  renderer.render(scene,camera);
}
animate();

// === Resize ===
addEventListener('resize',()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
