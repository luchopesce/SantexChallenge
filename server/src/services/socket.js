const socketIo = require("socket.io");

let io;

function initializeSocketServer(server) {
  io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_HTTP,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("Un cliente se ha conectado");

    socket.on("disconnect", () => {
      console.log("Un cliente se ha desconectado");
    });
  });

  console.log("Socket.IO está corriendo");
}

function emitPlayerUpdated(playerUpdated) {
  if (io) {
    io.emit("playerUpdated", playerUpdated);
  }
}

function emitPlayerDeleted(playerDeleted) {
  if (io) {
    io.emit("playerDeleted", playerDeleted);
  }
}

function emitPlayerCreated(playerCreated) {
  if (io) {
    io.emit("playerCreated", playerCreated);
  }
}

function emitPlayerImport() {
  if (io) {
    io.emit("playerImport");
  }
}

module.exports = {
  initializeSocketServer,
  emitPlayerUpdated,
  emitPlayerDeleted,
  emitPlayerCreated,
  emitPlayerImport,
};
