import React, { useEffect, useRef, useState } from "react";
import { copy } from "./copy";
import mapImgSrc from "../assets/map.jpg";

const Map2D = () => {
  // TODO move to config
  const width = 800;
  const height = 600;
  const cellSize = 20;
  const visitedRadius = cellSize / 2;
  const userRadius = visitedRadius / 2;
  const canvasRef = useRef(null);
  const userPositionRef = useRef({
    x: Math.floor(width / 2 / cellSize),
    y: Math.floor(height / 2 / cellSize),
  });

  const draw = (ctx) => {
    const mapImg = new Image();
    const catImg = new Image();
    mapImg.onload = () => {
      // Loop through each cell in the map array
      for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[0].length; y++) {
          if (map[x][y]) {
            // Cell is visited, fill it with the map image
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
            // Cell is not visited, fill it with black color
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
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
    mapImg.src = mapImgSrc;
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

    if (
      updated.x >= 0 &&
      updated.x < map.length &&
      updated.y >= 0 &&
      updated.y < map[updated.x].length
    ) {
      setMap((prevMap) => {
        const updatedMap = [...prevMap];
        // Mark the current tile and its surrounding tiles as visited
        for (let x = updated.x - 1; x <= updated.x + 1; x++) {
          for (let y = updated.y - 1; y <= updated.y + 1; y++) {
            if (
              x >= 0 &&
              x < updatedMap.length &&
              y >= 0 &&
              y < updatedMap[x].length
            ) {
              updatedMap[x][y] = true;
            }
          }
        }
        return updatedMap;
      });
    }
  };

  useEffect(() => {
    markVisited(userPositionRef.current); // Mark initial position as visited
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      draw(ctx);
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
