const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stops: [{
    name: String,
    location: { lat: Number, lng: Number },
  }],
});

module.exports = mongoose.model('Route', RouteSchema);