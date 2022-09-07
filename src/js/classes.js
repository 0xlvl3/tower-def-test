import { c, mouse } from "./canvas.js";
import { waypoints } from "./waypoints.js";

export class PlacementTile {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.size = 64;
    this.color = "rgba(255, 255, 255, 0.2)";
    this.occupied = false;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.size, this.size);
  }

  update(mouse) {
    this.draw();

    if (
      mouse.x > this.position.x &&
      mouse.x < this.position.x + this.size &&
      mouse.y > this.position.y &&
      mouse.y < this.position.y + this.size
    ) {
      this.color = "rgba(144, 249, 144, 0.5)";
    } else {
      this.color = "rgba(255, 255, 255, 0.2)";
    }
  }
}

//Enemy class
export class Enemy {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.width = 100;
    this.height = 100;
    //reference to our waypoints js
    this.waypointIndex = 0;
    //how we center our squares on our waypoint so they aren't off center
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();

    //variable for our waypoints
    const waypoint = waypoints[this.waypointIndex];
    //x and y distance for our Math.atan2 method
    const yDistance = waypoint.y - this.center.y;
    const xDistance = waypoint.x - this.center.x;
    //this formula always needs y before x
    const angle = Math.atan2(yDistance, xDistance);

    // this.position.x += 1;
    //cos(r) === x
    //sin(r) === y
    this.position.x += Math.cos(angle);
    this.position.y += Math.sin(angle);

    //code for centering our enemys on our waypoint line
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };

    //how we move from waypoint to waypoint, through our waypoints array
    if (
      Math.round(this.center.x) === waypoint.x &&
      Math.round(this.center.y) === waypoint.y &&
      this.waypointIndex < waypoints.length - 1
    ) {
      this.waypointIndex++;
    }
  }
}

export class Building {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.width = 64 * 2;
  }

  draw() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, 64);
  }
}
