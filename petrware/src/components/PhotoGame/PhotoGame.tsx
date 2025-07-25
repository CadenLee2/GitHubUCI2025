import React, { useEffect, useRef, useState } from "react";
import squirrel from "../../assets/squirrel.png";
import crow from "../../assets/crow.png";
import bg from "../../assets/Aldrich-Park.jpg";
import "./PhotoGame.css";

type Target = {
  id: number;
  isGood: boolean;
  x: number;
  y: number;
};

const goodImgSrc = squirrel;
const badImgSrc = crow;
const TARGET_SIZE = 80;



const PhotoGame = (props: { finishGame: (pointsWon:number) => void}) => {
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameStart, setGameStart] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const {finishGame} = props

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameStart || gameOver) return;
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStart, gameOver]);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.offsetWidth;
      const height = container.offsetHeight;

      const isGood = Math.random() < 0.6;
      const x = Math.random() * (width - TARGET_SIZE);
      const y = Math.random() * (height - TARGET_SIZE + 1000);

      const newTarget: Target = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        isGood,
        x,
        y,
      };

      setTargets((prev) => [...prev, newTarget]);

      setTimeout(() => {
        setTargets((prev) => prev.filter((t) => t.id !== newTarget.id));
      }, 1500 + Math.random() * 500);
    }, 500);

    return () => clearInterval(spawnInterval);
  }, []);

  const handleClick = (target: Target) => {
    if(target.isGood){
      setScore(score + 1);
    }
    else {
      if(score > 0){
        setScore(score - 1)
      }
    }
    setTargets((prev) => prev.filter((t) => t.id !== target.id));
  };

  return (
    <div
      ref={containerRef}
      className="game"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {!gameStart && (
        <div className="overlay">
          <div className="overlay-content">
            <h2 style={{ marginBottom: 20 }}>!! NEW CHALLENGE !!</h2>
            <p style={{ marginBottom: 30 }}>
              The Petr drop now needs you to show pictures of your favorite
              4-legged animals on campus.
              <br />
              Thankfully, there's plenty of squirrels in the park, but make sure
              you don't get any photos of those crows!
              <br />
              Controls: Take pictures by clicking on the animals. Clicking on
              squirrels gains points, but crows will make you lose points!
              <br />
              You have 30 seconds. Good luck!
            </p>
            <button className="start-end-button" onClick={() => setGameStart(true)}>
              Start Game
            </button>
          </div>
        </div>
      )}

      {gameStart && !gameOver && (
        <>
          <div className="score-display">Squirrel pictures taken: {score}</div>
          <div className="timer-display">Time Left: {timeLeft}s</div>

          {targets.map((target) => (
            <img
              key={target.id}
              src={target.isGood ? goodImgSrc : badImgSrc}
              onClick={() => handleClick(target)}
              className="target"
              style={{ left: target.x, top: target.y }}
              alt={target.isGood ? "Good target" : "Decoy"}
            />
          ))}
        </>
      )}

      {gameOver && (
        <div className="overlay">
          <div className="overlay-content">
            {score > 1 && <div>
              <h2 style={{ marginBottom: 20 }}>!! TIME IS UP !!</h2>
            <p style={{ marginBottom: 30 }}>
              You have {score} photos to show at the petr drop!
              <br />
              Game score: {score * 250}
            </p>
            <button className="start-end-button" onClick={() => finishGame(score * 250)}>
              Next Game
            </button>
              </div>}
            {score == 0 && <div>
            <h2 style={{ marginBottom: 20 }}>!! TIME IS UP !!</h2>
            <p style={{ marginBottom: 30 }}>
              You didn't get any photos...
            </p>
            <button className="start-end-button" onClick={() => {location.reload()}}>
              Back to home
            </button>
              </div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGame;
