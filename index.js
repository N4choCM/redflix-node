const Server = require("./core/model/server");
require("dotenv").config();

const server = new Server();

server.listen();