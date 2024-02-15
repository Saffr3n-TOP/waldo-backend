const mongoose = require('mongoose');

const PolygonSchema =
  new /** @type {typeof mongoose.Schema<{name: string, vertices: Polygon}>} */ (
    mongoose.Schema
  )(
    {
      name: { type: String, required: true },
      vertices: [[Number]]
    },
    { collection: 'polygons' }
  );

module.exports = mongoose.model('Polygon', PolygonSchema);
