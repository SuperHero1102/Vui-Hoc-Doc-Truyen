const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const {
  vec3, add3, sub3, scale3, dot3, len3, norm3, clamp, mix, mix3, smin,
  sdSphere, sdEllipsoid, sdRoundBox, sdTorus, sdCapsule, sdCylinder,
  renderClayModel
} = require('./clay_sdf_engine.cjs');

const OUT_DIR = path.resolve(__dirname, '../src/assets/accessories');

// 1. 3D Clay Bow Generator (Full complete bow, both loops, knot, ribbon tails, no cutoffs)
function createClayBow(colors = { main: [0.98, 0.42, 0.62], knot: [0.99, 0.35, 0.55], tail: [0.95, 0.40, 0.58] }, hasDots = false) {
  return function(p) {
    // Knot in center
    const knotDist = sdEllipsoid(p, [0.15, 0.17, 0.15]);
    
    // Left and right puffy rounded loops
    // Tilt the loops slightly
    const leftP = [p[0] + 0.32, (p[1] - 0.05) * 1.1 + p[0] * 0.15, p[2] * 1.2];
    const rightP = [p[0] - 0.32, (p[1] - 0.05) * 1.1 - p[0] * 0.15, p[2] * 1.2];
    
    const leftLoop = sdEllipsoid(leftP, [0.32, 0.28, 0.18]);
    const rightLoop = sdEllipsoid(rightP, [0.32, 0.28, 0.18]);
    
    // Indent inside the loops
    const leftIndent = sdSphere([p[0] + 0.32, p[1] - 0.05, p[2] + 0.1], 0.13);
    const rightIndent = sdSphere([p[0] - 0.32, p[1] - 0.05, p[2] + 0.1], 0.13);
    
    const leftShape = Math.max(leftLoop, -leftIndent);
    const rightShape = Math.max(rightLoop, -rightIndent);
    
    // Two hanging ribbon tails
    const leftTail = sdCapsule(p, [-0.08, 0.1, 0.02], [-0.28, 0.55, -0.04], 0.11);
    const rightTail = sdCapsule(p, [0.08, 0.1, 0.02], [0.28, 0.55, -0.04], 0.11);
    
    // Smooth clay union
    const loops = Math.min(leftShape, rightShape);
    const tails = Math.min(leftTail, rightTail);
    
    let d = smin(loops, knotDist, 0.06);
    d = smin(d, tails, 0.05);
    
    // Coloring
    let color = colors.main;
    if (knotDist < 0.02) {
      color = colors.knot;
    } else if (tails < loops) {
      color = colors.tail;
    }
    
    // Optional polka dots
    if (hasDots && d < 0.02) {
      const dotCoord = [Math.sin(p[0] * 18), Math.sin(p[1] * 18)];
      if (dotCoord[0] * dotCoord[0] + dotCoord[1] * dotCoord[1] < 0.3) {
        color = [1.0, 1.0, 0.95]; // white cream dot
      }
    }
    
    return { dist: d, color };
  };
}

// 2. 3D Clay Necktie Generator (Triangular knot, tapered tie, diagonal clay stripes, 0 artifacts)
function createClayNecktie(baseColor = [0.15, 0.38, 0.85], stripeColor = [0.98, 0.82, 0.25]) {
  return function(p) {
    // Knot at top (rounded inverted triangle)
    const knotY = p[1] + 0.50;
    const knotWidth = 0.18 + Math.max(0, -knotY) * 0.15;
    const knot = sdRoundBox([p[0], knotY, p[2]], [knotWidth, 0.12, 0.10], 0.04);
    
    // Tie body: tapered from knot to tip
    const tieY = p[1] - 0.05;
    // Tie extends from y = -0.38 to y = 0.55
    let body = 100.0;
    if (tieY > -0.38 && tieY < 0.55) {
      // Width expands then tapers to tip
      let w = 0.14 + (tieY + 0.38) * 0.16;
      if (tieY > 0.40) {
        // Pointed triangular tip
        w = Math.max(0.01, w - (tieY - 0.40) * 1.8);
      }
      body = sdRoundBox([p[0], tieY, p[2]], [w, 0.42, 0.06], 0.03);
    }
    
    // Behind-the-collar band
    const collarBand = sdTorus([p[0], p[1] + 0.56, p[2] + 0.05], [0.28, 0.04]);
    
    let d = Math.min(knot, body);
    d = Math.min(d, collarBand);
    
    // Diagonal stripes color
    let color = baseColor;
    if (knot < 0.02) {
      color = [baseColor[0] * 0.9, baseColor[1] * 0.9, baseColor[2] * 0.9];
    } else {
      const stripePos = (p[0] * 1.5 + p[1] * 2.0);
      const frac = (stripePos - Math.floor(stripePos));
      if (frac > 0.65) {
        color = stripeColor;
      }
    }
    
    return { dist: d, color };
  };
}

