import {
  xCoordToPixel,
  yCoordToPixel,
  xPixelToCoord,
  yPixelToCoord,
} from './util';

const defaultVehicles = [
  { id: 0, name: 'Tom', x: 0, y: 0 },
  { id: 1, name: 'Mark', x: 0, y: 1 },
  { id: 2, name: 'Kim', x: 1, y: 0 },
  { id: 3, name: 'Megan', x: 9, y: 9 },
];

const SPEED = 2;

export function getDefaultVehicles() {
  return defaultVehicles;
}

const minX = xCoordToPixel(0) - 5;
const minY = yCoordToPixel(0) - 5;
const maxX = xCoordToPixel(9) + 30;
const maxY = yCoordToPixel(9) + 30;

export function moveX(vehicle, target) {
  const { car } = vehicle;

  if (car.x > minX && car.x < maxX) {
    if (car.x < target) {
      car.x += SPEED;
      vehicle.x = xPixelToCoord(car.x);
    } else if (car.x > target) {
      car.x -= SPEED;
      vehicle.x = xPixelToCoord(car.x);
    }
  } else {
    console.error('Car went out of bounds on X coord');
  }
}

export function moveY(vehicle, target) {
  const { car } = vehicle;

  if (car.y > minY && car.y < maxY) {
    if (car.y < target) {
      car.y += SPEED;
      vehicle.y = yPixelToCoord(car.y);
    } else if (car.y > target) {
      car.y -= SPEED;
      vehicle.y = yPixelToCoord(car.y);
    }
  } else {
    console.error('Car went out of bounds on Y coord');
  }
}
