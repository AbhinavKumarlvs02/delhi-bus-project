const Route = require('../models/routeModel');

exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.addRoute = async (req, res) => {
  const { name, stops } = req.body;
  try {
    const newRoute = new Route({ name, stops });
    const route = await newRoute.save();
    res.json(route);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.updateRoute = async (req, res) => {
  const { name, stops } = req.body;
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    route.name = name || route.name;
    route.stops = stops || route.stops;
    const updatedRoute = await route.save();
    res.json(updatedRoute);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndRemove(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json({ message: 'Route removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};