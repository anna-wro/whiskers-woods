import React, { useEffect, useRef, useState } from "react";
import { copy } from "../consts/copy";
import mapImgSrc from "../assets/map.jpg";
import playerImgSrc from "../assets/player.png";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CELL_SIZE,
  VISITED_RADIUS,
  USER_RADIUS,
} from "../consts/config";

const Map2D = () => {
  const canvasRef = useRef(null);
  const [tipDisplayed, setTipDisplayed] = useState(true);
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
            ctx.fillStyle = "#575757";
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
      const radius = 3;
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
        y = Math.min(y + distance, CANVAS_HEIGHT / CELL_SIZE);
      } else if (event.key === "ArrowLeft") {
        x = Math.max(x - distance, 0);
      } else if (event.key === "ArrowRight") {
        x = Math.min(x + distance, CANVAS_WIDTH / CELL_SIZE);
      }

      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        updateUserPosition({ x, y });
        setTipDisplayed(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="container">
      <h1 className="title">{copy.title}</h1>
      <p className="tip">{tipDisplayed ? copy.tip : copy.afterKeypress}</p>
      <div className="mapContainer">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="map"
        />
      </div>
    </div>
  );
};

export default Map2D;
