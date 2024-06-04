// controllers/socketController.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const socketController = io => {
  io.on('connection', async connectedSocket => {
    let user = null;
    const authorizationHeader = connectedSocket.handshake.headers.authorization;
    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
      } catch (err) {
        console.error('Socket authentication error:', err.message);
      }
    }

    if (user) {
      console.log(`User ${user.name} connected`);
      connectedSocket.user = user;
      connectedSocket.join(user.clinic);
      connectedSocket.on('chat message', async msg => {
        io.to(user.clinic).emit('chat message', { user: user.name, message: msg });
      });
    } else {
      console.log('Unauthenticated user connected');
    }

    // Handle other socket events
    // ...
  });
};

module.exports = socketController;
