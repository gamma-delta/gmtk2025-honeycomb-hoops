import { CANVAS, CONTROLS, CTX } from "./main.js";
import { SOUNDS } from "./sounds.js";
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
  displayOnly: boolean;
  eraseMode: boolean;

  constructor(rules: string, displayOnly: boolean = false, origin: GridCoord | null = null) {
    // This is how Hexagony does it
    let cleanRules = rules.replace(/\s+/g, "");
    // Unfortunately hexagony uses weird rectangular something coords
    // so i can't steal their algorithm
    // https://en.wikipedia.org/wiki/Centered_hexagonal_number
    this.radius = Math.ceil((3 + Math.sqrt(12 * cleanRules.length - 3)) / 6) - 1;

    this.displayOnly = displayOnly;
    this.eraseMode = false;

    let scale = this.displayOnly ? 0.2 : 1;
    this.hexSize = Math.max(40, Math.min(900 / this.radius / 4, 120)) * scale;
    this.origin = origin ?? { x: CANVAS.width / 2, y: CANVAS.height / 2 };
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

  update() {
    let mouseHex = this.hoveredHex();

    if (!this.won && !this.displayOnly) {
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
          let dirKey: keyof Connections | null;
          if (posDelta.q == 1 && posDelta.r == -1) {
            dirKey = "up";
          } else if (posDelta.q == 1 && posDelta.r == 0) {
            dirKey = "right";
          } else if (posDelta.q == 0 && posDelta.r == 1) {
            dirKey = "down";
          } else {
            console.log("Invalid drag delta.", { delta, positive, origin, posDelta });
            dirKey = null;
          }

          if (dirKey != null) {
            let conn = this.connections.getOrInsert(origin, {
              up: false,
              right: false,
              down: false,
            });
            if (this.eraseMode) {
              if (conn[dirKey])
                SOUNDS.erase.pickAndPlay();
              conn[dirKey] = false;
            } else {
              SOUNDS.tap.pickAndPlay();
              conn[dirKey] = !conn[dirKey];
            }
          }

          let youWin = this.checkWon();
          if (youWin) {
            SOUNDS.win.pickAndPlay();
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
    let dirs6: (keyof Connections6)[] = ["up", "right", "down", "backUp", "backRight", "backDown"];
    let anyStartPos: HexCoord | null = null;

    let encounteredWithConns = new Set();
    for (let pos of Util.iterHexSpiral(this.radius)) {
      let rule = this.rules.get(pos);
      let conn6 = this.getAllConnections(pos);
      let arity = this.conn6Count(conn6);

      if (arity != 0) {
        encounteredWithConns.add(HexBoard.makeKey(pos));
      }

      if (arity != 0 && anyStartPos == null) {
        anyStartPos = pos;
      }
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

    // Path along. make sure that it forms one loop.
    let visited = new Set();
    if (anyStartPos == null) return false;
    let cursor = { ...anyStartPos };
    let entryDir: keyof Connections6 | null = null;
    let originalExitDir: keyof Connections6 | null = null;

    let i = 1000;
    for (; i > 0; i--) {
      let nextDir: keyof Connections6 | null = null;

      visited.add(HexBoard.makeKey(cursor));

      let conns = this.getAllConnections(cursor);
      let arity = this.conn6Count(conns);
      if (arity == 2) {
        // Go out "the other way"
        for (let dir of dirs6) {
          if (conns[dir] && entryDir != this.flipDir6(dir)) {
            nextDir = dir;
            break;
          }
        }
      } else {
        // Hopefully arity == 4
        if (entryDir == null) {
          // Just pick something
          for (let dir of dirs6) {
            if (conns[dir]) {
              nextDir = dir;
              break;
            }
          }
        } else {
          nextDir = entryDir;
        }
      }

      // Move the cursor
      let cursor2 = { q: cursor.q, r: cursor.r };
      if (nextDir == "up") { cursor2.q += 1; cursor2.r -= 1; }
      else if (nextDir == "right") { cursor2.q += 1; }
      else if (nextDir == "down") { cursor2.r += 1; }
      else if (nextDir == "backUp") { cursor2.r -= 1; }
      else if (nextDir == "backRight") { cursor2.q -= 1; }
      else if (nextDir == "backDown") { cursor2.q -= 1; cursor2.r += 1; }

      // Shuffle it all down
      entryDir = nextDir;
      if (originalExitDir == null) {
        originalExitDir = nextDir;
      }

      if (i != 1000 && Util.vEq(cursor, anyStartPos) && originalExitDir == nextDir) {
        // We're about to do what we started with.
        break;
      }

      cursor = cursor2;
    }
    // ran out of checking time
    // this code isn't perfect and sometimes loops forever
    // so this is a failsafe
    if (i == 0) {
      return false;
    }

    if (visited.size != encounteredWithConns.size) {
      return false;
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
      let hoverThis = (pos.q == mouseHex.q && pos.r == mouseHex.r) && !this.displayOnly;
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
      CTX.lineWidth = 5;
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
