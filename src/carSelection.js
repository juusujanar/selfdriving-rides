import munkres from 'munkres-js';
import { distance, getUnservedRides, getRideWithId } from './util';


function queuedRidesDist(car, rides) {
  let dist = 0;
  if (car.rides.length === 0) {
    return dist;
  }
  const location = Object.assign({}, car);
  car.rides.forEach((rideId) => {
    const ride = getRideWithId(rides, rideId);
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
function getDestinationReachTime(driver, rides, destination, time) {
  let dist = Math.round(time);
  const ride = driver.currentRide;
  // happpens if car already finished
  if (ride === undefined || ride == null) {
    dist += distance(driver.x, driver.y, destination.xStart, destination.yStart);
  } else {
    if (ride.status === `${driver.name} approaching`) {
      dist += distance(driver.x, driver.y, ride.xStart, ride.yStart);
      dist += distance(ride.xStart, ride.yStart, ride.xEnd, ride.yEnd);
    } else if (ride.status === `In ${driver.name}'s car`) {
      dist += distance(driver.x, driver.y, ride.xEnd, ride.yEnd);
    }
    dist += queuedRidesDist(driver, rides);
    dist += distanceFromLastPointToDestination(driver, destination);
    dist = Math.round(dist);
  }
  return dist;
}


function getMaxPointsForRide(ride, rides, driver, time, onStartBonus) {
  // reversed points system for Hungarian algorithm. Smaller score is better
  let score = 100;
  const destReachTime = getDestinationReachTime(driver, rides, ride, time);
  const rideDistance = distance(ride.xStart, ride.yStart, ride.xEnd, ride.yEnd);
  const destEndpointReachTime = destReachTime + rideDistance;

  if (destReachTime <= ride.earliestStart) {
    score -= onStartBonus;
  }
  if (destEndpointReachTime <= ride.latestFinish) {
    score -= rideDistance;
  }
  return score;
}

function getPointsGivingRides(drivers, rides, nextRides, time, onStartBonus) {
  const result = [];
  nextRides.forEach((nextRide) => {
    const rideResult = [];
    for (let i = 0; i < drivers.length; i++) {
      const driver = drivers[i];
      const points = getMaxPointsForRide(nextRide, rides, driver, time, onStartBonus);
      rideResult.push([driver, points]);
    }
    result.push([nextRide, rideResult]);
  });
  return result;
}

function getRidesMatrix(scores) {
  const matrix = [];
  for (let i = scores.length - 1; i >= 0; i--) {
    const row = [];
    for (let j = 0; j < scores.length; j++) {
      row.push(scores[i][1][j][1]);
    }
    matrix.push(row);
  }
  return matrix;
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


function getNextRidesToCheck(vehciles, rides) {
  const newRides = getUnservedRides(rides);
  const driversCount = vehciles.length;
  const nextRides = newRides.slice(0, driversCount);
  return nextRidesWithEqualStartTimeRides(nextRides, newRides);
}

function findCarUsingHungarian(vehicles, rides, time, onStartBonus) {
  const nextRides = getNextRidesToCheck(vehicles, rides);
  const nextRidesScores = getPointsGivingRides(vehicles, rides, nextRides, time, onStartBonus);
  const ridesMatrix = getRidesMatrix(nextRidesScores);
  const resultMatrix = munkres(ridesMatrix);
  return vehicles[resultMatrix[resultMatrix.length - 1][1]];
}

function findClosestCar(destination, rides, vehicles, time) {
  let bestTime = 100000000;
  let best;
  vehicles.forEach((car) => {
    const reachingTime = getDestinationReachTime(car, rides, destination, time);
    if (reachingTime < bestTime) {
      bestTime = reachingTime;
      best = car;
    }
  });
  return best;
}

export function assignRideForCar(car, vehicles, rides, time, onStartBonus) {
  let newRides = getUnservedRides(rides);
  // it is the first assignment so every car gets just one endpoint
  if (newRides.length === rides.length) {
    const ridesCount = rides.length;
    let rideIndex = 0;
    vehicles.forEach((vehicle) => {
      if (rideIndex >= ridesCount) {
        return;
      }
      vehicle.rides.push(rideIndex);
      rides[rideIndex].served = true;
      rideIndex += 1;
    });
  } else {
    while (car.rides.length === 0) {
      newRides = getUnservedRides(rides);
      // all rides are served
      if (newRides.length === 0) {
        return;
      }
      const ride = newRides[0];
      if (newRides.length === 1) {
        const closestCar = findClosestCar(ride, rides, vehicles, time);
        closestCar.rides.push(ride.id);
        ride.served = true;
        return;
      }
      const hungarianCar = findCarUsingHungarian(vehicles, rides, time, onStartBonus);
      hungarianCar.rides.push(ride.id);
      hungarianCar.status = 'Moving';
      ride.served = true;
    }
  }
}
