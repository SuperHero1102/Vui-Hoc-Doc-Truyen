const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const {
  vec3, add3, sub3, scale3, dot3, len3, norm3, clamp, mix, mix3, smin,
  sdSphere, sdEllipsoid, sdRoundBox, sdCapsule, sdTorus, sdCylinder,
  renderClayModel
} = require('./clay_sdf_engine.cjs');

const OUT_DIR = path.resolve(__dirname, '../src/assets/accessories');

// 1. Necktie: Knot at top, rounded box tie body, pointed tip, diagonal stripe
function necktieSDF(p) {
  const knot = sdEllipsoid([p[0], p[1] + 0.38, p[2]], [0.15, 0.11, 0.08]);
  const body = sdRoundBox([p[0], p[1] - 0.02, p[2]], [0.13, 0.30, 0.04], 0.03);
  const tip = sdCapsule(p, [0, 0.26, 0], [0, 0.45, 0], 0.04);
  const d = Math.min(knot, smin(body, tip, 0.04));
  let color = [0.18, 0.42, 0.88];
  const stripe = Math.sin((p[0] * 1.8 + p[1] * 2.5) * 6);
  if (stripe > 0.45 && knot > 0.04) color = [0.99, 0.82, 0.22];
  return { dist: d, color };
}

// 2. Bell Choker: Red choker strap + golden bell with rim
function bellChokerSDF(p) {
  const strap = sdRoundBox([p[0], p[1] + 0.10, p[2]], [0.42, 0.06, 0.03], 0.02);
  const bell = sdSphere([p[0], p[1] - 0.12, p[2]], 0.18);
  const rim = sdRoundBox([p[0], p[1] - 0.12, p[2]], [0.20, 0.03, 0.05], 0.02);
  const d = Math.min(strap, Math.min(bell, rim));
  let color = [0.98, 0.20, 0.28];
  if (bell < strap || rim < strap) color = [0.99, 0.82, 0.18];
  return { dist: d, color };
}

// 3. Candy Heart Necklace: Beaded arc + sweet pastel heart
function candyNecklaceSDF(p) {
  const strap = sdRoundBox([p[0], p[1] + 0.12, p[2]], [0.44, 0.05, 0.03], 0.02);
  const hp = [p[0], p[1] - 0.14, p[2]];
  const lh = sdSphere([hp[0] + 0.09, hp[1] + 0.06, hp[2]], 0.13);
  const rh = sdSphere([hp[0] - 0.09, hp[1] + 0.06, hp[2]], 0.13);
  const tip = sdCapsule(hp, [0, -0.15, 0], [0, 0.02, 0], 0.13);
  const heart = smin(smin(lh, rh, 0.04), tip, 0.04);
  const d = Math.min(strap, heart);
  let color = [1.0, 0.42, 0.72];
  if (strap < heart) color = [0.35, 0.85, 0.98];
  return { dist: d, color };
}

// 4. Party Cone Hat: Tapered body + fluffy pompom + festive rim
function partyConeSDF(p) {
  // Stacked rounded spheres forming cone
  const p1 = sdSphere([p[0], p[1] - 0.22, p[2]], 0.38);
  const p2 = sdSphere([p[0], p[1] - 0.02, p[2]], 0.28);
  const p3 = sdSphere([p[0], p[1] + 0.18, p[2]], 0.18);
  const body = smin(smin(p1, p2, 0.08), p3, 0.08);
  const pompom = sdSphere([p[0], p[1] + 0.36, p[2]], 0.13);
  const rim = sdRoundBox([p[0], p[1] - 0.30, p[2]], [0.42, 0.06, 0.06], 0.03);
  const d = Math.min(Math.min(body, pompom), rim);
  let color = [0.25, 0.70, 0.98];
  if (pompom < 0.03) color = [0.99, 0.85, 0.20];
  else if (rim < 0.03) color = [0.98, 0.35, 0.65];
  else if (Math.sin(p[1] * 12) > 0.2) color = [0.99, 0.85, 0.25];
  return { dist: d, color };
}

// 5. Bear Beanie: Dome beanie with bear ears and fluffy cuff
function bearBeanieSDF(p) {
  const dome = sdEllipsoid([p[0], p[1] - 0.05, p[2]], [0.52, 0.38, 0.35]);
  const cuff = sdRoundBox([p[0], p[1] - 0.28, p[2]], [0.48, 0.08, 0.20], 0.05);
  const leftEar = sdSphere([p[0] + 0.38, p[1] + 0.28, p[2]], 0.15);
  const rightEar = sdSphere([p[0] - 0.38, p[1] + 0.28, p[2]], 0.15);
  const ears = Math.min(leftEar, rightEar);
  const d = smin(smin(dome, cuff, 0.06), ears, 0.04);
  let color = [0.72, 0.45, 0.28];
  if (cuff < 0.02) color = [0.88, 0.65, 0.45];
  return { dist: d, color };
}

