import React, { useEffect, useRef, useState } from "react";
import { copy } from "./copy";
import mapImgSrc from "../assets/map.jpg";
import playerImgSrc from "../assets/player.png";

const Map2D = () => {
  // TODO move to config
  const width = 800;
  const height = 600;
  const cellSize = 30;
  const visitedRadius = cellSize / 2;
  const userRadius = 10;
  const canvasRef = useRef(null);
  const userPositionRef = useRef({
    x: Math.floor(width / 2 / cellSize),
    y: Math.floor(height / 2 / cellSize),
  });

  const draw = (ctx) => {
    const mapImg = new Image();
    const playerImg = new Image();
    mapImg.onload = () => {
      for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[0].length; y++) {
          if (map[x][y]) {
            // Cell is visited, fill it with the map image
            ctx.drawImage(
              mapImg,
              x * cellSize,
              y * cellSize,
              visitedRadius * 2,
              visitedRadius * 2,
              x * cellSize,
              y * cellSize,
              visitedRadius * 2,
              visitedRadius * 2
            );
          } else {
            // Cell is not visited, fill it with black color
            ctx.fillStyle = "black";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }
      ctx.drawImage(
        playerImg,
        0,
        0,
        playerImg.width,
        playerImg.height,
        userPositionRef.current.x * cellSize - userRadius,
        userPositionRef.current.y * cellSize - userRadius,
        userRadius * 2,
        userRadius * 2
      );
    };
    mapImg.src = mapImgSrc;
    playerImg.src = playerImgSrc;
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
      const radius = 2;
      // Mark the current tile and its surrounding tiles as visited
      for (
        let x = Math.max(updated.x - radius, 0);
        x < Math.min(updated.x + radius, map.length);
        x++
      ) {
        for (
          let y = Math.max(updated.y - radius, 0);
          y < Math.min(updated.y + radius, map[updated.x].length);
          y++
        ) {
          console.log("Mark visited:", { x, y });
          updatedMap[x][y] = true;
        }
      }
      return updatedMap;
    });
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      draw(ctx);

      markVisited(userPositionRef.current); // Mark initial position as visited
    }
  }, []);

  const updateUserPosition = (updated) => {
    userPositionRef.current = updated;
    markVisited(updated);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      draw(ctx);
    }
  };

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
  }, []);

  return (
    <div className="container">
      <h1>{copy.title}</h1>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};

export default Map2D;
