const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const dotenv = require('dotenv');

dotenv.config();

// Socket.io
const options = {
  cors: true,
  origins: ['http://127.0.0.1:3000'],
};
const io = require('socket.io')(httpServer, options);

require('./services/socket')(io);

// Server
const cors = require('cors');

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));
app.use(express.json())

require('./routes/diceRoutes')(app);

httpServer.listen(4000);
