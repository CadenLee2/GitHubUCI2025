import { useEffect, useState, useRef } from 'react'
import './RoadMinigame.css'

function Player({ roadWidth, roadHeight }: { roadWidth: number, roadHeight: number }) {
  const [x, setX] = useState(0);
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
      const moveSpeed = 3;

      setX((prevX) => {
        let newX = prevX;
        if (keysPressed.current.has("ArrowRight")) {
          newX += moveSpeed;
        }
        if (keysPressed.current.has("ArrowLeft")) {
          newX -= moveSpeed;
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
function RoadMinigame() {
  const roadRef = useRef<HTMLDivElement>(null);
  const [roadWidth, setRoadWidth] = useState(0);
  const [roadHeight, setRoadHeight] = useState(0);
  const [showText, setShowText] = useState(true)

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
        <Player roadWidth={roadWidth} roadHeight={roadHeight}/>
      </> 
      )}
    </div>
  )
}

export default RoadMinigame;