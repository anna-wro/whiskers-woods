import React, { useEffect, useRef, useState } from "react";
import { Position } from "./types";
import { GameMap } from "../GameMap";

interface MapRenderProps {
  userPosition: Position;
  map: GameMap;
  cellSize: number;
}

export const MapRender = ({ userPosition, map, cellSize }: MapRenderProps) => {
  const visitedPosition: Position[] = [];
  const visitedRadius = 5;
  const userRadius = 5;
  for (const pos of map.iterVisitedPosition()) {
    visitedPosition.push(pos);
  }
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const img = new Image();
    ctx.globalAlpha = 1;
    img.onload = () => {
      console.log("Loaded successfully");
      for (const visitedPos of visitedPosition) {
        console.log("Processing visited position:", visitedPos);
        // ctx.beginPath();
        // ctx.arc(pos.x, pos.y, 3 * Math.sin(25 * 0.05) ** 2, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fillRect(
          visitedPos.x * cellSize - visitedRadius,
          visitedPos.y * cellSize - visitedRadius,
          visitedRadius * 2,
          visitedRadius * 2
        );
      }

      ctx.fillStyle = "orange";
      ctx.fillRect(
        userPosition.x * cellSize - userRadius,
        userPosition.y * cellSize - userRadius,
        userRadius * 2,
        userRadius * 2
      );
      console.log({ userPosition });
    };
    img.src =
      "https://voxelsmash.com/wp-content/uploads/2022/08/factorio-best-tips-for-beginners.jpg";
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    const render = () => {
      if (!context) return;
      draw(context);
    };
    render();
  }, [draw]);

  return <canvas ref={canvasRef} width={600} height={400} />;
};
