// Fabián Espitia Sotelo
// Daniel Libardo Diaz Gonzalez
// Santiago Bello Moreno
// Julian David Velandia Neuta

// Se utiliza P5.js
// Artículo: https://webglfundamentals.org/webgl/lessons/webgl-fog.html
// Imagen de referncia para textura: Nachito (Mascota Unal)

const vertSrc = `
precision highp float;

attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 v_texcoord;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
  v_texcoord = aTexCoord;
}
`;

const fragSrc = `
precision highp float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec4 u_fogColor;
uniform float u_fogNear;
uniform float u_fogFar;

void main() {
  vec4 color = texture2D(u_texture, v_texcoord);

  // gl_FragCoord.z = profundidad del píxel, de 0 a 1
  float fogAmount = smoothstep(u_fogNear, u_fogFar, gl_FragCoord.z);

  gl_FragColor = mix(color, u_fogColor, fogAmount);
}
`;

const fogColor = [0.8, 0.9, 1, 1];
const numCubes = 40;

let fogShader;
let cubeTexture;
let fogNearSlider, fogFarSlider;
let rotX = 0;
let rotY = 0;

async function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();

  cubeTexture = await loadImage('https://raw.githubusercontent.com/julian10neuta/FogShader/main/textura.png');

  fogShader = createShader(vertSrc, fragSrc);

  // Sliders (aparecen debajo del canvas)
  createSpan(' fogNear ');
  fogNearSlider = createSlider(0, 1, 0.9, 0.001);
  createSpan(' fogFar ');
  fogFarSlider = createSlider(0, 1, 0.99, 0.001);
}

function draw() {
  if (!cubeTexture || !fogFarSlider) return;   

  background(fogColor[0] * 255, fogColor[1] * 255, fogColor[2] * 255);

  rotX += -0.4 * deltaTime / 1000;
  rotY += -0.4 * deltaTime / 1000;

  perspective(PI / 3, width / height, 1, 2000);
  camera(0, 0, 2,  0, 0, 0,  0, 1, 0);

  shader(fogShader);
  fogShader.setUniform('u_texture', cubeTexture);
  fogShader.setUniform('u_fogColor', fogColor);
  fogShader.setUniform('u_fogNear', fogNearSlider.value());
  fogShader.setUniform('u_fogFar', fogFarSlider.value());

  for (let i = 0; i <= numCubes; i++) {
    push();
    translate(-2 + i * 1.1, 0, -i * 1.4);
    rotateX(rotX + i * 0.1);
    rotateY(rotY + i * 0.1);
    box(1);
    pop();
  }
}
