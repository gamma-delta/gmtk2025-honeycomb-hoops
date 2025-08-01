// Yoink
// https://github.com/gamma-delta/gmtk-2022/blob/main/src/widget.ts

import { CONTROLS, CTX } from "./main.js";
import { GameState } from "./states.js";
import { GridCoord } from "./util.js";

export abstract class Widget<S extends GameState> {
  x: number;
  y: number;
  w: number;
  h: number;
  isHovered: boolean = false;
  state: S;

  constructor(state: S, x: number, y: number, w: number, h: number) {
    this.state = state;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  update() {
    let mousePos = CONTROLS.mousePos();
    const hovering = mousePos.x >= this.x
      && mousePos.x <= this.x + this.w
      && mousePos.y >= this.y
      && mousePos.y <= this.y + this.h;

    if (hovering != this.isHovered) {
      this.isHovered = hovering;
      this.onHoverChange();
    }
    if (hovering && CONTROLS.mouseClicked()) {
      this.onClick();
    }
  }

  abstract onClick(): void;
  onHoverChange(): void { }
  abstract draw(): void;
  center(): GridCoord {
    return {
      x: this.x + this.w / 2,
      y: this.y + this.h / 2,
    }
  }

  outline(fill: string, stroke: string) {
    CTX.fillStyle = "white";
    CTX.fillRect(this.x, this.y, this.w, this.h);
    CTX.strokeStyle = "black";
    CTX.lineWidth = 4;
    CTX.strokeRect(this.x, this.y, this.w, this.h);
  }
  centerText(text: string) {
    let metrics = CTX.measureText(text);
    CTX.fillText(text, this.x + this.w / 2,
      this.y + this.h / 2
      + (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) / 2);
  }
}

export class ClickButton<S extends GameState> extends Widget<S> {
  onClickLambda: () => void;
  text: string;

  constructor(state: S,
    x: number, y: number, w: number, h: number,
    text: string, onClickLambda: () => void,
  ) {
    super(state, x, y, w, h);
    this.text = text;
    this.onClickLambda = onClickLambda;
  }

  onClick(): void {
    this.onClickLambda();
  }
  draw(): void {
    this.outline("white", "black");

    CTX.textAlign = "center";
    CTX.font = `40px "Courier New", sans-serif`;
    CTX.fillStyle = "black";
    this.centerText(this.text);
  }
}
