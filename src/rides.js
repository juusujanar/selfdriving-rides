import { getRandomInt } from './util';

let currentId = -1;

const defaultRides = [
  { id: 0, xStart: 2, yStart: 0, xEnd: 4, yEnd: 0, earliestStart: 3, latestFinish: 5, status: 'Waiting' },
  { id: 1, xStart: 0, yStart: 2, xEnd: 0, yEnd: 4, earliestStart: 6, latestFinish: 10, status: 'Waiting' },
  { id: 2, xStart: 2, yStart: 5, xEnd: 3, yEnd: 7, earliestStart: 7, latestFinish: 15, status: 'Waiting' },
  { id: 3, xStart: 2, yStart: 2, xEnd: 0, yEnd: 0, earliestStart: 9, latestFinish: 15, status: 'Waiting' },
  { id: 4, xStart: 5, yStart: 1, xEnd: 2, yEnd: 4, earliestStart: 11, latestFinish: 16, status: 'Waiting' },
  { id: 5, xStart: 1, yStart: 0, xEnd: 1, yEnd: 1, earliestStart: 13, latestFinish: 18, status: 'Waiting' },
  { id: 6, xStart: 4, yStart: 2, xEnd: 2, yEnd: 5, earliestStart: 13, latestFinish: 28, status: 'Waiting' },
  { id: 7, xStart: 4, yStart: 2, xEnd: 2, yEnd: 5, earliestStart: 16, latestFinish: 28, status: 'Waiting' },
];


export function generateRideRequest(rows, columns, currentTime) {
  // Generate coordinates for the ride
  const xStart = getRandomInt(0, columns);
  const yStart = getRandomInt(0, rows);
  const xEnd = getRandomInt(0, columns);
  const yEnd = getRandomInt(0, rows);

  // Generate times for the rides
  const earliestStart = Math.ceil(currentTime) + getRandomInt(0, 10);
  const latestFinish = earliestStart + getRandomInt(3, 10);

  currentId++;

  return {
    id: currentId,
    xStart,
    yStart,
    xEnd,
    yEnd,
    earliestStart,
    latestFinish,
    status: 'Waiting',
  };
}

export function getDefaultRides(n) {
  currentId = n - 1;
  return defaultRides.slice(0, n);
}
