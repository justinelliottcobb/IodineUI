/**
 * Cl(3,0) Geometric Algebra rotor library for GLSL.
 *
 * Rotors are stored as vec4(scalar, e12, e13, e23) — the even subalgebra
 * of Cl(3,0), isomorphic to quaternions but with geometric algebra semantics.
 *
 * Import and interpolate into fragment shader strings:
 *   import { rotorLib, tiltPreamble } from '../lib/rotor3d'
 *   fragment: `
 *     ...uniforms...
 *     ${rotorLib}
 *     ${tiltPreamble}
 *     void main() { vec2 uv = apply_tilt(vUv, uTilt); ... }
 *   `
 */

/** Core rotor functions — pure function definitions, no uniforms/precision */
export const rotorLib = /* glsl */ `
  // --- Cl(3,0) Rotor Library ---
  // Rotor layout: vec4(scalar, e12, e13, e23)

  vec4 rotor_multiply(vec4 a, vec4 b) {
    // Geometric product of two even-grade elements in Cl(3,0)
    return vec4(
      a.x*b.x - a.y*b.y - a.z*b.z - a.w*b.w,  // scalar
      a.x*b.y + a.y*b.x - a.z*b.w + a.w*b.z,  // e12
      a.x*b.z + a.y*b.w + a.z*b.x - a.w*b.y,  // e13
      a.x*b.w - a.y*b.z + a.z*b.y + a.w*b.x   // e23
    );
  }

  vec4 rotor_reverse(vec4 r) {
    // Reverse: negate all bivector components
    return vec4(r.x, -r.yzw);
  }

  vec3 rotor_apply(vec4 r, vec3 v) {
    // Sandwich product R v R~
    // Expanded to avoid constructing full multivector intermediates
    float s = r.x;
    vec3 B = r.yzw; // bivector components (e12, e13, e23)

    // Equivalent to the Euler-Rodrigues formula:
    // v' = v + 2s(B × v) + 2(B × (B × v))
    vec3 t = 2.0 * cross(B, v);
    return v + s * t + cross(B, t);
  }

  vec4 rotor_from_plane_angle(vec3 bivector, float angle) {
    // bivector should be a unit bivector (normalized e12, e13, e23 components)
    // R = cos(θ/2) - sin(θ/2) * B
    float ha = angle * 0.5;
    return vec4(cos(ha), -sin(ha) * bivector);
  }

  vec4 rotor_normalize(vec4 r) {
    return r * inversesqrt(dot(r, r));
  }

  vec4 rotor_slerp(vec4 a, vec4 b, float t) {
    float d = dot(a, b);
    if (d < 0.0) { b = -b; d = -d; }
    if (d > 0.9995) return normalize(mix(a, b, t));
    float theta = acos(d);
    float st = sin(theta);
    return (sin((1.0 - t) * theta) * a + sin(t * theta) * b) / st;
  }

  mat3 rotor_to_matrix(vec4 r) {
    // For when you need to feed into standard pipelines
    vec3 x = rotor_apply(r, vec3(1, 0, 0));
    vec3 y = rotor_apply(r, vec3(0, 1, 0));
    vec3 z = rotor_apply(r, vec3(0, 0, 1));
    return mat3(x, y, z);
  }
`

/** Tilt helper — requires rotorLib to be included first. Requires uniform vec2 uTilt. */
export const tiltPreamble = /* glsl */ `
  // --- Rotor Tilt Helper ---
  vec2 apply_tilt(vec2 uv, vec2 tilt) {
    if (tilt.x == 0.0 && tilt.y == 0.0) return uv;
    // Build composed tilt rotor from XZ and YZ plane rotations
    vec4 r_xz = rotor_from_plane_angle(vec3(0.0, 1.0, 0.0), tilt.x);
    vec4 r_yz = rotor_from_plane_angle(vec3(0.0, 0.0, 1.0), tilt.y);
    vec4 r = rotor_multiply(r_yz, r_xz);
    // Lift 2D UV to 3D, apply rotor, project back with perspective
    vec3 p = rotor_apply(r, vec3(uv - 0.5, 0.0));
    float perspective = 1.0 / (1.0 - p.z * 0.5);
    return p.xy * perspective + 0.5;
  }
`