// 3. 3D Clay Gentleman Bowtie
function createClayBowtie() {
  return function(p) {
    const knot = sdEllipsoid(p, [0.12, 0.14, 0.12]);
    const leftP = [p[0] + 0.30, p[1] * (1.0 + Math.abs(p[0]) * 0.8), p[2]];
    const rightP = [p[0] - 0.30, p[1] * (1.0 + Math.abs(p[0]) * 0.8), p[2]];
    const left = sdRoundBox(leftP, [0.25, 0.20, 0.08], 0.05);
    const right = sdRoundBox(rightP, [0.25, 0.20, 0.08], 0.05);
    
    const wings = Math.min(left, right);
    const d = smin(wings, knot, 0.06);
    
    let color = [0.85, 0.15, 0.22]; // Rich crimson red
    if (knot < 0.02) color = [0.70, 0.10, 0.16];
    return { dist: d, color };
  };
}

// 4. 3D Clay Bell Choker (Red velvet collar with golden bell)
function createClayBellChoker() {
  return function(p) {
    // Red collar band
    const band = sdTorus([p[0], p[1] + 0.15, p[2]], [0.45, 0.06]);
    // Golden sphere bell
    const bellP = [p[0], p[1] - 0.15, p[2] - 0.08];
    const bell = sdSphere(bellP, 0.16);
    // Bell rim & slit
    const rim = sdTorus([bellP[0], bellP[1] - 0.02, bellP[2]], [0.15, 0.02]);
    const bellTotal = smin(bell, rim, 0.02);
    
    const d = Math.min(band, bellTotal);
    let color = [0.98, 0.20, 0.28]; // red band
    if (bellTotal < band) {
      color = [0.98, 0.80, 0.15]; // gleaming gold bell
    }
    return { dist: d, color };
  };
}

// 5. 3D Clay Candy Necklace
function createClayCandyNecklace() {
  return function(p) {
    // Heart pendant in center
    const hp = [p[0], p[1] - 0.15, p[2]];
    const leftH = sdSphere([hp[0] + 0.09, hp[1] - 0.06, hp[2]], 0.12);
    const rightH = sdSphere([hp[0] - 0.09, hp[1] - 0.06, hp[2]], 0.12);
    const tipH = sdCapsule(hp, [0, 0.15, 0], [0, -0.05, 0], 0.13);
    const heart = smin(smin(leftH, rightH, 0.04), tipH, 0.04);
    
    // Beaded candy collar
    const band = sdTorus([p[0], p[1] + 0.18, p[2]], [0.42, 0.05]);
    const d = Math.min(heart, band);
    
    let color = [1.0, 0.45, 0.75]; // Pastel bubblegum pink
    if (band < heart) {
      // Alternating candy beads
      const angle = Math.atan2(p[1] + 0.18, p[0]);
      color = (Math.sin(angle * 8) > 0) ? [0.4, 0.8, 1.0] : [1.0, 0.85, 0.3];
    }
    return { dist: d, color };
  };
}

