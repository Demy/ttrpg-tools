const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const dotenv = require('dotenv');
var compression = require('compression');

dotenv.config();

// Socket.io
const options = {
  cors: true,
  origins: ['https://demy.su', 'http://localhost:3000'],
  methods: ["GET", "POST"],
  transports: ['websocket', 'polling'],
  allowEIO3: true
};
const io = require('socket.io')(httpServer, options);

require('./services/socket')(io);

// Server
const cors = require('cors');

var corsOptions = {
  origins: ['https://demy.su', 'http://localhost:3000'],
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(compression());

app.get('/', (req, res) => {
  res.send('API root');
});

require('./routes/diceRoutes')(app);

httpServer.listen(4000);
