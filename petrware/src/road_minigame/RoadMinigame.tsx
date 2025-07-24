import { useEffect, useState, useRef } from 'react'
import './RoadMinigame.css'

function Player({ roadWidth, roadHeight }: { roadWidth: number, roadHeight: number }) {
  const [x, setX] = useState((roadWidth/2) - 50);
  const [y, setY] = useState(0);
  const keysPressed = useRef(new Set<string>());
  const playerWidth = 50;
  const playerHeight = 50;

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

  useEffect(() => {
    if (roadWidth === 0 || roadHeight === 0) return;

    let animationFrameId: number;

    const gameLoop = () => {
      const maxBoundsX = (roadWidth / 2) - (playerWidth / 2);
      const maxBoundsY = (roadHeight / 2) - (playerHeight / 2);
      const moveSpeed = 4;

      setX((prevX) => {
        let newX = prevX;
        const wallX = 0; // wall is at center
        const wallWidth = 40; // increased thickness
        
        if (keysPressed.current.has("ArrowRight")) {
          const potentialX = newX + moveSpeed;
          // Check if we're going to hit the wall from the left side
          if (potentialX + playerWidth/2 < wallX - wallWidth/2 || potentialX - playerWidth/2 > wallX + wallWidth/2) {
            newX = potentialX;
          }
        }
        if (keysPressed.current.has("ArrowLeft")) {
          const potentialX = newX - moveSpeed;
          // Check if we're going to hit the wall from the right side
          if (potentialX + playerWidth/2 < wallX - wallWidth/2 || potentialX - playerWidth/2 > wallX + wallWidth/2) {
            newX = potentialX;
          }
        }
        return Math.max(-maxBoundsX, Math.min(newX, maxBoundsX));
      });

      setY((prevY) => {
        let newY = prevY;
        if (keysPressed.current.has("ArrowDown")) {
          newY += moveSpeed;
        }
        if (keysPressed.current.has("ArrowUp")) {
          newY -= moveSpeed;
        }
        return Math.max(-maxBoundsY, Math.min(newY, maxBoundsY));
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [roadWidth, roadHeight]);


  return (
  <div
    style={{
      borderRadius: '50%',
      transform: `translate(${x}px, ${y}px)`,
      width: playerWidth,
      height: playerHeight,
      background: 'skyblue',
    }}></div>
  )
}

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

function Obstacle({ x, y, width, height, direction }: { x: number, y: number, width: number, height: number, direction: "up" | "down" }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% + ${x - width / 2}px)`,
        top: `calc(50% + ${-y - height / 2}px)`,
        width,
        height,
        background: direction === "up" ? 'orange' : 'purple', // Example usage
        borderRadius: '10px',
      }}
    />
  );
}

function RoadMinigame() {
  const [roadWidth, setRoadWidth] = useState(0);
  const [roadHeight, setRoadHeight] = useState(0);
  const [showText, setShowText] = useState(true);
  const [obstacles, setObstacles] = useState<{ x: number, y: number, id: number, direction: "up" | "down", speed: number}[]>([]);
  const roadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

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

  useEffect(() => {
    if (!roadHeight) return;
    let animationFrameId: number;
    let lastSpawnLeft = Date.now();
    let lastSpawnRight = Date.now();
    const wallWidth = 40;

    const animate = () => {
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

      const currentTime = Date.now();

      // Spawn for left side
      if (currentTime - lastSpawnLeft > (Math.random() * (3-0.5)+0.5)*1000) {
        const direction = Math.random() < 0.5 ? "up" : "down";
        const speed = Math.random() * (8 - 3) + 3;
        const obstacleWidth = 40; // Width of the obstacle
        const safeDistance = wallWidth/2 + obstacleWidth/2 + 10; // Keep safe distance from wall
        const availableWidth = (roadWidth/2) - safeDistance; // Space on left side
        const proposedX = -safeDistance - (Math.random() * (availableWidth - obstacleWidth));
        
        setObstacles((prev) => [
          ...prev,
          {
            x: proposedX,
            y: direction === "down" ? -roadHeight / 2 - speed : roadHeight / 2 + speed,
            id: Math.random(),
            direction,
            speed
          },
        ]);
        lastSpawnLeft = currentTime;
      }

      // Spawn for right side
      if (currentTime - lastSpawnRight > (Math.random() * (3-0.5)+0.5)*1000) {
        const direction = Math.random() < 0.5 ? "up" : "down";
        const speed = Math.random() * (8 - 3) + 3;
        const obstacleWidth = 40; // Width of the obstacle
        const safeDistance = wallWidth/2 + obstacleWidth/2 + 10; // Keep safe distance from wall
        const availableWidth = (roadWidth/2) - safeDistance; // Space on right side
        const proposedX = safeDistance + (Math.random() * (availableWidth - obstacleWidth));
        
        setObstacles((prev) => [
          ...prev,
          {
            x: proposedX,
            y: direction === "down" ? -roadHeight / 2 - speed : roadHeight / 2 + speed,
            id: Math.random(),
            direction,
            speed
          },
        ]);
        lastSpawnRight = currentTime;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [roadWidth, roadHeight]);

  return (
    <div ref={roadRef} className={`road-minigame${showText ? '' : ' hidden'}`}>
      {showText && (
      <>
        <h1>Move Across Ring Road!</h1>
        <p>Use the arrow keys to move across the road. Avoid those pesky bikes and scooters.</p>
      </> 
      )}

      {!showText && (
      <>
        <Wall x={0} width={40} />
        <Player roadWidth={roadWidth} roadHeight={roadHeight}/>
        {obstacles.map((obs) => (
          <Obstacle key={obs.id} x={obs.x} y={obs.y} width={40} height={120} direction={obs.direction}/>
        ))}
      </> 
      )}
    </div>
  )
}

export default RoadMinigame;