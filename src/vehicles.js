import {
  xCoordToPixel,
  yCoordToPixel,
  xPixelToCoord,
  yPixelToCoord,
} from './util';

const defaultVehicles = [
  { id: 0, name: 'Tom', x: 0, y: 0, status: 'Waiting', destination: '', client: '', currentRide: null, time: 0},
  { id: 1, name: 'Mark', x: 0, y: 1, status: 'Waiting', destination: '', client: '', currentRide: null, time: 0 },
  { id: 2, name: 'Kim', x: 1, y: 0, status: 'Waiting', destination: '', client: '', currentRide: null, time: 0 },
  { id: 3, name: 'Megan', x: 2, y: 0, status: 'Waiting', destination: '', client: '', currentRide: null, time: 0 },
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


export function getDefaultVehicles(n) {
  return defaultVehicles.slice(0, n);
}

const minX = xCoordToPixel(0) - 5;
const minY = yCoordToPixel(0) - 5;
const maxX = xCoordToPixel(9) + 30;
const maxY = yCoordToPixel(9) + 30;

console.log(`Minimum borders are X ${minX} and Y ${minY}, maximum X ${maxX} and Y ${maxY}`);

export function move(vehicle, rides, xSpeed, ySpeed) {
  if (vehicle.status === "finished")
    return;

  if (vehicle.destination === '') {   // first assignments
    takeNextRide(vehicle, rides);
  } else if (destinationReached(vehicle) && clientReady()) {  // todo client ready - boolean if client is ready for next destination
    assignDestination(vehicle, rides);
  }
  if (!destinationReached(vehicle)) {
    changeCarLocation(vehicle, xSpeed, ySpeed);
  }
}

//todo simple solution. If time make it more fancy (random time turns etc)
function changeCarLocation(vehicle, xSpeed, ySpeed) {
  //goes to the x endpoint first
  if (vehicle.destination[0] !== vehicle.x) {
    moveX(vehicle, xCoordToPixel(vehicle.destination[0]), xSpeed);
  } else {
    moveY(vehicle, yCoordToPixel(vehicle.destination[1]), ySpeed);
  }
}

function moveX(vehicle, target, speed) {
  const { car } = vehicle;
  vehicle.status = 'Moving';

  // TODO: Check if next step is also in map bounds
  if (car.x > minX && car.x < maxX) {
    // Moving towards the right-side of the map
    if (car.x < target) { // If we have not passed the target
      if (car.x + speed < target) { // If target is further than 1 step, take 1 step
        car.rotation = 0;
        car.x += speed;
      } else { // Otherwise move to the target
        car.x = target;
      }
      vehicle.x = Math.round(xPixelToCoord(car.x) * 100) / 100;

    // Moving towards the left-side of the map
    } else if (car.x > target) { // Check to make sure we did not pass the target
      if (car.x - speed > target) { // If target is further than 1 step, take 1 step
        car.rotation = 180 * (Math.PI / 180);
        car.x -= speed;
      } else {
        car.x = target; // Otherwise move to the target exactly
      }
      vehicle.x = Math.round(xPixelToCoord(car.x) * 100) / 100;
    }
  } else {
    console.error('Car went out of bounds on X coord');
  }
}

function moveY(vehicle, target, speed) {
  const { car } = vehicle;
  vehicle.status = 'Moving';

  if (car.y > minY && car.y < maxY) {
    if (car.y < target) {    // moving down
      if (car.y + speed < target) {
        car.rotation = 90 * (Math.PI / 180);
        car.y += speed;
      } else {
        car.y = target;
      }
      vehicle.y = Math.round(yPixelToCoord(car.y) * 100) / 100;
      if (vehicle.y === 2) {
      }
    // moving up
    } else if (car.y > target) { // Check to make sure we did not pass the target
      if (car.y - speed > target) { // If target is further than 1 step, take 1 step
        car.rotation = 270 * (Math.PI / 180);
        car.y -= speed;
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

function clientReady() {
  return true;
}

function assignDestination(car, rides) { //serving our client and if we finish with the client we assign a new client
  const ride = car.currentRide;
  if (car.currentRide.xStart === car.x && car.currentRide.yStart === car.y) { // we start to move to client's destination
    ride.status = `In ${car.name}'s car`;
    car.destination = [ride.xEnd, ride.yEnd];
    // Remove marker on pickup
    ride.startMarker.destroy();
  } else {   // client is in it's destination
    ride.status = "Finished";
    // Remove marker on finish
    ride.endMarker.destroy();
    takeNextRide(car, rides);
  }
}



function takeNextRide(car, rides) {
  const ride = rides[car.rides.shift()];
  if (ride == null) {   // there are no more rides that need serving
    car.status = "finished";
    return;
  }
  car.currentRide = ride;
  ride.status = `${car.name} approaching`;
  car.destination = [ride.xStart, ride.yStart];
  car.client = ride.id;
}

