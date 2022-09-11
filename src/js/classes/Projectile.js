import Sprite from "./Sprite.js";

export default class Projectile extends Sprite {
  constructor({ position = { x: 0, y: 0 }, enemy }) {
    super({ position }, "/img/projectile.png");

    this.velocity = {
      x: 0,
      y: 0,
    };
    this.enemy = enemy;
    this.radius = 10;
  }

  /**
 * before we extended with sprite
 * ---
 * use this to create orange cirlce projectile 
 * 
 *  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "orange";
    c.fill();
  }
 */

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
