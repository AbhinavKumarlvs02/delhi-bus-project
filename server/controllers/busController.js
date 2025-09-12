const Bus = require('../models/busModel');

exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate('route');
    res.json(buses);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.addBus = async (req, res) => {
  const { busNumber, capacity } = req.body;
  try {
    const newBus = new Bus({ busNumber, capacity });
    const bus = await newBus.save();
    res.json(bus);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.updateBus = async (req, res) => {
  const { busNumber, capacity, route } = req.body;
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    bus.busNumber = busNumber || bus.busNumber;
    bus.capacity = capacity || bus.capacity;
    bus.route = route || bus.route;
    const updatedBus = await bus.save();
    res.json(updatedBus);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndRemove(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json({ message: 'Bus removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};