import type { ShaderEffect } from '../registry'

const effect: ShaderEffect = {
  name: 'progress-ring',
  glow: 'rgba(139, 92, 246, 0.4)',
  fragment: /* glsl */ `
    precision highp float;

    uniform float uTime;
    uniform float uIntensity;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform float uProgress;

    varying vec2 vUv;

    #define PI 3.14159265359
    #define TWO_PI 6.28318530718

    void main() {
      // Center coordinates
      vec2 uv = vUv - 0.5;

      // Correct for aspect ratio
      float aspect = uResolution.x / uResolution.y;
      uv.x *= aspect;

      // Polar coordinates
      float angle = atan(uv.y, uv.x);
      float radius = length(uv);

      // Normalize angle to 0-1 (starting from top, clockwise)
      float normalizedAngle = (-angle + PI * 0.5) / TWO_PI;
      normalizedAngle = mod(normalizedAngle, 1.0);

      // Ring parameters
      float ringWidth = 0.08;
      float ringRadius = 0.35;

      // Create ring shape with smooth edges
      float ring = smoothstep(ringRadius - ringWidth, ringRadius - ringWidth + 0.01, radius) *
                   smoothstep(ringRadius + ringWidth, ringRadius + ringWidth - 0.01, radius);

      // Progress arc
      float progress = clamp(uProgress, 0.0, 1.0);
      float progressArc = smoothstep(progress + 0.005, progress, normalizedAngle);

      // Background ring (unfilled portion)
      float bgRing = ring * (1.0 - progressArc) * 0.2;

      // Filled ring
      float filledRing = ring * progressArc;

      // Color gradient along progress (purple to cyan)
      vec3 col1 = vec3(0.55, 0.36, 0.96);
      vec3 col2 = vec3(0.02, 0.71, 0.83);
      float gradientPos = normalizedAngle / max(progress, 0.01);
      vec3 fillColor = mix(col1, col2, clamp(gradientPos, 0.0, 1.0));

      // Shimmer at leading edge
      float shimmer = sin(radius * 40.0 - uTime * 6.0) * 0.5 + 0.5;
      float atEdge = smoothstep(0.015, 0.0, abs(normalizedAngle - progress)) * step(normalizedAngle, progress);
      fillColor += shimmer * atEdge * 0.5;

      // Bright tip at progress point
      float tipGlow = exp(-abs(normalizedAngle - progress) * 80.0) * ring;
      fillColor += vec3(1.0) * tipGlow * 0.6;

      // Background color
      vec3 bgColor = vec3(0.15, 0.15, 0.2);

      // Combine
      vec3 finalColor = fillColor * filledRing + bgColor * bgRing;
      float alpha = (filledRing + bgRing) * uIntensity;

      gl_FragColor = vec4(finalColor * uIntensity, alpha);
    }
  `,
}

export default effect
