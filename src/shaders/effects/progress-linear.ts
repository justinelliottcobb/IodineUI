import type { ShaderEffect } from '../registry'
import { rotorLib, tiltPreamble } from '../lib/rotor3d'

const effect: ShaderEffect = {
  name: 'progress-linear',
  glow: 'rgba(139, 92, 246, 0.4)',
  defaults: {
    speed: 1.0,
    palette: ['#8b5cf6', '#06b6d4', '#252540'],
  },
  fragment: /* glsl */ `
    precision highp float;

    uniform float uTime;
    uniform float uIntensity;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform float uProgress;
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
      float progress = clamp(uProgress, 0.0, 1.0);

      // Progress fill with smooth edge
      float edgeWidth = 0.02;
      float fill = smoothstep(progress + edgeWidth, progress, uv.x);

      // Wave animation at the edge
      float wave = sin(uv.y * 30.0 + uTime * uSpeed * 5.0) * 0.008;
      float waveFill = smoothstep(progress + wave + edgeWidth, progress + wave, uv.x);

      // Gradient along progress using palette
      float gradientPos = uv.x / max(progress, 0.01);
      vec3 fillColor = mix(uColor1, uColor2, clamp(gradientPos, 0.0, 1.0));

      // Shimmer effect moving along the bar
      float shimmerPos = mod(uTime * uSpeed * 0.5, 1.5) - 0.25;
      float shimmer = smoothstep(shimmerPos - 0.15, shimmerPos, uv.x) *
                      smoothstep(shimmerPos + 0.15, shimmerPos, uv.x);
      shimmer *= step(uv.x, progress) * 0.4;
      fillColor += vec3(shimmer);

      // Glow at the leading edge
      float edgeGlow = exp(-abs(uv.x - progress) * 40.0) * 0.6;
      fillColor += vec3(1.0) * edgeGlow * step(uv.x, progress + 0.05);

      // Apply intensity
      float alpha = waveFill * uIntensity;
      vec3 col = fillColor * uIntensity;

      // Background (unfilled portion) using palette color 3
      float bgAlpha = (1.0 - fill) * 0.3 * uIntensity;

      // Combine fill and background
      vec3 finalColor = mix(uColor3, col, fill);
      float finalAlpha = max(alpha, bgAlpha);

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `,
}

export default effect
