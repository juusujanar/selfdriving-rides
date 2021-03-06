import * as PIXI from 'pixi.js';

import * as updater from './updateFrontend';
import * as rides from './rides';
import * as vehicles from './vehicles';
import { xCoordToPixel, yCoordToPixel, rounded, sortRides } from './util';

// General configuration of the field sizes
const ROWS = 10;
const COLUMNS = 10;
const MAX_ROWS = 10;
const MAX_COLUMNS = 10;
const RESOLUTION_X = 1024;
const RESOLUTION_Y = 768;
let rectWidth = 0;
let rectHeight = 0;
let roadWidth = 0;
let roadHeight = 0;

// rides configuration
const CAR_COUNT = localStorage.getItem('cars') || 3;
const RIDE_COUNT = localStorage.getItem('rides') || 8;

// Color configurations
const rectangleColor = 0xc0e8da;
const roadColor = 0x8c9191;
const lineColorOnRoad = 0xffffff;

// Array of rides to be accepted by a driver
let pendingRides = rides.getDefaultRides(RIDE_COUNT);
// Array of vehicles in use
const drivers = vehicles.getDefaultVehicles(CAR_COUNT);

const startMarker = PIXI.Texture.fromImage('./red-marker.png');
const endMarker = PIXI.Texture.fromImage('./green-marker.png');

// assign rides to drivers
for (let i = 0; i < drivers.length; i++) {
  drivers[i].rides = [];
}

const app = new PIXI.Application(RESOLUTION_X, RESOLUTION_Y, { backgroundColor: roadColor });
document.body.appendChild(app.view);


window.saveConfiguration = () => {
  localStorage.setItem('cars', document.getElementById('vehicle-count').value);
  localStorage.setItem('rides', document.getElementById('ride-count').value);
  localStorage.setItem('speed', document.getElementById('car-speed').value);
  window.location.reload();
};

window.clearFinished = () => {
  pendingRides = pendingRides.filter(ride => ride.status !== 'Finished');
};

window.pause = () => {
  if (app.ticker.started) {
    app.ticker.stop();
    document.getElementById('pause').innerHTML = 'Resume simulation';
  } else {
    app.ticker.start();
    document.getElementById('pause').innerHTML = 'Pause simulation';
  }
};


function addRideMarkers(ride) {
  const start = new PIXI.Sprite(startMarker);
  start.anchor.set(0.5, 0.9); // Center sprite's anchor point
  start.x = xCoordToPixel(ride.xStart);
  start.y = yCoordToPixel(ride.yStart);
  app.stage.addChild(start);
  ride.startMarker = start;

  const end = new PIXI.Sprite(endMarker);
  end.anchor.set(0.5, 0.9); // Center sprite's anchor point
  end.x = xCoordToPixel(ride.xEnd);
  end.y = yCoordToPixel(ride.yEnd);
  app.stage.addChild(end);
  ride.endMarker = end;
}


window.addRide = () => {
  if (pendingRides.length < 10) {
    const ride = rides.generateRideRequest(ROWS - 1, COLUMNS - 1, window.time, drivers);
    pendingRides.push(ride);
    sortRides(pendingRides);
    addRideMarkers(ride);
  }
};


function calcRectSize(canvasWidthOrHeight, columnOrRowCount, roadSize) {
  const unused = canvasWidthOrHeight - columnOrRowCount * roadSize;
  return unused / columnOrRowCount;
}


function drawVerticalLines(x, y, lineWidth, lineLength, missingLineLength) {
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

function drawHorizontalLines(x, y, lineWidth, lineLength, missingLineLength) {
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
  roadWidth = 60 + 5 * (maxColumnCount - columnCount - 1);
  roadHeight = 60 + 5 * (maxRowCount - rowCount - 1);
  // making the roadHeight and roadWidth equal to the smaller value of them
  const roadSize = Math.min(roadWidth, roadHeight);

  rectWidth = calcRectSize(RESOLUTION_X, columnCount, roadSize);
  rectHeight = calcRectSize(RESOLUTION_Y, rowCount, roadSize);

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
      drawVerticalLines(x, y, 2, 10, 10);
      drawHorizontalLines(x, y, 2, 10, 10);
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

const streetPassingSpeed = localStorage.getItem('speed') || 2; // in seconds
let time = 0;
let timeChangeInTick = 0;
let xSpeed;
let ySpeed;

function formSpeeds() {
  const xDistToPass = rectWidth + roadWidth;
  const yDistToPass = rectHeight + roadHeight;
  const tickRate = 60;
  xSpeed = xDistToPass / tickRate / streetPassingSpeed;
  ySpeed = yDistToPass / tickRate / streetPassingSpeed;
  timeChangeInTick = 1 / (tickRate * streetPassingSpeed);
}


window.addEventListener('load', () => {
  // Set simulation field size
  document.getElementById('vehicle-count').value = CAR_COUNT;
  document.getElementById('ride-count').value = RIDE_COUNT;
  document.getElementById('car-speed').value = streetPassingSpeed;

  sortRides(pendingRides);

  drawRoads(ROWS, COLUMNS, MAX_ROWS, MAX_COLUMNS);
  formSpeeds();

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

  for (let i = 0, len = pendingRides.length; i < len; i++) {
    addRideMarkers(pendingRides[i]);
  }

  // Ticker default speed is 1 which equals to approximately 60 FPS
  app.ticker.add(() => {
    time += timeChangeInTick;
    window.time = time;
    for (let driverIndex = 0, len = drivers.length; driverIndex < len; driverIndex++) {
      vehicles.move(drivers, driverIndex, pendingRides, xSpeed, ySpeed, time);
    }

    if (Math.ceil(time * 100) % 2 === 0) {
      updater.updatePendingRides(pendingRides);
      updater.updateVehicles(drivers);
      document.getElementById('time').innerHTML = rounded(time).toFixed(2);
      document.getElementById('fps').innerHTML = (Math.round(app.ticker.FPS * 100) / 100).toFixed(2);
    }
  });
});
