export const CANVAS = document.getElementById("gameCanvas") as HTMLCanvasElement;
export const CTX = CANVAS.getContext("2d") as CanvasRenderingContext2D;

import { drawHexGrid } from "./util.js";

function mainLoop() {
  CTX.fillStyle = "white";
  CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);

  drawHexGrid(4);
}

window.setInterval(mainLoop, 1000 / 60);
console.log("AAAAA")

