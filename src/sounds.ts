export class SoundSet {
  lastSound: number | null = null;
  sounds: HTMLAudioElement[];
  // TODO: pitch changing? this is apparently very hard

  constructor(...paths: string[]) {
    this.sounds = paths.map(s => {
      let a = new Audio("assets/" + s + ".ogg");
      a.load();
      return a;
    });
  }

  pickAndPlay(): HTMLAudioElement {
    let sound;
    if (this.sounds.length == 1) {
      sound = this.sounds[0];
    } else if (this.lastSound == null) {
      let idx = Math.floor(Math.random() * this.sounds.length);
      this.lastSound = idx;
      sound = this.sounds[idx];
    } else {
      let idx = Math.floor(Math.random() * (this.sounds.length - 1));
      if (idx >= this.lastSound) {
        idx += 1;
      }
      this.lastSound = idx;
      sound = this.sounds[idx];
    }

    sound.pause();
    sound.currentTime = 0;
    sound.play();
    return sound;
  }
}

export const SOUNDS = {
  tap: new SoundSet("tap-variant-01", "tap-variant-02", "tap-variant-03", "tap-variant-04"),
  erase: new SoundSet("erase"),
  button_up: new SoundSet("button-up"),
  button_down: new SoundSet("button-down"),
  win: new SoundSet("win"),
}
