import { CANVAS, CONTROLS, CTX } from "./main.js";
import { GridCoord, HexCoord } from "./util.js";
import * as Util from "./util.js";

const TAU = Math.PI * 2;

export class Puzzle {
  radius: number;
  hexSize: number;
  origin: GridCoord;

  dragOrigin: HexCoord | null;
  connections: HexBoard<Connections>;

  constructor(radius: number) {
    this.radius = radius;
    this.hexSize = Math.max(40, Math.min(1000 / this.radius / 4, 120));
    this.origin = { x: CANVAS.width / 2, y: CANVAS.height / 2 };

    this.dragOrigin = null;
    this.connections = new HexBoard();
  }

  hoveredHex(): HexCoord {
    let mousePosAbs = Util.vSub(CONTROLS.mousePos(), this.origin);
    return Util.axialRound(Util.gridToHex(mousePosAbs, this.hexSize));
  }

  tick() {
    this.update();
    this.draw();
  }

  update() {
    let mouseHex = this.hoveredHex();

    if (CONTROLS.mouseDown() && Util.hexDistance(mouseHex) <= this.radius) {
      if (this.dragOrigin != null && !Util.vEq(mouseHex, this.dragOrigin)) {
        let delta = Util.vSub(mouseHex, this.dragOrigin);

        // Always store the stick-out-i-ness on the left hex of a boundary
        let positive = delta.q == 1 || (delta.q == 0 && delta.r == 1);
        let origin, posDelta;
        if (positive) {
          origin = this.dragOrigin;
          posDelta = delta;
        } else {
          origin = mouseHex;
          posDelta = { q: -delta.q, r: -delta.r };
        }
        let dirKey: keyof Connections;
        if (posDelta.q == 1 && posDelta.r == -1) {
          dirKey = "up";
        } else if (posDelta.q == 1 && posDelta.r == 0) {
          dirKey = "right";
        } else if (posDelta.q == 0 && posDelta.r == 1) {
          dirKey = "down";
        } else {
          console.log("Invalid drag delta.", { delta, positive, origin, posDelta });
          dirKey = "right";
        }

        let conn = this.connections.getOrInsert(origin, {
          up: false,
          right: false,
          down: false,
        });
        conn[dirKey] = !conn[dirKey];
      }

      this.dragOrigin = mouseHex;
    } else {
      this.dragOrigin = null;
    }
  }

  draw() {
    let mouseHex = this.hoveredHex();

    for (let pos of Util.iterHexSpiral(this.radius)) {
      let gridPos = Util.hexToGrid(pos, this.hexSize);
      let worldspacePos = Util.vAdd(gridPos, this.origin);

      let path = new Path2D();

      for (let clock = 0; clock <= 6; clock++) {
        let angle = (TAU / 6) * clock + (TAU / 12 * 5);
        let dx = Math.cos(angle);
        let dy = Math.sin(angle);
        let point = Util.vAdd(worldspacePos,
          { x: dx * this.hexSize, y: dy * this.hexSize });
        if (clock == 0) {
          path.moveTo(point.x, point.y);
        } else {
          path.lineTo(point.x, point.y);
        }
      }

      // Draw outline over shading
      if (pos.q == mouseHex.q && pos.r == mouseHex.r) {
        CTX.beginPath();
        CTX.fillStyle = "#DDD";
        CTX.fill(path);
      }
      CTX.lineCap = "butt";
      CTX.beginPath();
      CTX.strokeStyle = "#BBB";
      CTX.lineWidth = 4;
      CTX.stroke(path);
    }

    // Draw the stroke over everything
    for (let pos of Util.iterHexSpiral(this.radius)) {
      let gridPos = Util.hexToGrid(pos, this.hexSize);
      let worldspacePos = Util.vAdd(gridPos, this.origin);

      let conns = this.connections.get(pos);
      if (conns != null) {
        let drawIt = (angle: number) => {
          let dx = Math.cos(angle);
          let dy = Math.sin(angle);
          let acrossSize = Math.sqrt(3) * this.hexSize;

          CTX.beginPath();
          CTX.strokeStyle = "#444";
          CTX.lineWidth = 8;
          CTX.lineCap = "round";
          CTX.moveTo(worldspacePos.x, worldspacePos.y);
          CTX.lineTo(
            worldspacePos.x + dx * acrossSize,
            worldspacePos.y + dy * acrossSize
          );
          CTX.stroke();
        }
        if (conns.up) drawIt(-TAU / 6);
        if (conns.right) drawIt(0);
        if (conns.down) drawIt(TAU / 6);
      }
    }
  }
}

class HexBoard<T> {
  storage: Map<string, T>;

  constructor() {
    this.storage = new Map();
  }

  static makeKey(pos: HexCoord): string {
    // I'm so so sorry. Got this idea from Lua docs. Sorry
    return pos.q + "," + pos.r;
  }
  static parseKey(key: string): HexCoord {
    let splitted = key.split(",");
    if (splitted.length !== 2) {
      console.error("Could not parse because bad comma count", key);
      return { q: 0, r: 0 };
    }
    let lhs = Number(splitted[0]);
    let rhs = Number(splitted[1]);
    if (isNaN(lhs) || isNaN(rhs)) {
      console.error("Could not parse because malformed numbers", key);
      return { q: 0, r: 0 };
    }
    return { q: lhs, r: lhs }
  }

  get(pos: HexCoord): T | null {
    // I'm so so sorry. Got this idea from Lua docs. Sorry
    return this.storage.get(HexBoard.makeKey(pos)) ?? null;
  }

  set(pos: HexCoord, obj: T): T | null {
    let prev = this.get(pos);
    this.storage.set(HexBoard.makeKey(pos), obj);
    return prev;
  }

  getOrInsert(pos: HexCoord, backup: T): T {
    let here = this.get(pos);
    if (here !== null) {
      return here;
    } else {
      this.set(pos, backup);
      return backup;
    }
  }

  *iter(): Iterator<[HexCoord, T]> {
    for (let [k, v] of this.storage) {
      let hexKey = HexBoard.parseKey(k);
      yield [hexKey, v];
    }
  }
}

type PuzzlePiece = number;

type Connections = {
  /*
    / \ U
   |  | R
   \ / D
  */
  up: boolean,
  right: boolean,
  down: boolean,
}
