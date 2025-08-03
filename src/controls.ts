import { GridCoord } from "./util.js";

export class ControlsHandler {
  #mouseX: number = 0;
  #mouseY: number = 0;

  #mouseDown: boolean = false;
  #mouseClicked: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    let self = this;
    canvas.addEventListener("mousemove", function(evt) {
      let rect = canvas.getBoundingClientRect();
      self.#mouseX = evt.clientX - rect.left;
      self.#mouseY = evt.clientY - rect.top;
    });
    canvas.addEventListener("mousedown", function(_) {
      self.#mouseDown = true;
      self.#mouseClicked = true;
    });
    canvas.addEventListener("mouseup", function(_) {
      self.#mouseDown = false;
      self.#mouseClicked = false;
    });
  }

  tick() {
    this.#mouseClicked = false;
  }

  mousePos(): GridCoord {
    return { x: this.#mouseX, y: this.#mouseY };
  }

  mouseDown(): boolean {
    return this.#mouseDown;
  }
  mouseClicked(): boolean {
    return this.#mouseClicked;
  }
}
