
function assignDriverForNextRide(drivers, nextRides) { // todo
  console.log(nextRides);
  return 0;
}

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
}