// 6. 3D Clay Birthday Party Cone Hat
function createClayPartyHat() {
  return function(p) {
    // Cone: tapered cylinder / cone from y = 0.5 to y = -0.45
    const y = p[1];
    let cone = 100.0;
    if (y > -0.45 && y < 0.50) {
      const r = (0.50 - y) * 0.48;
      cone = sdSphere([p[0], 0, p[2]], r);
      cone = Math.max(cone, Math.abs(y - 0.02) - 0.48);
    }
    // Pom-pom on top
    const pompom = sdSphere([p[0], p[1] + 0.55, p[2]], 0.12);
    // Rim ruffle at bottom
    const rim = sdTorus([p[0], p[1] - 0.45, p[2]], [0.46, 0.06]);
    
    const d = Math.min(Math.min(cone, pompom), rim);
    let color = [0.25, 0.70, 0.98]; // vibrant cyan blue
    if (pompom < 0.02) color = [0.99, 0.82, 0.20]; // yellow pompom
    else if (rim < 0.02) color = [0.98, 0.35, 0.65]; // pink rim
    else if (Math.sin(p[1] * 15) > 0) color = [0.98, 0.85, 0.25]; // yellow stripes
    
    return { dist: d, color };
  };
}

// 7. 3D Clay Bear Beanie (Winter beanie with cute bear ears)
function createClayBearBeanie() {
  return function(p) {
    // Main beanie dome
    const dome = sdEllipsoid([p[0], p[1] - 0.05, p[2]], [0.55, 0.42, 0.45]);
    // Folded cuff at bottom
    const cuff = sdTorus([p[0], p[1] - 0.30, p[2]], [0.52, 0.10]);
    // Left & right bear ears
    const leftEar = sdSphere([p[0] + 0.42, p[1] + 0.32, p[2]], 0.16);
    const rightEar = sdSphere([p[0] - 0.42, p[1] + 0.32, p[2]], 0.16);
    const ears = Math.min(leftEar, rightEar);
    
    const d = smin(smin(dome, cuff, 0.06), ears, 0.04);
    let color = [0.72, 0.45, 0.28]; // warm teddy bear brown
    if (cuff < 0.02) color = [0.88, 0.65, 0.45]; // lighter cuff
    return { dist: d, color };
  };
}

// 8. 3D Clay Flower Crown (Floral pastel tiara)
function createClayFlowerCrown() {
  return function(p) {
    const vine = sdTorus([p[0], p[1] - 0.05, p[2]], [0.52, 0.05]);
    // 5 pastel clay blossoms across the front
    let blossoms = 100.0;
    const angles = [-0.6, -0.3, 0.0, 0.3, 0.6];
    for (const a of angles) {
      const bx = Math.sin(a) * 0.52;
      const bz = -Math.cos(a) * 0.52 + 0.52;
      const flower = sdSphere([p[0] - bx, p[1] - 0.05, p[2] - bz], 0.12);
      blossoms = Math.min(blossoms, flower);
    }
    const d = Math.min(vine, blossoms);
    let color = [0.35, 0.80, 0.45]; // green vine
    if (blossoms < vine) color = [0.99, 0.55, 0.75]; // cherry blossom pink
    return { dist: d, color };
  };
}

// 9. 3D Clay Sailor Cap
function createClaySailorCap() {
  return function(p) {
    // White round sailor cap
    const cap = sdCylinder([p[0], p[1], p[2]], 0.48, 0.18);
    // Navy blue trim rim
    const rim = sdTorus([p[0], p[1] - 0.16, p[2]], [0.50, 0.05]);
    // Little anchor badge
    const badge = sdSphere([p[0], p[1] - 0.05, p[2] - 0.48], 0.09);
    
    const d = Math.min(Math.min(cap, rim), badge);
    let color = [0.98, 0.98, 1.0]; // crisp white
    if (rim < 0.02) color = [0.12, 0.22, 0.55]; // navy
    else if (badge < 0.02) color = [0.98, 0.82, 0.20]; // golden anchor
    return { dist: d, color };
  };
}

