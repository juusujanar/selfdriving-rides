import { getRandomInt } from './util';

export function generateRideRequest(rows, columns, pendingRides, currentTime) {
  // Generate coordinates for the ride
  const x = getRandomInt(0, columns);
  const y = getRandomInt(0, rows);

  // Generate times for the rides
  const earliestStart = currentTime + 0;
  const latestFinish = currentTime + 0;

  pendingRides.push({
    x,
    y,
    earliestStart,
    latestFinish,
  });
}

export function assignRide() {
  return undefined;
}
