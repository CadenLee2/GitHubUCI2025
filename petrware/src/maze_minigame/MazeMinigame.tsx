import './MazeMinigame.css';
import { useRef, useEffect, useState } from "react";
import ImageStudentCenter from "../assets/studentCenter.png";
import ImageStudentCenterInterior from "../assets/studentCenterInterior.png";
import ImagePetr from "../assets/PetrCharacter.png";
import ImagePetr2 from "../assets/PetrCharacter2.png";

type Player = {
  x: number,
  y: number,
  floor: number,
  walkingStep: number
}

type KeysPressed = {[key: string]: true};

const STUDENT_CENTER_FLOOR_2 = [
  "1111111111111111x22222222x3333333x44444444444444444x555555555555555555555",
  "1111111111111111x22222222x3333333x44444444444444444x555555555555555555555",
  "1111111111111111xSx222222x3333333x44444444444444444x555555555555555555xxx",
  "1111111111111111xSx222222x3333333x44444444444444444x555555555555555555x  ",
  "1111111111111111xxx222222xxDxxxxxx44444444444444444x5555555555555555xxx  ",
  "1111111111111111D222222222222xaaax4444444444444444x 55555555555555xSx    ",
  "1111111111111111x2222222xSxDxxaaaxxxxxxxxxxxxxxxxxxx55555555555555xSx    ",
  "1111111111111111x2222222xSxaaaaxax777777x8888888888x55555555555555x55xxxx",
  "1111111111111111xxxxxDxxxx9xaaaxax777777x8888888888xxx555555555555x555555",
  "xxxxx11111111111x9999999999xxxxxDx777777x888888888888x555555555xxxxxxxxxx",
  "99999xxxxxxxxDxxx9999999999999999x77xDx7x888888888888D55555555x6666666666",
  "9999999999999999999999999999999999xx999x9xx8888888888x55555555x6666666666",
  "9999999999999999999999999999999999999999999xx88888888x55555xxxx66666xxxxx",
  "999999999999999999999999999999999999999999999xx888888x5555x666666666x9999",
  "99999999xxDx99999999999999999999999999999999999xDxxDDx555x xxx666666D9999",
  "999999xx    xx999999999999999999999999999999999999999x555x   x666666x9999",
  "9999xx        xxxxxDxxxxxxx999999999999999999999999xSx555x   xxxxxxxx9999",
  "99xx          x            x99999999999999999999999xSxDxxxxxxx99999999999",
  "xx            x             x99999999999999999999999x99999999999999999999",
];

const STUDENT_CENTER_FLOOR_1 = [
  "    x33333333333x4444444x55555555x66666666666666666xddddddddddddddddddddd",
  "xxxxx3333xxxxxxxxxx44444x55555555x66666666666666666xddddddddddddddddddddd",
  "1111x3333x222222xSx44444x55555555x66666666666666666xddddddddddddddxxxxxxx",
  "1111D3333D222222xSx44444x55555555x66666666666666666Dddddddddddddddxdddxbb",
  "1111x3333x222222x4444444x55555555x66666666666666666xddddddddddddddxdxxxbb",
  "1111D3333D222222x4444444xxxDxxxxxx6666666666666666xdddddddddddddddxSxbbbb",
  "1111x3333x222222x4444444xSx xx   xxxDDxxxxxDxxxxxxxxddddddddddddddxSxbbbb",
  "xxxx333333xxxxxxx4444444xSx  xxx x      x8888888888xdddddddddddddddddxxxx",
  "3333333333333333xxxxxDxxx      x x      x8888888888xxxddddddddddddddddddd",
  "xxxxx33333333333x                x      x888888888888xxxxxxddddxxxxxxxxxx",
  "     xxxxxxxxDxxx       xxDxxDxxDx      x888888888888x99999xddxcccx      ",
  "                        x77777777x       xx8888888888x99999xddxcccx      ",
  "                        xxDxxDxxDx         xx88888888D99999xxxxccccxxxxxx",
  "          xxx                                xx888888x9999xcccxcccccccccc",
  "        xxeeexDx                               xDxxDxx999xccccxxxxxxccccc",
  "      Dxeeeeeeeexxx                 xx             xSxDDDxccccxcccccccccc",
  "    xxeeeeeeeeeeeeexDx            xxffxxx          xSx   xccccxxxxxxccccc",
  "  xxeeeeeeeeeeeeeeeeeexxx       DDfffffffxxx             Dccccccccccccccc",
  "xxeeeeeeeeeeeeeeeeeeeeeeexDx  xxffffffffffffxxx          xccccccccccccccc",
];

