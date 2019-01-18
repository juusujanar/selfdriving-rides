/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * We start coordinates at (0,0) and end at (9,9)
 * Coordinate 0,0 so upper-left intersection is at (50,40)
 * Next x intersection is +100, so (150,40)
 * Next y intersection is +75, so (50,115) or (150,115)
 */

const xStart = 40;
const xStep = 102.2;
const yStart = 52;
const yStep = 76.8;

export function xCoordToPixel(coord) {
  if (coord < 0 || coord > 9) {
    throw new Error(`X coordinate out of bounds: ${coord}`);
  }
  return xStart + coord * xStep;
}

export function xPixelToCoord(pixel) {
  if (pixel < 0 || pixel > 1024) {
    throw new Error(`X pixel out of bounds: ${pixel}`);
  }
  return (pixel - xStart) / xStep;
}

export function yCoordToPixel(coord) {
  if (coord < 0 || coord > 9) {
    throw new Error(`Y coordinate out of bounds: ${coord}`);
  }
  return yStart + coord * yStep;
}

export function yPixelToCoord(pixel) {
  if (pixel < 0 || pixel > 1024) {
    throw new Error(`Y pixel out of bounds: ${pixel}`);
  }
  return (pixel - yStart) / yStep;
}

export function rounded(time) {
  const num = Number(time);
  const roundedString = num.toFixed(2);
  return Number(roundedString); // toFixed() returns a string (often suitable for printing already)
}
