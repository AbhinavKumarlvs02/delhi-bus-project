const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  currentLocation: { lat: Number, lng: Number },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
});

module.exports = mongoose.model('Bus', BusSchema);