// 6. Flower Crown: Green arc with 5 pastel blossoms
function flowerCrownSDF(p) {
  const vine = sdRoundBox([p[0], p[1] - 0.05, p[2]], [0.48, 0.04, 0.04], 0.02);
  let blossoms = 100.0;
  const xs = [-0.36, -0.18, 0.0, 0.18, 0.36];
  for (const bx of xs) {
    const f = sdSphere([p[0] - bx, p[1] - 0.05, p[2]], 0.12);
    blossoms = Math.min(blossoms, f);
  }
  const d = Math.min(vine, blossoms);
  let color = [0.35, 0.80, 0.45];
  if (blossoms < vine) color = [0.99, 0.55, 0.75];
  return { dist: d, color };
}

// 7. Sailor Cap: White cap + navy brim + gold badge
function sailorCapSDF(p) {
  const cap = sdEllipsoid([p[0], p[1] + 0.06, p[2]], [0.46, 0.22, 0.26]);
  const rim = sdRoundBox([p[0], p[1] - 0.14, p[2]], [0.46, 0.06, 0.15], 0.04);
  const badge = sdSphere([p[0], p[1] - 0.05, p[2] - 0.15], 0.10);
  const d = Math.min(Math.min(cap, rim), badge);
  let color = [0.98, 0.98, 1.0];
  if (rim < 0.02) color = [0.12, 0.25, 0.65];
  else if (badge < 0.02) color = [0.99, 0.82, 0.20];
  return { dist: d, color };
}

// 8. Swirl Lollipop: Big round swirl candy head + stick
function lollipopSDF(p) {
  const stick = sdCapsule(p, [0, -0.05, 0], [0, -0.65, 0], 0.04);
  const head = sdEllipsoid([p[0], p[1] - 0.22, p[2]], [0.35, 0.35, 0.10]);
  const d = Math.min(head, stick);
  let color = [0.98, 0.98, 0.95];
  if (head < stick) {
    const angle = Math.atan2(p[1] - 0.22, p[0]);
    const dist = Math.sqrt(p[0] * p[0] + (p[1] - 0.22) * (p[1] - 0.22));
    const swirl = Math.sin(angle * 3 + dist * 15);
    color = (swirl > 0) ? [0.98, 0.32, 0.55] : [0.35, 0.85, 0.95];
  }
  return { dist: d, color };
}

// 9. Baby Bottle: Translucent bottle body + blue collar + silicone nipple
function babyBottleSDF(p) {
  const bottle = sdRoundBox([p[0], p[1] + 0.05, p[2]], [0.18, 0.28, 0.16], 0.06);
  const collar = sdRoundBox([p[0], p[1] - 0.26, p[2]], [0.19, 0.05, 0.16], 0.03);
  const nipple = sdSphere([p[0], p[1] - 0.38, p[2]], 0.12);
  const d = Math.min(Math.min(bottle, collar), nipple);
  let color = [0.98, 0.98, 0.98];
  if (collar < 0.02) color = [0.35, 0.75, 0.98];
  else if (nipple < 0.02) color = [0.99, 0.75, 0.45];
  return { dist: d, color };
}

const fixes = [
  ['jewelry_necktie.png', necktieSDF],
  ['jewelry_bell_choker.png', bellChokerSDF],
  ['jewelry_candy_necklace.png', candyNecklaceSDF],
  ['hat_party_cone.png', partyConeSDF],
  ['hat_bear_beanie.png', bearBeanieSDF],
  ['hat_flower_crown.png', flowerCrownSDF],
  ['hat_sailor_cap.png', sailorCapSDF],
  ['prop_lollipop.png', lollipopSDF],
  ['prop_baby_bottle.png', babyBottleSDF]
];

for (const [fname, sdf] of fixes) {
  const png = renderClayModel(sdf);
  const outPath = path.join(OUT_DIR, fname);
  const bytes = PNG.sync.write(png);
  fs.writeFileSync(outPath, bytes);
  console.log(`Rendered ${fname} -> size: ${bytes.length} bytes`);
}
