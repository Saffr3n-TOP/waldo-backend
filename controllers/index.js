const createError = require('http-errors');
const isPointInPolygon = require('../utils/isPointInPolygon');
const Polygon = require('../models/polygon');

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.initialize = async (req, res, next) => {
  const polygonsArray = await Polygon.find(
    {},
    { name: 1, isFound: { $toBool: 0 } }
  )
    .exec()
    .catch((err) => createError(500, err));

  if (polygonsArray instanceof Error) {
    return next(polygonsArray);
  }

  const polygonsObject = polygonsArray.reduce(
    (obj, polygon) => ({ ...obj, [polygon.id]: polygon }),
    {}
  );

  req.session.start = Date.now();
  req.session.polygons = polygonsObject;

  res.status(200).json({
    data: {
      message: 'Game successfully started',
      start: req.session.start,
      polygons: req.session.polygons
    }
  });
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.checkPolygon = async (req, res, next) => {
  if (!req.session.polygons) {
    return next(createError(401, 'Start the game first'));
  }

  if (req.session.polygons[req.params.id].isFound) {
    return res.status(200).json({
      data: {
        message: 'It was already found. Keep going!',
        start: req.session.start,
        polygons: req.session.polygons
      }
    });
  }

  const polygon = await Polygon.findById(req.params.id)
    .exec()
    .catch((err) => createError(500, err));

  if (polygon instanceof Error) {
    return next(polygon);
  }

  if (!polygon) {
    return next(createError(404, 'Polygon Not Found'));
  }

  if (!req.query.point) {
    return next(
      createError(400, 'Invalid point format (?point=<integerX>+<integerY>)')
    );
  }

  const [x, y] = /** @type {string} */ (req.query.point)
    .split(' ')
    .map((v) => +v);

  if (isNaN(x) || isNaN(y)) {
    return next(
      createError(400, 'Invalid point format (?point=<integerX>+<integerY>)')
    );
  }

  if (!isPointInPolygon([x, y], polygon.vertices)) {
    return res.status(200).json({
      data: {
        message: 'Nope... Keep trying!',
        start: req.session.start,
        polygons: req.session.polygons
      }
    });
  }

  req.session.polygons[req.params.id].isFound = true;

  if (
    Object.values(req.session.polygons).every(
      (polygon) => polygon.isFound === true
    )
  ) {
    req.session.polygons = null;
    req.session.end = Date.now();

    res.status(200).json({
      data: {
        message: 'You win!',
        start: req.session.start,
        end: req.session.end
      }
    });

    req.session = null;
    return;
  }

  res.status(200).json({
    data: {
      message: 'Correct! Keep it up!',
      start: req.session.start,
      polygons: req.session.polygons
    }
  });
};
