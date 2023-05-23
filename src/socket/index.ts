import { Server } from "socket.io";
import http from "http";
import { createError } from "../utils/errorHandler";

let io: Server;

const ioInstance = {
  init: (serverInstance: http.Server) => {
    io = new Server(serverInstance);
    return io;
  },
  getIo: () => {
    if (!io) {
      createError("Socket Instance Not Initialized", 500);
    }
    return io;
  },
};

export default ioInstance;
