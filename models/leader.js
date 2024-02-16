const mongoose = require('mongoose');

const LeaderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    time: { type: Number, required: true }
  },
  { collection: 'leaders' }
);

module.exports = mongoose.model('Leader', LeaderSchema);
