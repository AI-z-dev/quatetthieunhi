// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 3000);
camera.position.z = 400;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// Orbit controls (tự xoay 360 bằng chuột)
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// ⭐ Ngân hà (sao)
const starGeo = new THREE.BufferGeometry();
const starCount = 6000;
const starPos = [];
for(let i=0; i<starCount; i++){
  starPos.push((Math.random()-0.5)*4000,
               (Math.random()-0.5)*4000,
               (Math.random()-0.5)*4000);
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos,3));
const starMat = new THREE.PointsMaterial({color:0xffffff, size:1.2});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// 💙 Trái tim 3D particles
function createHeartShape(){
  const heart = new THREE.Shape();
  heart.moveTo(0,0);
  heart.bezierCurveTo(0,0,0,-3,3,-3);
  heart.bezierCurveTo(6,-3,6,0,6,0);
  heart.bezierCurveTo(6,3,3,5,0,8);
  heart.bezierCurveTo(-3,5,-6,3,-6,0);
  heart.bezierCurveTo(-6,0,-6,-3,-3,-3);
  heart.bezierCurveTo(0,-3,0,0,0,0);
  return heart;
}

const heartShape = createHeartShape();
const heartPoints = heartShape.getSpacedPoints(1000);
const heartParticles = [];

for (let i = 0; i < heartPoints.length; i++) {
  const p = heartPoints[i];
  for (let j = 0; j < 6; j++) {
    const z = (Math.random()-0.5)*40;
    heartParticles.push(p.x*15, p.y*15, z);
  }
}

const heartGeo = new THREE.BufferGeometry();
heartGeo.setAttribute('position', new THREE.Float32BufferAttribute(heartParticles, 3));

const heartMat = new THREE.PointsMaterial({color:0x00ccff, size:2});
const heart = new THREE.Points(heartGeo, heartMat);
scene.add(heart);

// ✨ Text
const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', font=>{
  const textGeo = new THREE.TextGeometry("Chúc bạn Trần Bình Trung Thu ấm áp nhaa <3", {
    font: font,
    size: 20,
    height: 4,
    curveSegments: 12,
  });
  const textMat = new THREE.MeshBasicMaterial({color:0xff66cc});
  const text = new THREE.Mesh(textGeo, textMat);
  text.position.set(-250, -150, 0);
  scene.add(text);
});

// 💓 Hiệu ứng tim đập + đổi màu
let scaleDir = 1;
const color = new THREE.Color(0x00ccff);
function heartbeat(t){
  // scale
  const s = heart.scale.x + scaleDir*0.0025;
  heart.scale.set(s,s,s);
  if(s>1.05) scaleDir=-1;
  if(s<0.95) scaleDir=1;

  // đổi màu mượt
  const hue = (t*0.0001)%1;
  color.setHSL(hue, 0.8, 0.5);
  heart.material.color.copy(color);
}

// 🎵 Nút nhạc
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let playing = false;

musicBtn.addEventListener("click", ()=>{
  if(playing){
    music.pause();
    musicBtn.textContent = "▶️ Nhạc";
  } else {
    music.play();
    musicBtn.textContent = "⏸️ Dừng";
  }
  playing = !playing;
});

// Loop
function animate(t){
  requestAnimationFrame(animate);
  stars.rotation.y += 0.0005;
  heartbeat(t);
  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener("resize", ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
