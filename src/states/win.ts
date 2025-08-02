import { CANVAS, CONTROLS, CTX } from "../main.js";
import { SOUNDS } from "../sounds.js";
import { GameState, StateTransition } from "../states.js"
import * as Util from "../util.js";

export class StateYouWin implements GameState {
  update(): StateTransition {
    if (CONTROLS.mouseClicked()) {
      SOUNDS.button_down.pickAndPlay();
      return {
        type: "pop",
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

    CTX.fillStyle = "black";
    CTX.font = `120px "Courier New", sans-serif`;
    CTX.fillText("Thanks for Playing!", centerX, centerY - 150);

    CTX.textAlign = "left";
    CTX.fillStyle = "#222";
    CTX.font = `40px "Courier New", sans-serif`;
    Util.drawTextWithNewlines(`You beat the game! Well done.

If you're reading this message, you must have enjoyed the game to
play this far. I'd appreciate it if you left a nice comment with
your thoughts.

Again, thank you so much for playing my game.

(Click to return to level select.)`,
      100, centerY);
  }
  drawTransparent(): boolean {
    return false;
  }
}
