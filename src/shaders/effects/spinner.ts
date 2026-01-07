import type { ShaderEffect } from '../registry'

const effect: ShaderEffect = {
  name: 'spinner',
  glow: 'rgba(139, 92, 246, 0.4)',
  fragment: /* glsl */ `
    precision highp float;

    uniform float uTime;
    uniform float uIntensity;
    uniform vec2 uResolution;
    uniform vec2 uMouse;

    varying vec2 vUv;

    #define PI 3.14159265359
    #define TWO_PI 6.28318530718

    void main() {
      // Center coordinates and correct for aspect ratio
      vec2 uv = vUv - 0.5;
      float aspect = uResolution.x / uResolution.y;
      uv.x *= aspect;

      // Polar coordinates
      float angle = atan(uv.y, uv.x);
      float radius = length(uv);

      // Ring parameters
      float ringWidth = 0.06;
      float ringRadius = 0.35;

      // Create ring shape with smooth edges
      float ring = smoothstep(ringRadius - ringWidth, ringRadius - ringWidth + 0.02, radius) *
                   smoothstep(ringRadius + ringWidth, ringRadius + ringWidth - 0.02, radius);

      // Rotating arc (spinner tail)
      float arcLength = PI * 1.3;
      float rotation = uTime * 4.0;

      // Normalize angle to 0..TWO_PI range starting from rotation point
      float normalizedAngle = mod(angle - rotation + PI, TWO_PI);

      // Create arc with smooth fade tail
      float arc = smoothstep(0.0, 0.3, normalizedAngle) *
                  smoothstep(arcLength, arcLength - 0.6, normalizedAngle);

      // Combine ring and arc
      float spinner = ring * arc;

      // Color gradient along arc (purple to cyan)
      vec3 col1 = vec3(0.55, 0.36, 0.96);
      vec3 col2 = vec3(0.02, 0.71, 0.83);
      float gradientPos = normalizedAngle / arcLength;
      vec3 col = mix(col1, col2, clamp(gradientPos, 0.0, 1.0));

      // Add bright tip at leading edge
      float tipBrightness = smoothstep(arcLength - 0.2, arcLength, normalizedAngle) * ring;
      col = mix(col, vec3(1.0), tipBrightness * 0.7);

      // Add subtle inner glow
      float innerGlow = exp(-radius * 4.0) * 0.15;
      col += vec3(0.55, 0.36, 0.96) * innerGlow;

      // Apply intensity
      float alpha = spinner * uIntensity;
      col *= uIntensity;

      gl_FragColor = vec4(col * alpha, alpha);
    }
  `,
}

export default effect
