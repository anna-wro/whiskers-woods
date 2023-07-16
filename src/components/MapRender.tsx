import React, { useEffect, useRef, useState } from "react";
import { Position } from "./types";
import { GameMap } from "../GameMap";

interface MapRenderProps {
  userPosition: Position;
  map: GameMap;
}

export const MapRender = ({ userPosition, map }: MapRenderProps) => {
  const visitedPosition: Position[] = [];
  for (const pos of map.iterVisitedPosition()) {
    visitedPosition.push(pos);
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";
    for (const pos of visitedPosition) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 3 * Math.sin(25 * 0.05) ** 2, 0, 2 * Math.PI);
      ctx.fillStyle = "blue";
      ctx.fill();
    }
    ctx.beginPath();

    ctx.arc(
      userPosition.x,
      userPosition.y,
      5 * Math.sin(25 * 0.05) ** 2,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "orange";
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    let frameCount = 0;
    let animationFrameId: ReturnType<typeof window.requestAnimationFrame>;

    const render = () => {
      if (!context) return;
      draw(context);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return <canvas ref={canvasRef} width={600} height={400} />;
  //   return (
  //     <div className="map-container">
  //       {/* <div
  //         className="user"
  //         style={{
  //           top: `${userPosition.y}px`,
  //           left: `${userPosition.x}px`,
  //         }}
  //       /> */}
  //       <p>
  //         User position: {userPosition.x} x {userPosition.y}
  //       </p>
  //       <p>Visited position: {visitedPosition.map(vis => <li>{vis.x} x {vis.y}</li>)}</p>
  //       <canvas id="map" width="600" height="400" />
  //     </div>
  //   );
};
