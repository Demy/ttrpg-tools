const app = require('express')();
const httpServer = require('http').createServer(app);
const options = {
  cors: true,
  origins: ['http://127.0.0.1:3000'],
};
const io = require('socket.io')(httpServer, options);

io.on('connection', socket => {
  console.log('Socket client connected!');

  const response = new Date();
  socket.emit('FromAPI', response);

  socket.on('disconnect', () => {
    console.log('Socket client disconnected!');
  });
});

httpServer.listen(4000);
