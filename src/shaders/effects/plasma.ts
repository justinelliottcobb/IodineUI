import type { ShaderEffect } from '../registry'
import { rotorLib, tiltPreamble } from '../lib/rotor3d'

const effect: ShaderEffect = {
  name: 'plasma',
  glow: 'rgba(147, 51, 234, 0.4)',
  defaults: {
    speed: 1.0,
    palette: ['#8b5cf6', '#06b6d4'],
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
      vec2 p = uv * 4.0 * uScale - 2.0 * uScale;

      float t = uTime * uSpeed * 0.5;

      float v1 = sin(p.x * 2.0 + t);
      float v2 = sin(p.y * 2.0 + t * 0.7);
      float v3 = sin((p.x + p.y) * 1.5 + t * 0.5);
      float v4 = sin(length(p) * 3.0 - t);

      float v = (v1 + v2 + v3 + v4) * 0.25;

      // Mouse interaction
      float mouseDist = length(uv - uMouse);
      v += sin(mouseDist * 10.0 - uTime * uSpeed * 2.0) * 0.3 * (1.0 - mouseDist);

      // Color using palette - tint the RGB sine wave with palette colors
      vec3 rawCol = vec3(
        sin(v * 3.14159 + 0.0) * 0.5 + 0.5,
        sin(v * 3.14159 + 2.094) * 0.5 + 0.5,
        sin(v * 3.14159 + 4.188) * 0.5 + 0.5
      );

      // Tint toward palette colors
      vec3 col = rawCol * mix(uColor1, uColor2, rawCol.r);

      // Background blend derived from first palette color (darkened)
      vec3 bgColor = uColor1 * 0.2;
      col = mix(bgColor, col, uIntensity);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
}

export default effect
