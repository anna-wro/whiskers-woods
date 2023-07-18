import React, { useEffect, useRef, useState } from "react";
import { copy } from "./copy";

const Map2D = () => {
  const userPositionRef = useRef({ x: 0, y: 0 });

  const width = 600;
  const height = 400;
  const cellSize = 30;
  const visitedRadius = 15;
  const userRadius = 5;
  const canvasRef = useRef(null);

  const draw = (ctx) => {
    const mapImg = new Image();
    const catImg = new Image();
    mapImg.onload = () => {
      for (let x = 0; x <= ctx.canvas.width / cellSize; x++) {
        for (let y = 0; y <= ctx.canvas.height / cellSize; y++) {
          if (map[x] && map[x][y]) {
            ctx.drawImage(
              mapImg,
              x * cellSize - visitedRadius,
              y * cellSize - visitedRadius,
              visitedRadius * 2,
              visitedRadius * 2,
              x * cellSize - visitedRadius,
              y * cellSize - visitedRadius,
              visitedRadius * 2,
              visitedRadius * 2
            );
          } else {
            ctx.fillRect(
              x * cellSize - visitedRadius,
              y * cellSize - visitedRadius,
              visitedRadius * 2,
              visitedRadius * 2
            );
            ctx.stroke();
          }
        }
      }
      ctx.drawImage(
        catImg,
        0,
        0,
        catImg.width,
        catImg.height,
        userPositionRef.current.x * cellSize - userRadius,
        userPositionRef.current.y * cellSize - userRadius,
        userRadius * 2,
        userRadius * 2
      );
    };
    mapImg.src =
      "https://voxelsmash.com/wp-content/uploads/2022/08/factorio-best-tips-for-beginners.jpg";
    catImg.src = "https://i.imgur.com/7oHPx0S.png";
  };

  // Initialize the map
  const initialMap = Array.from({ length: width / cellSize + 1 }, () =>
    Array.from({ length: height / cellSize + 1 }, () => false)
  );
  const [map, setMap] = useState(initialMap);

  const markVisited = (updated) => {
    console.assert(updated.x < map.length, "Invalid x");
    console.assert(updated.y < map[updated.x].length, "Invalid y");

    setMap((prevMap) => {
      const updatedMap = [...prevMap];
      updatedMap[updated.x][updated.y] = true;
      return updatedMap;
    });
  };

  const updateUserPosition = (updated) => {
    userPositionRef.current = updated;
    markVisited(updated);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const render = () => {
      draw(context);
    };
    render();
  }, [draw, map]); // Include 'map' as a dependency

  useEffect(() => {
    const handleKeyDown = (event) => {
      const distance = 1;
      let { x, y } = userPositionRef.current;

      if (event.key === "ArrowUp") {
        y = Math.max(y - distance, 0);
      } else if (event.key === "ArrowDown") {
        y = Math.min(y + distance, height / cellSize);
      } else if (event.key === "ArrowLeft") {
        x = Math.max(x - distance, 0);
      } else if (event.key === "ArrowRight") {
        x = Math.min(x + distance, width / cellSize);
      }

      updateUserPosition({ x, y });
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [width, height, cellSize]);

  return (
    <div className="container">
      <h1>{copy.title}</h1>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};

export default Map2D;