// 10. 3D Clay Heart Sunglasses
function createClayHeartGlasses() {
  return function(p) {
    // Left heart frame
    const lp = [p[0] + 0.32, p[1], p[2]];
    const lh1 = sdSphere([lp[0] + 0.08, lp[1] + 0.08, lp[2]], 0.14);
    const lh2 = sdSphere([lp[0] - 0.08, lp[1] + 0.08, lp[2]], 0.14);
    const ltip = sdCapsule(lp, [0, -0.16, 0], [0, 0.02, 0], 0.14);
    const leftHeart = smin(smin(lh1, lh2, 0.04), ltip, 0.04);
    
    // Right heart frame
    const rp = [p[0] - 0.32, p[1], p[2]];
    const rh1 = sdSphere([rp[0] + 0.08, rp[1] + 0.08, rp[2]], 0.14);
    const rh2 = sdSphere([rp[0] - 0.08, rp[1] + 0.08, rp[2]], 0.14);
    const rtip = sdCapsule(rp, [0, -0.16, 0], [0, 0.02, 0], 0.14);
    const rightHeart = smin(smin(rh1, rh2, 0.04), rtip, 0.04);
    
    // Bridge between hearts
    const bridge = sdCapsule(p, [-0.18, 0.02, 0], [0.18, 0.02, 0], 0.04);
    
    const d = Math.min(Math.min(leftHeart, rightHeart), bridge);
    return { dist: d, color: [0.98, 0.25, 0.55] }; // Candy pink frames
  };
}

// 11. 3D Clay Star Glasses
function createClayStarGlasses() {
  return function(p) {
    // Left star
    const leftStar = sdSphere([p[0] + 0.32, p[1], p[2]], 0.24);
    // Right star
    const rightStar = sdSphere([p[0] - 0.32, p[1], p[2]], 0.24);
    const bridge = sdCapsule(p, [-0.16, 0.0, 0], [0.16, 0.0, 0], 0.04);
    const d = Math.min(Math.min(leftStar, rightStar), bridge);
    return { dist: d, color: [0.99, 0.80, 0.15] }; // Golden star glasses
  };
}

// 12. 3D Clay Star & Heart Cheek Stickers
function createClayCheekStickers() {
  return function(p) {
    const leftStar = sdSphere([p[0] + 0.40, p[1] - 0.05, p[2]], 0.15);
    const rightHeart = sdSphere([p[0] - 0.40, p[1] - 0.05, p[2]], 0.15);
    const d = Math.min(leftStar, rightHeart);
    let color = (p[0] > 0) ? [0.99, 0.85, 0.20] : [0.99, 0.40, 0.65];
    return { dist: d, color };
  };
}

// 13. 3D Clay Cat Whiskers & Little Pink Nose
function createClayCatWhiskers() {
  return function(p) {
    // Little pink triangular nose
    const nose = sdSphere([p[0], p[1] + 0.05, p[2]], 0.09);
    // 3 whiskers left, 3 whiskers right
    let whiskers = 100.0;
    for (let i = -1; i <= 1; i++) {
      const yOff = i * 0.07;
      const lw = sdCapsule(p, [-0.12, 0.02 + yOff, 0], [-0.48, 0.05 + yOff * 1.5, 0], 0.025);
      const rw = sdCapsule(p, [0.12, 0.02 + yOff, 0], [0.48, 0.05 + yOff * 1.5, 0], 0.025);
      whiskers = Math.min(whiskers, Math.min(lw, rw));
    }
    const d = Math.min(nose, whiskers);
    let color = (nose < whiskers) ? [0.99, 0.50, 0.65] : [0.25, 0.25, 0.30];
    return { dist: d, color };
  };
}

// 14. 3D Clay Giant Swirl Lollipop
function createClayLollipop() {
  return function(p) {
    // Stick
    const stick = sdCapsule(p, [0, -0.05, 0], [0, -0.65, 0], 0.04);
    // Round candy head
    const head = sdCylinder([p[0], p[1] - 0.22, p[2]], 0.36, 0.08);
    const d = Math.min(head, stick);
    
    let color = [0.98, 0.98, 0.95]; // white stick
    if (head < stick) {
      // Rainbow spiral swirl
      const angle = Math.atan2(p[1] - 0.22, p[0]);
      const dist = Math.sqrt(p[0] * p[0] + (p[1] - 0.22) * (p[1] - 0.22));
      const swirl = Math.sin(angle * 3 + dist * 15);
      color = (swirl > 0) ? [0.98, 0.32, 0.55] : [0.35, 0.85, 0.95];
    }
    return { dist: d, color };
  };
}

