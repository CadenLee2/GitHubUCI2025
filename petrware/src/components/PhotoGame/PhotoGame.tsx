import React, { useEffect, useRef, useState } from "react";
import squirrel from '../../assets/squirrel.png';
import crow from '../../assets/crow.png';
import bg from '../../assets/Aldrich-Park.jpg'

/*TODO:
  Add in tutorial page
  Add in crows
  Add in bg


*/

type Target = {
  id: number;
  isGood: boolean;
  x: number;
  y: number;
};

const goodImgSrc = squirrel;
const badImgSrc = crow;
const TARGET_SIZE = 80;

const PhotoGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [timeLeft, setTimeLeft] = useState(30); // countdown from 30 seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.offsetWidth;
      const height = container.offsetHeight * 1.5

      const isGood = Math.random() < 0.6;

      const x = Math.random() * (width - TARGET_SIZE);
      const y = Math.random() * (height - TARGET_SIZE);

      const newTarget: Target = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        isGood,
        x,
        y,
      };

      setTargets(prev => [...prev, newTarget]);

      setTimeout(() => {
        setTargets(prev => prev.filter(t => t.id !== newTarget.id));
      }, 1500 + Math.random() * 500);
    }, 500);

    return () => clearInterval(spawnInterval);
  }, []);

  const handleClick = (target: Target) => {
    setScore(score + (target.isGood ? 1 : -1));
    setTargets(prev => prev.filter(t => t.id !== target.id));
  };

  return (
    <div
      ref={containerRef}
      className = "game"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div style={{     position: "absolute",
    top: 10,
    left: 10,
    padding: "10px 16px",
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(6px)",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)", }}>
        Squirrel pictures taken: {score}
      </div>
      <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        padding: "10px 16px",
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(6px)",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      }}
    >
        Time Left: {timeLeft}s
      </div>

      {targets.map(target => (
        <img
          key={target.id}
          src={target.isGood ? goodImgSrc : badImgSrc}
          onClick={() => handleClick(target)}
          style={{
            position: "absolute",
            left: target.x,
            top: target.y,
            width: TARGET_SIZE,
            height: TARGET_SIZE,
            cursor: "pointer",
            userSelect: "none",
          }}
          alt={target.isGood ? "Good target" : "Decoy"}
        />
      ))}
    </div>
  );
};

export default PhotoGame;
