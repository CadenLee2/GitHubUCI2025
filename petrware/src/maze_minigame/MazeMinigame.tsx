import './MazeMinigame.css';
import { useRef, useEffect, useState } from "react";
import ImageStudentCenter from "../assets/studentCenter.png";
import ImageStudentCenterInterior from "../assets/studentCenterInterior.png";
import ImagePetr from "../assets/PetrCharacter.png";
import ImagePetr2 from "../assets/PetrCharacter2.png";
import ImageBackpack from "../assets/Backpack.png";
import ImageWaterBottle from "../assets/WaterBottle.png";
import ImageQuestionMark from "../assets/QuestionMark.png";
import type {
  Objective,
  Player,
  KeysPressed,
  ScreenName
} from "./types";
import {
  STUDENT_CENTER_FLOOR_2,
  STUDENT_CENTER_FLOOR_1,
  ROOMS_2,
  ROOMS_1,
  ROOMS_2_QCOORDS,
  ROOMS_1_QCOORDS,
  TARGET,
  OBJECTIVES_DEFAULT,
} from "./Constants.ts";

function timeUntil(timePoint: number) {
  const timeLeft = timePoint - Date.now();
  const secLeftTotal = Math.floor(timeLeft / 1000);
  const minLeft = Math.floor(secLeftTotal / 60);
  const secLeft = secLeftTotal % 60;
  return { minLeft, secLeft };
}

function ObjectiveDisplay(props: { objectives: Objective[], column?: true }) {
  return (
    <div className={ props.column ? "quests-col" : "quests" }>
      {
        props.objectives.map((obj, i) => 
          <div key={i} className="quest">
            <div className={`checkbox ${obj.complete ? "checked" : ""}`}>
              {obj.complete && 'X'}
            </div>
            <span className={obj.complete ? "finished-text" : undefined}>{obj.text}</span>
          </div>
        )
      }
    </div>
  );
}

