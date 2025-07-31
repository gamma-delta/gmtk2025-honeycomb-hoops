export class StateStack {
  states: GameState[];

  constructor(start: GameState) {
    this.states = [start];
  }

  tick() {
    let update = this.states[this.states.length - 1].update();
    if (update != null) {
      if (update.type == "pop") {
        if (this.states.length == 1) {
          console.error("Can't pop state because the stack would be empty")
        } else {
          this.states.pop();
        }
      } else if (update.type == "push") {
        this.states.push(update.state);
      } else {
        this.states.pop();
        this.states.push(update.state);
      }
    }

    let toDraw = [];
    for (let i = this.states.length - 1; i >= 0; i--) {
      let st = this.states[i]
      toDraw.push(st);
      if (!st.drawTransparent()) {
        break;
      }
    }
    for (let i = toDraw.length - 1; i >= 0; i--) {
      toDraw[i].draw();
    }
  }
}

export interface GameState {
  update(): StateTransition;
  draw(): void;
  drawTransparent(): boolean;
}

export type StateTransition =
  null
  | { type: "pop" }
  | { type: "push", state: GameState }
  | { type: "swap", state: GameState };
