import { getRandomInt } from './util';

let currentId = -1;

export function generateRideRequest(rows, columns, currentTime) {
  // Generate coordinates for the ride
  const x = getRandomInt(0, columns);
  const y = getRandomInt(0, rows);

  // Generate times for the rides
  const earliestStart = currentTime + 0;
  const latestFinish = currentTime + 0;

  currentId++;

  return {
    id: currentId,
    x,
    y,
    earliestStart,
    latestFinish,
    status: 'Waiting',
  };
}

export function assignRide() {
  return undefined;
}
