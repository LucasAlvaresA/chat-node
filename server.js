const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

server.listen(3000);

app.use(express.static(path.join(__dirname, "public")));

let connectedUsers = [];

io.on("connection", (socket) => {
    console.log("online");

    socket.on("joinRequest", (username) => {
        socket.username = username;
        connectedUsers.push(username);
        console.log(connectedUsers);

        socket.emit("userOk", connectedUsers);
        socket.broadcast.emit("listUpdate", {
            joined: username,
            list: connectedUsers,
        });
    });

    socket.on("disconnect", () => {
        connectedUsers = connectedUsers.filter((u) => u != socket.username);
        console.log(connectedUsers);
        socket.broadcast.emit("listUpdate", {
            left: socket.username,
            list: connectedUsers,
        });
    });
});
