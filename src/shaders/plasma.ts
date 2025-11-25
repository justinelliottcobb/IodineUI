export const plasmaFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * 4.0 - 2.0;

    float t = uTime * 0.5;

    float v1 = sin(p.x * 2.0 + t);
    float v2 = sin(p.y * 2.0 + t * 0.7);
    float v3 = sin((p.x + p.y) * 1.5 + t * 0.5);
    float v4 = sin(length(p) * 3.0 - t);

    float v = (v1 + v2 + v3 + v4) * 0.25;

    // Mouse interaction
    float mouseDist = length(uv - uMouse);
    v += sin(mouseDist * 10.0 - uTime * 2.0) * 0.3 * (1.0 - mouseDist);

    vec3 col = vec3(
      sin(v * 3.14159 + 0.0) * 0.5 + 0.5,
      sin(v * 3.14159 + 2.094) * 0.5 + 0.5,
      sin(v * 3.14159 + 4.188) * 0.5 + 0.5
    );

    col = mix(vec3(0.1, 0.0, 0.2), col, uIntensity);

    gl_FragColor = vec4(col, 1.0);
  }
`
