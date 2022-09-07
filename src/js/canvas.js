import { placementTitlesData } from "./placementTitles.js";
import { waypoints } from "./waypoints.js";
import { PlacementTile, Enemy, Building } from "./classes.js";

export const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d");

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

const enemies = [];
for (let i = 1; i < 10; i++) {
  const xOffset = i * 150;

  enemies.push(
    new Enemy({
      position: {
        x: waypoints[0].x - xOffset,
        y: waypoints[0].y,
      },
    })
  );
}

// const enemy = new Enemy({ position: { x: waypoints[0].x, y: waypoints[0].y } });
// const enemy2 = new Enemy({
//   position: { x: waypoints[0].x - 250, y: waypoints[0].y },
// });

const buildings = [];
let activeTile = undefined;

//animation function
function animate() {
  //the method that animates our game, through recursive
  requestAnimationFrame(animate);

  //drawing our map into our canvas
  c.drawImage(map, 0, 0);

  enemies.forEach((enemy) => {
    enemy.update();
  });

  placementTiles.forEach((tile) => {
    tile.update(mouse);
  });

  buildings.forEach((building) => {
    building.draw();
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
