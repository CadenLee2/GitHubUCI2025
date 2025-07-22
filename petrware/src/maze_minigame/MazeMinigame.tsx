import './MazeMinigame.css';
import { useRef, useEffect, useState } from "react";
import ImageStudentCenter from "../assets/studentCenter.png";
import ImageStudentCenterInterior from "../assets/studentCenterInterior.png";

type Player = {
  x: number,
  y: number,
  floor: number
}

type KeysPressed = {[key: string]: number};

const STUDENT_CENTER_FLOOR_2 = [
  "                x        x       x                 x                     ",
  "                x        x       x                 x                     ",
  "                xSx      x       x                 x                  xxx",
  "                xSx      x       x                 x                  x  ",
  "                xxx      xxxxxxxxx                 x                xxx  ",
  "                D            x   x                x               xSx    ",
  "                x       xSxDxx   xxxxxxxxxxxxxxxxxxx              xSx    ",
  "                x       xSx  xxx x      x          x              x  xxxx",
  "                xxxxxDxxxx x   x x      x          xxx            x      ",
  "xxxxx           x          xxxxxDx      x            x         xxxxxxxxxx",
  "     xxxxxxxxDxxx                x  xDx x            D        x          ",
  "                                  xx   x xx          x        x          ",
  "                                           xx        x     xxxx     xxxxx",
  "                                             xx      x    x         x    ",
  "        xxDx                                   xDxxDxx   x xxx      D    ",
  "      xx    xx                                       x   x   x      x    ",
  "    xx        xxxxxDxxxxxxx                        xSx   x   xxxxxxxx    ",
  "  xx          x            x                       xSxDxxxxxxx           ",
  "xx            x             x                       x                    ",
];

const STUDENT_CENTER_FLOOR_1 = [
  "                x        x       x                 x                     ",
  "                xxx      x       x                 x                     ",
  "                xSx      x       x                 x              xxxxxxx",
  "                xSx      x       x                 x              x   x  ",
  "                x        xxxxxxxxx                 x              x xxx  ",
  "                D        x   x   x                x               xSx    ",
  "                x       xSxDxx   xxxxxxxxxxxxxxxxxxx              xSx    ",
  "                x       xSx  xxx x      x          x                 xxxx",
  "                xxxxxDxxx  x   x x      x          xxx                   ",
  "xxxxx           x          xxxxxDx      x            x         xxxxxxxxxx",
  "     xxxxxxxxDxxx                x  xDx x            D        x          ",
  "                                  xx   x xx          x        x          ",
  "                                           xx        x     xxxx     xxxxx",
  "                                             xx      x    x         x    ",
  "        xxDx                                   xDxxDxx   x xxx      D    ",
  "      xx    xx                                     xSx   x   x      x    ",
  "    xx        xxxxxDxxxxxxx                        xSx   x   xxxxxxxx    ",
  "  xx          x            x                         xDxxxxxxx           ",
  "xx            x             x                                            ",
];

