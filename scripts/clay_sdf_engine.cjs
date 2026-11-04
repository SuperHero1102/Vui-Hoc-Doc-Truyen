const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

// 3D Vector Math Helpers
function vec3(x, y, z) { return [x, y, z]; }
function add3(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub3(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function scale3(a, s) { return [a[0] * s, a[1] * s, a[2] * s]; }
function dot3(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function len3(a) { return Math.sqrt(dot3(a, a)); }
function norm3(a) { const l = len3(a); return l > 1e-6 ? scale3(a, 1 / l) : [0, 0, 1]; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function mix(a, b, t) { return a * (1 - t) + b * t; }
function mix3(a, b, t) { return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)]; }

// Smooth minimum for organic clay blending
function smin(d1, d2, k = 0.08) {
  const h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}

// SDF Primitives
function sdSphere(p, r) { return len3(p) - r; }
function sdEllipsoid(p, r) {
  const k0 = len3([p[0] / r[0], p[1] / r[1], p[2] / r[2]]);
  const k1 = len3([p[0] / (r[0] * r[0]), p[1] / (r[1] * r[1]), p[2] / (r[2] * r[2])]);
  return k0 * (k0 - 1.0) / k1;
}
function sdRoundBox(p, b, r) {
  const q = [Math.abs(p[0]) - b[0], Math.abs(p[1]) - b[1], Math.abs(p[2]) - b[2]];
  const m = [Math.max(q[0], 0), Math.max(q[1], 0), Math.max(q[2], 0)];
  return len3(m) + Math.min(Math.max(q[0], Math.max(q[1], q[2])), 0.0) - r;
}
function sdTorus(p, t) {
  const q = [Math.sqrt(p[0] * p[0] + p[1] * p[1]) - t[0], p[2]];
  return len3(q) - t[1];
}
function sdCapsule(p, a, b, r) {
  const pa = sub3(p, a), ba = sub3(b, a);
  const h = clamp(dot3(pa, ba) / dot3(ba, ba), 0.0, 1.0);
  return len3(sub3(pa, scale3(ba, h))) - r;
}
function sdCylinder(p, r, h) {
  const d = [len3([p[0], p[2]]) - r, Math.abs(p[1]) - h];
  return Math.min(Math.max(d[0], d[1]), 0.0) + len3([Math.max(d[0], 0), Math.max(d[1], 0)]);
}

// 3D Clay Scene Ray-marcher & Shading
function renderClayModel(sdfFunc, width = 256, height = 256) {
  const png = new PNG({ width, height });
  const lightDir = norm3([-0.45, -0.65, 0.8]);
  const fillLightDir = norm3([0.5, 0.4, 0.5]);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 2x2 Sub-pixel Anti-aliasing
      let accR = 0, accG = 0, accB = 0, accA = 0;
      const subOffsets = [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]];

      for (const [ox, oy] of subOffsets) {
        // Normalized coordinates in [-1, 1], preserving aspect ratio
        const uvX = ((x + ox) / width) * 2 - 1;
        const uvY = ((y + oy) / height) * 2 - 1;

        // Ray setup: Orthographic projection with depth tracing
        const ro = [uvX, uvY, -1.8];
        const rd = [0, 0, 1];
        let t = 0.0;
        let hit = false;
        let resColor = [1, 1, 1];

        for (let step = 0; step < 40; step++) {
          const p = add3(ro, scale3(rd, t));
          const { dist, color } = sdfFunc(p);
          if (dist < 0.003) {
            hit = true;
            resColor = color;
            break;
          }
          t += dist * 0.8;
          if (t > 3.6) break;
        }

        if (hit) {
          const p = add3(ro, scale3(rd, t));
          // Calculate surface normal via gradient
          const eps = 0.004;
          const nx = sdfFunc([p[0] + eps, p[1], p[2]]).dist - sdfFunc([p[0] - eps, p[1], p[2]]).dist;
          const ny = sdfFunc([p[0], p[1] + eps, p[2]]).dist - sdfFunc([p[0], p[1] - eps, p[2]]).dist;
          const nz = sdfFunc([p[0], p[1], p[2] + eps]).dist - sdfFunc([p[0], p[1], p[2] - eps]).dist;
          const normal = norm3([nx, ny, nz]);

          // Clay Lighting Model
          const diff = Math.max(0, dot3(normal, lightDir));
          const fill = Math.max(0, dot3(normal, fillLightDir)) * 0.4;
          const amb = 0.38;

          // Blinn-Phong soft clay highlight
          const viewDir = norm3(sub3([0, 0, -2], p));
          const halfDir = norm3(add3(lightDir, viewDir));
          const spec = Math.pow(Math.max(0, dot3(normal, halfDir)), 18) * 0.42;

          // Subtle Fresnel rim glow
          const fresnel = Math.pow(1 - Math.max(0, dot3(normal, viewDir)), 2.8) * 0.28;

          // Soft ambient occlusion
          const ao = clamp(1.0 - Math.max(0, 0.4 - t * 0.1), 0.7, 1.0);

          const totalLight = (diff * 0.65 + fill + amb + fresnel) * ao;
          const r = clamp(resColor[0] * totalLight + spec, 0, 1);
          const g = clamp(resColor[1] * totalLight + spec, 0, 1);
          const b = clamp(resColor[2] * totalLight + spec, 0, 1);

          accR += r; accG += g; accB += b; accA += 1.0;
        }
      }

      const pixelIdx = (y * width + x) << 2;
      if (accA > 0) {
        png.data[pixelIdx] = Math.round((accR / 4) * 255);
        png.data[pixelIdx + 1] = Math.round((accG / 4) * 255);
        png.data[pixelIdx + 2] = Math.round((accB / 4) * 255);
        png.data[pixelIdx + 3] = Math.round((accA / 4) * 255);
      } else {
        png.data[pixelIdx] = 0;
        png.data[pixelIdx + 1] = 0;
        png.data[pixelIdx + 2] = 0;
        png.data[pixelIdx + 3] = 0;
      }
    }
  }

  return png;
}

module.exports = {
  vec3, add3, sub3, scale3, dot3, len3, norm3, clamp, mix, mix3, smin,
  sdSphere, sdEllipsoid, sdRoundBox, sdTorus, sdCapsule, sdCylinder,
  renderClayModel
};
