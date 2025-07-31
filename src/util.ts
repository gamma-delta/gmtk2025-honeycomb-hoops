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

export function axialRound(hex: HexCoord): HexCoord {
  let hex_s = -hex.q - hex.r;

  let q = Math.round(hex.q);
  let r = Math.round(hex.r);
  let s = Math.round(hex_s);

  let q_diff = Math.abs(q - hex.q);
  let r_diff = Math.abs(r - hex.r);
  let s_diff = Math.abs(s - hex_s);

  if (q_diff > r_diff && q_diff > s_diff) {
    q = -r - s;
  } else if (r_diff > s_diff) {
    r = -q - s;
  } else {
    // s = -q - r;
  }
  return { q, r };
}

export function hexDistance(a: HexCoord, b?: HexCoord): number {
  if (b === undefined) {
    b = { q: 0, r: 0 };
  }

  return (Math.abs(a.q - b.q)
    + Math.abs(a.q + a.r - b.q - b.r)
    + Math.abs(a.r - b.r)) / 2;
}

export function drawHexGrid(radius: number) {
  for (let pos of iterHexSpiral(radius)) {
    let gridPos = hexToGrid(pos, 16);
    CTX.beginPath();
    CTX.fillStyle = "#2";
    CTX.arc(gridPos.x + 128, gridPos.y + 128, 5, 0, 360);
    CTX.fill();
  }
}

type ACoord = {
  [key: string]: number
};
export function vMath<T extends ACoord>(
  lhs: T,
  rhs: T,
  math: (l: number, r: number) => number
): T {
  let keys = Object.keys(lhs);
  let out: any = {};
  for (let k of keys) {
    let res = math(lhs[k], rhs[k]);
    // sigh
    if (res === -0) res = 0;
    out[k] = res;
  }
  return out;
}
export function vAdd<T extends ACoord>(lhs: T, rhs: T) {
  return vMath(lhs, rhs, (l, r) => l + r);
}
export function vSub<T extends ACoord>(lhs: T, rhs: T) {
  return vMath(lhs, rhs, (l, r) => l - r);
}
export function vEq<T extends ACoord>(lhs: T, rhs: T): boolean {
  let keys = Object.keys(lhs);
  for (let k of keys) {
    if (lhs[k] !== rhs[k]) return false
  }
  return true;
}

export function clamp(x: number, min: number, max: number) {
  return Math.max(min, Math.min(x, max));
}

export function drawTextWithNewlines(text: string, x: number, y: number) {
  let lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let metrics = CTX.measureText(lines[i]);
    let height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    CTX.fillText(lines[i], x, y + i * height);
  }
}
