import React, { useEffect, useRef, useState } from "react";
import { Position } from "./types";
import { GameMap } from "../GameMap";

interface MapRenderProps {
  userPosition: Position;
  map: GameMap;
  cellSize: number;
}

export const MapRender = ({ userPosition, map, cellSize }: MapRenderProps) => {
  const visitedRadius = 15;
  const userRadius = 5;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const mapImg = new Image();
    const catImg = new Image();
    mapImg.onload = () => {
      console.log("Loaded successfully");
      const visitedPosition: Position[] = [];
      for (const pos of map.iterVisitedPosition()) {
        visitedPosition.push(pos);
      }
      console.log("Visited position count", visitedPosition.length);
      for (const visitedPos of visitedPosition) {
        console.log("Processing visited position:", visitedPos);
        ctx.drawImage(
          mapImg,
          visitedPos.x * cellSize - visitedRadius,
          visitedPos.y * cellSize - visitedRadius,
          visitedRadius * 2,
          visitedRadius * 2,
          visitedPos.x * cellSize - visitedRadius,
          visitedPos.y * cellSize - visitedRadius,
          visitedRadius * 2,
          visitedRadius * 2
        );
      }

      ctx.drawImage(
        catImg,
        0,
        0,
        catImg.width,
        catImg.height,
        userPosition.x * cellSize - userRadius,
        userPosition.y * cellSize - userRadius,
        userRadius * 2,
        userRadius * 2
      );
      console.log({ userPosition });
    };
    mapImg.src =
      "https://voxelsmash.com/wp-content/uploads/2022/08/factorio-best-tips-for-beginners.jpg";
    catImg.src = "https://i.imgur.com/7oHPx0S.png";
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
