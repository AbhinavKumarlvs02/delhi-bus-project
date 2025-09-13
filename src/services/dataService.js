import { busAPI, routeAPI } from './api';

// Data service to handle all data fetching and caching
export class DataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Cache management
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  // Bus operations
  async getBuses(forceRefresh = false) {
    const cacheKey = 'buses';
    
    if (!forceRefresh) {
      const cached = this.getCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await busAPI.getBuses();
      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw error;
    }
  }

  async addBus(busData) {
    try {
      const response = await busAPI.addBus(busData);
      // Invalidate cache
      this.cache.delete('buses');
      return response.data;
    } catch (error) {
      console.error('Error adding bus:', error);
      throw error;
    }
  }

  async updateBus(id, busData) {
    try {
      const response = await busAPI.updateBus(id, busData);
      // Invalidate cache
      this.cache.delete('buses');
      return response.data;
    } catch (error) {
      console.error('Error updating bus:', error);
      throw error;
    }
  }

  async deleteBus(id) {
    try {
      await busAPI.deleteBus(id);
      // Invalidate cache
      this.cache.delete('buses');
      return true;
    } catch (error) {
      console.error('Error deleting bus:', error);
      throw error;
    }
  }

  // Route operations
  async getRoutes(forceRefresh = false) {
    const cacheKey = 'routes';
    
    if (!forceRefresh) {
      const cached = this.getCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await routeAPI.getRoutes();
      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  }

  async addRoute(routeData) {
    try {
      const response = await routeAPI.addRoute(routeData);
      // Invalidate cache
      this.cache.delete('routes');
      return response.data;
    } catch (error) {
      console.error('Error adding route:', error);
      throw error;
    }
  }

  async updateRoute(id, routeData) {
    try {
      const response = await routeAPI.updateRoute(id, routeData);
      // Invalidate cache
      this.cache.delete('routes');
      return response.data;
    } catch (error) {
      console.error('Error updating route:', error);
      throw error;
    }
  }

  async deleteRoute(id) {
    try {
      await routeAPI.deleteRoute(id);
      // Invalidate cache
      this.cache.delete('routes');
      return true;
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  }

  // Utility methods
  clearCache() {
    this.cache.clear();
  }

  // Transform data for UI
  transformBusData(buses) {
    return buses.map(bus => ({
      id: bus._id,
      name: `Bus ${bus.busNumber}`,
      busNumber: bus.busNumber,
      capacity: bus.capacity,
      status: bus.currentLocation ? 'Active' : 'Inactive',
      routeName: bus.route?.name || 'No Route',
      location: bus.currentLocation ? [bus.currentLocation.lat, bus.currentLocation.lng] : [30.8974, 75.8569],
      route: bus.route
    }));
  }

  transformRouteData(routes) {
    return routes.map(route => ({
      id: route._id,
      name: route.name,
      stops: route.stops.map(stop => ({
        id: `${route._id}-${stop.name}`,
        name: stop.name,
        location: [stop.location.lat, stop.location.lng]
      }))
    }));
  }

  // Calculate dashboard stats
  calculateDashboardStats(buses, routes) {
    const activeBuses = buses.filter(bus => bus.currentLocation).length;
    const totalCapacity = buses.reduce((sum, bus) => sum + bus.capacity, 0);
    
    return {
      totalBuses: buses.length,
      activeBuses,
      totalRoutes: routes.length,
      totalCapacity
    };
  }
}

// Export singleton instance
export const dataService = new DataService();
