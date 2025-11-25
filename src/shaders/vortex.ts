export const vortexFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv - 0.5;

    // Apply mouse offset to vortex center
    vec2 center = (uMouse - 0.5) * 0.3;
    uv -= center;

    float angle = atan(uv.y, uv.x);
    float radius = length(uv);

    // Spiral distortion
    float spiral = angle + radius * 8.0 - uTime * 2.0;

    // Create bands
    float bands = sin(spiral * 3.0) * 0.5 + 0.5;
    bands = pow(bands, 2.0);

    // Radial fade
    float fade = 1.0 - radius * 1.5;
    fade = clamp(fade, 0.0, 1.0);

    // Pulsing glow
    float pulse = sin(uTime * 3.0) * 0.1 + 0.9;

    float v = bands * fade * pulse * uIntensity;

    // Colors - deep purple to cyan
    vec3 col1 = vec3(0.2, 0.0, 0.4);
    vec3 col2 = vec3(0.0, 0.8, 1.0);
    vec3 col3 = vec3(1.0, 1.0, 1.0);

    vec3 col = mix(col1, col2, v);
    col = mix(col, col3, pow(v, 3.0));

    // Add subtle rotation highlight
    float highlight = sin(angle * 2.0 + uTime) * 0.5 + 0.5;
    col += highlight * 0.1 * fade;

    gl_FragColor = vec4(col, 1.0);
  }
`
