const rolls = require('./rolls');

const PUBLIC_ROOM = 'public';

module.exports = io => {
  io.on('connection', socket => {
    console.log('Socket client connected!');
    
    socket.on('joinPublicRoom', () => {
      console.log('joinPublicRoom');

      socket.join(PUBLIC_ROOM);

      socket.on('roll', ({ dice, text, uid }) => {
        rolls.makePublicRoll(dice, text).then(res => {
          io.to(PUBLIC_ROOM).emit('roll', { ...res, uid });
        });
      });

      socket.on('leavePublicRoom', () => {
        console.log('leavePublicRoom');
        
        socket.leave(PUBLIC_ROOM);
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket client disconnected!');
    });
  });
};