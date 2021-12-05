const rolls = require('./rolls');
const rooms = require('./rooms');

let count = 0;

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log('Socket client connected! Clients connected: ' + (++count));
    
    socket.on('joinRoom', (roomId) => {
      console.log('joinRoom ' + roomId);
      socket.join(roomId);

      const onRollListener = ({ dice, text, uid }) => {
        console.log('roll in ' + roomId);
        rolls.makeRoll({ roomId, dice, text }, res => {
          io.to(roomId).emit('roll', { ...res, uid });
        });
      };

      socket.on('roll', onRollListener);

      socket.on('leaveRoom', () => {
        console.log('leaveRoom (inner) ' + roomId);
        socket.off('roll', onRollListener);
        socket.leave(roomId);
      });
    });

    socket.on('createRoom', (data) => {
      rooms.createRoom(data).then(result => {
        socket.emit('room', data.roomId);
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket client disconnected! Clients connected: ' + (--count));
    });
  });
};