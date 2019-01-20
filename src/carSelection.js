

/* prolly not useful anymore



export function getCarSelection(rides, drivers) {
  const selection = {};
  let ridesAssigned = 0;
  const driversCount = drivers.length;
  const ridesCount = rides.length;

  // assign one first ride for each car
  for (let i = 0; i < drivers.length; i++) {
    selection[i] = [ridesAssigned];
    ridesAssigned++;
  }

  while (ridesAssigned < ridesCount) {
    let lastRideToTakeIndex = Math.min(ridesCount, ridesAssigned + driversCount);
    const nextRides = rides.slice(ridesAssigned, lastRideToTakeIndex);
    // maybe we have more rides with the same startTime as we have with current last startTime
    const lastRideEarliestStart = nextRides[nextRides.length - 1].earliestStart;
    let nextRide = rides[lastRideToTakeIndex];
    while (lastRideToTakeIndex + 1 <= ridesCount
    && nextRide.earliestStart === lastRideEarliestStart) {
      nextRides.push(nextRide);
      lastRideToTakeIndex++;
      nextRide = rides[lastRideToTakeIndex];
    }

    const driver = assignDriverForNextRide(drivers, nextRides);
    selection[driver].push(ridesAssigned);
    ridesAssigned++;
  }

  return selection;
}*/

function canGetThereBeforeStart(ride, driver) {
  console.log(driver);
}

function getMaxPointsForRide(ride, driver) {
  let score = 0;
  if (canGetThereBeforeStart(ride, driver)) {
    score += 1;
  }
  if (canFinishRideInTime(ride, driver)) {
    score += 2;
  }
  return score;
}

function getPointsGivingRides(drivers, nextRides) {
  const result = {};
  drivers.forEach((driver) => {
    result[driver] = [];
    for (let i = 0; i < nextRides.length; i++) {
      const nextRide = nextRides[0];
      const points = getMaxPointsForRide(nextRide, driver);
      result[driver].push([nextRide, points]);
    }
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

export function assignRideForCar(car, vehicles, rides) {
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
  }
  return assignments;
}
