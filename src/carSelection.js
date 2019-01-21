import munkres from 'munkres-js';
import { distance } from './util';


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

function getRidesMatrix(scores) {
  const matrix = [];
  for (let i = 0; i < scores.length; i++) {
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

function getUnservedRides(rides) {
  return rides.filter(ride => ride.served === false);
}

function getNextRidesToCheck(vehciles, rides) {
  const newRides = getUnservedRides(rides);
  const driversCount = vehciles.length;
  const nextRides = newRides.slice(0, driversCount);
  return nextRidesWithEqualStartTimeRides(nextRides, newRides);
}

function findCarUsingHungarian(vehicles, rides, time) {
  const nextRides = getNextRidesToCheck(vehicles, rides);
  const nextRidesScores = getPointsGivingRides(vehicles, nextRides, time);
  const ridesMatrix = getRidesMatrix(nextRidesScores);
  const resultMatrix = munkres(ridesMatrix);
  console.log(resultMatrix);
  return resultMatrix[0][1];
}

function findClosestCar(destination, vehicles, time) {
  console.log(destination);
  let bestTime = 100000000;
  let best;
  vehicles.forEach((car) => {
    const reachingTime = getDestinationReachTime(car, destination, time);
    if (reachingTime < bestTime) {
      bestTime = reachingTime;
      best = car;
    }
  });
  console.log(best);
  console.log(bestTime);
  return best;
}

export function assignRideForCar(car, vehicles, rides, time) {
  const newRides = getUnservedRides(rides);

  // it is the first assignment so every car gets just one endpoint
  if (newRides.length === rides.length) {
    let rideIndex = 0;
    vehicles.forEach((vehicle) => {
      vehicle.rides.push(rideIndex);
      rides[rideIndex].served = true;
      rideIndex += 1;
    });
  } else {
    while (car.rides.length === 0) {
      // all rides are served
      if (newRides.length === 0) {
        return;
      }
      const ride = newRides[0];
      if (newRides.length === 1) {
        const closestCar = findClosestCar(ride, vehicles, time);
        console.log(closestCar);
        closestCar.rides.push(ride.id);
        ride.served = true;
        return;
      }
      car.rides.push(ride.id);//  todo make it more advanced
      ride.served = true;
    }
  }
}

export function assignRideForCar2(car, vehicles, rides, time) {
  console.log("assigning drive for following car:");
  console.log(car);
  const assignments = {};
  const newRides = getUnservedRides(rides);

  // it is the first assignment so every car gets just one endpoint
  if (newRides.length === rides.length) {
    let rideIndex = 0;
    vehicles.forEach((vehicle) => {
      assignments[vehicle.id] = [rideIndex];
      rideIndex += 1;
    });
  } else if (newRides.length === 1) {
    const closestCar = findClosestCar(newRides[0], vehicles);
    assignments[closestCar.id] = newRides[0].id;
  } else if (newRides.length > 1) {
    console.log(assignments);
    const hungarianCar = findCarUsingHungarian(vehicles, rides, time);
    console.log("hungarianCar: ");
    console.log(hungarianCar);
    assignments[hungarianCar.toString()] = newRides[0].id;
    console.log(assignments);
    assignments[car.id.toString()] = [newRides[1].id];//  todo make it more advanced
  }
  console.log("Car result after assignment: ");
  console.log(assignments);
  console.log(assignments[car]);
  //assignments[car.id] = [newRides[0].id];//  todo make it more advanced
  return assignments;
}
