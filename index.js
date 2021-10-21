const express = require("express");
const app = express();
const socket = require("socket.io");
const cors = require("cors");
const dotenv = require('dotenv');

dotenv.config();

app.use(express());
const port = 8000;

app.use(cors());
app.use(express.json())

var server = app.listen(
  port,
  () => {
    console.log(
      `Server is running on the port no: ${(port)} `
    )
    
    const io = socket(server);
    require('./services/socket')(io);
  }
);

require('./routes/roomRoutes')(app);
