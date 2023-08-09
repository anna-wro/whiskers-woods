import React, { useEffect, useRef, useState } from "react";
import { copy } from "../consts/copy";
import mapImgSrc from "../assets/map.jpg";
import playerImgSrc from "../assets/player.png";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CELL_SIZE,
  CELLS_TO_REVEAL,
  VISITED_RADIUS,
  USER_RADIUS,
  USER_MOVE_SPEED,
} from "../consts/config";
import Header from "./Header";

const Map2D = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameStarted, setGameStarted] = useState(true);
  const userPositionRef = useRef({
    x: Math.floor(CANVAS_WIDTH / 2 / CELL_SIZE),
    y: Math.floor(CANVAS_HEIGHT / 2 / CELL_SIZE),
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
              x * CELL_SIZE,
              y * CELL_SIZE,
              VISITED_RADIUS * 2,
              VISITED_RADIUS * 2,
              x * CELL_SIZE,
              y * CELL_SIZE,
              VISITED_RADIUS * 2,
              VISITED_RADIUS * 2
            );
          } else {
            // Cell is not visited, fill it with dark color
            ctx.fillStyle = "#3f615b";
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
      }
      ctx.drawImage(
        playerImg,
        0,
        0,
        playerImg.width,
        playerImg.height,
        userPositionRef.current.x * CELL_SIZE - USER_RADIUS,
        userPositionRef.current.y * CELL_SIZE - USER_RADIUS,
        USER_RADIUS * 2,
        USER_RADIUS * 2
      );
    };
    mapImg.src = mapImgSrc;
    playerImg.src = playerImgSrc;
  };

  // Initialize the map
  const initialMap = Array.from({ length: CANVAS_WIDTH / CELL_SIZE + 1 }, () =>
    Array.from({ length: CANVAS_HEIGHT / CELL_SIZE + 1 }, () => false)
  );
  const [map, setMap] = useState(initialMap);

  const markVisited = (updated) => {
    console.assert(updated.x < map.length, "Invalid x");
    console.assert(updated.y < map[updated.x].length, "Invalid y");

    setMap((prevMap) => {
      const updatedMap = [...prevMap];
      // Mark the current tile and its surrounding tiles as visited
      for (
        let x = Math.max(updated.x - CELLS_TO_REVEAL, 0);
        x < Math.min(updated.x + CELLS_TO_REVEAL, map.length);
        x++
      ) {
        for (
          let y = Math.max(updated.y - CELLS_TO_REVEAL, 0);
          y < Math.min(updated.y + CELLS_TO_REVEAL, map[updated.x].length);
          y++
        ) {
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
      let { x, y } = userPositionRef.current;

      if (event.key === "ArrowUp") {
        y = Math.max(y - USER_MOVE_SPEED, 0);
      } else if (event.key === "ArrowDown") {
        y = Math.min(y + USER_MOVE_SPEED, CANVAS_HEIGHT / CELL_SIZE);
      } else if (event.key === "ArrowLeft") {
        x = Math.max(x - USER_MOVE_SPEED, 0);
      } else if (event.key === "ArrowRight") {
        x = Math.min(x + USER_MOVE_SPEED, CANVAS_WIDTH / CELL_SIZE);
      }

      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        updateUserPosition({ x, y });
        setGameStarted(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="container">
      <Header />
      <div className="tip">{gameStarted ? copy.tip : copy.afterKeypress}</div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="map"
      />
    </div>
  );
};

export default Map2D;
