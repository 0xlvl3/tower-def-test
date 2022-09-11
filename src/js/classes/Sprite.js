import { c } from "../canvas.js";

export default class Sprite {
  constructor(
    { position = { x: 0, y: 0 } },
    imageSrc,
    frames = { max: 1 },
    offset = { x: 0, y: 0 }
  ) {
    this.position = position;

    this.image = new Image();
    this.image.src = imageSrc;

    //used to loop through our sprites, max is max frames and current is current frame which we default to 0
    //elapsed and hold are related to the speed of which we proceed through our crop of images
    this.frames = {
      max: frames.max,
      current: 0,
      elapsed: 0,
      hold: 3,
    };

    this.offset = offset;
  }

  draw() {
    if (!this.image.complete) return;

    //how we crop our image so we can loop through the correct amount of frames associated with that image
    const cropWidth = this.image.width / this.frames.max;

    //crop used within our drawImage method
    const crop = {
      position: {
        x: cropWidth * this.frames.current,
        y: 0,
      },
      width: this.image.width / this.frames.max,
      height: this.image.height,
    };

    //drawImage that will crop our specifed sprite sheets into correct amounts related to that image.
    c.drawImage(
      this.image,
      crop.position.x,
      crop.position.y,
      crop.width,
      crop.height,
      this.position.x + this.offset.x,
      this.position.y + this.offset.y,
      crop.width,
      crop.height
    );
  }

  update() {
    //responsible for animation
    this.frames.elapsed++;
    if (this.frames.elapsed % this.frames.hold === 0) {
      //how we reloop through our frames once we hit our max frames
      this.frames.current++;
      if (this.frames.current >= this.frames.max) {
        this.frames.current = 0;
      }
    }
  }
}
