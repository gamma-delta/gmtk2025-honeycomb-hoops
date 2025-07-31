import { CANVAS, CONTROLS, CTX } from "../main.js";
import { Puzzle } from "../puzzle.js";
import { PuzzlePack } from "../puzzleList.js";
import { GameState, StateTransition } from "../states.js"
import * as Util from "../util.js";

export class StatePlayPuzzle implements GameState {
  puzzle: Puzzle;
  sidebar: string;

  constructor(puzzle: PuzzlePack) {
    this.puzzle = new Puzzle(puzzle.source);
    this.sidebar = puzzle.sidebar;
  }

  update(): StateTransition {
    this.puzzle.update();
    return null;
  }
  draw(): void {
    this.puzzle.draw();

    CTX.fillStyle = "#222";
    CTX.textAlign = "start";
    CTX.font = `24px "Courier New", sans-serif`;
    Util.drawTextWithNewlines(this.sidebar, 20, 40);
  }
  drawTransparent(): boolean {
    return false;
  }
}
