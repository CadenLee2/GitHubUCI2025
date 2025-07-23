import './MazeMinigame.css';
import { useRef, useEffect, useState } from "react";
import ImageStudentCenter from "../assets/studentCenter.png";
import ImageStudentCenterInterior from "../assets/studentCenterInterior.png";
import ImagePetr from "../assets/PetrCharacter.png";
import ImagePetr2 from "../assets/PetrCharacter2.png";
import ImageBackpack from "../assets/Backpack.png";
import { STUDENT_CENTER_FLOOR_2, STUDENT_CENTER_FLOOR_1, ROOMS_2, ROOMS_1 } from "./Constants.ts";

type Player = {
  x: number,
  y: number,
  floor: number,
  walkingStep: number,
  hasBackpack: boolean
}

type KeysPressed = {[key: string]: true};

export default function MazeMinigame(props: { finishGame: (pointsWon: number) => void }) {
  const player = useRef<Player>({
    x: 71,
    y: 17,
    floor: 2,
    walkingStep: 0,
    hasBackpack: false
  });

  const backpackCoords = useRef({ x: 14, y: 4, floor: 1 } );

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
  const assetBackpack = useRef<null | HTMLImageElement>(null);

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
    // Backpack
    if (player.current.hasBackpack) {
      renderAtCoord(
        player.current.x + 0.2, 
        player.current.y + 0.2, 
        ctx, 
        1.1, 
        1.1, 
        assetBackpack!.current as CanvasImageSource
      );
    } else if (
      backpackCoords.current.floor == player.current.floor
      && playerRoom == floorPlan[backpackCoords.current.y][backpackCoords.current.x]
    ) {
      renderAtCoord(
        backpackCoords.current.x - 0.2, 
        backpackCoords.current.y - 0.2, 
        ctx, 
        1.4, 
        1.4, 
        assetBackpack!.current as CanvasImageSource
      );
    }
    // UI
    if (timer) {
      ctx.fillStyle = "red";
      const timeLeft = (timer.current ?? 0) - Date.now();
      const secLeftTotal = Math.floor(timeLeft / 1000);
      const minLeft = Math.floor(secLeftTotal / 60);
      const secLeft = secLeftTotal % 60;
      const formatTime = minLeft + ":" + (secLeft < 10 ? '0' : '') + secLeft;
      ctx.font="28px Arial";
      ctx.fillText(formatTime, width - 120, 44);
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
      const gotBackpack = (
        player.current.x == backpackCoords.current.x
        && player.current.y == backpackCoords.current.y
        && player.current.floor == backpackCoords.current.floor
        && !player.current.hasBackpack
      );
      if (gotBackpack) {
        player.current.hasBackpack = true;
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
    const GAME_DURATION_SECONDS = 80;
    timer.current = Date.now() + GAME_DURATION_SECONDS * 1000;
  }, []);

  return (
    <div className="main-container">
      <div className="quests">
        <span>You accidentally left your backpack in Emerald Bay!</span>
        <div className="quest">
          <div className="checkbox">
          </div>
          <span>Find your backpack</span>
        </div>
        <div className="quest">
          <div className="checkbox">
          </div>
          <span>Escape the student center (get to Ring Road)</span>
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
        <img src={ImageBackpack} ref={assetBackpack} />
      </div>
    </div>
  );
}
