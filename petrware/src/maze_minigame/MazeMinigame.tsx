import './MazeMinigame.css';
import { useRef, useEffect, useState } from "react";

type Player = {
  x: number,
  y: number
}

const STUDENT_CENTER_FLOOR_2 = [
  "                x        x       x                 x                     ",
  "                xS       x       x                 x                     ",
  "                xS       x       x                 x                  xxx",
  "                x        x       x                 x                  x  ",
  "                x        xxxxxxxxx                 x                xxx  ",
  "                D            x   x                x                Sx    ",
  "                x        SxDxx   xxxxxxxxxxxxxxxxxxx               Sx    ",
  "                x        Sx  xxx x      x          x                 xxxx",
  "                xxxxxDxxxx x   x x      x          xxx                   ",
  "xxxxx           x          xxxxxDx      x            x         xxxxxxxxxx",
  "     xxxxxxxxDxxx                x  xDx x            D        x          ",
  "                                  xx   x xx          x        x          ",
  "                                           xx        x     xxxx     xxxxx",
  "                                             xx      x    x         x    ",
  "        xxDx                                   xDxxDxx   x xxx      D    ",
  "      xx    xx                                      Sx   x   x      x    ",
  "    xx        xxxxxDxxxxxxx                         Sx   x   xxxxxxxx    ",
  "  xx          x            x                         xDxxxxxxx           ",
  "xx            x             x                                            ",
];

export default function MazeMinigame(props: { finishGame: (pointsWon: number) => void }) {
  const [player, setPlayer] = useState<Player>({
    x: 12,
    y: 12
  });

  const canvas = useRef<null | HTMLCanvasElement>(null);

  const tileWidth = 20;
  const controls: Record<string, string> = {
    'w': 'up',
    'a': 'left',
    's': 'down',
    'd': 'right'
  }

  function renderAtCoord(x: number, y: number, ctx: CanvasRenderingContext2D, w = 1.0, h = 1.0) {
    ctx.fillRect(x * tileWidth, y * tileWidth, w * tileWidth, h * tileWidth);
  }

  function render() {
    const ctx = canvas.current!.getContext("2d")!;
    const width = canvas.current!.width;
    const height = canvas.current!.height;
    // Bg
    ctx.fillStyle = "black";
    ctx.imageSmoothingEnabled = false;
    ctx.fillRect(0, 0, width, height);
    // Floor plan
    // TODO: allow multiple floors
    const floorPlan = STUDENT_CENTER_FLOOR_2;
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
          ctx.fillStyle = "black";
          renderAtCoord(x, y, ctx, 1, 2);
          for (let i = 0; i < 0.99; i += 0.2) {
            // TODO: different style for going upstairs vs downstairs
            let alphapercent = 1 - (i / 2);
            if (y > 0 && floorPlan[y - 1][x] == 'S') {
              // This is the lower stairs
              alphapercent -= 0.5;
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

  function handleKeyDown(event: KeyboardEvent) {
    const pressed = controls[event.key];
    const playerOrigY = player.y;
    const playerOrigX = player.x;
    if (pressed == 'up') {
      player.y--;
    }
    if (pressed == 'down') {
      player.y++;
    }
    if (pressed == 'left') {
      player.x--;
    }
    if (pressed == 'right') {
      player.x++;
    }
    // Check collision
    if (STUDENT_CENTER_FLOOR_2[player.y][player.x] == 'x') {
      player.x = playerOrigX;
      player.y = playerOrigY;
    }
    render();
  }

  function handleKeyUp(event: KeyboardEvent) {
    // TODO: handle
  }

  useEffect(() => {
    // SETUP
    // Handle keybinds
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    // Initial render
    render();
    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  }, []);

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
    </div>
  );
}
