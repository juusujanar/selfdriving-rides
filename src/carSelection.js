function assignDriverForNextRide(drivers, nextRides) { // todo
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
    const nextRides = rides.slice(ridesAssigned, Math.min(ridesCount, ridesAssigned + driversCount));
    const driver = assignDriverForNextRide(drivers, nextRides);
    selection[driver].push(ridesAssigned);
    ridesAssigned++;
  }

  return selection;
}