function MazeMinigameGame(props: {
  win: (timeMins: number, timeSecs: number) => void,
  lose: (points: number) => void
}) {
  const { win, lose } = props;

  const player = useRef<Player>({
    x: 71,
    y: 17,
    floor: 2,
    walkingStep: 0,
    hasCollectibles: new Set<string>(),
    beenTo: new Set<string>()
  });
  const [objectives, setObjectives] = useState(OBJECTIVES_DEFAULT);

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
  const assetWaterBottle = useRef<null | HTMLImageElement>(null);
  const assetQuestionMark = useRef<null | HTMLImageElement>(null);

  const collectibles = useRef({
    "backpack": {
      x: 14,
      y: 4,
      floor: 1,
      objectiveFinish: 1,
      asset: assetBackpack,
      offsetX: 0.2,
      offsetY: 0.2
    },
    "waterBottle": {
      x: 42,
      y: 8,
      floor: 2,
      objectiveFinish: 0,
      asset: assetWaterBottle,
      offsetX: -0.6,
      offsetY: 0.2
    }
  });

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
    const screenWidthTiles = ctx.canvas.width / tileWidth - 1;
    const screenHeightTiles = ctx.canvas.height / tileWidth - 1;
    const newOffsetX = (screenWidthTiles / 2 - player.current.x) * offsetRatio + offsetX.current * (1 - offsetRatio);
    const newOffsetY = (screenHeightTiles / 2 - player.current.y) * offsetRatio + offsetY.current * (1 - offsetRatio);
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
    const qCoords = player.current.floor == 2 ? ROOMS_2_QCOORDS : ROOMS_1_QCOORDS;
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
          // Invisible
          ctx.fillStyle = "#c4c4b4";
          renderAtCoord(x, y, ctx);
          const showQuestionMark = (
            qCoords[tile] && x == qCoords[tile].x && y == qCoords[tile].y
            && !player.current.beenTo.has(player.current.floor + '-' + tile)
          );
          if (showQuestionMark) {
            renderAtCoord(x, y, ctx, 1, 1, assetQuestionMark.current as CanvasImageSource);
          }
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
    // Collectibles
    for (const [colName, colData] of Object.entries(collectibles.current)) {
      if (player.current.hasCollectibles.has(colName)) {
        // Player holding
        renderAtCoord(
          player.current.x + colData.offsetX, 
          player.current.y + colData.offsetY, 
          ctx, 
          1.1, 
          1.1, 
          colData.asset.current as CanvasImageSource
        );
      } else if (
        colData.floor == player.current.floor
        && playerRoom == floorPlan[colData.y][colData.x]
      ) {
        renderAtCoord(
          colData.x - 0.2, 
          colData.y - 0.2, 
          ctx, 
          1.4, 
          1.4, 
          colData.asset.current as CanvasImageSource
        );
      }
    }
    // UI
    if (timer) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.beginPath();
      ctx.roundRect(width - 130, 20, 74, 30, 8);
      ctx.fill();
      ctx.fillStyle = "orange";
      const { minLeft, secLeft } = timeUntil(timer.current ?? 0);
      const formatTime = minLeft + ":" + (secLeft < 10 ? '0' : '') + secLeft;
      ctx.font="28px Arial";
      ctx.fillText(formatTime, width - 120, 44);
    }
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.beginPath();
    ctx.roundRect(30, 20, 400, 30, 8);
    ctx.fill();
    const playerRoomName = player.current.floor == 2 ? ROOMS_2[playerRoom] : ROOMS_1[playerRoom];
    if (playerRoomName) {
      ctx.fillStyle = "white";
      ctx.font="22px Arial";
      ctx.fillText("FLOOR " + player.current.floor + " - " + playerRoomName, 40, 42);
    } else {
      ctx.fillStyle = "white";
      ctx.font="22px Arial";
      ctx.fillText("FLOOR " + player.current.floor, 40, 42);
    }
    const fillActive = "rgba(70, 100, 240, 0.8)";
    const fillInactive = "rgba(0, 0, 0, 0.2)";
    const diamondY = 90; //height - 80;
    const diamondX = 20;
    const diamondH = 40;
    const diamondW = 80;
    const diamondOffset = 14;
    ctx.beginPath();
    ctx.moveTo(diamondX, diamondY + diamondH / 2);
    ctx.lineTo(diamondX + diamondW / 2, diamondY);
    ctx.lineTo(diamondX + diamondW, diamondY + diamondH / 2);
    ctx.lineTo(diamondX + diamondW / 2, diamondY + diamondH);
    ctx.lineTo(diamondX, diamondY + diamondH / 2);
    ctx.closePath();
    ctx.fillStyle = player.current.floor == 1 ? fillActive : fillInactive;
    ctx.fill();
    ctx.beginPath();
    const diamond2Y = diamondY - diamondOffset;
    ctx.moveTo(diamondX, diamond2Y + diamondH / 2);
    ctx.lineTo(diamondX + diamondW / 2, diamond2Y);
    ctx.lineTo(diamondX + diamondW, diamond2Y + diamondH / 2);
    ctx.lineTo(diamondX + diamondW / 2, diamond2Y + diamondH);
    ctx.lineTo(diamondX, diamond2Y + diamondH / 2);
    ctx.closePath();
    ctx.fillStyle = player.current.floor == 2 ? fillActive : fillInactive;
    ctx.fill();
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
      const tile = floorPlan[player.current.y][player.current.x];
      const justHitStairs = tile == 'S'
        && floorPlan[playerOrigY][playerOrigX] != 'S';
      if (justHitStairs) {
        if (player.current.floor == 2) player.current.floor = 1;
        else player.current.floor = 2;
      }
      // Collision of collectibles
      for (const [colName, colData] of Object.entries(collectibles.current)) {
        const gotCol = (
          !player.current.hasCollectibles.has(colName)
          && player.current.x == colData.x
          && player.current.y == colData.y
          && player.current.floor == colData.floor
        );
        if (gotCol) {
          const newObjectives = objectives.slice();
          newObjectives[colData.objectiveFinish].complete = true;
          setObjectives(newObjectives);
          player.current.hasCollectibles.add(colName);
        }
      }
      // Store the player's been here
      player.current.beenTo.add(player.current.floor + '-' + tile);
    }
    if (pressed) {
      cooldown.current = Date.now() + 70;
      // Animate the character
      player.current.walkingStep = 1 - player.current.walkingStep;
    }
  }

  function checkEndConditions() {
    const { minLeft, secLeft } = timeUntil(timer.current ?? 0);
    const gameLost = minLeft < 0 || (minLeft == 0 && secLeft <= 0);
    if (gameLost) {
      lose();
      return;
    }
    let gameWon = true;
    for (const colName of Object.keys(collectibles.current)) {
      if (!player.current.hasCollectibles.has(colName)) gameWon = false;
    }
    const floorPlan = player.current.floor == 2 ? STUDENT_CENTER_FLOOR_2 : STUDENT_CENTER_FLOOR_1;
    const tile = floorPlan[player.current.y][player.current.x];
    if (player.current.floor != TARGET.floor || tile != TARGET.tile) {
      gameWon = false;
    }
    if (gameWon) {
      win(minLeft, secLeft);
      return;
    }
  }

  /** Call this function each frame */
  function frame() {
    handleKeys();
    checkEndConditions();
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
    // Start the game the moment this is first rendered
    const GAME_DURATION_SECONDS = 80;
    timer.current = Date.now() + GAME_DURATION_SECONDS * 1000;
  }, []);

  return (
    <>
      <div>
        <span>You accidentally left some of your belongings in the Student Center!</span>
        <ObjectiveDisplay objectives={objectives} />
      </div>
      <div ref={canvasWrapper} className="canvas-wrapper">
        <canvas ref={canvas} className="main-canvas" width={936} height={615}>
        </canvas>
      </div>
      <div className="assets">
        <img src={ImageStudentCenter} ref={assetStudentCenter} />
        <img src={ImageStudentCenterInterior} ref={assetStudentCenterInterior} />
        <img src={ImagePetr} ref={assetPetr} />
        <img src={ImagePetr2} ref={assetPetr2} />
        <img src={ImageBackpack} ref={assetBackpack} />
        <img src={ImageWaterBottle} ref={assetWaterBottle} />
        <img src={ImageQuestionMark} ref={assetQuestionMark} />
      </div>
    </>
  );
}

