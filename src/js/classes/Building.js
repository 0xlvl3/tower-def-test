import Sprite from "./Sprite.js";
import { c } from "../canvas.js";
import Projectile from "./projectile.js";

export default class Building extends Sprite {
  constructor({ position = { x: 0, y: 0 } }) {
    super(
      { position },
      "/img/tower.png",
      { max: 19, current: 0, elapsed: 0, hold: 4 },
      { x: 0, y: -80 }
    );

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

    //used this before adding shoot, we declared property this.elapsedSpawnTime = 0
    // this.elapsedSpawnTime = 0; // will be used to produce a projectile    // if (this.elapsedSpawnTime % 100 === 0 && this.target) {

    // this.elapsedSpawnTime++;

    this.projectiles = [];
  }

  draw() {
    super.draw();
    // c.fillStyle = "blue";
    // c.fillRect(this.position.x, this.position.y, this.width, 64);

    // c.beginPath();
    // c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    // c.fillStyle = "rgba(0, 0, 255, 0.2)";
    // c.fill();
  }

  update() {
    this.draw();

    //will make our building return to frame 0 and will only animate || update when an enemy is colliding with the building
    if (this.target || (!this.target && this.frames.current !== 0)) {
      super.update();
    }

    if (
      this.target &&
      this.frames.current === 6 &&
      this.frames.elapsed % this.frames.hold === 0
    ) {
      this.shoot();
    }
  }

  shoot() {
    this.projectiles.push(
      new Projectile({
        //position the projectile in center
        position: {
          x: this.center.x - 20,
          y: this.center.y - 112,
        },
        enemy: this.target, //target first enemy for now
      })
    );
  }
}
