const messages = [];
const users = [];

module.exports = {
  messagingController: (io) => {
    io.on("connection", (socket) => {
      socket.on("messageInsert", (message) => {
        console.log("message received", message);

        messages.push(message);
        io.emit("messageUpdated", messages);
      });
    });
  },
};
