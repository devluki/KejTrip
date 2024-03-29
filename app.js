const cookieSession = require("cookie-session");
const express = require("express");

const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
// const session = require('express-session');

const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const methodOverride = require("method-override");

const app = express();
// Sprawdzić deklaracje protu do wrzucenia
// const port = normalizePort(process.env.PORT || '3000');

const port = process.env.PORT || 3000;
app.set("port", port);
// Socekt.io
const http = require("http").createServer(app);
const io = require("socket.io")(http);
// Do sprawdzenia
require("dotenv").config();

// Middleware

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(methodOverride("_method"));

app.use(express.static("public"));
app.use(expressLayouts);
app.use(cookieParser("TravelBlogSecure"));

app.use(
  cookieSession({
    name: "session",
    overwrite: false,
    keys: ["123456"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(flash());
app.use(fileUpload());
app.use(express.json());

app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
//io -> socket
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("newComment", (comment) => {
    io.emit("newComment", comment);
  });
  socket.on("newLike", (data) => {
    io.emit("newLike", data);
  });
  socket.on("cookies", (data) => {
    io.emit("cookies", data);
  });
});

// Routes

const routes = require("./server/routes/articlesRoutes.js");

const { SocketAddress } = require("net");
app.use("/", routes);
http.listen(port, (req, res) => {
  console.log(`Listening to port ${port}`);
  console.log("io:port", port);
});
