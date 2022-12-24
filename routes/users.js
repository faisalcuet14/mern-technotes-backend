const express = require("express");
const {
  getAllusers,
  createNewUser,
  updateUser,
  deleteUser,
  getOneUser,
} = require("../controllers/usersController");

const router = express.Router();

router
  .route("/")
  .get(getAllusers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser);
router.get("/:id", getOneUser);

module.exports = router;
