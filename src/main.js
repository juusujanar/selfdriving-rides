import * as PIXI from 'pixi.js';

import * as updater from './updateFrontend';
import * as rides from './rides';
import * as vehicles from './vehicles';
import { xCoordToPixel, yCoordToPixel } from './util';

// General configuration of the field sizes
const ROWS = localStorage.getItem('rows') || 10;
const COLUMNS = localStorage.getItem('columns') || 10;
const MAX_ROWS = localStorage.getItem('max_rows') || 10;
const MAX_COLUMNS = localStorage.getItem('max_columns') || 10;
const RESOLUTION_X = 1024;
const RESOLUTION_Y = 768;

// Color configurations
const rectangleColor = 0xc0e8da;
const roadColor = 0x8c9191;
const lineColorOnRoad = 0xffffff;

window.saveConfiguration = () => {
  localStorage.setItem('rows', document.getElementById('rows').value);
  localStorage.setItem('columns', document.getElementById('columns').value);
  window.location.reload();
};


// Array of rides to be accepted by a driver
const pendingRides = [];
// Array of vehicles in use
const drivers = vehicles.getDefaultVehicles();

const app = new PIXI.Application(RESOLUTION_X, RESOLUTION_Y, { backgroundColor: 0xbbbcbf });
document.body.appendChild(app.view);

function calcRectSize(canvasWidthOrHeight, columnOrRowCount, roadSize) {
  const unused = canvasWidthOrHeight - columnOrRowCount * roadSize;
  return unused / columnOrRowCount;
}


function drawVerticalLines(x, y, rectWidth, rectHeight, roadWidth,
  lineWidth, lineLength, missingLineLength) {
  const xLine = x + rectWidth + roadWidth / 2 - lineWidth / 2;
  const linesCount = Math.floor(rectHeight / (lineLength + missingLineLength));
  const linesLength = linesCount * lineLength + (linesCount - 1) * missingLineLength;
  const linesEdgeFromCrossing = (rectHeight - linesLength) / 2;

  // drawing lines and increasing its y position
  let currentY = y + linesEdgeFromCrossing;
  const rectangle = new PIXI.Graphics();
  for (let i = 0; i < linesCount; i++) {
    rectangle.beginFill(lineColorOnRoad);
    rectangle.drawRect(xLine, currentY, lineWidth, lineLength);
    rectangle.endFill();
    app.stage.addChild(rectangle);
    currentY += lineLength + missingLineLength;
  }
}

function drawHorizontalLines(x, y, rectWidth, rectHeight, roadHeight,
  lineWidth, lineLength, missingLineLength) {
  const yLine = y + rectHeight + roadHeight / 2 - lineWidth / 2;
  const linesCount = Math.floor(rectWidth / (lineLength + missingLineLength));
  const linesLength = linesCount * lineLength + (linesCount - 1) * missingLineLength;
  const linesEdgeFromCrossing = (rectWidth - linesLength) / 2;

  // drawing lines and increasing its y position
  let currentX = x + linesEdgeFromCrossing;
  const rectangle = new PIXI.Graphics();
  for (let i = 0; i < linesCount; i++) {
    rectangle.beginFill(lineColorOnRoad);
    rectangle.drawRect(currentX, yLine, lineLength, lineWidth);
    rectangle.endFill();
    app.stage.addChild(rectangle);
    currentX += lineLength + missingLineLength;
  }
}


function drawRoads(rowCount, columnCount, maxColumnCount, maxRowCount) {
  // if you want to play with road/rectangle sizes then just adjust roadWidth and roadHeight
  const roadWidth = 60 + 5 * (maxColumnCount - columnCount - 1);
  const roadHeight = 60 + 5 * (maxRowCount - rowCount - 1);
  // making the roadHeight and roadWidth equal to the smaller value of them
  const roadSize = Math.min(roadWidth, roadHeight);

  const rectWidth = calcRectSize(RESOLUTION_X, columnCount, roadSize);
  const rectHeight = calcRectSize(RESOLUTION_Y, rowCount, roadSize);

  let y = -rectHeight / 2;
  const rectangle = new PIXI.Graphics();

  // drawing rows
  for (let i = 0; i < rowCount + 1; i++) {
    let x = -rectWidth / 2;
    // drawing columns
    for (let j = 0; j < columnCount + 1; j++) {
      rectangle.beginFill(rectangleColor);
      rectangle.drawRect(x, y, rectWidth, rectHeight);
      rectangle.endFill();
      app.stage.addChild(rectangle);
      // drawing road lines between two rectangles. (it prolly is faster outside of loop)
      drawVerticalLines(x, y, rectWidth, rectHeight, roadSize, 2, 10, 10);
      drawHorizontalLines(x, y, rectWidth, rectHeight, roadSize, 2, 10, 10);
      // changing x ready for another rectangle
      x = x + roadSize + rectWidth;
    }
    y = y + roadSize + rectHeight;
  }
}


/**
 * We start coordinates at (0,0) and end at (9,9)
 * Coordinate 0,0 so upper-left intersection is at (50,40)
 * Next x intersection is +100, so (150,40)
 * Next y intersection is +75, so (50,115) or (150,115)
 */


window.addEventListener('load', () => {
  // Set simulation field size
  // document.getElementById('rows').value = localStorage.getItem('rows') || 10;
  // document.getElementById('columns').value = localStorage.getItem('columns') || 10;

  drawRoads(ROWS, COLUMNS, MAX_ROWS, MAX_COLUMNS);

  // Generate three random ride requests
  for (let i = 0; i < 4; i++) {
    pendingRides.push(rides.generateRideRequest(ROWS - 1, COLUMNS - 1, 0));
  }

  // Add cars onto the canvas
  const carImage = PIXI.Texture.fromImage('./car.png');

  for (let i = 0, len = drivers.length; i < len; i++) {
    const car = new PIXI.Sprite(carImage);
    car.scale.x = 0.3;
    car.scale.y = 0.3;
    car.anchor.set(0.5); // Center sprite's anchor point
    car.x = xCoordToPixel(drivers[i].x);
    car.y = yCoordToPixel(drivers[i].y);
    app.stage.addChild(car);
    drivers[i].car = car;
  }

  updater.updatePendingRides(pendingRides);
  updater.updateVehicles(drivers);

  // Ticket default speed is 1 which equals to approximately 60 FPS
  app.ticker.add(() => {
    for (let i = 0, len = drivers.length; i < len; i++) {
      vehicles.moveX(drivers[i], xCoordToPixel(9));
    }

    // rides.generateRideRequest(ROWS, COLUMNS, pendingRides, 0);
    // console.log(pendingRides);
    updater.updatePendingRides(pendingRides);
    updater.updateVehicles(drivers);

    // Testing vehicle turning
    // Currently rotating infinitely
    vehicles.turnLeft(drivers[3]);
  });
});
