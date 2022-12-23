const allowedOrigin = ["http://localhost:3500"];

module.exports.corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("NOT Allowed by CORS!!"));
    }
  },
  credentials: true,
  // optionsSuccessStatus: 200,  // set response status to 200, default is 204
};
