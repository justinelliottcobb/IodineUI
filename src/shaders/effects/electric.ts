import type { ShaderEffect } from '../registry'
import { rotorLib, tiltPreamble } from '../lib/rotor3d'

const effect: ShaderEffect = {
  name: 'electric',
  glow: 'rgba(6, 182, 212, 0.4)',
  defaults: {
    speed: 1.2,
    palette: ['#06b6d4', '#8b5cf6'],
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

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
      vec2 uv = apply_tilt(vUv, uTilt);
      float t = uTime * uSpeed;

      // Multiple sharp noise layers at different speeds
      float n1 = noise(uv * 8.0 * uScale + vec2(t * 2.0, 0.0));
      float n2 = noise(uv * 16.0 * uScale + vec2(0.0, t * 3.0) + 3.0);
      float n3 = noise(uv * 32.0 * uScale + vec2(t * -1.5, t * 1.0) + 7.0);

      // Sharpen into lightning-like branches
      float bolt1 = pow(n1, 8.0) * 4.0;
      float bolt2 = pow(n2, 10.0) * 6.0;
      float bolt3 = pow(n3, 12.0) * 8.0;

      // Flickering intensity
      float flicker1 = step(0.7, sin(t * 13.0 + uv.x * 5.0) * 0.5 + 0.5);
      float flicker2 = step(0.6, sin(t * 17.0 + uv.y * 7.0) * 0.5 + 0.5);

      // Combine bolts with flickering
      float electric = bolt1 * (0.5 + flicker1 * 0.5) +
                       bolt2 * (0.3 + flicker2 * 0.7) +
                       bolt3 * 0.2;

      electric = clamp(electric, 0.0, 1.0);

      // Color: bright core fading to palette
      vec3 col = mix(uColor1, uColor2, electric);
      col = mix(col, vec3(1.0), pow(electric, 3.0) * 0.8);

      // Background glow
      float bgGlow = (bolt1 * 0.1 + bolt2 * 0.05);
      col += uColor1 * bgGlow;

      // Mouse attracts electricity
      float mouseDist = length(uv - uMouse);
      float mouseAttract = exp(-mouseDist * 6.0) * 0.4;
      float mouseBolt = pow(noise(uv * 20.0 * uScale + vec2(t * 5.0)), 6.0) * mouseAttract * 4.0;
      col += mix(uColor1, vec3(1.0), 0.5) * mouseBolt;

      col *= uIntensity;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
}

export default effect
