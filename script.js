// setup scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 2000);
camera.position.z = 250;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// controls (drag xoay camera)
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// background stars
const starGeo = new THREE.BufferGeometry();
const starCount = 3000;
const starPos = [];
for(let i=0;i<starCount;i++){
  starPos.push((Math.random()-0.5)*2000,
               (Math.random()-0.5)*2000,
               (Math.random()-0.5)*2000);
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos,3));
const starMat = new THREE.PointsMaterial({color:0xffffff, size:1});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// heart shape (particles)
const heartShape = new THREE.Shape();
heartShape.moveTo(0,0);
heartShape.bezierCurveTo(0,0,0,-3,3,-3);
heartShape.bezierCurveTo(6,-3,6,0,6,0);
heartShape.bezierCurveTo(6,3,3,5,0,8);
heartShape.bezierCurveTo(-3,5,-6,3,-6,0);
heartShape.bezierCurveTo(-6,0,-6,-3,-3,-3);
heartShape.bezierCurveTo(0,-3,0,0,0,0);

const points = heartShape.getPoints(1000);
const heartGeo = new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(p.x*10,p.y*10,0)));
const heartMat = new THREE.PointsMaterial({color:0x55aaff, size:1.5});
const heart = new THREE.Points(heartGeo, heartMat);
scene.add(heart);

// heartbeat effect
let scaleDir = 1;
function heartbeat(){
  const s = heart.scale.x + scaleDir*0.002;
  heart.scale.set(s,s,s);
  if(s>1.05) scaleDir=-1;
  if(s<0.95) scaleDir=1;
}

// danh sách animation
const animateFns = [heartbeat];

// Text "Trung Thu ấm áp"
const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', font=>{
  const textGeo = new THREE.TextGeometry('Chúc bạn Bình Trung Thu ấm áp', {
    font: font,
    size: 15,
    height: 2,
    curveSegments: 12,
  });
  const textMat = new THREE.MeshBasicMaterial({color:0xff6699});
  const text = new THREE.Mesh(textGeo, textMat);
  text.position.set(-60, -100, 0);
  scene.add(text);

  // orbit animation cho chữ
  const radius = 120;
  function animateText(t){
    text.position.x = Math.cos(t*0.001)*radius;
    text.position.z = Math.sin(t*0.001)*radius;
  }
  animateFns.push(animateText);
});

// loop
function animate(t){
  requestAnimationFrame(animate);
  stars.rotation.y += 0.0002;
  heart.rotation.y += 0.001;
  animateFns.forEach(fn=>fn(t));
  renderer.render(scene,camera);
}
animate();

// responsive
addEventListener('resize',()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
