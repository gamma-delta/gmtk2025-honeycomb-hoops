import { CANVAS, CONTROLS, CTX } from "../main.js";
import { Puzzle } from "../puzzle.js";
import { puzzlePacks } from "../puzzleList.js";
import { GameState, StateTransition } from "../states.js"
import * as Util from "../util.js";
import { StatePlayPuzzle } from "./playPuzzle.js";

export class StateSplash implements GameState {
  ticksAlive: number = 0;

  update(): StateTransition {
    this.ticksAlive += 1;

    if (CONTROLS.mouseClicked()) {
      // TODO: push level select
      return {
        type: "push",
        state: new StatePlayPuzzle(0),
      };
    } else {
      return null;
    }
  }
  draw(): void {
    CTX.fillStyle = "white";
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);

    let centerX = CANVAS.width / 2;
    let centerY = CANVAS.height / 2;

    CTX.textAlign = "center";

    CTX.fillStyle = lerpToDark(this.ticksAlive / 60);
    CTX.font = `120px "Courier New", sans-serif`;
    CTX.fillText("Honeycomb Hoops", centerX, centerY - 80);

    CTX.fillStyle = lerpToDark(Math.min((this.ticksAlive - 60) / 60, 0.6));
    CTX.font = `40px "Courier New", sans-serif`;
    CTX.fillText("by petrak@", centerX, centerY);

    CTX.fillStyle = lerpToDark((this.ticksAlive - 120) / 120);
    CTX.fillText("Click to Start", centerX, centerY + 80);
  }
  drawTransparent(): boolean {
    return false;
  }
}

function lerpToDark(t: number): string {
  t = Util.clamp(t, 0, 1);
  let percent = (1 - t) * 100;
  return "hsl(0 0 " + percent.toFixed(0) + ")";
}
