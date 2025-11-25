import type { ShaderEffect } from '../registry'

const effect: ShaderEffect = {
  name: 'fire',
  glow: 'rgba(239, 68, 68, 0.4)',
  fragment: /* glsl */ `
    precision highp float;

    uniform float uTime;
    uniform float uIntensity;
    uniform vec2 uResolution;
    uniform vec2 uMouse;

    varying vec2 vUv;

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
      for (int i = 0; i < 5; i++) {
        v += a * smoothNoise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = vUv;

      // Fire rises from bottom
      vec2 q = uv;
      q.y -= uTime * 0.3;

      float n = fbm(q * 4.0 + uTime * 0.5);
      n += fbm(q * 8.0 - uTime * 0.3) * 0.5;

      // Shape fire - stronger at bottom
      float shape = 1.0 - uv.y;
      shape = pow(shape, 0.8);

      // Mouse interaction - fire follows mouse
      float mouseDist = length(uv - uMouse);
      float mouseInfluence = exp(-mouseDist * 3.0) * 0.5;
      n += mouseInfluence;

      float fire = n * shape * uIntensity;

      // Fire colors
      vec3 col = vec3(0.0);
      col = mix(col, vec3(0.1, 0.0, 0.0), smoothstep(0.0, 0.3, fire));
      col = mix(col, vec3(0.8, 0.2, 0.0), smoothstep(0.3, 0.5, fire));
      col = mix(col, vec3(1.0, 0.6, 0.0), smoothstep(0.5, 0.7, fire));
      col = mix(col, vec3(1.0, 1.0, 0.6), smoothstep(0.7, 1.0, fire));

      gl_FragColor = vec4(col, 1.0);
    }
  `,
}

export default effect
