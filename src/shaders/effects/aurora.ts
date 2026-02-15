import type { ShaderEffect } from '../registry'
import { rotorLib, tiltPreamble } from '../lib/rotor3d'

const effect: ShaderEffect = {
  name: 'aurora',
  glow: 'rgba(16, 185, 129, 0.4)',
  defaults: {
    speed: 0.4,
    palette: ['#10b981', '#06b6d4', '#8b5cf6'],
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

    void main() {
      vec2 uv = apply_tilt(vUv, uTilt);
      float t = uTime * uSpeed;

      // Layered horizontal waves at different frequencies
      float wave1 = sin(uv.x * 3.0 * uScale + t * 1.2) * 0.15;
      float wave2 = sin(uv.x * 5.0 * uScale - t * 0.8 + 1.0) * 0.1;
      float wave3 = sin(uv.x * 8.0 * uScale + t * 0.5 + 2.5) * 0.06;

      // Vertical position of each aurora band
      float band1 = smoothstep(0.08, 0.0, abs(uv.y - 0.5 + wave1 - 0.1));
      float band2 = smoothstep(0.06, 0.0, abs(uv.y - 0.5 + wave2 + 0.05));
      float band3 = smoothstep(0.05, 0.0, abs(uv.y - 0.5 + wave3 + 0.15));

      // Fade bands vertically (aurora is brightest at center, fades at edges)
      float vertFade = 1.0 - 2.0 * abs(uv.y - 0.5);
      vertFade = clamp(vertFade, 0.0, 1.0);
      vertFade = pow(vertFade, 0.6);

      // Color each band from palette
      vec3 col = uColor1 * band1 + uColor2 * band2 + uColor3 * band3;

      // Soft background glow
      float glow = exp(-pow((uv.y - 0.45) * 3.0, 2.0)) * 0.15;
      col += mix(uColor1, uColor2, 0.5) * glow;

      // Mouse interaction — shimmer follows cursor
      float mouseDist = length(uv - uMouse);
      float mouseGlow = exp(-mouseDist * 5.0) * 0.25;
      col += uColor2 * mouseGlow;

      col *= vertFade * uIntensity;

      // Subtle flicker
      float flicker = 0.95 + 0.05 * sin(t * 7.0 + uv.x * 20.0);
      col *= flicker;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
}

export default effect