// 15. 3D Clay Heart Balloon
function createClayHeartBalloon() {
  return function(p) {
    const bp = [p[0], p[1] - 0.15, p[2]];
    const lh = sdSphere([bp[0] + 0.16, bp[1] + 0.12, bp[2]], 0.25);
    const rh = sdSphere([bp[0] - 0.16, bp[1] + 0.12, bp[2]], 0.25);
    const tip = sdCapsule(bp, [0, -0.25, 0], [0, 0.05, 0], 0.22);
    const heart = smin(smin(lh, rh, 0.06), tip, 0.06);
    
    // Knot & dangling string
    const knot = sdCone = sdSphere([p[0], p[1] + 0.16, p[2]], 0.05);
    const string = sdCapsule(p, [0, 0.20, 0], [0.08, 0.65, 0], 0.02);
    
    const d = Math.min(Math.min(heart, knot), string);
    let color = [0.99, 0.35, 0.60]; // Vibrant glossy pink balloon
    if (string < 0.02) color = [0.90, 0.90, 0.90];
    return { dist: d, color };
  };
}

// 16. 3D Clay Rainbow Star Scepter
function createClayRainbowScepter() {
  return function(p) {
    const staff = sdCapsule(p, [0, 0.15, 0], [0, -0.65, 0], 0.04);
    const star = sdSphere([p[0], p[1] - 0.35, p[2]], 0.24);
    const orb = sdSphere([p[0], p[1] - 0.35, p[2]], 0.16);
    
    const d = Math.min(staff, star);
    let color = [0.99, 0.85, 0.20]; // Golden star
    if (staff < star) color = [0.85, 0.85, 0.95];
    return { dist: d, color };
  };
}

// 17. 3D Clay Baby Milk Bottle
function createClayBabyBottle() {
  return function(p) {
    const bottle = sdRoundBox([p[0], p[1] + 0.05, p[2]], [0.20, 0.32, 0.20], 0.08);
    const collar = sdCylinder([p[0], p[1] - 0.30, p[2]], 0.18, 0.06);
    const nipple = sdEllipsoid([p[0], p[1] - 0.42, p[2]], [0.10, 0.14, 0.10]);
    
    const d = Math.min(Math.min(bottle, collar), nipple);
    let color = [0.98, 0.98, 0.98]; // milky white bottle
    if (collar < 0.02) color = [0.35, 0.75, 0.98]; // pastel blue collar
    else if (nipple < 0.02) color = [0.99, 0.75, 0.45]; // warm silicone nipple
    return { dist: d, color };
  };
}

// 18. 3D Clay Rubber Duckie
function createClayRubberDuck() {
  return function(p) {
    const body = sdEllipsoid([p[0], p[1] + 0.08, p[2]], [0.35, 0.26, 0.30]);
    const head = sdSphere([p[0] + 0.18, p[1] - 0.20, p[2]], 0.20);
    const beak = sdRoundBox([p[0] + 0.38, p[1] - 0.18, p[2]], [0.10, 0.05, 0.08], 0.03);
    const duck = smin(body, head, 0.08);
    const d = Math.min(duck, beak);
    
    let color = [0.99, 0.85, 0.15]; // cheerful yellow
    if (beak < 0.02) color = [0.98, 0.45, 0.10]; // orange beak
    return { dist: d, color };
  };
}

// 19. 3D Clay Dino Plushie
function createClayDinoPlush() {
  return function(p) {
    const body = sdEllipsoid([p[0], p[1] + 0.05, p[2]], [0.30, 0.35, 0.26]);
    const head = sdSphere([p[0], p[1] - 0.32, p[2]], 0.22);
    // Spikes along the back
    const spike = sdSphere([p[0] - 0.24, p[1] - 0.15, p[2]], 0.10);
    const d = Math.min(smin(body, head, 0.08), spike);
    let color = [0.35, 0.82, 0.55]; // pastel mint dino green
    if (spike < 0.02) color = [0.99, 0.80, 0.25]; // yellow back spikes
    return { dist: d, color };
  };
}

