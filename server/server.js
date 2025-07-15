const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./sequelize");
const Document = require("./models/document");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = 3001;
const defaultValue = "";

sequelize.sync().then(() => {
  console.log("PostgreSQL connected and models synced.");
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.update({ data }, { where: { id: documentId } });
    });
  });
});

async function findOrCreateDocument(id) {
  if (!id) return;

  const [doc, created] = await Document.findOrCreate({
    where: { id },
    defaults: { data: defaultValue },
  });

  return doc;
}