export default function MazeMinigame(props: { finishGame: (pointsWon: number) => void }) {
  const [player, setPlayer] = useState<Player>({
    x: 12,
    y: 12,
    floor: 2
  });

  // Using ref to prevent issues with useEffect
  const [keysPressed, setKeysPressed] = useState<KeysPressed>({});
  const cooldown = useRef(0);
  const offsetX = useRef(0);
  const offsetY = useRef(0);

  const canvas = useRef<null | HTMLCanvasElement>(null);
  const assetStudentCenter = useRef<null | HTMLImageElement>(null);
  const assetStudentCenterInterior = useRef<null | HTMLImageElement>(null);

  const tileWidth = 20;
  const controls: Record<string, string> = {
    'w': 'up',
    'a': 'left',
    's': 'down',
    'd': 'right'
  }

  function renderAtCoord(x: number, y: number, ctx: CanvasRenderingContext2D, w = 1.0, h = 1.0) {
    // Determine the offset based on the player's position
    const offsetRatio = 0.0001;
    const newOffsetX = (22 - player.x) * offsetRatio + offsetX.current * (1 - offsetRatio);
    const newOffsetY = (16 - player.y) * offsetRatio + offsetY.current * (1 - offsetRatio);
    offsetX.current = newOffsetX;
    offsetY.current = newOffsetY;
    ctx.fillRect(
      Math.floor((newOffsetX + x) * tileWidth),
      Math.floor((newOffsetY + y) * tileWidth),
      w * tileWidth + 1, h * tileWidth + 1
    );
  }

  function render() {
    const ctx = canvas.current!.getContext("2d")!;
    const width = canvas.current!.width;
    const height = canvas.current!.height;
    // Bg
    ctx.fillStyle = "black";
    ctx.imageSmoothingEnabled = false;
    ctx.fillRect(0, 0, width, height);
    // Get image
    if (player.floor == 2) {
      ctx.drawImage(assetStudentCenter!.current as CanvasImageSource, 0, 0, width, height);
    } else {
      ctx.drawImage(assetStudentCenterInterior!.current as CanvasImageSource, 0, 0, width, height);
    }
    // Floor plan
    // TODO: allow multiple floors
    const floorPlan = player.floor == 2 ? STUDENT_CENTER_FLOOR_2 : STUDENT_CENTER_FLOOR_1;
    for (let y = 0; y < floorPlan.length; y++) {
      for (let x = 0; x < floorPlan[y].length; x++) {
        // Render
        const tile = floorPlan[y][x];
        if (tile == ' ') {
          ctx.fillStyle = "beige";
          renderAtCoord(x, y, ctx);
        } else if (tile == 'x') {
          ctx.fillStyle = "gray";
          renderAtCoord(x, y, ctx);
        } else if (tile == 'D') {
          // Door
          ctx.fillStyle = "beige";
          renderAtCoord(x, y, ctx);
          ctx.fillStyle = "rgba(150, 150, 150, 0.5)";
          renderAtCoord(x, y, ctx);
        } else if (tile == 'S') {
          // Stairs
          if (player.floor == 2) {
            ctx.fillStyle = "black";
          } else {
            ctx.fillStyle = "#e5dda7";
          }
          renderAtCoord(x, y, ctx, 1, 2);
          for (let i = 0; i < 0.99; i += 0.2) {
            // TODO: different style for going upstairs vs downstairs
            let alphapercent = 1 - (i / 2);
            if (player.floor == 2) {
              if (y > 0 && floorPlan[y - 1][x] == 'S') {
                // This is the lower stairs
                alphapercent -= 0.5;
              }
            } else {
              alphapercent = i / 2;
              if (y > 0 && floorPlan[y - 1][x] == 'S') {
                // This is the lower stairs
                alphapercent += 0.5;
              }
            }
            ctx.fillStyle = "rgba(150, 150, 150, " + alphapercent + ")";
            renderAtCoord(x, y + i, ctx, 1, 0.1);
            ctx.fillStyle = "rgba(200, 200, 200, " + alphapercent + ")";
            renderAtCoord(x, y + i + 0.1, ctx, 1, 0.1);
          }
        }
      }
    }
    // Player
    // TODO: draw an image of the player instead?
    ctx.fillStyle = "red";
    renderAtCoord(player.x, player.y, ctx);
  }

  function handleKeys() {
    const floorPlan = player.floor == 2 ? STUDENT_CENTER_FLOOR_2 : STUDENT_CENTER_FLOOR_1;
    let pressed = false
    for (const key of Object.keys(keysPressed)) {
      const control = controls[key];
      const playerOrigY = player.y;
      const playerOrigX = player.x;
      // Movement
      if (Date.now() < cooldown.current) {
        // Still cooling down
        continue;
      }
      pressed = true;
      if (control == 'up') {
        player.y--;
      }
      if (control == 'down') {
        player.y++;
      }
      if (control == 'left') {
        player.x--;
      }
      if (control == 'right') {
        player.x++;
      }
      const colliding =
        player.x < 0 || player.y < 0
        || player.y >= floorPlan.length
        || player.x >= floorPlan[player.y].length
        || floorPlan[player.y][player.x] == 'x'
      if (colliding) {
        player.x = playerOrigX;
        player.y = playerOrigY;
      }
      // New position
      const justHitStairs = floorPlan[player.y][player.x] == 'S'
        && floorPlan[playerOrigY][playerOrigX] != 'S';
      if (justHitStairs) {
        if (player.floor == 2) player.floor = 1;
        else player.floor = 2;
      }
      setPlayer(player);
    }
    if (pressed) {
      cooldown.current = Date.now() + 60;
    }
  }

  /** Call this function each frame */
  function frame() {
    console.log("frame");
    handleKeys();
    render();
  }

  function handleKeyDown(event: KeyboardEvent) {
    const newKeysPressed = JSON.parse(JSON.stringify(keysPressed));
    newKeysPressed[event.key] = true;
    setKeysPressed(newKeysPressed);
  }

  function handleKeyUp(event: KeyboardEvent) {
    const newKeysPressed = JSON.parse(JSON.stringify(keysPressed));
    delete newKeysPressed[event.key];
    setKeysPressed(newKeysPressed);
  }

  useEffect(() => {
    // SETUP
    // Handle keybinds
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    // Initial render
    render();
    // Call on each "frame"
    const intervalId = window.setInterval(frame, 10);
    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.clearInterval(intervalId);
    }
  });

  return (
    <div className="main-container">
      <div className="quests">
        <span><i>Objectives:</i></span>
        <div className="quest">
          <div className="checkbox">
          </div>
          <span>Find your backpack</span>
        </div>
        <div className="quest">
          <div className="checkbox">
          </div>
          <span>Escape the student center</span>
        </div>
      </div>
      <canvas ref={canvas} className="main-canvas" width={936} height={655}>
      </canvas>
      <div className="assets">
        <img src={ImageStudentCenter} ref={assetStudentCenter} />
        <img src={ImageStudentCenterInterior} ref={assetStudentCenterInterior} />
      </div>
    </div>
  );
}
