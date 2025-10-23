const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { sequelize } = require('./models');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { globalLimiter } = require('./middleware/rateLimiter');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'https://hohai110.five-plus-one.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Apply rate limiting
app.use(globalLimiter);

// API routes
app.use('/api/v1', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Socket.IO configuration for relay activity
let onlineCount = 0;
const io = new Server(server, {
  path: '/ws/relay',
  cors: corsOptions
});

io.on('connection', (socket) => {
  onlineCount++;
  console.log(`Client connected. Online count: ${onlineCount}`);
  io.emit('presence:update', { count: onlineCount });

  socket.on('disconnect', () => {
    onlineCount--;
    console.log(`Client disconnected. Online count: ${onlineCount}`);
    io.emit('presence:update', { count: onlineCount });
  });

  // Handle new torch relay message
  socket.on('torch:send', (data) => {
    io.emit('torch:new', {
      id: Date.now(),
      ...data,
      timestamp: new Date().toISOString()
    });
  });
});

// Database connection and server start
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync database (development only)
    // Note: Using alter: false to avoid "too many keys" error
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('Database synchronized.');
    }

    // Start server
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/v1`);
      console.log(`WebSocket available at http://localhost:${PORT}/ws/relay`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await sequelize.close();
    console.log('HTTP server closed');
    process.exit(0);
  });
});

startServer();
