const { dbURI } = require('../../config.js');
const mongoose = require('mongoose');

// Connect
mongoose.connect(dbURI)
    .then(() => console.log('Mongoose connected to ' + dbURI))
    .catch((err) => {
        console.error('Mongoose connection error: ' + err);
        process.exit(1);
    });

// CONNECTION EVENTS
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
const gracefulShutdown = async (msg) => {
    try {
        await mongoose.connection.close();
        console.log('Mongoose disconnected through ' + msg);
    } catch (err) {
        console.error('Error during mongoose disconnect:', err);
    }
};

// For nodemon restarts
process.once('SIGUSR2', async () => {
    await gracefulShutdown('nodemon restart');
    process.kill(process.pid, 'SIGUSR2');
});

// For app termination (CTRL+C)
process.on('SIGINT', async () => {
    await gracefulShutdown('app termination');
    process.exit(0);
});

// For Heroku app termination
process.on('SIGTERM', async () => {
    await gracefulShutdown('Heroku app termination');
    process.exit(0);
});

// BRING IN YOUR SCHEMAS & MODELS
require('./locations.js');
