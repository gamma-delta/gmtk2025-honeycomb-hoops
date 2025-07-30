import { CANVAS, CTX } from "./main.js"

// Axial coordinates, pointy tops
export type HexCoord = { q: number, r: number };
export type GridCoord = { x: number, y: number };

export function* iterHexSpiral(radius: number): Iterable<HexCoord> {
  for (let q = -radius; q <= radius; q++) {
    let min = Math.max(-radius, -q - radius);
    let max = Math.min(radius, -q + radius);
    for (let r = min; r <= max; r++) {
      yield { q, r };
    }
  }
}

export function hexToGrid(hex: HexCoord, size: number): GridCoord {
  return {
    x: (Math.sqrt(3) * hex.q + Math.sqrt(3) / 2 * hex.r) * size,
    y: (3 / 2 * hex.r) * size
  }
}
export function gridToHex(grid: GridCoord, size: number): HexCoord {
  return {
    q: Math.sqrt(3) / 3 * grid.x / size - 1 / 3 * grid.y / size,
    r: 2 / 3 * grid.y / size,
  }
}

export function drawHexGrid(radius: number) {
  for (let pos of iterHexSpiral(radius)) {
    let gridPos = hexToGrid(pos, 16);
    CTX.beginPath();
    CTX.fillStyle = "black";
    CTX.arc(gridPos.x + 128, gridPos.y + 128, 5, 0, 360);
    CTX.fill();
  }
}
