const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  currentLocation: { lat: Number, lng: Number },
  lastLoc : {
    type: { type: String , enum : ['Point'], defaul: "Point" },
    coordinates: { type: [Number] , default: [0,0] }
  },
  lastSpeed: { type: Number , default: 0 },
  lastSeenAt: {type: Date },
  status: { type: String , default: "active" },
  driverPhone: {type: String},
  seq: {type: Number , default: 0}
});

BusSchema.index({lastLoc:'2dsphere'});
BusSchema.index({lastSeenAt: -1});

module.exports = mongoose.model('Bus', BusSchema);