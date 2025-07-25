
// Main React imports and CSS
import { useEffect, useState, useRef } from 'react'
import './RoadMinigame.css'


// Player component: Handles player movement and position
function Player({ roadWidth, roadHeight, setPlayerX, setPlayerY }: { roadWidth: number, roadHeight: number, setPlayerX: (x: number) => void, setPlayerY: (y: number) => void }) {
  // Player position state
  const [x, setX] = useState((roadWidth/2) - 50);
  const [y, setY] = useState(0);
  // Track currently pressed keys
  const keysPressed = useRef(new Set<string>());
  const playerWidth = 50;
  const playerHeight = 50;


  // Listen for key presses to control movement
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      keysPressed.current.add(event.key);
    }

    function handleKeyUp(event: KeyboardEvent) {
      keysPressed.current.delete(event.key);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);


  // Animation loop for player movement
  useEffect(() => {
    if (roadWidth === 0 || roadHeight === 0) return;

    let animationFrameId: number;

    const gameLoop = () => {
      // Calculate movement bounds
      const maxBoundsX = (roadWidth / 2) - (playerWidth / 2);
      const maxBoundsY = (roadHeight / 2) - (playerHeight / 2);
      const moveSpeed = 3;

      // Update X position
      setX((prevX) => {
        let newX = prevX;
        if (keysPressed.current.has("ArrowRight") || keysPressed.current.has("d")) {
          newX += moveSpeed;
        }
        if (keysPressed.current.has("ArrowLeft") || keysPressed.current.has("l")) {
          newX -= moveSpeed;
        }
        // Clamp to bounds
        const finalX = Math.max(-maxBoundsX, Math.min(newX, maxBoundsX));
        setPlayerX(finalX);
        return finalX;
      });

      // Update Y position
      setY((prevY) => {
        let newY = prevY;
        if (keysPressed.current.has("ArrowDown") || keysPressed.current.has("s")) {
          newY -= moveSpeed;
        }
        if (keysPressed.current.has("ArrowUp") || keysPressed.current.has("w")) {
          newY += moveSpeed;
        }
        // Clamp to bounds
        const finalY = Math.max(-maxBoundsY, Math.min(newY, maxBoundsY));
        setPlayerY(finalY);
        return finalY;
      });

      // Continue animation
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [roadWidth, roadHeight]);



  // Render player as a blue circle
  // transform: `translate(${x}px, ${y}px)`,
  return (
    <div
      style={{
        borderRadius: '50%',
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${-y}px)`,
        width: playerWidth,
        height: playerHeight,
        background: 'skyblue',
      }}></div>
  )
}

// Wall component: Renders a vertical green wall at given x position
function Wall({ x, width }: { x: number, width: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% + ${x - width / 2}px)`,
        top: '0',
        width,
        height: '100%',
        background: 'green',
      }}
    />
  );
}