export default function MazeMinigame(props: { finishGame: (pointsWon: number) => void }) {
  const { finishGame } = props;

  const [screen, setScreen] = useState<ScreenName>("instructions");
  const [minLeft, setMinLeft] = useState(-1);
  const [secLeft, setSecLeft] = useState(-1);
  const [pointsWon, setPointsWon] = useState(-1);

  function win(minLeftNum: number, secLeftNum: number) {
    setScreen("win");
    setPointsWon(minLeftNum * 60 + secLeftNum);
    setMinLeft(minLeftNum);
    setSecLeft(secLeftNum);
  }

  function lose() {
    setScreen("lose");
  }

  return (
    <div className="main-container">
      {
        screen == "instructions" ?
          <div className="info-column">
            <span>You accidentally left some of your belongings in UCI's Student Center.</span>
            <span>Find them quickly!</span>
            <span>Use WASD or the arrow keys to move around the map. You can use stairs to go between floors.</span>
            <ObjectiveDisplay column objectives={OBJECTIVES_DEFAULT} />
            <span></span>
            <button onClick={() => setScreen("game")}>Start Minigame</button>
          </div>
        : screen == "game" ? <MazeMinigameGame win={win} lose={lose} />
        : screen == "win" ?
          <div className="info-column">
            <span>
              You succeeded with {minLeft} minutes and {secLeft} seconds left!
            </span>
            <span>
              <b>+{pointsWon} points</b>
            </span>
            <span>
              Next, you head to Aldrich Park.
            </span>
            <button onClick={() => finishGame(pointsWon)}>Next game</button>
          </div>
        : 
          <div className="info-column">
            <span>Time's up!</span>
            <span>You didn't get everything. Better luck next time...</span>
            <button onClick={() => location.reload()}>Back to main menu</button>
          </div>
      }
    </div>
  );
}
