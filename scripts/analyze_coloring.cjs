const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

// Measure an image: max black radius, black pixel count, black ratio, and region count
function analyzeBinaryImage(blackArr, width, height) {
  const INF = 999999;
  const dist = new Int32Array(width * height);
  let blackCount = 0;

  for (let i = 0; i < width * height; i++) {
    if (blackArr[i] === 1) {
      dist[i] = INF;
      blackCount++;
    } else {
      dist[i] = 0;
    }
  }

  // Forward pass 3-4 distance transform
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

  // Backward pass
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

  let maxDist = 0;
  for (let i = 0; i < width * height; i++) {
    if (dist[i] > maxDist) maxDist = dist[i];
  }
  const maxRadiusPx = (maxDist / 3).toFixed(1);
  const blackRatio = (blackCount / (width * height) * 100).toFixed(2);

  // Connected white regions (Flood Fill)
  const visited = new Uint8Array(width * height);
  let regionCount = 0;
  const minRegionSize = Math.floor(width * height * 0.005); // 0.5% min region size
  const regions = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const startIdx = y * width + x;
      if (blackArr[startIdx] === 0 && visited[startIdx] === 0) {
        // BFS
        let size = 0;
        const queue = [startIdx];
        visited[startIdx] = 1;

        while (queue.length > 0) {
          const curr = queue.pop();
          size++;
          const cx = curr % width;
          const cy = Math.floor(curr / width);

          const neighbors = [
            cy > 0 ? curr - width : -1,
            cy < height - 1 ? curr + width : -1,
            cx > 0 ? curr - 1 : -1,
            cx < width - 1 ? curr + 1 : -1,
          ];

          for (const n of neighbors) {
            if (n >= 0 && blackArr[n] === 0 && visited[n] === 0) {
              visited[n] = 1;
              queue.push(n);
            }
          }
        }

        if (size >= minRegionSize) {
          regions.push(size);
          regionCount++;
        }
      }
    }
  }

  return {
    maxDist,
    maxRadiusPx: parseFloat(maxRadiusPx),
    blackCount,
    blackRatio: parseFloat(blackRatio),
    regionCount,
    regions,
  };
}

module.exports = { analyzeBinaryImage };
