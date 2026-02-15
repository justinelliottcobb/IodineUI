import type { ShaderEffect } from '../registry'
import { rotorLib, tiltPreamble } from '../lib/rotor3d'

const effect: ShaderEffect = {
  name: 'nebula',
  glow: 'rgba(139, 92, 246, 0.4)',
  defaults: {
    speed: 0.3,
    palette: ['#8b5cf6', '#ef4444', '#06b6d4'],
  },
  fragment: /* glsl */ `
    precision highp float;

    uniform float uTime;
    uniform float uIntensity;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uSpeed;
    uniform float uScale;
    uniform vec2 uTilt;

    varying vec2 vUv;

    ${rotorLib}
    ${tiltPreamble}

    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = noise(i);
      float b = noise(i + vec2(1.0, 0.0));
      float c = noise(i + vec2(0.0, 1.0));
      float d = noise(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 6; i++) {
        v += a * smoothNoise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = apply_tilt(vUv, uTilt);
      float t = uTime * uSpeed;

      // Multi-directional noise layers
      float n1 = fbm(uv * 3.0 * uScale + vec2(t * 0.3, t * 0.1));
      float n2 = fbm(uv * 4.0 * uScale + vec2(-t * 0.2, t * 0.4) + 5.0);
      float n3 = fbm(uv * 5.0 * uScale + vec2(t * 0.1, -t * 0.15) + 10.0);

      // Cloud-like shapes
      float cloud1 = smoothstep(0.3, 0.7, n1);
      float cloud2 = smoothstep(0.35, 0.65, n2);
      float cloud3 = smoothstep(0.4, 0.6, n3);

      // Color mixing from palette
      vec3 col = vec3(0.0);
      col += uColor1 * cloud1 * 0.6;
      col += uColor2 * cloud2 * 0.4;
      col += uColor3 * cloud3 * 0.3;

      // Star-like specks
      float stars = noise(uv * 80.0);
      stars = smoothstep(0.97, 1.0, stars) * 0.8;
      col += vec3(stars);

      // Soft central glow
      float centerDist = length(uv - 0.5);
      float centerGlow = exp(-centerDist * 3.0) * 0.2;
      col += mix(uColor1, uColor3, 0.5) * centerGlow;

      // Mouse interaction
      float mouseDist = length(uv - uMouse);
      float mouseGlow = exp(-mouseDist * 4.0) * 0.2;
      col += uColor2 * mouseGlow;

      col *= uIntensity;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
}

export default effect
