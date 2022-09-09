import { c, mouse, enemies, buildings } from "./canvas.js";
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
    this.radius = 50;
    this.health = 100;

    //used for the speed of our enemies
    this.velocity = { x: 0, y: 0 };
  }

  draw() {
    c.fillStyle = "red";
    //make the enemies squares
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    c.beginPath();
    c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    c.fill();

    //red health bar
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y - 15, this.width, 10);

    //green health bar
    c.fillStyle = "green";
    c.fillRect(
      this.position.x,
      this.position.y - 15,
      (this.width * this.health) / 100,
      10
    );
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

    //variables we will use to increase the speed of our enemies
    const speed = 10;
    this.velocity.x = Math.cos(angle) * speed;
    this.velocity.y = Math.sin(angle) * speed;

    //how we speed our enemies up
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //code for centering our enemys on our waypoint line
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };

    //how we move from waypoint to waypoint, through our waypoints array
    if (
      //
      Math.abs(Math.round(this.center.x) - waypoint.x) <
        Math.abs(this.velocity.x) &&
      Math.abs(Math.round(this.center.y) - waypoint.y) <
        Math.abs(this.velocity.y) &&
      this.waypointIndex < waypoints.length - 1
    ) {
      this.waypointIndex++;
    }
  }
}

export class Projectile {
  constructor({ position = { x: 0, y: 0 }, enemy }) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.enemy = enemy;
    this.radius = 10;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "orange";
    c.fill();
  }

  update() {
    this.draw();

    //editing our values
    //atan2 takes x and y distance as argus
    const angle = Math.atan2(
      this.enemy.center.y - this.position.y,
      this.enemy.center.x - this.position.x
    );

    //will push projectile toward the enemy,
    const POWER = 5; //power here represents the speed of the projectile
    this.velocity.x = Math.cos(angle) * POWER;
    this.velocity.y = Math.sin(angle) * POWER;

    //
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

export class Building {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;

    //using width and height we center the projectile in our buildings
    this.width = 64 * 2;
    this.height = 64;
    //center the projectile
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.radius = 250; //will be the radius around our building that if an enemy is in our radius we will shoot a projectile

    this.target;
    this.frames = 0; // will be used to produce a projectile

    this.projectiles = [];
  }

  draw() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, 64);

    c.beginPath();
    c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "rgba(0, 0, 255, 0.2)";
    c.fill();
  }

  update() {
    this.draw();
    if (this.frames % 100 === 0 && this.target) {
      this.projectiles.push(
        new Projectile({
          //position the projectile in center
          position: {
            x: this.center.x,
            y: this.center.y,
          },
          enemy: this.target, //target first enemy for now
        })
      );
    }

    this.frames++;
  }
}
