const { Server } = require("socket.io");
const { messagingController } = require("./controller/messagingController");

module.exports = {
  initSocket: (httpServer) => {
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.use((socket, next) => {
      console.log("token for socket >>", socket.handshake.auth.token);
      next();
    });

    messagingController(io);
  },
};