// 20. 3D Clay Bear Slippers
function createClayBearSlippers() {
  return function(p) {
    const leftS = sdEllipsoid([p[0] + 0.25, p[1], p[2]], [0.18, 0.30, 0.16]);
    const rightS = sdEllipsoid([p[0] - 0.25, p[1], p[2]], [0.18, 0.30, 0.16]);
    // Bear ears on slippers
    const le1 = sdSphere([p[0] + 0.35, p[1] - 0.22, p[2]], 0.08);
    const le2 = sdSphere([p[0] + 0.15, p[1] - 0.22, p[2]], 0.08);
    const re1 = sdSphere([p[0] - 0.15, p[1] - 0.22, p[2]], 0.08);
    const re2 = sdSphere([p[0] - 0.35, p[1] - 0.22, p[2]], 0.08);
    
    const d = Math.min(Math.min(leftS, rightS), Math.min(Math.min(le1, le2), Math.min(re1, re2)));
    return { dist: d, color: [0.78, 0.52, 0.35] }; // Teddy brown slippers
  };
}

// 21. 3D Clay Happy Frog Plushie
function createClayFrogPlush() {
  return function(p) {
    const head = sdEllipsoid([p[0], p[1] + 0.05, p[2]], [0.38, 0.30, 0.28]);
    const leftEye = sdSphere([p[0] + 0.24, p[1] - 0.24, p[2]], 0.14);
    const rightEye = sdSphere([p[0] - 0.24, p[1] - 0.24, p[2]], 0.14);
    const frog = smin(smin(head, leftEye, 0.06), rightEye, 0.06);
    // Rosy pink cheeks
    const leftCheek = sdSphere([p[0] + 0.28, p[1] + 0.08, p[2]], 0.08);
    const rightCheek = sdSphere([p[0] - 0.28, p[1] + 0.08, p[2]], 0.08);
    
    const d = Math.min(frog, Math.min(leftCheek, rightCheek));
    let color = [0.42, 0.85, 0.40]; // bright happy frog green
    if (leftCheek < 0.02 || rightCheek < 0.02) color = [0.99, 0.55, 0.70];
    return { dist: d, color };
  };
}

// Cleaner function for existing accessories:
// Removes stray pixels (< 350 pixels) and removes border artifacts at y > 215 or y < 15
function cleanExistingAccessory(filename) {
  const filePath = path.join(OUT_DIR, filename);
  if (!fs.existsSync(filePath)) return;
  const buf = fs.readFileSync(filePath);
  const png = PNG.sync.read(buf);
  const w = png.width, h = png.height;
  
  // 1. Remove border strip artifacts at y >= 215 or y <= 15 if not connected to main body
  // Find connected components
  const visited = new Uint8Array(w * h);
  const components = [];
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (visited[idx] || png.data[(idx << 2) + 3] <= 20) continue;
      
      let count = 0;
      const pixels = [];
      let minX = x, maxX = x, minY = y, maxY = y;
      const queue = [idx];
      visited[idx] = 1;
      
      while (queue.length > 0) {
        const curr = queue.pop();
        pixels.push(curr);
        count++;
        const cy = Math.floor(curr / w);
        const cx = curr % w;
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;
        
        const nbs = [curr - 1, curr + 1, curr - w, curr + w];
        for (const n of nbs) {
          if (n >= 0 && n < w * h && !visited[n] && png.data[(n << 2) + 3] > 20) {
            visited[n] = 1;
            queue.push(n);
          }
        }
      }
      components.push({ count, bbox: [minX, minY, maxX, maxY], pixels });
    }
  }
  
  if (components.length <= 1) return; // already single clean object
  
  components.sort((a, b) => b.count - a.count);
  const mainComp = components[0];
  
  // Remove components that are small (< 600 px) or at edge borders
  let removedCount = 0;
  for (let i = 1; i < components.length; i++) {
    const comp = components[i];
    const isSmall = comp.count < 800;
    const isEdgeArtifact = comp.bbox[3] >= 215 || comp.bbox[1] <= 15 || comp.bbox[0] <= 12 || comp.bbox[2] >= 244;
    
    if (isSmall || isEdgeArtifact) {
      for (const pIdx of comp.pixels) {
        const offset = pIdx << 2;
        png.data[offset] = 0;
        png.data[offset + 1] = 0;
        png.data[offset + 2] = 0;
        png.data[offset + 3] = 0;
      }
      removedCount++;
    }
  }
  
  fs.writeFileSync(filePath, PNG.sync.write(png));
  console.log(`Cleaned ${filename}: removed ${removedCount} stray components.`);
}