const ROOMS_2: Record<string, string> = {
  '1': 'West Food Court',
  '2': 'Student Center Lobby',
  '3': 'Crystal Cove Auditorium',
  '5': 'UCI Bookstore',
  '6': 'Starbucks',
  '7': 'Anthill Pub and Grill',
  '8': 'East Food Court',
  '9': 'Terrace',
  ' ': 'Esports Arena',
  'a': 'Restrooms'
}

const ROOMS_1: Record<string, string> = {
  '1': 'Doheny Beach Meeting Rooms',
  '2': 'Emerald Bay Meeting Rooms',
  '3': 'Gallery Lounge',
  '4': 'Crystal Cove Lounge',
  '5': 'Crystal Cove Auditorium',
  '6': 'Empty Room',
  '7': 'Crescent Bay Rooms',
  '8': 'Computer Lab',
  '9': 'CSL Patio',
  'c': 'Courtyard Study Lounge',
  ' ': 'Hallway',
  'd': 'UCI Bookstore',
  'e': 'West Courtyard',
  'f': 'Pacific Ballroom'
};

export default function MazeMinigame(props: { finishGame: (pointsWon: number) => void }) {
  const player = useRef<Player>({
    x: 12,
    y: 12,
    floor: 2,
    walkingStep: 0
  });

  // Using ref to prevent issues with useEffect
  const keysPressed = useRef<KeysPressed>({});
  const cooldown = useRef(0);
  const offsetX = useRef(0);
  const offsetY = useRef(0);

  const timer = useRef<number | null>(null);

  const canvas = useRef<null | HTMLCanvasElement>(null);
  const canvasWrapper = useRef<null | HTMLDivElement>(null);
  const assetStudentCenter = useRef<null | HTMLImageElement>(null);
  const assetStudentCenterInterior = useRef<null | HTMLImageElement>(null);
  const assetPetr = useRef<null | HTMLImageElement>(null);
  const assetPetr2 = useRef<null | HTMLImageElement>(null);

  const tileWidth = 36;
  const controls: Record<string, string> = {
    'w': 'up',
    'a': 'left',
    's': 'down',
    'd': 'right',
    'ArrowUp': 'up',
    'ArrowLeft': 'left',
    'ArrowDown': 'down',
    'ArrowRight': 'right'
  }

  function renderAtCoord(x: number, y: number, ctx: CanvasRenderingContext2D, w = 1.0, h = 1.0, img: CanvasImageSource | null = null) {
    // Determine the offset based on the player's position
    const offsetRatio = 0.0001;
    const newOffsetX = (13 - player.current.x) * offsetRatio + offsetX.current * (1 - offsetRatio);
    const newOffsetY = (9 - player.current.y) * offsetRatio + offsetY.current * (1 - offsetRatio);
    offsetX.current = newOffsetX;
    offsetY.current = newOffsetY;
    const realX = Math.floor((newOffsetX + x) * tileWidth);
    const realY = Math.floor((newOffsetY + y) * tileWidth);
    const realWidth = w * tileWidth + 1;
    const realHeight = h * tileWidth + 1;
    // Render
    if (img) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, realX, realY, realWidth, realHeight);
      ctx.imageSmoothingEnabled = false;
    } else {
      ctx.fillRect(realX, realY, realWidth, realHeight);
    }
  }

  function render() {
    const ctx = canvas.current!.getContext("2d")!;
    const width = canvas.current!.offsetWidth;
    const height = canvas.current!.offsetHeight;
    canvas.current!.width = width;
    // Bg
    ctx.fillStyle = "black";
    ctx.imageSmoothingEnabled = false;
    ctx.fillRect(0, 0, width, height);
    // Get image
    if (player.current.floor == 2) {
      ctx.globalAlpha = 0.5;
      ctx.drawImage(assetStudentCenter!.current as CanvasImageSource, 0, 0, width, height);
    } else {
      ctx.globalAlpha = 0.5;
      ctx.drawImage(assetStudentCenterInterior!.current as CanvasImageSource, 0, 0, width, height);
    }
    ctx.globalAlpha = 1.0;
    // Floor plan is based on the player's current floor
    const floorPlan = player.current.floor == 2 ? STUDENT_CENTER_FLOOR_2 : STUDENT_CENTER_FLOOR_1;
    // Identify which room the player is in
    const playerRoom = floorPlan[player.current.y][player.current.x];
    for (let y = 0; y < floorPlan.length; y++) {
      for (let x = 0; x < floorPlan[y].length; x++) {
        // Render
        const tile = floorPlan[y][x];
        if (tile == 'x') {
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
          if (player.current.floor == 2) {
            ctx.fillStyle = "black";
          } else {
            ctx.fillStyle = "#e5dda7";
          }
          renderAtCoord(x, y, ctx, 1, 2);
          for (let i = 0; i < 0.99; i += 0.2) {
            // TODO: different style for going upstairs vs downstairs
            let alphapercent = 1 - (i / 2);
            if (player.current.floor == 2) {
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
            renderAtCoord(x, y + i, ctx, 1, 0.09);
            ctx.fillStyle = "rgba(200, 200, 200, " + alphapercent + ")";
            renderAtCoord(x, y + i + 0.09, ctx, 1, 0.09);
          }
        } else if (tile == playerRoom) {
          // Bright
          ctx.fillStyle = "beige";
          renderAtCoord(x, y, ctx);
        } else {
          ctx.fillStyle = "#c4c4b4";
          renderAtCoord(x, y, ctx);
        }
      }
    }
    // Player
    renderAtCoord(
      player.current.x - 0.4, 
      player.current.y - 0.4, 
      ctx, 
      1.8, 
      1.8, 
      player.current.walkingStep == 0 ?
        assetPetr!.current as CanvasImageSource :
        assetPetr2!.current as CanvasImageSource
    );
    // UI
    if (timer) {
      ctx.fillStyle = "red";
      const timeLeft = (timer.current ?? 0) - Date.now();
      const secLeftTotal = Math.floor(timeLeft / 1000);
      const minLeft = Math.floor(secLeftTotal / 60);
      const secLeft = secLeftTotal % 60;
      const formatTime = minLeft + ":" + (secLeft < 10 ? '0' : '') + secLeft;
      ctx.font="24px Arial";
      ctx.fillText(formatTime, width - 180, 40);
    }
    const playerRoomName = player.current.floor == 2 ? ROOMS_2[playerRoom] : ROOMS_1[playerRoom];
    if (playerRoomName) {
      ctx.fillStyle = "white";
      ctx.font="24px Arial";
      ctx.fillText("FLOOR " + player.current.floor + " - " + playerRoomName, 40, 40);
    } else {
      ctx.fillStyle = "white";
      ctx.font="24px Arial";
      ctx.fillText("FLOOR " + player.current.floor, 40, 40);
    }
  }

  function handleKeys() {
    const floorPlan = player.current.floor == 2 ? STUDENT_CENTER_FLOOR_2 : STUDENT_CENTER_FLOOR_1;
    let pressed = false;
    for (const control of Object.keys(keysPressed.current)) {
      const playerOrigY = player.current.y;
      const playerOrigX = player.current.x;
      // Movement
      if (Date.now() < cooldown.current) {
        // Still cooling down
        continue;
      }
      if (control == 'up') {
        player.current.y--;
        pressed = true;
      } else if (control == 'down') {
        player.current.y++;
        pressed = true;
      } else if (control == 'left') {
        player.current.x--;
        pressed = true;
      } else if (control == 'right') {
        player.current.x++;
        pressed = true;
      }
      const colliding =
        player.current.x < 0 || player.current.y < 0
        || player.current.y >= floorPlan.length
        || player.current.x >= floorPlan[player.current.y].length
        || floorPlan[player.current.y][player.current.x] == 'x'
      if (colliding) {
        player.current.x = playerOrigX;
        player.current.y = playerOrigY;
      }
      // New position
      const justHitStairs = floorPlan[player.current.y][player.current.x] == 'S'
        && floorPlan[playerOrigY][playerOrigX] != 'S';
      if (justHitStairs) {
        if (player.current.floor == 2) player.current.floor = 1;
        else player.current.floor = 2;
      }
    }
    if (pressed) {
      cooldown.current = Date.now() + 70;
      // Animate the character
      player.current.walkingStep = 1 - player.current.walkingStep;
    }
  }

  /** Call this function each frame */
  function frame() {
    handleKeys();
    render();
  }

  function handleKeyDown(event: KeyboardEvent) {
    keysPressed.current![controls[event.key]] = true;
  }

  function handleKeyUp(event: KeyboardEvent) {
    delete keysPressed.current![controls[event.key]];
  }

  useEffect(() => {
    // SETUP
    // Handle keybinds
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    // Call on each "frame"
    const intervalId = window.setInterval(frame, 10);
    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.clearInterval(intervalId);
    }
  });

  useEffect(() => {
    const GAME_DURATION = 60 * 1000;
    timer.current = Date.now() + GAME_DURATION;
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
      <div ref={canvasWrapper} className="canvas-wrapper">
        <canvas ref={canvas} className="main-canvas" width={936} height={655}>
        </canvas>
      </div>
      <div className="assets">
        <img src={ImageStudentCenter} ref={assetStudentCenter} />
        <img src={ImageStudentCenterInterior} ref={assetStudentCenterInterior} />
        <img src={ImagePetr} ref={assetPetr} />
        <img src={ImagePetr2} ref={assetPetr2} />
      </div>
    </div>
  );
}
