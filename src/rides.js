import { getRandomInt } from './util';

let currentId = -1;

const defaultRides = [
  { id: 0, xStart: 2, yStart: 0, xEnd: 4, yEnd: 0, earliestStart: 3, latestFinish: 5, status: 'Waiting', served: false },
  { id: 1, xStart: 2, yStart: 5, xEnd: 3, yEnd: 7, earliestStart: 7, latestFinish: 15, status: 'Waiting', served: false },
  { id: 2, xStart: 0, yStart: 8, xEnd: 5, yEnd: 4, earliestStart: 8, latestFinish: 17, status: 'Waiting', served: false },
  { id: 3, xStart: 9, yStart: 2, xEnd: 0, yEnd: 0, earliestStart: 9, latestFinish: 21, status: 'Waiting', served: false },
  { id: 4, xStart: 5, yStart: 1, xEnd: 2, yEnd: 4, earliestStart: 11, latestFinish: 17, status: 'Waiting', served: false },
  { id: 5, xStart: 1, yStart: 0, xEnd: 1, yEnd: 1, earliestStart: 13, latestFinish: 15, status: 'Waiting', served: false },
  { id: 6, xStart: 4, yStart: 2, xEnd: 2, yEnd: 5, earliestStart: 15, latestFinish: 22, status: 'Waiting', served: false },
  { id: 7, xStart: 7, yStart: 8, xEnd: 4, yEnd: 1, earliestStart: 18, latestFinish: 29, status: 'Waiting', served: false },
  { id: 8, xStart: 7, yStart: 7, xEnd: 9, yEnd: 9, earliestStart: 25, latestFinish: 29, status: 'Waiting', served: false },
  { id: 9, xStart: 4, yStart: 6, xEnd: 0, yEnd: 8, earliestStart: 26, latestFinish: 33, status: 'Waiting', served: false },
];

function setVehiclesMoving(vehicles) {
  vehicles.forEach((veh) => {
    veh.status = 'Moving';
  });
}

export function generateRideRequest(rows, columns, currentTime, vehicles) {
  // Generate coordinates for the ride
  const xStart = getRandomInt(0, columns);
  const yStart = getRandomInt(0, rows);
  const xEnd = getRandomInt(0, columns);
  const yEnd = getRandomInt(0, rows);

  // Generate times for the rides
  const earliestStart = Math.ceil(currentTime) + getRandomInt(8, 20);
  const latestFinish = earliestStart + getRandomInt(15, 25);

  currentId++;
  setVehiclesMoving(vehicles);

  return {
    id: currentId,
    xStart,
    yStart,
    xEnd,
    yEnd,
    earliestStart,
    latestFinish,
    status: 'Waiting',
    served: false,
  };
}

export function getDefaultRides(n) {
  currentId = n - 1;
  return defaultRides.slice(0, n);
}
