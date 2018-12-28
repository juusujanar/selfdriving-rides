import * as PIXI from 'pixi.js';
import * as updater from './updateFrontend';
import * as rides from './rides';

// General configuration of the field sizes
const ROWS = localStorage.getItem('rows') || 10;
const COLUMNS = localStorage.getItem('columns') || 10;
const MAX_ROWS = localStorage.getItem('rows') || 10;
const MAX_COLUMNS = localStorage.getItem('columns') || 10;
const RESOLUTION_X = 1024;
const RESOLUTION_Y = 768;

window.saveConfiguration = () => {
  localStorage.setItem('rows', document.getElementById('rows').value);
  localStorage.setItem('columns', document.getElementById('columns').value);
  window.location.reload();
};


// Array of rides to be accepted by a driver
const pendingRides = [];
// Array of vehicles in use
const vehicles = [];

const app = new PIXI.Application(RESOLUTION_X, RESOLUTION_Y, { backgroundColor: 0xbbbcbf });
document.body.appendChild(app.view);

function calcRectSize(canvasWidth, columnOrRowCount, roadSize) {
  const unused = canvasWidth - columnOrRowCount * roadSize;
  return unused / columnOrRowCount;
}

function drawRoads(rowCount, columnCount, maxColumnCount, maxRowCount) {
  // if you want to play with road/rectangle sizes then just adjust roadWidth and roadHeight
  const roadWidth = 40 + 5 * (maxColumnCount - columnCount - 1);
  const roadHeight = 40 + 5 * (maxRowCount - rowCount - 1);

  const rectWith = calcRectSize(RESOLUTION_X, columnCount, roadWidth);
  const rectHeight = calcRectSize(RESOLUTION_Y, rowCount, roadHeight);

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

window.addEventListener('load', () => {
  document.getElementById('rows').value = localStorage.getItem('rows') || 10;
  document.getElementById('columns').value = localStorage.getItem('columns') || 10;

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

  rides.generateRideRequest(ROWS, COLUMNS, pendingRides, 0);
  rides.generateRideRequest(ROWS, COLUMNS, pendingRides, 1);
  rides.generateRideRequest(ROWS, COLUMNS, pendingRides, 0);

  // Listen for animate update
  app.ticker.add(() => {
    // rides.generateRideRequest(ROWS, COLUMNS, pendingRides, 0);
    // console.log(pendingRides);
    updater.updatePendingRides(pendingRides);
    updater.updateVehicles(vehicles);
  });
});
