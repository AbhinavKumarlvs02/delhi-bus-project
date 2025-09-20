const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// require('dotenv').config({ path: '../.env' });
require('dotenv').config();

// Import models
const User = require('./models/userModel');
const Bus = require('./models/busModel');
const Route = require('./models/routeModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/delhi-bus-project');

const sampleRoutes = [
    {
        name: 'Route A - Central Delhi',
        stops: [
            { name: 'Connaught Place', location: { lat: 28.6315, lng: 77.2167 } },
            { name: 'India Gate', location: { lat: 28.6129, lng: 77.2295 } },
            { name: 'Red Fort', location: { lat: 28.6562, lng: 77.2410 } },
            { name: 'Jama Masjid', location: { lat: 28.6507, lng: 77.2338 } },
            { name: 'Chandni Chowk', location: { lat: 28.6582, lng: 77.2306 } }
        ]
    },
    {
        name: 'Route B - South Delhi',
        stops: [
            { name: 'Lotus Temple', location: { lat: 28.5535, lng: 77.2588 } },
            { name: 'Akshardham Temple', location: { lat: 28.6129, lng: 77.2784 } },
            { name: 'Qutub Minar', location: { lat: 28.5245, lng: 77.1855 } },
            { name: 'Humayun Tomb', location: { lat: 28.5933, lng: 77.2506 } }
        ]
    }
];

const sampleBuses = [
    {
        busNumber: 'DL-01A-1234',
        capacity: 40,
        currentLocation: { lat: 28.6315, lng: 77.2167 }
    },
    {
        busNumber: 'DL-01A-1235',
        capacity: 35,
        currentLocation: { lat: 28.6129, lng: 77.2295 }
    },
    {
        busNumber: 'DL-01A-1236',
        capacity: 45,
        currentLocation: { lat: 28.5535, lng: 77.2588 }
    }
];

const sampleUsers = [
    {
        name: 'Admin User',
        email: 'admin@delhibus.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        name: 'Driver John',
        email: 'driver@delhibus.com',
        password: 'driver123',
        role: 'driver'
    },
    {
        name: 'Passenger Jane',
        email: 'passenger@delhibus.com',
        password: 'passenger123',
        role: 'passenger'
    }
];

async function seedData() {
    try {
        console.log('Starting data seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Bus.deleteMany({});
        await Route.deleteMany({});

        console.log('Cleared existing data');

        // Create routes first
        const createdRoutes = await Route.insertMany(sampleRoutes);
        console.log(`Created ${createdRoutes.length} routes`);

        // Create users
        const createdUsers = [];
        for (const userData of sampleUsers) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            
            const user = new User({
                ...userData,
                password: hashedPassword
            });
            
            await user.save();
            createdUsers.push(user);
        }
        console.log(`Created ${createdUsers.length} users`);

        // Create buses and assign routes
        const createdBuses = [];
        for (let i = 0; i < sampleBuses.length; i++) {
            const busData = {
                ...sampleBuses[i],
                route: createdRoutes[i % createdRoutes.length]._id
            };
            
            const bus = new Bus(busData);
            await bus.save();
            createdBuses.push(bus);
        }
        console.log(`Created ${createdBuses.length} buses`);

        console.log('\n=== Sample Login Credentials ===');
        console.log('Admin: admin@delhibus.com / admin123');
        console.log('Driver: driver@delhibus.com / driver123');
        console.log('Passenger: passenger@delhibus.com / passenger123');
        console.log('\nData seeding completed successfully!');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedData();
