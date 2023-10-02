/**
 * @fileoverview Server configuration file.
 */
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../../config/db_config");

/**
 * @description Class that represents the server.
 */
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.SERVER_PORT;
    this.authPath = "/auth";
    this.userPath = "/users";
    this.connectToDB();
    this.middlewares();
    this.routes();
  }

  /**
   * @description Connects to the database.
   */
  async connectToDB() {
    await dbConnection();
  }

  /**
   * @description Sets the middlewares.
   */
  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  /**
   * @description Matches the routes of the Server with the file where they are located.
   */
  routes() {
    this.app.use(this.authPath, require("../routes/auth_route"));
    this.app.use(this.userPath, require("../routes/user_route"));
  }

  /**
   * @description Sets the port to which the Server listens.
   */
  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port ", this.port);
    });
  }
}

module.exports = Server;