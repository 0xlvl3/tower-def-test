import { waypoints } from "./waypoints.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 768;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

/**
 *  HOW TO IMPORT A MAP IMAGE INTO CANVAS
 * -----------------------------------------
 *  const image = new Image();
 *  image.onload = () = {
 *  c.drawImage(image, width, height)
 *  }
 *  image.src = 'img/image.png'
 * -----------------------------------------
 */
//drawing our map into our canvas
const map = new Image();
//we call c.drawImage within our animate loop
map.onload = () => {
  animate();
};
//how we set the src of our map
map.src = "/img/map.png";

//Enemy class
class Enemy {
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

const enemys = [];

const enemy = new Enemy({ position: { x: waypoints[0].x, y: waypoints[0].y } });
const enemy2 = new Enemy({
  position: { x: waypoints[0].x - 150, y: waypoints[0].y },
});

//animation function
function animate() {
  //the method that animates our game, through recursive
  requestAnimationFrame(animate);

  //drawing our map into our canvas
  c.drawImage(map, 0, 0);

  enemy.update();
  enemy2.update();
}
