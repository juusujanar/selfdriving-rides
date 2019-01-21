import munkres from 'munkres-js';
import { distance } from './util';

console.debug(munkres([
  [400, 150, 400],
  [400, 450, 600],
  [300, 225, 300]
]));


function queuedRidesDist(car) {
  let dist = 0;
  if (car.rides.length === 0) {
    return dist;
  }
  console.log('check me');
  const location = JSON.parse(JSON.stringify(car));// doing it do just shut up the ESLint
  car.rides.forEach((ride) => {
    dist += distance(location.x, location.y, ride.xStart, ride.yStart);
    dist += distance(ride.xStart, ride.yStart, ride.xEnd, ride.yEnd);
    location.x = ride.xEnd;
    location.y = ride.yEnd;
  });
  return dist;
}

function findLastPoint(car) {
  if (car.rides.length > 0) {
    const lastRide = car.rides[car.rides.length - 1];
    return [lastRide.xEnd, lastRide.yEnd];
  }
  if (car.currentRide !== undefined) {
    return [car.currentRide.xEnd, car.currentRide.yEnd];
  }
  return [car.x, car.y];
}

function distanceFromLastPointToDestination(driver, dest) {
  const lastPoint = findLastPoint(driver);
  return distance(lastPoint[0], lastPoint[1], dest.xStart, dest.yStart);
}

// the destination here shows starting location of a next ride
function getDestinationReachTime(driver, destination, time) {
  let dist = Math.round(time);
  const ride = driver.currentRide;

  if (ride.status === `${driver.name} approaching`) {
    dist += distance(driver.x, driver.y, ride.xStart, ride.yStart);
    dist += distance(ride.xStart, ride.yStart, ride.xEnd, ride.yEnd);
  } else if (ride.status === `In ${driver.name}'s car`) {
    dist += distance(driver.x, driver.y, ride.xEnd, ride.yEnd);
  }

  dist += queuedRidesDist(driver);
  dist += distanceFromLastPointToDestination(driver, destination);
  dist = Math.round(dist);
  return dist;
}


function getMaxPointsForRide(ride, driver, time) {
  // reversed points system for Hungarian algorithm. Smaller score is better
  let score = 3;
  const destReachTime = getDestinationReachTime(driver, ride, time);
  const destEndpointReachTime = destReachTime
      + distance(ride.xStart, ride.yStart, ride.xEnd, ride.yEnd);

  if (destReachTime <= ride.earliestStart) {
    score -= 1;
  }
  if (destEndpointReachTime <= ride.latestFinish) {
    score -= 2;
  }
  return score;
}

function getPointsGivingRides(drivers, nextRides, time) {
  const result = [];
  nextRides.forEach((nextRide) => {
    const rideResult = [];
    for (let i = 0; i < drivers.length; i++) {
      const driver = drivers[i];
      const points = getMaxPointsForRide(nextRide, driver, time);
      rideResult.push([driver, points]);
    }
    result.push([nextRide, rideResult]);
  });

  return result;
}


function nextRidesWithEqualStartTimeRides(nextRides, newRides) {
  const firstStartTime = nextRides[0].earliestStart;
  let indexToCheck = nextRides.length;
  let nextRide = newRides[indexToCheck];

  while (nextRide !== undefined && nextRide.earliestStart === firstStartTime) {
    nextRides.push(nextRide);
    indexToCheck++;
    nextRide = newRides[indexToCheck];
  }
  return nextRides;
}

function getUnservedRides(rides) {
  const res = [];
  rides.forEach((ride) => {
    if (ride.status === 'Waiting') {
      res.push(ride);
    }
  });
  return res;
}

function getNextRidesToCheck(vehciles, rides) {
  const newRides = getUnservedRides(rides);
  const driversCount = vehciles.length;
  const nextRides = newRides.slice(0, driversCount);
  return nextRidesWithEqualStartTimeRides(nextRides, newRides);
}

export function assignRideForCar(car, vehicles, rides, time) {
  const assignments = {};
  const newRides = getUnservedRides(rides);
  // it is the first assignment so every car gets just one endpoint
  if (newRides.length === rides.length) {
    let rideIndex = 0;
    vehicles.forEach((vehicle) => {
      assignments[vehicle.id] = [rideIndex];
      rideIndex += 1;
    });
  } else if (newRides.length !== 0) {
    assignments[car.id] = [newRides[0].id];//  todo make it more advanced
    const nextRides = getNextRidesToCheck(vehicles, rides);
    const nextRidesScores = getPointsGivingRides(vehicles, nextRides, time);
    console.log(nextRidesScores);
  }
  return assignments;
}
