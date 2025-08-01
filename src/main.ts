export const CANVAS = document.getElementById("gameCanvas") as HTMLCanvasElement;
export const CTX = CANVAS.getContext("2d") as CanvasRenderingContext2D;

import { ControlsHandler } from "./controls.js";
import { Puzzle } from "./puzzle.js";
import { StateStack } from "./states.js";
import { StateSplash } from "./states/splash.js";

export const CONTROLS = new ControlsHandler(CANVAS);

const stateStack = new StateStack(new StateSplash());

function mainLoop() {
  stateStack.tick();
  CONTROLS.tick();
}

window.setInterval(mainLoop, 1000 / 60);

