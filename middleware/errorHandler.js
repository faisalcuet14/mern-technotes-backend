const { logEvent } = require("./logger");

const errorHandler = (err, req, res, next) => {
  const errMsg = `${err.name}: ${err.message}\t${req.method} ${req.url} ${req.headers.origin}`;
  console.log(errMsg);
  logEvent(errMsg, "errLogs.log");
  // set response status code
  res.status(res.statusCode ? res.statusCode : 500); //default to server error
  // send response
  res.json({ message: err.message });
};

module.exports = errorHandler;
