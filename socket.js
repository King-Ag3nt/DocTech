let io;

module.exports = {
  init: httpServer => {
    return (io = require('socket.io')(httpServer));
  },
  getIo: () => {
    if (!io) {
      throw new Error('Socket.io is not initalized');
    }
    return io;
  },
};
