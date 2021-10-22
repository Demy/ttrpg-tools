const rolls = require('./rolls');
const rooms = require('./rooms');

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log('Socket client connected!');
    
    socket.on('joinRoom', (roomId) => {
      console.log('joinRoom ' + roomId);
      socket.join(roomId);

      socket.on('roll', ({ dice, text, uid }) => {
        rolls.makeRoll({ roomId, dice, text }, res => {
          io.to(roomId).emit('roll', { ...res, uid });
        });
      });

      socket.on('leaveRoom', () => {
        console.log('leaveRoom ' + roomId);
        socket.leave(roomId);
      });
    });

    socket.on('createRoom', (data) => {
      rooms.createRoom(data).then(result => {
        socket.emit('room', data.roomId);
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket client disconnected!');
    });
  });
};