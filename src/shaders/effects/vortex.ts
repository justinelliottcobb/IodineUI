import type { ShaderEffect } from '../registry'
import { rotorLib, tiltPreamble } from '../lib/rotor3d'

const effect: ShaderEffect = {
  name: 'vortex',
  glow: 'rgba(6, 182, 212, 0.4)',
  defaults: {
    speed: 1.0,
    palette: ['#7c3aed', '#06b6d4'],
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
      vec2 uv = apply_tilt(vUv, uTilt) - 0.5;

      // Apply mouse offset to vortex center
      vec2 center = (uMouse - 0.5) * 0.3;
      uv -= center;

      float angle = atan(uv.y, uv.x);
      float radius = length(uv);

      // Spiral distortion
      float spiral = angle + radius * 8.0 * uScale - uTime * uSpeed * 2.0;

      // Create bands
      float bands = sin(spiral * 3.0) * 0.5 + 0.5;
      bands = pow(bands, 2.0);

      // Radial fade
      float fade = 1.0 - radius * 1.5;
      fade = clamp(fade, 0.0, 1.0);

      // Pulsing glow
      float pulse = sin(uTime * uSpeed * 3.0) * 0.1 + 0.9;

      float v = bands * fade * pulse * uIntensity;

      // Colors from palette
      vec3 col = mix(uColor1, uColor2, v);
      col = mix(col, vec3(1.0), pow(v, 3.0));

      // Add subtle rotation highlight
      float highlight = sin(angle * 2.0 + uTime * uSpeed) * 0.5 + 0.5;
      col += highlight * 0.1 * fade;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
}

export default effect
