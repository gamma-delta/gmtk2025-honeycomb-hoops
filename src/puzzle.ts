import { CANVAS, CONTROLS, CTX } from "./main.js";
import { GridCoord, HexCoord } from "./util.js";
import * as Util from "./util.js";

const TAU = Math.PI * 2;

export class Puzzle {
  radius: number;
  hexSize: number;
  origin: GridCoord;

  rules: HexBoard<PuzzlePiece>;
  dragOrigin: HexCoord | null;
  connections: HexBoard<Connections>;

  won: boolean;

  constructor(rules: string) {
    // This is how Hexagony does it
    let cleanRules = rules.replace(/\s+/g, "");
    console.log(cleanRules);
    // Unfortunately hexagony uses weird rectangular something coords
    // https://en.wikipedia.org/wiki/Centered_hexagonal_number
    this.radius = Math.ceil((3 + Math.sqrt(12 * cleanRules.length - 3)) / 6) - 1;

    this.hexSize = Math.max(40, Math.min(1000 / this.radius / 4, 120));
    this.origin = { x: CANVAS.width / 2, y: CANVAS.height / 2 };
    this.won = false;

    this.rules = new HexBoard();
    this.dragOrigin = null;
    this.connections = new HexBoard();

    // I recognize this is unreadable, sorry
    let across = this.radius + 1;
    let row = 0;
    let ltr = 0;
    for (let i = 0; row < this.radius * 2 + 1; i++) {
      let expanding = row < this.radius;
      let leftmostQ = expanding ? -row : -this.radius;
      let coord = {
        q: leftmostQ + ltr,
        r: row - this.radius,
      };
      // console.log(ltr, row, across, coord);
      let ch = cleanRules.charAt(i);
      if (ch == "K" || ch == "O" || ch == "X") {
        this.rules.set(coord, ch);
      }

      if (ltr >= across - 1) {
        ltr = 0;
        row += 1;
        if (expanding) {
          across += 1;
        } else {
          across -= 1;
        }
      } else {
        ltr += 1;
      }
    }

    // console.log(this.rules.storage);
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

    if (!this.won) {
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

          let youWin = this.checkWon();
          if (youWin) {
            this.won = true;
          }
        }

        this.dragOrigin = mouseHex;
      } else {
        this.dragOrigin = null;
      }
    }
  }

  getAllConnections(hex: HexCoord): Connections6 {
    let conn = this.connections.get(hex) ?? { up: false, right: false, down: false };
    return {
      backUp: this.connections.get(Util.vAdd(hex, { q: 0, r: -1 }))?.down ?? false,
      backRight: this.connections.get(Util.vAdd(hex, { q: -1, r: 0 }))?.right ?? false,
      backDown: this.connections.get(Util.vAdd(hex, { q: -1, r: 1 }))?.up ?? false,
      ...conn
    };
  }

  conn6Count(conn: Connections6): number {
    return (conn.up ? 1 : 0)
      + (conn.right ? 1 : 0)
      + (conn.down ? 1 : 0)
      + (conn.backUp ? 1 : 0)
      + (conn.backRight ? 1 : 0)
      + (conn.backDown ? 1 : 0)
  }
  flipDir6(dir: keyof Connections6): keyof Connections6 {
    switch (dir) {
      case "up": return "backDown";
      case "right": return "backRight";
      case "down": return "backUp";
      case "backUp": return "down";
      case "backRight": return "right";
      case "backDown": return "up";
    }
  }

  checkWon(): boolean {
    let dirs6: (keyof Connections6)[] = ["up", "right", "down", "backUp", "backRight", "backDown"]
    for (let pos of Util.iterHexSpiral(this.radius)) {
      let rule = this.rules.get(pos);
      let conn6 = this.getAllConnections(pos);
      let arity = this.conn6Count(conn6);
      // console.log(pos, conn6, arity, rule);
      // Euler characteristic: no odd nodes.
      if (arity == 1 || arity == 3 || arity == 5) {
        return false;
      }

      let crossesSelf = arity == 4;
      // Double check no K shape
      if (crossesSelf) {
        for (let dir of dirs6) {
          let flip = this.flipDir6(dir);
          if (conn6[dir] != conn6[flip]) {
            crossesSelf = false;
          }
        }
      }

      if (rule == "K") {
        if (arity != 2) {
          return false;
        }
        // Must bend
        for (let dir of dirs6) {
          let flip = this.flipDir6(dir);
          // We have a straight line
          if (conn6[dir] && conn6[flip]) {
            return false;
          }
        }
      } else if (rule == "O") {
        if (arity != 2) {
          return false;
        }
        // Must go straight
        for (let dir of dirs6) {
          let flip = this.flipDir6(dir);
          // console.log(dir, flip)
          if (conn6[dir] && !conn6[flip]) {
            return false;
          }
        }
      } else if (rule == "X") {
        if (!crossesSelf) {
          return false
        }
      } else {
        // Only crossing allowed is on squares
        if (crossesSelf) {
          return false;
        }
      }
    }
    return true;

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
      let hoverThis = pos.q == mouseHex.q && pos.r == mouseHex.r;
      let hexColor;
      if (this.won) {
        hexColor = hoverThis ? "#BDB" : "#BFB";
      } else {
        hexColor = hoverThis ? "#DDD" : "#FFF"
      }

      CTX.beginPath();
      CTX.fillStyle = hexColor;
      CTX.fill(path);
      CTX.lineCap = "butt";
      CTX.beginPath();
      CTX.strokeStyle = "#BBB";
      CTX.lineWidth = 4;
      CTX.stroke(path);

      // Draw rules
      let rule = this.rules.get(pos);
      // let rule = "X";
      if (rule == "K" || rule == "O") {
        let circRadius = this.hexSize * 0.5;

        CTX.fillStyle = (rule == "K") ? "black" : "white";
        CTX.beginPath();
        CTX.arc(worldspacePos.x, worldspacePos.y, circRadius, 0, 360);
        CTX.fill();

        CTX.strokeStyle = "black";
        CTX.beginPath();
        CTX.arc(worldspacePos.x, worldspacePos.y, circRadius, 0, 360);
        CTX.stroke();
      } else if (rule == "X") {
        // Draw a black square I guess?
        let delta = this.hexSize * 0.3;
        CTX.fillStyle = "#222";
        CTX.strokeStyle = "#222";
        CTX.beginPath();
        CTX.rect(worldspacePos.x - delta, worldspacePos.y - delta,
          delta * 2, delta * 2);
        CTX.fill();
        CTX.beginPath();
        CTX.rect(worldspacePos.x - delta, worldspacePos.y - delta,
          delta * 2, delta * 2);
        CTX.stroke();
      }
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
    return { q: lhs, r: rhs }
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

  *iter(): Generator<[HexCoord, T]> {
    for (let [k, v] of this.storage) {
      let hexKey = HexBoard.parseKey(k);
      // console.log(k, hexKey, v);
      yield [hexKey, v];
    }
  }
}

type PuzzlePiece = "K" | "O" | "X";

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
type Connections6 = {
  /*
 U  / \ U
 R |  | R
 D \ / D
  */
  up: boolean,
  right: boolean,
  down: boolean,
  backUp: boolean,
  backRight: boolean,
  backDown: boolean,
}
