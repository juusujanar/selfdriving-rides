import { getRandomInt } from './util';

let currentId = -1;

const defaultRides2 = [
  { id: 0, name: 'Tom', x: 0, y: 0, status: 'Waiting', destination: '' },
  { id: 1, name: 'Mark', x: 0, y: 1, status: 'Waiting', destination: '' },
  { id: 2, name: 'Kim', x: 1, y: 0, status: 'Waiting', destination: '' },
  { id: 3, name: 'Megan', x: 2, y: 0, status: 'Waiting', destination: '' },
// { id: 4, name: 'Megan', x: 3, y: 0, status: 'Waiting', destination: '' },
// { id: 5, name: 'Megan', x: 4, y: 0, status: 'Waiting', destination: '' },
// { id: 6, name: 'Megan', x: 5, y: 0, status: 'Waiting', destination: '' },
// { id: 7, name: 'Megan', x: 6, y: 0, status: 'Waiting', destination: '' },
// { id: 8, name: 'Megan', x: 7, y: 0, status: 'Waiting', destination: '' },
// { id: 9, name: 'Megan', x: 8, y: 0, status: 'Waiting', destination: '' },
// { id: 10, name: 'Megan', x: 9, y: 0, status: 'Waiting', destination: '' },
// { id: 11, name: 'Megan', x: 0, y: 2, status: 'Waiting', destination: '' },
// { id: 12, name: 'Megan', x: 0, y: 3, status: 'Waiting', destination: '' },
// { id: 13, name: 'Megan', x: 0, y: 4, status: 'Waiting', destination: '' },
// { id: 14, name: 'Megan', x: 0, y: 5, status: 'Waiting', destination: '' },
// { id: 15, name: 'Megan', x: 0, y: 6, status: 'Waiting', destination: '' },
// { id: 16, name: 'Megan', x: 0, y: 7, status: 'Waiting', destination: '' },
// { id: 17, name: 'Megan', x: 0, y: 8, status: 'Waiting', destination: '' },
// { id: 18, name: 'Megan', x: 0, y: 9, status: 'Waiting', destination: '' },
];

const defaultRides = [
  { id: 0, x: 2, y: 0, earliestStart: 3, latestFinish: 5, status: 'Waiting'},
  { id: 2, x: 0, y: 2, earliestStart: 6, latestFinish: 10, status: 'Waiting'},
  { id: 2, x: 2, y: 5, earliestStart: 7, latestFinish: 15, status: 'Waiting'},
  { id: 3, x: 2, y: 2, earliestStart: 9, latestFinish: 15, status: 'Waiting'},
  { id: 4, x: 5, y: 1, earliestStart: 11, latestFinish: 16, status: 'Waiting'},
  { id: 5, x: 1, y: 0, earliestStart: 13, latestFinish: 18, status: 'Waiting'},
  { id: 6, x: 4, y: 2, earliestStart: 17, latestFinish: 28, status: 'Waiting'}
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

export function assignRide() {
  return undefined;
}
