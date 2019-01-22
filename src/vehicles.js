import {
  xCoordToPixel,
  yCoordToPixel,
  xPixelToCoord,
  yPixelToCoord,
  distance,
  getRideWithId,
} from './util';
import { assignRideForCar } from './carSelection';


const defaultVehicles = [
  { id: 0, name: 'Tom', x: 0, y: 0, status: 'Waiting', destination: '', client: '', currentRide: null, score: 0 },
  { id: 1, name: 'Mark', x: 0, y: 0, status: 'Waiting', destination: '', client: '', currentRide: null, score: 0 },
  { id: 2, name: 'Kim', x: 0, y: 0, status: 'Waiting', destination: '', client: '', currentRide: null, score: 0 },
  { id: 3, name: 'Megan', x: 0, y: 0, status: 'Waiting', destination: '', client: '', currentRide: null, score: 0 },
];


export function getDefaultVehicles(n) {
  return defaultVehicles.slice(0, n);
}

const minX = xCoordToPixel(0) - 5;
const minY = yCoordToPixel(0) - 5;
const maxX = xCoordToPixel(9) + 30;
const maxY = yCoordToPixel(9) + 30;

const START_ON_TIME_BONUS = 5;

console.log(`Minimum borders are X ${minX} and Y ${minY}, maximum X ${maxX} and Y ${maxY}`);

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
    if (car.y < target) { // moving down
      if (car.y + speed < target) {
        car.rotation = 90 * (Math.PI / 180);
        car.y += speed;
      } else {
        car.y = target;
      }
      vehicle.y = Math.round(yPixelToCoord(car.y) * 100) / 100;
      // moving up
    } else if (car.y > target) { // Check to make sure we did not pass the target
      if (car.y - speed > target) { // If target is further than 1 step, take 1 step
        car.rotation = 270 * (Math.PI / 180);
        car.y -= speed;
      } else {
        car.y = target; // Otherwise move to the target exactly
      }
      vehicle.y = Math.round(yPixelToCoord(car.y) * 100) / 100;
    }
  } else {
    console.error('Car went out of bounds on Y coord');
  }
}

// todo simple solution. If time make it more fancy (random time turns etc)
function changeCarLocation(vehicle, xSpeed, ySpeed) {
  // goes to the x endpoint first
  if (vehicle.destination[0] !== vehicle.x) {
    moveX(vehicle, xCoordToPixel(vehicle.destination[0]), xSpeed);
  } else {
    moveY(vehicle, yCoordToPixel(vehicle.destination[1]), ySpeed);
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

function clientReady(car) {
  return window.time >= car.currentRide.earliestStart;
}

function takeNextRide(vehicles, driverID, rides, time) {
  const car = vehicles[driverID];
  if (car.rides.length === 0) {
    assignRideForCar(car, vehicles, rides, time, START_ON_TIME_BONUS);
  }
  const rideID = car.rides.shift();
  const ride = getRideWithId(rides, rideID);
  if (ride == null) { // there are no more rides that need serving
    car.currentRide = null;
    car.status = 'Finished';
    return;
  }

  car.currentRide = ride;
  ride.status = `${car.name} approaching`;
  car.destination = [ride.xStart, ride.yStart];
  car.client = ride.id;
}

// serving our client and if we finish with the client we assign a new client
function assignDestination(car, vehicles, rides, time) {
  const ride = car.currentRide;
  // we start to move to client's destination
  if (car.currentRide.xStart === car.x && car.currentRide.yStart === car.y) {
    ride.status = `In ${car.name}'s car`;
    car.destination = [ride.xEnd, ride.yEnd];

    if (ride.earliestStart === Math.ceil(window.time) - 1) {
      // Give 10 points if picked up on time
      car.score += START_ON_TIME_BONUS;
    }
    // Remove marker on pickup
    ride.startMarker.destroy();
  } else { // client is in it's destination
    ride.status = 'Finished';
    // Give distance points when finishing ride
    if (Math.round(time) <= ride.latestFinish) {
      car.score += distance(ride.xStart, ride.yStart, ride.xEnd, ride.yEnd);
    }
    // Remove marker on finish
    ride.endMarker.destroy();
    takeNextRide(vehicles, car.id, rides, time);
  }
}

export function move(vehicles, driverID, rides, xSpeed, ySpeed, time) {
  const vehicle = vehicles[driverID];
  if (vehicle.status === 'Finished') {
    return;
  }

  if (vehicle.destination === '' || vehicle.currentRide === null) { // first assignments
    takeNextRide(vehicles, driverID, rides, time);
  } else if (destinationReached(vehicle) && clientReady(vehicle)) {
    assignDestination(vehicle, vehicles, rides, time);
  }
  if (!destinationReached(vehicle)) {
    changeCarLocation(vehicle, xSpeed, ySpeed);
  }
}
