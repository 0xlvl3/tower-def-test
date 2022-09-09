import { placementTitlesData } from "./placementTitles.js";
import { waypoints } from "./waypoints.js";
import { PlacementTile, Enemy, Building, Projectile } from "./classes.js";

export const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d");
const gameOver = document.querySelector(".gameOver");
const heartsCount = document.querySelector(".heartCount");

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
map.src = "/img/newMap.png";

//create a 2d map of our placement tiles
const placementTilesData2D = [];

//split that map into rows of 20 all up 12 rows
for (let i = 0; i < placementTitlesData.length; i += 20) {
  //we slice i, i + 20 to get our rows
  placementTilesData2D.push(placementTitlesData.slice(i, i + 20));
}

const placementTiles = [];

//we then forEach
placementTilesData2D.forEach((row, y) => {
  row.forEach((placement, x) => {
    if (placement === 14) {
      //add building placement tile here
      placementTiles.push(
        new PlacementTile({
          position: {
            x: x * 64,
            y: y * 64,
          },
        })
      );
    }
  });
});

export const enemies = [];
/**
 * spawnEnemies will spawn amount of enemies declared in parameters
 * @param {int} spawnCount 

 */
function spawnEnemies(spawnCount) {
  //use for loop so render doesn't mess up
  //we +1 on spawn count since we start on 1 within our loop
  for (let i = 1; i < spawnCount + 1; i++) {
    //xOffset is how far between spawns enemies will spawn
    const xOffset = i * 200;

    enemies.push(
      new Enemy({
        position: {
          x: waypoints[0].x - xOffset,
          y: waypoints[0].y,
        },
      })
    );
  }
}
// const enemy = new Enemy({ position: { x: waypoints[0].x, y: waypoints[0].y } });
// const enemy2 = new Enemy({
//   position: { x: waypoints[0].x - 250, y: waypoints[0].y },
// });

export const buildings = [];
let activeTile = undefined;

//will be used within spawnEnemies as our counter
let enemyCount = 3;
spawnEnemies(enemyCount);

//life counter
let lifeCount = 10;

//animation function
function animate() {
  //the method that animates our game, through recursive
  //stored in const for the animation ID used within ----
  const animationID = requestAnimationFrame(animate);

  //drawing our map into our canvas
  c.drawImage(map, 0, 0);

  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.update();

    //when enemy goes off map
    if (enemy.position.x > canvas.width) {
      //remove enemy from map
      enemies.splice(i, 1);

      //take 1 life
      lifeCount -= 1;
      heartsCount.innerHTML = lifeCount;
      if (lifeCount === 0) {
        //cancelAnimationFrame takes the animationID as an argu, and will pause the game when we reach 0 lifeCount
        cancelAnimationFrame(animationID);
        gameOver.style.display = "flex";
      }
    }

    //tracking total amount of enemies
    if (enemies.length === 0) {
      //increase total amount of enemies per wave
      enemyCount += 2;
      //if 0 spawn respawn enemies
      spawnEnemies(enemyCount);
    }
  }

  placementTiles.forEach((tile) => {
    tile.update(mouse);
  });

  buildings.forEach((building) => {
    building.update();
    //target is set to null first this will be used with collision detection with our buildings
    building.target = null;

    //how we detect collision between enemy and buildings
    const validEnemies = enemies.filter((enemy) => {
      //same as collision between our projectile and enemy
      const xDifference = enemy.center.x - building.center.x;
      const yDifference = enemy.center.y - building.center.y;
      const distance = Math.hypot(xDifference, yDifference);

      return distance < enemy.radius + building.radius;
    });

    building.target = validEnemies[0];

    //we replaced our forEach loop with a for loop so our projectile rendered correctly
    // building.projectiles.forEach((projectile, i) -- originally
    for (let i = building.projectiles.length - 1; i >= 0; i--) {
      const projectile = building.projectiles[i];

      projectile.update();

      //how to detect for enemy collision
      //this is how you get the distance between projectile and enemy
      const xDifference = projectile.enemy.center.x - projectile.position.x;
      const yDifference = projectile.enemy.center.y - projectile.position.y;
      const distance = Math.hypot(xDifference, yDifference);

      //this is when our projectile hits an enemy, once hit it removes projectile
      if (distance < projectile.enemy.radius + projectile.radius) {
        //how we get enemy health
        // projectile.enemy.health;
        //enemy hit takes -20 to health
        projectile.enemy.health -= 20;
        //if enemy health is gone
        if (projectile.enemy.health <= 0) {
          const enemyIndex = enemies.findIndex((enemy) => {
            return projectile.enemy === enemy;
          });

          //random enemies will not be removed because of this if
          if (enemyIndex > -1) {
            enemies.splice(enemyIndex, 1);
          }
        }

        building.projectiles.splice(i, 1);
      }
    }
  });
}

export const mouse = {
  x: undefined,
  y: undefined,
};

canvas.addEventListener("click", (e) => {
  if (activeTile && !activeTile.isOccupied) {
    buildings.push(
      new Building({
        position: {
          x: activeTile.position.x,
          y: activeTile.position.y,
        },
      })
    );
    activeTile.isOccupied = true;
    console.log(activeTile);
    console.log(buildings);
  }
});

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  activeTile = null;
  for (let i = 0; i < placementTiles.length; i++) {
    const tile = placementTiles[i];
    if (
      mouse.x > tile.position.x &&
      mouse.x < tile.position.x + tile.size &&
      mouse.y > tile.position.y &&
      mouse.y < tile.position.y + tile.size
    ) {
      activeTile = tile;
      break;
    }
  }
});
