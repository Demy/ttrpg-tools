const rolls = require('./rolls');

module.exports = io => {
  io.on('connection', socket => {
    console.log('Socket client connected!');

    socket.on('roll', ({ dice, text, uid }) => {
      rolls.makePublicRoll(dice, text).then(res => {
        socket.emit('roll', { ...res, uid });
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket client disconnected!');
    });
  });
};