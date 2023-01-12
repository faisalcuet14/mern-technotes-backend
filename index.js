require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { corsOptions } = require("./config/corsOptions");
const errorHandler = require("./middleware/errorHandler");
const { logger, logEvent } = require("./middleware/logger");
const rootdir = require("./rootdir");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");

// initiate app
const app = express();
const PORT = process.env.PORT || 3500;

// connect to database
connectDB();

// log incoming request
app.use(logger);

// handle req.body
app.use(express.urlencoded({ extended: false }));
// handle json
app.use(express.json());
// handle Cross Origin Resource Sharing (CORS) access
app.use(cors(corsOptions));
// serve static files
app.use(express.static("public"));

// handle root
app.use("/", require("./routes/root"));

// handle users route
app.use("/users", require("./routes/users"));
// handle notes route
app.use("/notes", require("./routes/notes"));

// handle 404 pages
app.get("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(rootdir, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ msg: "file not found" });
  } else {
    res.type("txt").send("file not found");
  }
});

// log all server processing errors and send response
app.use(errorHandler);

// listen to server after database connection
mongoose.connection.once("connected", () => {
  console.log("connected to database");
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
});

// log database error
mongoose.connection.on("error", (err) => {
  console.log(err);
  const mongoErr = `${err.no}: ${err.code}\tsyscall:${err.syscall}\thostname:${err.hostname}`;
  logEvent(mongoErr, "mongoLogs.log");
});
