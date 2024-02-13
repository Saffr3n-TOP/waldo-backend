const mongoose = require('mongoose');

const PolygonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    vertices: [[{ type: Number }]]
  },
  { collection: 'polygons' }
);

module.exports = mongoose.model('Polygon', PolygonSchema);