// Obstacle component: Renders a moving obstacle (bike/scooter)
function Obstacle({ x, y, width, height, direction, image }: { x: number, y: number, width: number, height: number, direction: "up" | "down", image: string }) {
  
  // left: `calc(50% + ${x - width / 2}px)`,
  // top: `calc(50% + ${-y - height / 2}px)`,

  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${-y}px)`,
        width,
        height,
        border: '2px solid #333',
        boxSizing: 'border-box',
        borderRadius: '10px',
        background: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <img
        src={image}
        alt="bike obstacle"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transform: direction === 'up' ? 'rotate(0deg)' : 'rotate(180deg)'
        }}
      />
    </div>
  );
}


// Main game component: Handles game state, obstacle spawning, win/loss logic
function RoadMinigame(props: { finishGame: (points: number) => void }) {
  // Road dimensions
  const [roadWidth, setRoadWidth] = useState(0);
  const [roadHeight, setRoadHeight] = useState(0);
  // Show intro text
  const [showText, setShowText] = useState(true);
  // Obstacles array
  const [obstacles, setObstacles] = useState<{ x: number, y: number, id: number, direction: "up" | "down", speed: number, image: string}[]>([]);
  // Controls when obstacles can spawn (after intro/grace period)
  const [canSpawnObstacles, setCanSpawnObstacles] = useState(false);
  // Player position
  const [playerX, setPlayerX] = useState((roadWidth/2) - 50);
  const [playerY, setPlayerY] = useState(0);
  // Game result state
  const [gameResult, setGameResult] = useState<'playing' | 'lose' | 'win'>('playing');
  // Ref for road container
  const roadRef = useRef<HTMLDivElement>(null);


  // Show intro text for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])


  // Measure road size on mount and window resize
  useEffect(() => {
    const measureRoad = () => {
      if (roadRef.current) {
        setRoadWidth(roadRef.current.offsetWidth);
        setRoadHeight(roadRef.current.offsetHeight);
      }
    }
    measureRoad();
    window.addEventListener('resize', measureRoad);
    return () => window.removeEventListener('resize', measureRoad);
  }, []);


  // After intro text, wait 2 seconds before allowing obstacles to spawn
  useEffect(() => {
    if (showText) {
      setCanSpawnObstacles(false);
      return;
    }
    const graceTimer = setTimeout(() => {
      setCanSpawnObstacles(true);
    }, 2000);
    return () => clearTimeout(graceTimer);
  }, [showText]);


  // Animation loop for moving obstacles and win detection
  useEffect(() => {
    if (!roadHeight || gameResult !== 'playing') return;
    let animationFrameId: number;
    const playerWidth = 50;
    const animate = () => {
      // Move obstacles and remove those out of bounds
      setObstacles((prev) =>
        prev
          .map((obs) => ({
            ...obs,
            y: obs.direction === "down" ? obs.y + obs.speed : obs.y - obs.speed
          }))
          .filter(
            (obs) =>
              (obs.direction === "down" && obs.y < roadHeight / 2 + 50) ||
              (obs.direction === "up" && obs.y > -roadHeight / 2 - 50)
          )
      );

      // Collision detection for obstacles
      const OBSTACLE_WIDTH = 70;
      const OBSTACLE_HEIGHT = 150;
      for (const ob of obstacles) {
        if (
          playerX >= ob.x && playerX < ob.x + OBSTACLE_WIDTH
          && playerY >= ob.y && playerY < ob.y + OBSTACLE_HEIGHT
        ) {
          // Dead
          //setGameResult('lose');
          console.log("Game over. Ob, player: " + ob.x + ',' + ob.y + '; ' + playerX + ',' + playerY);
        }
      }

      // Win zone detection (left side strip)
      const winZoneWidth = 40; // px, same as wall width for visual alignment
      if (playerX - playerWidth / 2 <= -roadWidth / 2 + winZoneWidth) {
        // Win the game
        setGameResult('win');
        return;
      }

      // Continue animation
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [roadWidth, roadHeight, playerX, playerY, gameResult]);


  // Separate effect for obstacle spawning (left/right sides)
  useEffect(() => {
    if (!roadHeight || !canSpawnObstacles || gameResult !== 'playing') return;
    const wallWidth = 40;
    let spawnLeftTimeout: NodeJS.Timeout | null = null;
    let spawnRightTimeout: NodeJS.Timeout | null = null;
    let isUnmounted = false;

    // Spawn obstacle on left side
    function spawnLeft() {
      if (isUnmounted) return;
      const direction = Math.random() < 0.5 ? "up" : "down";
      const speed = Math.random() * (6 - 3) + 3;
      const obstacleWidth = 70;
      const safeDistance = wallWidth/2 + obstacleWidth/2 + 10;
      const availableWidth = (roadWidth/2) - safeDistance;
      const proposedX = -safeDistance - (Math.random() * (availableWidth - obstacleWidth));
      const image = Math.random() < 0.5 ? '/bike1.png' : '/bike2.png';
      setObstacles((prev) => [
        ...prev,
        {
          x: proposedX,
          y: direction === "down" ? -roadHeight / 2 - speed : roadHeight / 2 + speed,
          id: Math.random(),
          direction,
          speed,
          image
        },
      ]);
      // Random delay before next spawn
      const nextDelay = (Math.random() * (3-0.5)+0.5)*1000;
      spawnLeftTimeout = setTimeout(spawnLeft, nextDelay);
    }

    // Spawn obstacle on right side
    function spawnRight() {
      if (isUnmounted) return;
      const direction = Math.random() < 0.5 ? "up" : "down";
      const speed = Math.random() * (6 - 3) + 3;
      const obstacleWidth = 70;
      const safeDistance = wallWidth/2 + obstacleWidth/2 + 10;
      const availableWidth = (roadWidth/2) - safeDistance;
      const proposedX = safeDistance + (Math.random() * (availableWidth - obstacleWidth));
      const image = Math.random() < 0.5 ? '/bike1.png' : '/bike2.png';
      setObstacles((prev) => [
        ...prev,
        {
          x: proposedX,
          y: direction === "down" ? -roadHeight / 2 - speed : roadHeight / 2 + speed,
          id: Math.random(),
          direction,
          speed,
          image
        },
      ]);
      // Random delay before next spawn
      const nextDelay = (Math.random() * (3-0.5)+0.5)*1000;
      spawnRightTimeout = setTimeout(spawnRight, nextDelay);
    }

    spawnLeft();
    spawnRight();

    // Cleanup on unmount
    return () => {
      isUnmounted = true;
      if (spawnLeftTimeout) clearTimeout(spawnLeftTimeout);
      if (spawnRightTimeout) clearTimeout(spawnRightTimeout);
    };
  }, [roadWidth, roadHeight, canSpawnObstacles, gameResult]);


  // Render main game UI
  return (
    <div ref={roadRef} className={`road-minigame${showText ? '' : ' hidden'}`}>
      {/* Intro text */}
      {showText && (
        <>
          <h1>Move Across Ring Road!</h1>
          <p>Use the arrow keys to move across the road. Avoid those pesky bikes and scooters.</p>
        </> 
      )}

      {/* Main game area */}
      {!showText && (
        gameResult === 'win' ? (
          // Win screen
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#063', color: 'white', fontSize: '2rem', gap: 20 }}>
            <h1>You crossed Ring Road</h1>
            <span>+5000 points!</span>
            <br />
            <button onClick={() => props.finishGame(5000)}>Continue</button>
          </div>
        ) : gameResult === 'lose' ? (
          // Lose screen
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#890c14', color: 'white', fontSize: '2rem', gap: 20 }}>
            <h1>You did not cross Ring Road!</h1>
            <span>+0 points!</span>
            <br />
            <button onClick={() => props.finishGame(0)}>Continue</button>
          </div>
        ) : (
          <>
            {/* Win zone visual (left strip) */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 40,
              height: '100%',
              background: 'rgba(0,128,0,0.2)',
              zIndex: 1
            }} />
            {/* Green wall for visual alignment */}
            <Wall x={0} width={40} />
            {/* Player */}
            <Player roadWidth={roadWidth} roadHeight={roadHeight} setPlayerX={setPlayerX} setPlayerY={setPlayerY}/>
            {/* Obstacles */}
            {obstacles.map((obs) => (
              <Obstacle key={obs.id} x={obs.x} y={obs.y} width={50} height={100} direction={obs.direction} image={obs.image}/>
            ))}
          </>
        )
      )}
    </div>
  )
}


// Export main game component
export default RoadMinigame;
