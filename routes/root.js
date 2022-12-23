const express = require("express");
const path = require("path");
const rootdir = require("../rootdir");

const router = express.Router();

router.get("^/$|index(.html)?", (req, res) => {
  res.sendFile(path.join(rootdir, "views", "index.html"));
});

module.exports = router;