// MAIN BUILD EXECUTION
console.log('=== 1. GENERATING CRUCIAL REPAIRED ACCESSORIES ===');

// 1. REPAIR PINK BOW: Beautiful, complete, 100% unclipped 3D clay bow
console.log('Rendering jewelry_pink_bow.png...');
const pinkBowPng = renderClayModel(createClayBow({
  main: [0.99, 0.42, 0.65],
  knot: [0.99, 0.32, 0.58],
  tail: [0.95, 0.38, 0.62]
}));
fs.writeFileSync(path.join(OUT_DIR, 'jewelry_pink_bow.png'), PNG.sync.write(pinkBowPng));

// 2. REPAIR NECKTIE: Smart clean 3D clay necktie with diagonal stripes, 0 stray pixels
console.log('Rendering jewelry_necktie.png...');
const necktiePng = renderClayModel(createClayNecktie([0.18, 0.42, 0.88], [0.99, 0.82, 0.22]));
fs.writeFileSync(path.join(OUT_DIR, 'jewelry_necktie.png'), PNG.sync.write(necktiePng));

console.log('=== 2. GENERATING EXTENDED NEW 3D CLAY ACCESSORIES ===');

// Category: jewelry (Bows & Neckwear)
console.log('Rendering new bows & neck accessories...');
// Red bow
const redBowPng = renderClayModel(createClayBow({
  main: [0.95, 0.15, 0.22],
  knot: [0.82, 0.10, 0.16],
  tail: [0.90, 0.12, 0.18]
}));
fs.writeFileSync(path.join(OUT_DIR, 'jewelry_red_bow.png'), PNG.sync.write(redBowPng));

// Yellow polka dot bow
const yellowPolkaBowPng = renderClayModel(createClayBow({
  main: [0.99, 0.82, 0.20],
  knot: [0.95, 0.72, 0.15],
  tail: [0.98, 0.78, 0.18]
}, true));
fs.writeFileSync(path.join(OUT_DIR, 'jewelry_yellow_polka_bow.png'), PNG.sync.write(yellowPolkaBowPng));

// Mint pastel bow
const mintBowPng = renderClayModel(createClayBow({
  main: [0.35, 0.85, 0.72],
  knot: [0.28, 0.75, 0.65],
  tail: [0.32, 0.80, 0.68]
}));
fs.writeFileSync(path.join(OUT_DIR, 'jewelry_mint_bow.png'), PNG.sync.write(mintBowPng));

// Gentleman bowtie
const bowtiePng = renderClayModel(createClayBowtie());
fs.writeFileSync(path.join(OUT_DIR, 'jewelry_gentleman_bowtie.png'), PNG.sync.write(bowtiePng));

// Bell choker
const bellChokerPng = renderClayModel(createClayBellChoker());
fs.writeFileSync(path.join(OUT_DIR, 'jewelry_bell_choker.png'), PNG.sync.write(bellChokerPng));

// Candy heart necklace
const candyNecklacePng = renderClayModel(createClayCandyNecklace());
fs.writeFileSync(path.join(OUT_DIR, 'jewelry_candy_necklace.png'), PNG.sync.write(candyNecklacePng));

// Category: hat
console.log('Rendering new hats...');
fs.writeFileSync(path.join(OUT_DIR, 'hat_party_cone.png'), PNG.sync.write(renderClayModel(createClayPartyHat())));
fs.writeFileSync(path.join(OUT_DIR, 'hat_bear_beanie.png'), PNG.sync.write(renderClayModel(createClayBearBeanie())));
fs.writeFileSync(path.join(OUT_DIR, 'hat_flower_crown.png'), PNG.sync.write(renderClayModel(createClayFlowerCrown())));
fs.writeFileSync(path.join(OUT_DIR, 'hat_sailor_cap.png'), PNG.sync.write(renderClayModel(createClaySailorCap())));

