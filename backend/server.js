const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

// Database Connection
const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'db',
    database: process.env.DB_NAME || 'speed_db',
    password: process.env.DB_PASSWORD || 'password',
    port: 5432,
};

const pgClient = new Client(dbConfig);

pgClient.connect()
    .then(() => {
        console.log('Connected to PostgreSQL');
        
        // Listen to the channel defined in init.sql
        pgClient.query('LISTEN new_speed_channel');
        
        pgClient.on('notification', (msg) => {
            const payload = JSON.parse(msg.payload);
            // Broadcast to all connected React clients
            io.emit('speed_update', payload.speed);
        });
    })
    .catch(err => console.error('DB Connection Error:', err));

// Sensor Simulator: Insert data every 1 second
setInterval(async () => {
    const randomSpeed = Math.floor(Math.random() * 121); // Speed 0 to 120
    try {
        await pgClient.query('INSERT INTO speed_data (speed) VALUES ($1)', [randomSpeed]);
    } catch (err) {
        console.error('Insert error:', err);
    }
}, 1000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));