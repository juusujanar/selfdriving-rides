import { getRandomInt } from './util';

let currentId = -1;

const defaultRides = [
  { id: 0, x: 2, y: 0, earliestStart: 3, latestFinish: 5, status: 'Waiting' },
  { id: 2, x: 0, y: 2, earliestStart: 6, latestFinish: 10, status: 'Waiting' },
  { id: 2, x: 2, y: 5, earliestStart: 7, latestFinish: 15, status: 'Waiting' },
  { id: 3, x: 2, y: 2, earliestStart: 9, latestFinish: 15, status: 'Waiting' },
  { id: 4, x: 5, y: 1, earliestStart: 11, latestFinish: 16, status: 'Waiting' },
  { id: 5, x: 1, y: 0, earliestStart: 13, latestFinish: 18, status: 'Waiting' },
  { id: 6, x: 4, y: 2, earliestStart: 17, latestFinish: 28, status: 'Waiting' },
];


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

export function getDefaultRides(n) {
  return defaultRides.slice(0, n);
}

export function assignRide(id) {
  // TODO: Remove marker from image
  return undefined;
}
