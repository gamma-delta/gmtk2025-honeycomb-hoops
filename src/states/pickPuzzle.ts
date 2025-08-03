import { CANVAS, CONTROLS, CTX } from "../main.js";
import { Puzzle } from "../puzzle.js";
import { PuzzlePack, puzzlePacks } from "../puzzleList.js";
import { SOUNDS } from "../sounds.js";
import { GameState, StateTransition } from "../states.js"
import * as Util from "../util.js";
import { ClickButton, Widget } from "../widget.js";
import { StatePlayPuzzle } from "./playPuzzle.js";

const PUZZLES_ACROSS = 8;
const PADDING = 20;

export class StatePickPuzzle implements GameState {
  pickedIndex: number | null = null;

  widgets: Widget<StatePickPuzzle>[];

  constructor() {
    this.widgets = puzzlePacks.map((pp, idx) => {
      return new LevelButton(this, pp.source, idx);
    });
  }

  update(): StateTransition {
    for (let w of this.widgets) {
      w.update();
    }

    if (this.pickedIndex !== null) {
      let idx = this.pickedIndex;
      this.pickedIndex = null;
      return {
        type: "push",
        state: new StatePlayPuzzle(idx),
      }
    }

    return null;
  }
  draw(): void {
    CTX.fillStyle = "white";
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
    for (let w of this.widgets) {
      w.draw();
    }
  }

  drawTransparent(): boolean {
    return false;
  }
}

class LevelButton extends Widget<StatePickPuzzle> {
  puzzle: Puzzle;
  idx: number;

  constructor(state: StatePickPuzzle, puzzleSrc: string, idx: number) {
    let sqX = idx % PUZZLES_ACROSS;
    let sqY = Math.floor(idx / PUZZLES_ACROSS);

    let strideX = (CANVAS.width - PADDING) / PUZZLES_ACROSS;
    let sz = strideX - PADDING;
    let pxX = PADDING + sqX * strideX;
    let pxY = PADDING + sqY * strideX;
    super(state, pxX, pxY, sz, sz);

    this.puzzle = new Puzzle(puzzleSrc, true, {
      x: pxX + sz / 2,
      y: pxY + sz / 2
    });
    this.idx = idx;
  }

  onClick(): void {
    this.state.pickedIndex = this.idx;
    SOUNDS.button_down.pickAndPlay();
  }
  draw(): void {
    this.outline("white", this.isHovered ? "#222" : "#999", 2);

    this.puzzle.draw();
  }
}
