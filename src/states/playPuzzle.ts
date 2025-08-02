import { CANVAS, CONTROLS, CTX } from "../main.js";
import { Puzzle } from "../puzzle.js";
import { PuzzlePack, puzzlePacks } from "../puzzleList.js";
import { GameState, StateTransition } from "../states.js"
import * as Util from "../util.js";
import { ClickButton, Widget } from "../widget.js";

const BUTTON_WIDTH = 250;
const BUTTON_HEIGHT = 80;

export class StatePlayPuzzle implements GameState {
  puzzle: Puzzle;
  sidebar: string;
  puzzleIndex: number;

  widgets: Widget<StatePlayPuzzle>[];

  goToNextPuzzle: boolean = false;
  exitBack: boolean = false;

  constructor(puzzleIndex: number) {
    this.puzzleIndex = puzzleIndex;
    let puzzle = puzzlePacks[puzzleIndex];
    this.puzzle = new Puzzle(puzzle.source);
    this.sidebar = puzzle.sidebar;

    this.widgets = [];
    let centerX = CANVAS.width / 2;
    let centerY = CANVAS.height / 2;
    let columnLhs = CANVAS.width - BUTTON_WIDTH * 1.5;
    let buttonStartY = centerY - BUTTON_HEIGHT / 2;

    this.widgets.push(new EraseModeButton(this, columnLhs, buttonStartY));
    this.widgets.push(new BackToLevelSelectButton(this, columnLhs, buttonStartY + 120));
    this.widgets.push(new NextLevelButton(this, columnLhs, buttonStartY + 240));
  }

  update(): StateTransition {
    if (this.goToNextPuzzle) {
      // TODO: what to do if you win every puzzle
      return {
        type: "swap",
        state: new StatePlayPuzzle(this.puzzleIndex + 1),
      }
    } else if (this.exitBack) {
      return { type: "pop" };
    }

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
  constructor(state: StatePlayPuzzle, x: number, y: number) {
    super(
      state,
      x, y, BUTTON_WIDTH, BUTTON_HEIGHT,
    )
  }
  onClick(): void {
    if (!this.state.puzzle.won)
      this.state.puzzle.eraseMode = !this.state.puzzle.eraseMode;
  }
  draw(): void {
    let darkColor;
    if (!this.state.puzzle.won
      && (this.state.puzzle.eraseMode || this.isHovered)) {
      darkColor = "#444"
    } else {
      darkColor = "#999"
    }
    this.outline(
      this.state.puzzle.eraseMode ? "#EBB" : "white",
      darkColor,
    );

    CTX.textAlign = "center";
    CTX.font = `24px "Courier New", sans-serif`;
    CTX.fillStyle = darkColor;
    this.centerText(this.state.puzzle.eraseMode ? "Eraser: On" : "Eraser: Off");
  }
}
class BackToLevelSelectButton extends Widget<StatePlayPuzzle> {
  constructor(state: StatePlayPuzzle, x: number, y: number) {
    super(
      state,
      x, y, BUTTON_WIDTH, BUTTON_HEIGHT,
    )
  }
  onClick(): void {
    this.state.exitBack = true;
  }

  draw(): void {
    let darkColor;
    if (this.isHovered) {
      darkColor = "#444"
    } else {
      darkColor = "#999"
    }
    this.outline(
      "#EBB",
      darkColor,
    );

    CTX.textAlign = "center";
    CTX.font = `24px "Courier New", sans-serif`;
    CTX.fillStyle = darkColor;
    this.centerText("Level Select");
  }
}
class NextLevelButton extends Widget<StatePlayPuzzle> {
  constructor(state: StatePlayPuzzle, x: number, y: number) {
    super(
      state,
      x, y, BUTTON_WIDTH, BUTTON_HEIGHT,
    )
  }
  onClick(): void {
    if (this.state.puzzle.won) {
      this.state.goToNextPuzzle = true;
    }
  }
  draw(): void {
    if (this.state.puzzle.won) {
      this.outline("white", "#222");

      CTX.textAlign = "center";
      CTX.font = `24px "Courier New", sans-serif`;
      CTX.fillStyle = "#222";
      this.centerText("Next Level");
    }
  }
}
