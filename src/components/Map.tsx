import React, { useEffect, useState } from "react";

export const Map = () => {
  const mapWidth = 600;
  const mapHeight = 400;
  const userSize = 20;
  const userInitialPosition = {
    x: mapWidth / 2 - userSize / 2,
    y: mapHeight / 2 - userSize / 2
  };

  const [userPosition, setUserPosition] = useState(userInitialPosition);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const distance = 20;
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

      setUserPosition({ x, y });
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [userPosition]);

  return (
    <div>
      <h1>Map Explorer</h1>
      <div className="map-container">
        <div
          className="user"
          style={{
            top: `${userPosition.y}px`,
            left: `${userPosition.x}px`
          }}
        />
      </div>
    </div>
  );
};