// Category: face
console.log('Rendering new face accessories...');
fs.writeFileSync(path.join(OUT_DIR, 'face_heart_glasses.png'), PNG.sync.write(renderClayModel(createClayHeartGlasses())));
fs.writeFileSync(path.join(OUT_DIR, 'face_star_glasses.png'), PNG.sync.write(renderClayModel(createClayStarGlasses())));
fs.writeFileSync(path.join(OUT_DIR, 'face_star_stickers.png'), PNG.sync.write(renderClayModel(createClayCheekStickers())));
fs.writeFileSync(path.join(OUT_DIR, 'face_cat_whiskers.png'), PNG.sync.write(renderClayModel(createClayCatWhiskers())));

// Category: prop
console.log('Rendering new handheld props...');
fs.writeFileSync(path.join(OUT_DIR, 'prop_lollipop.png'), PNG.sync.write(renderClayModel(createClayLollipop())));
fs.writeFileSync(path.join(OUT_DIR, 'prop_heart_balloon.png'), PNG.sync.write(renderClayModel(createClayHeartBalloon())));
fs.writeFileSync(path.join(OUT_DIR, 'prop_rainbow_scepter.png'), PNG.sync.write(renderClayModel(createClayRainbowScepter())));
fs.writeFileSync(path.join(OUT_DIR, 'prop_baby_bottle.png'), PNG.sync.write(renderClayModel(createClayBabyBottle())));

// Category: plush
console.log('Rendering new plushes & shoes...');
fs.writeFileSync(path.join(OUT_DIR, 'plush_rubber_duck.png'), PNG.sync.write(renderClayModel(createClayRubberDuck())));
fs.writeFileSync(path.join(OUT_DIR, 'plush_dino_plush.png'), PNG.sync.write(renderClayModel(createClayDinoPlush())));
fs.writeFileSync(path.join(OUT_DIR, 'plush_bear_slippers.png'), PNG.sync.write(renderClayModel(createClayBearSlippers())));
fs.writeFileSync(path.join(OUT_DIR, 'plush_frog_plush.png'), PNG.sync.write(renderClayModel(createClayFrogPlush())));

console.log('=== 3. CLEANING STRAY ARTIFACTS ON ALL EXISTING ACCESSORIES ===');
const existingFiles = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.png'));
existingFiles.forEach(f => {
  // Do not clean the newly rendered clay models (they are already pristine)
  if (!f.startsWith('jewelry_red_bow') && !f.startsWith('jewelry_pink_bow') && !f.startsWith('jewelry_necktie') &&
      !f.startsWith('jewelry_yellow_polka_bow') && !f.startsWith('jewelry_mint_bow') && !f.startsWith('jewelry_gentleman_bowtie') &&
      !f.startsWith('jewelry_bell_choker') && !f.startsWith('jewelry_candy_necklace') && !f.startsWith('hat_party_cone') &&
      !f.startsWith('hat_bear_beanie') && !f.startsWith('hat_flower_crown') && !f.startsWith('hat_sailor_cap') &&
      !f.startsWith('face_heart_glasses') && !f.startsWith('face_star_glasses') && !f.startsWith('face_star_stickers') &&
      !f.startsWith('face_cat_whiskers') && !f.startsWith('prop_lollipop') && !f.startsWith('prop_heart_balloon') &&
      !f.startsWith('prop_rainbow_scepter') && !f.startsWith('prop_baby_bottle') && !f.startsWith('plush_rubber_duck') &&
      !f.startsWith('plush_dino_plush') && !f.startsWith('plush_bear_slippers') && !f.startsWith('plush_frog_plush')) {
    cleanExistingAccessory(f);
  }
});

console.log('ALL ACCESSORIES PRODUCED & CLEANED SUCCESSFULLY!');
