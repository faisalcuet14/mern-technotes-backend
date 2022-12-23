const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const rootdir = require("../rootdir");

const logEvent = async (message, logFile) => {
  const logMsg = `${format(
    new Date(),
    "dd-MM-yyyy HH:mm:ss"
  )} ${uuid()} ${message}\n`;
  try {
    if (!fs.existsSync(path.join(rootdir, "log"))) {
      await fsPromises.mkdir(path.join(rootdir, "log"));
    }
    await fsPromises.appendFile(path.join(rootdir, "log", logFile), logMsg);
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  const logMsg = `${req.method} ${req.url} ${req.headers.origin}`;
  console.log(logMsg);
  logEvent(logMsg, "reqLogs.log");
  next();
};

module.exports = { logEvent, logger };
