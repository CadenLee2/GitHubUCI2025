import React, { useEffect, useRef, useState } from "react";

type Target = {
  id: number;
  isGood: boolean;
  x: number;
  y: number;
};

const goodImgSrc = "https://via.placeholder.com/80x80.png?text=✔";
const badImgSrc = "https://via.placeholder.com/80x80.png?text=✘";
const TARGET_SIZE = 80;

const PhotoGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.offsetWidth;
      const height = container.offsetHeight;

      const isGood = Math.random() < 0.6;

      const x = Math.random() * (width - TARGET_SIZE);
      const y = Math.random() * (height - TARGET_SIZE + 30);

      const newTarget: Target = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        isGood,
        x,
        y,
      };

      setTargets(prev => [...prev, newTarget]);

      setTimeout(() => {
        setTargets(prev => prev.filter(t => t.id !== newTarget.id));
      }, 1000 + Math.random() * 500);
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
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 10, left: 10, fontSize: 20, fontWeight: "bold" }}>
        Squirrel pictures taken: {score}
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
