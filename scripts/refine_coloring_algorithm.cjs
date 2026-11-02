const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const { analyzeBinaryImage } = require('./analyze_coloring.cjs');

/**
 * 1. Binarize (threshold 128)
 * 2. Distance transform on black pixels: dist[i] = distance to nearest white pixel
 *    Pixels with radius > 5px (distance > 15 in Chamfer 3-4) are solid black
 * 3. In solid components: keep outer rim of 6px (dist <= 18 in Chamfer 3-4), turn interior (dist > 18) to white
 * 4. Close narrow white gaps (width < 4px) between black strokes to merge double lines into a single stroke:
 *    If a white pixel is sandwiched between black pixels within 3px on opposite sides, fill it.
 *    Then regularize stroke width to ~6px (Chamfer radius ~3px).
 * 5. Close line leaks / simplify regions:
 *    Ensure outer boundary is clean and closed. Remove tiny speckles.
 */
function processColoringBuffer(png) {
  const { width, height, data } = png;
  const total = width * height;

  // Step 1: Binarize
  const bin = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
    const alpha = data[idx + 3];
    bin[i] = (lum < 128 && alpha > 50) ? 1 : 0;
  }

  // Helper: compute Chamfer 3-4 distance transform on binary mask
  // where targetVal is the feature and otherVal is the background (distance = 0)
  function chamferDist(mask, targetVal) {
    const INF = 999999;
    const dist = new Int32Array(total);
    for (let i = 0; i < total; i++) {
      dist[i] = mask[i] === targetVal ? INF : 0;
    }

    // Forward
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (dist[idx] > 0) {
          let d = dist[idx];
          if (x > 0) d = Math.min(d, dist[idx - 1] + 3);
          if (y > 0) {
            d = Math.min(d, dist[idx - width] + 3);
            if (x > 0) d = Math.min(d, dist[idx - width - 1] + 4);
            if (x < width - 1) d = Math.min(d, dist[idx - width + 1] + 4);
          }
          dist[idx] = d;
        }
      }
    }

    // Backward
    for (let y = height - 1; y >= 0; y--) {
      for (let x = width - 1; x >= 0; x--) {
        const idx = y * width + x;
        if (dist[idx] > 0) {
          let d = dist[idx];
          if (x < width - 1) d = Math.min(d, dist[idx + 1] + 3);
          if (y < height - 1) {
            d = Math.min(d, dist[idx + width] + 3);
            if (x > 0) d = Math.min(d, dist[idx + width - 1] + 4);
            if (x < width - 1) d = Math.min(d, dist[idx + width + 1] + 4);
          }
          dist[idx] = d;
        }
      }
    }

    return dist;
  }

  // Step 2 & 3: Distance transform on black pixels
  let blackDist = chamferDist(bin, 1);
  const out1 = new Uint8Array(bin);

  // Keep outer rim ~5px (dist <= 14) of any thick solid black area, turn interior (dist > 14) to white
  for (let i = 0; i < total; i++) {
    if (bin[i] === 1 && blackDist[i] > 14) { // > 4.6px from edge
      out1[i] = 0; // Turn interior to white
    }
  }

  // Step 4: Fill narrow white gaps (width < 4px) between black strokes to merge double lines
  const out2 = new Uint8Array(out1);
  for (let y = 3; y < height - 3; y++) {
    for (let x = 3; x < width - 3; x++) {
      const idx = y * width + x;
      if (out1[idx] === 0) { // white pixel
        // Check horizontal gap <= 3px
        const l1 = out1[idx - 1], l2 = out1[idx - 2], l3 = out1[idx - 3];
        const r1 = out1[idx + 1], r2 = out1[idx + 2], r3 = out1[idx + 3];
        const hasLeft = l1 || l2 || l3;
        const hasRight = r1 || r2 || r3;
        const hGap = (hasLeft && hasRight) && (l1 + l2 + l3 + r1 + r2 + r3 >= 2);

        // Check vertical gap <= 3px
        const t1 = out1[idx - width], t2 = out1[idx - width * 2], t3 = out1[idx - width * 3];
        const b1 = out1[idx + width], b2 = out1[idx + width * 2], b3 = out1[idx + width * 3];
        const hasTop = t1 || t2 || t3;
        const hasBottom = b1 || b2 || b3;
        const vGap = (hasTop && hasBottom) && (t1 + t2 + t3 + b1 + b2 + b3 >= 2);

        // Diagonal gaps <= 3px
        const d1a = out1[idx - width - 1], d1b = out1[idx - (width + 1) * 2];
        const d2a = out1[idx + width + 1], d2b = out1[idx + (width + 1) * 2];
        const diag1Gap = (d1a || d1b) && (d2a || d2b);

        const d3a = out1[idx - width + 1], d3b = out1[idx - (width - 1) * 2];
        const d4a = out1[idx + width - 1], d4b = out1[idx + (width - 1) * 2];
        const diag2Gap = (d3a || d3b) && (d4a || d4b);

        if (hGap || vGap || diag1Gap || diag2Gap) {
          out2[idx] = 1;
        }
      }
    }
  }

  // Regularize stroke thickness:
  // After filling narrow gaps, some strokes might be thicker than 10px (radius > 5px).
  // Distance transform on the merged black strokes:
  let mergedBlackDist = chamferDist(out2, 1);
  const out3 = new Uint8Array(out2);

  // If any merged area became thick (> 10px / radius > 5px / dist > 14), turn interior to white
  for (let i = 0; i < total; i++) {
    if (out2[i] === 1 && mergedBlackDist[i] > 14) {
      out3[i] = 0;
    }
  }

  // Calculate current black count
  let currentBlack = 0;
  for (let i = 0; i < total; i++) if (out3[i] === 1) currentBlack++;
  let currentRatio = (currentBlack / total) * 100;

  // Adaptive thinning if black ratio is too high (>= 11.5%)
  while (true) {
    let count = 0;
    for (let i = 0; i < total; i++) if (out3[i] === 1) count++;
    const ratio = (count / total) * 100;
    if (ratio < 11.5) break;

    const dPass = chamferDist(out3, 1);
    let removed = 0;
    for (let i = 0; i < total; i++) {
      if (out3[i] === 1 && dPass[i] >= 9) { // thin inner core
        out3[i] = 0;
        removed++;
      }
    }
    if (removed === 0) {
      // If no pixels have d >= 9, thin edge with d >= 6
      for (let i = 0; i < total; i++) {
        if (out3[i] === 1 && dPass[i] >= 6) {
          out3[i] = 0;
          removed++;
        }
      }
    }
    if (removed === 0) break;
  }

  // Step 5: Close line leaks on boundaries:
  // Remove 1px-2px speckles (isolated black dots with <= 2 black neighbors)
  const out4 = new Uint8Array(out3);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (out3[idx] === 1) {
        let neighborCount = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;
            if (out3[(y + dy) * width + (x + dx)] === 1) neighborCount++;
          }
        }
        if (neighborCount <= 1) {
          out4[idx] = 0; // Remove single noisy isolated speckle
        }
      }
    }
  }

  // Border frame: make sure outer 2px is pure white
  for (let x = 0; x < width; x++) {
    out4[x] = 0;
    out4[width + x] = 0;
    out4[(height - 1) * width + x] = 0;
    out4[(height - 2) * width + x] = 0;
  }
  for (let y = 0; y < height; y++) {
    out4[y * width] = 0;
    out4[y * width + 1] = 0;
    out4[y * width + (width - 1)] = 0;
    out4[y * width + (width - 2)] = 0;
  }

  // Generate output RGBA buffer
  const outPng = new PNG({ width, height });
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    if (out4[i] === 1) {
      // Clean dark stroke #1E293B (30, 41, 59)
      outPng.data[idx] = 30;
      outPng.data[idx + 1] = 41;
      outPng.data[idx + 2] = 59;
      outPng.data[idx + 3] = 255;
    } else {
      // Pure white #FFFFFF (255, 255, 255)
      outPng.data[idx] = 255;
      outPng.data[idx + 1] = 255;
      outPng.data[idx + 2] = 255;
      outPng.data[idx + 3] = 255;
    }
  }

  const stats = analyzeBinaryImage(out4, width, height);
  return { outPng, stats };
}

module.exports = { processColoringBuffer };
