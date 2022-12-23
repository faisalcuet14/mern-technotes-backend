require("dotenv").config();
const express = require("express");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
const { logger } = require("./middleware/logger");
const rootdir = require("./rootdir");

// initiate app
const app = express();
const PORT = process.env.PORT || 3500;

// log incoming request
app.use(logger);

// handle req.body
app.use(express.urlencoded({ extended: false }));
// handle json
app.use(express.json());
// serve static files
app.use(express.static("public"));

// handle root
app.use("/", require("./routes/root"));

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

// create and listen to server
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
