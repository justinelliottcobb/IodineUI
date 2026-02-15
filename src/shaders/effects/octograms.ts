import type { ShaderEffect } from '../registry'
import { rotorLib, tiltPreamble } from '../lib/rotor3d'

const effect: ShaderEffect = {
  name: 'octograms',
  glow: 'rgba(59, 130, 246, 0.4)',
  defaults: {
    speed: 1.0,
    palette: ['#3b82f6', '#8b5cf6'],
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

    float gTime = 0.;
    const float REPEAT = 5.0;

    // Keep mat2 rot() for inner-loop SDF rotations (performance-critical)
    mat2 rot(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c,s,-s,c);
    }

    float sdBox(vec3 p, vec3 b) {
      vec3 q = abs(p) - b;
      return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }

    float box(vec3 pos, float scale) {
      pos *= scale;
      float base = sdBox(pos, vec3(.4,.4,.1)) /1.5;
      pos.xy *= 5.;
      pos.y -= 3.5;
      pos.xy *= rot(.75);
      float result = -base;
      return result;
    }

    float box_set(vec3 pos, float iTime) {
      vec3 pos_origin = pos;
      pos = pos_origin;
      pos.y += sin(gTime * 0.4) * 2.5;
      pos.xy *= rot(.8);
      float box1 = box(pos, 2. - abs(sin(gTime * 0.4)) * 1.5);
      pos = pos_origin;
      pos.y -= sin(gTime * 0.4) * 2.5;
      pos.xy *= rot(.8);
      float box2 = box(pos, 2. - abs(sin(gTime * 0.4)) * 1.5);
      pos = pos_origin;
      pos.x += sin(gTime * 0.4) * 2.5;
      pos.xy *= rot(.8);
      float box3 = box(pos, 2. - abs(sin(gTime * 0.4)) * 1.5);
      pos = pos_origin;
      pos.x -= sin(gTime * 0.4) * 2.5;
      pos.xy *= rot(.8);
      float box4 = box(pos, 2. - abs(sin(gTime * 0.4)) * 1.5);
      pos = pos_origin;
      pos.xy *= rot(.8);
      float box5 = box(pos, .5) * 6.;
      pos = pos_origin;
      float box6 = box(pos, .5) * 6.;
      float result = max(max(max(max(max(box1,box2),box3),box4),box5),box6);
      return result;
    }

    float map(vec3 pos, float iTime) {
      vec3 pos_origin = pos;
      float box_set1 = box_set(pos, iTime);
      return box_set1;
    }

    void main() {
      vec2 fragCoord = vUv * uResolution;
      vec2 p = (fragCoord.xy * 2. - uResolution.xy) / min(uResolution.x, uResolution.y);

      float iTime = uTime * uSpeed;

      vec3 ro = vec3(0., -0.2, iTime * 4.);
      vec3 ray = normalize(vec3(p, 1.5));

      // Compose XY and YZ ray rotations into a single rotor
      vec4 r_xy = rotor_from_plane_angle(vec3(1.0, 0.0, 0.0), sin(iTime * .03) * 5.0);
      vec4 r_yz = rotor_from_plane_angle(vec3(0.0, 0.0, 1.0), sin(iTime * .05) * 0.2);
      vec4 r_ray = rotor_multiply(r_yz, r_xy);

      // Apply tilt rotor (from mouse/config) if active
      if (uTilt.x != 0.0 || uTilt.y != 0.0) {
        vec4 r_tilt_xz = rotor_from_plane_angle(vec3(0.0, 1.0, 0.0), uTilt.x);
        vec4 r_tilt_yz = rotor_from_plane_angle(vec3(0.0, 0.0, 1.0), uTilt.y);
        vec4 r_tilt = rotor_multiply(r_tilt_yz, r_tilt_xz);
        r_ray = rotor_multiply(r_tilt, r_ray);
      }

      ray = rotor_apply(r_ray, ray);

      float t = 0.1;
      vec3 col = vec3(0.);
      float ac = 0.0;

      for (int i = 0; i < 99; i++) {
        vec3 pos = ro + ray * t;
        pos = mod(pos - 2., 4.) - 2.;
        gTime = iTime - float(i) * 0.01;

        float d = map(pos, iTime);
        d = max(abs(d), 0.01);
        ac += exp(-d * 23.);
        t += d * 0.55;
      }

      col = vec3(ac * 0.02);
      // Tint with palette colors instead of hardcoded blue
      col += uColor1 * 0.5 + uColor2 * 0.2 * abs(sin(iTime));

      col = mix(col * 0.3, col, uIntensity);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
}

export default effect
