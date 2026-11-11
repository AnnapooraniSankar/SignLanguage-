const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/signer", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signer.html"));
});

app.get("/nonsigner", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "nonsigner.html"));
});

app.get("/speech", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "speech.html"));
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Sign Language Platform" });
});

// ===== SOCKET.IO LOGIC =====
io.on("connection", socket => {
  console.log("user connected:", socket.id);

  socket.on("register", userId => {
    socket.data.userId = userId;
    console.log("registered", userId);
  });

  function getSocketByUserId(id) {
    for (const [, s] of io.of("/").sockets) {
      if (s.data.userId === id) return s;
    }
    return null;
  }

  // Caller -> Callee (offer)
  socket.on("call-user", ({ to, offer }) => {
    const callee = getSocketByUserId(to);
    if (callee && offer) {
      callee.emit("incoming-call", {
        from: socket.data.userId,
        to,
        offer
      });
      console.log(`incoming-call from ${socket.data.userId} to ${to}`);
    }
  });

  // Callee -> Caller (answer)
  socket.on("accept-call", ({ to, answer }) => {
    const caller = getSocketByUserId(to);
    if (caller && answer) {
      caller.emit("call-accepted", {
        from: socket.data.userId,
        to,
        answer
      });
      console.log(`call-accepted by ${socket.data.userId} for ${to}`);
    }
  });

  // ICE
  socket.on("ice-candidate", ({ to, candidate }) => {
    const peer = getSocketByUserId(to);
    if (peer && candidate) {
      peer.emit("ice-candidate", { candidate });
    }
  });

  // Chat
  socket.on("chat", ({ to, message, from }) => {
    const peer = getSocketByUserId(to);
    if (peer && message) {
      peer.emit("chat", { from, message });
    }
  });

  // Caption
  socket.on("caption", ({ to, from, text }) => {
    const peer = getSocketByUserId(to);
    if (peer && text) {
      peer.emit("caption", { from, text });
    }
  });

  // End call
  socket.on("end-call", ({ to }) => {
    const peer = getSocketByUserId(to);
    if (peer) {
      peer.emit("end-call");
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
