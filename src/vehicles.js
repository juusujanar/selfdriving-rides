import {
  xCoordToPixel,
  yCoordToPixel,
  xPixelToCoord,
  yPixelToCoord,
} from './util';

const defaultVehicles = [
  { id: 0, name: 'Tom', x: 0, y: 0, status: 'Waiting', destination: '', client: '' },
  { id: 1, name: 'Mark', x: 0, y: 1, status: 'Waiting', destination: '', client: '' },
  { id: 2, name: 'Kim', x: 1, y: 0, status: 'Waiting', destination: '', client: '' },
  { id: 3, name: 'Megan', x: 2, y: 0, status: 'Waiting', destination: '', client: '' },
  // { id: 4, name: 'Megan', x: 3, y: 0, status: 'Waiting', destination: '' },
  // { id: 5, name: 'Megan', x: 4, y: 0, status: 'Waiting', destination: '' },
  // { id: 6, name: 'Megan', x: 5, y: 0, status: 'Waiting', destination: '' },
  // { id: 7, name: 'Megan', x: 6, y: 0, status: 'Waiting', destination: '' },
  // { id: 8, name: 'Megan', x: 7, y: 0, status: 'Waiting', destination: '' },
  // { id: 9, name: 'Megan', x: 8, y: 0, status: 'Waiting', destination: '' },
  // { id: 10, name: 'Megan', x: 9, y: 0, status: 'Waiting', destination: '' },
  // { id: 11, name: 'Megan', x: 0, y: 2, status: 'Waiting', destination: '' },
  // { id: 12, name: 'Megan', x: 0, y: 3, status: 'Waiting', destination: '' },
  // { id: 13, name: 'Megan', x: 0, y: 4, status: 'Waiting', destination: '' },
  // { id: 14, name: 'Megan', x: 0, y: 5, status: 'Waiting', destination: '' },
  // { id: 15, name: 'Megan', x: 0, y: 6, status: 'Waiting', destination: '' },
  // { id: 16, name: 'Megan', x: 0, y: 7, status: 'Waiting', destination: '' },
  // { id: 17, name: 'Megan', x: 0, y: 8, status: 'Waiting', destination: '' },
  // { id: 18, name: 'Megan', x: 0, y: 9, status: 'Waiting', destination: '' },
];

const SPEED = 2;

export function getDefaultVehicles(n) {
  return defaultVehicles.slice(0, n);
}

const minX = xCoordToPixel(0) - 5;
const minY = yCoordToPixel(0) - 5;
const maxX = xCoordToPixel(9) + 30;
const maxY = yCoordToPixel(9) + 30;

console.log(`Minimum borders are X ${minX} and Y ${minY}, maximum X ${maxX} and Y ${maxY}`);

export function move(vehicle, rides) {
  if (vehicle.destination === '' || destinationReached(vehicle)) {
    assignDestination(vehicle, rides);
  }
  if (!destinationReached(vehicle)) {
    changeCarLocation(vehicle);
  }
}

//todo simple solution. If time make it more fancy (random time turns)
function changeCarLocation(vehicle) {
  //goes to the x endpoint first
  if (vehicle.destination[0] !== vehicle.x) {
    moveX(vehicle, xCoordToPixel(vehicle.destination[0]));
  } else {
    moveY(vehicle, yCoordToPixel(vehicle.destination[1]));
  }
}

function moveX(vehicle, target) {
  const { car } = vehicle;
  vehicle.status = 'Moving';

  // TODO: Check if next step is also in map bounds
  if (car.x > minX && car.x < maxX) {
    // Moving towards the right-side of the map
    if (car.x < target) { // If we have not passed the target
      if (car.x + SPEED < target) { // If target is further than 1 step, take 1 step
        car.x += SPEED;
      } else { // Otherwise move to the target
        car.x = target;
      }
      vehicle.x = Math.round(xPixelToCoord(car.x) * 100) / 100;

    // Moving towards the left-side of the map
    } else if (car.x > target) { // Check to make sure we did not pass the target
      if (car.x - SPEED > target) { // If target is further than 1 step, take 1 step
        car.x -= SPEED;
      } else {
        car.x = target; // Otherwise move to the target exactly
      }
      vehicle.x = Math.round(xPixelToCoord(car.x) * 100) / 100;
    }
  } else {
    console.error('Car went out of bounds on X coord');
  }
}

function moveY(vehicle, target) {
  const { car } = vehicle;
  vehicle.status = 'Moving';

  if (car.y > minY && car.y < maxY) {
    if (car.y < target) {    // moving down
      if (car.y + SPEED < target) {
        car.y += SPEED;
      } else {
        car.y = target;
      }
      vehicle.y = Math.round(yPixelToCoord(car.y) * 100) / 100;
      if (vehicle.y === 2) {
      }
    // moving up
    } else if (car.y > target) { // Check to make sure we did not pass the target
      if (car.y - SPEED > target) { // If target is further than 1 step, take 1 step
        car.y -= SPEED;
      } else {
        car.y = target; // Otherwise move to the target exactly
      }
      vehicle.y = Math.round(yPixelToCoord(car.y) * 100) / 100;
      if (vehicle.y === 2) {
      }
    }
  } else {
    console.error('Car went out of bounds on Y coord');
  }
}

// Currently rotating infinitely
export function turnRight(vehicle) {
  vehicle.status = 'Turning';
  vehicle.car.rotation += 1.5708 * 0.1;
}

export function turnLeft(vehicle) {
  vehicle.status = 'Turning';
  vehicle.car.rotation -= 1.5708 * 0.1;
}

function destinationReached(car) {
  return car.destination[0] === car.x && car.destination[1] === car.y;
}

  function assignDestination(car, rides) {
  for (let i = 0; i < rides.length; i++) {
    let ride = rides[i];

    // if someone is in the car, then brings client to it's destination
    if (ride.status === car.name + " approaching") {
      ride.status = "In " + car.name + "'s car";
      car.destination = [ride.xEnd, ride.yEnd];
      return;
    }

    // Client brought to it's destination
    if (ride.status === "In " + car.name + "'s car") {
      ride.status = "Finished";
    }

    // going to first waiting client
    if (ride.status === "Waiting") {
      ride.status = car.name + " approaching";
      car.destination = [ride.xStart, ride.yStart];
      car.client = ride.id;
      return;
    }
  }
}