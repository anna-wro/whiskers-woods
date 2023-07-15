import { Position } from "./components/types";

export class GameMap {
  map: boolean[][]; // [x][y]

  constructor(width: number, height: number) {
    this.map = [];

    for (let x = 0; x <= width; x++) {
      const line = [];
      for (let y = 0; y <= height; y++) {
        line.push(false);
      }
      this.map.push(line);
    }
  }

  markVisited(updated: Position) {
    console.assert(updated.x < this.map.length, "Invalid x");
    console.assert(updated.y < this.map[updated.x].length, "Invalid y");
    this.map[updated.x][updated.y] = true;
  }

  *iterVisitedPosition() {
    for (const [x, line] of this.map.entries()) {
      for (const [y, value] of line.entries()) {
        if (value == false) {
          continue;
        }
        yield { x, y };
      }
    }
  }
}
