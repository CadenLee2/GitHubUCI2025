export type Objective = { text: string, complete: boolean };

export type Player = {
  x: number,
  y: number,
  floor: number,
  walkingStep: number,
  hasCollectibles: Set<string>,
  beenTo: Set<string>
}

export type KeysPressed = {[key: string]: true};

export type ScreenName = "instructions" | "game" | "win" | "lose";

