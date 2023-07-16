import React, { useEffect, useState } from "react";
import { copy } from "./copy";
import { Position } from "./types";
import { MapRender } from "./MapRender";
import { GameMap } from "../GameMap";

export const Game = () => {
  const mapWidth = 600;
  const mapHeight = 400;
  const cellSize = 30;
  const userSize = cellSize;
  const userInitialPosition: Position = {
    x: Math.round(mapWidth / 2 / cellSize),
    y: Math.round(mapHeight / 2 / cellSize),
  };

  const [userPosition, setUserPosition] =
    useState<Position>(userInitialPosition);
  const [map] = useState<GameMap>(new GameMap(mapWidth, mapHeight));

  const updateUserPosition = (updated: Position) => {
    console.log("updateUserPosition", updated);
    setUserPosition(updated);
    map.markVisited(updated);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const distance = 1;
      let { x, y } = userPosition;

      if (event.key === "ArrowUp") {
        y = Math.max(y - distance, 0);
      } else if (event.key === "ArrowDown") {
        y = Math.min(y + distance, mapHeight - userSize);
      } else if (event.key === "ArrowLeft") {
        x = Math.max(x - distance, 0);
      } else if (event.key === "ArrowRight") {
        x = Math.min(x + distance, mapWidth - userSize);
      }

      updateUserPosition({ x, y });
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [userPosition]);

  return (
    <div className="container">
      <h1>{copy.title}</h1>
      <MapRender userPosition={userPosition} map={map} cellSize={cellSize} />
    </div>
  );
};
