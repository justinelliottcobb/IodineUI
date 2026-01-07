import type { ShaderEffect } from '../registry'

const effect: ShaderEffect = {
  name: 'progress-linear',
  glow: 'rgba(139, 92, 246, 0.4)',
  fragment: /* glsl */ `
    precision highp float;

    uniform float uTime;
    uniform float uIntensity;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform float uProgress;

    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      float progress = clamp(uProgress, 0.0, 1.0);

      // Progress fill with smooth edge
      float edgeWidth = 0.02;
      float fill = smoothstep(progress + edgeWidth, progress, uv.x);

      // Wave animation at the edge
      float wave = sin(uv.y * 30.0 + uTime * 5.0) * 0.008;
      float waveFill = smoothstep(progress + wave + edgeWidth, progress + wave, uv.x);

      // Base gradient colors (purple to cyan)
      vec3 col1 = vec3(0.55, 0.36, 0.96);
      vec3 col2 = vec3(0.02, 0.71, 0.83);

      // Gradient along progress
      float gradientPos = uv.x / max(progress, 0.01);
      vec3 fillColor = mix(col1, col2, clamp(gradientPos, 0.0, 1.0));

      // Shimmer effect moving along the bar
      float shimmerPos = mod(uTime * 0.5, 1.5) - 0.25;
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

      // Background (unfilled portion)
      vec3 bgColor = vec3(0.15, 0.15, 0.2);
      float bgAlpha = (1.0 - fill) * 0.3 * uIntensity;

      // Combine fill and background
      vec3 finalColor = mix(bgColor, col, fill);
      float finalAlpha = max(alpha, bgAlpha);

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `,
}

export default effect
