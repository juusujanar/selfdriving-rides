import * as PIXI from 'pixi.js';

const ROWS = 10;
const COLUMNS = 8;
const MAX_ROWS = 10;
const MAX_COLUMNS = 8;

// Array of rides to be accepted by a driver
const pendingRides = [];

const app = new PIXI.Application(800, 600, { backgroundColor: 0xbbbcbf });
document.body.appendChild(app.view);

function calcRectSize(canvasWidth, columnOrRowCount, roadSize) {
  const unused = canvasWidth - columnOrRowCount * roadSize;
  return unused / columnOrRowCount;
}

function drawRoads(rowCount, columnCount, maxColumnCount, maxRowCount) {
  // if you want to play with road/rectangle sizes then just adjust roadWidth and roadHeight
  const roadWidth = 40 + 5 * (maxColumnCount - columnCount - 1);
  const roadHeight = 40 + 5 * (maxRowCount - rowCount - 1);

  const rectWith = calcRectSize(800, columnCount, roadWidth);
  const rectHeight = calcRectSize(600, rowCount, roadHeight);

  let y = -rectHeight / 2;
  const rectangle = new PIXI.Graphics();
  for (let i = 0; i < rowCount + 1; i += 1) {
    let x = -rectWith / 2;
    for (let j = 0; j < columnCount + 1; j += 1) {
      rectangle.beginFill(0xffffff);
      rectangle.drawRect(x, y, rectWith, rectHeight);
      rectangle.endFill();
      x = x + roadWidth + rectWith;
      app.stage.addChild(rectangle);
    }
    y = y + roadHeight + rectHeight;
  }
}

function generateRideRequest(rows, columns) {
  pendingRides.push({});
  return pendingRides.pop();
}

drawRoads(ROWS, COLUMNS, MAX_ROWS, MAX_COLUMNS);

// create a new Sprite from an image path
const car = PIXI.Sprite.from('./car.png');
car.scale.x = 0.4;
car.scale.y = 0.4;


// center the sprite's anchor point
car.anchor.set(0.5);

// move the sprite to the center of the screen
car.x = app.screen.width / 2;
car.y = app.screen.height / 2;

app.stage.addChild(car);

// Listen for animate update
// app.ticker.add((delta) => {
//   just for fun, let's rotate the vroom machine a little
//   delta is 1 if running at 100% performance
//   creates frame-independent transformation
//   car.rotation += 0.1 * delta;
// });
