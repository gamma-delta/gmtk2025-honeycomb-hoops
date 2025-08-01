import { CANVAS, CONTROLS, CTX } from "../main.js";
import { Puzzle } from "../puzzle.js";
import { PuzzlePack } from "../puzzleList.js";
import { GameState, StateTransition } from "../states.js"
import * as Util from "../util.js";
import { ClickButton, Widget } from "../widget.js";

export class StatePlayPuzzle implements GameState {
  puzzle: Puzzle;
  sidebar: string;

  widgets: Widget<StatePlayPuzzle>[];

  constructor(puzzle: PuzzlePack) {
    this.puzzle = new Puzzle(puzzle.source);
    this.sidebar = puzzle.sidebar;

    this.widgets = [];
    let centerX = CANVAS.width / 2;
    let centerY = CANVAS.height / 2;

    this.widgets.push(new EraseModeButton(this));
    this.widgets.push(new NextLevelButton(this));
  }

  update(): StateTransition {
    this.puzzle.update();

    for (let w of this.widgets) {
      w.update();
    }

    return null;
  }
  draw(): void {
    CTX.fillStyle = "white";
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
    this.puzzle.draw();

    CTX.fillStyle = "#222";
    CTX.textAlign = "start";
    CTX.font = `24px "Courier New", sans-serif`;
    Util.drawTextWithNewlines(this.sidebar, 20, 40);

    for (let w of this.widgets) {
      w.draw();
    }
  }
  drawTransparent(): boolean {
    return false;
  }
}

class EraseModeButton extends Widget<StatePlayPuzzle> {
  constructor(state: StatePlayPuzzle) {
    super(
      state,
      CANVAS.width - 500, CANVAS.height - 400,
      400, 100,
    )
  }
  onClick(): void {
  }
  draw(): void {
    this.outline("white", "black");

    CTX.textAlign = "center";
    CTX.font = `40px "Courier New", sans-serif`;
    CTX.fillStyle = "black";
    this.centerText(this.state.puzzle.eraseMode ? "Eraser: On" : "Eraser: Off");
  }
}
class NextLevelButton extends Widget<StatePlayPuzzle> {
  constructor(state: StatePlayPuzzle) {
    super(
      state,
      CANVAS.width - 500, CANVAS.height - 150,
      400, 100,
    )
  }
  onClick(): void {
    this.state.puzzle.eraseMode = !this.state.puzzle.eraseMode;
  }
  draw(): void {
    if (this.state.puzzle.won) {
      this.outline("white", "black");

      CTX.textAlign = "center";
      CTX.font = `40px "Courier New", sans-serif`;
      CTX.fillStyle = "black";
      this.centerText("Next Level");
    }
  }
}
