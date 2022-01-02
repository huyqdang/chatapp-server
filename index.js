const express = require("express");
const cors = require("cors");
const usersController = require("./controllers/usersController");
const { createServer } = require("http");
const { initSocket } = require("./core/socket/index");
const { initDb } = require("./core/db/index");

const client = initDb();
const app = express();
const httpServer = createServer(app);
app.use(cors());
app.use(express.json());

// controllers
const userRouter = express.Router();
usersController(userRouter, client);

// socket
initSocket(httpServer);

const port = 8080;

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
