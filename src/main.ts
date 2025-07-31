import { ControlsHandler } from "./controls.js";
import { Puzzle } from "./puzzle.js";
import { drawHexGrid } from "./util.js";

export const CANVAS = document.getElementById("gameCanvas") as HTMLCanvasElement;
export const CTX = CANVAS.getContext("2d") as CanvasRenderingContext2D;

export const CONTROLS = new ControlsHandler(CANVAS);

const puzzle = new Puzzle(`
  . O .
 . . . .
K . . O .
 K X X .
  K . .
`);
// const puzzle = new Puzzle(`
//   . . .
//  . . . K
// K K . K K
//  K . . .
//   . . .
// `);

function mainLoop() {
  puzzle.tick();
}

window.setInterval(mainLoop, 1000 / 60);

