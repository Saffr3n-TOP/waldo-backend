/**
 * @param {Point} point
 * @param {Polygon} vertices
 */
module.exports = function isPointInPolygon(point, vertices) {
  const [x, y] = point;

  let isInside = false;

  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const [iX, iY] = vertices[i];
    const [jX, jY] = vertices[j];

    if (iY > y !== jY > y && x < ((jX - iX) * (y - iY)) / (jY - iY) + iX) {
      isInside = !isInside;
    }
  }

  return isInside;
};
