const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @route GET /users
// @desc get all users from db
// @access private
const getAllusers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users || !users?.length) {
    return res.status(400).json({ message: "No user found" });
  }
  res.json(users);
});

// @route POST /users
// @desc create new user
// @access private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  // validate incoming data
  if (!username || !password || !Array.isArray(roles) || !roles?.length) {
    return res.status(400).json({ message: "all fileds are required" });
  }
  // check for duplicate username
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "duplicate username" });
  }
  // create user and save to db
  const user = {
    username,
    password: await bcrypt.hash(password, 10),
    roles,
  };
  const result = await User.create(user);
  if (!result) {
    return res.status(400).json({ message: "invalid data" });
  }
  res.status(201).json({ message: `new user ${result.username} created` });
});

// @route PATCH /users
// @desc update exisiting user
// @access private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, active } = req.body;

  // validate incoming data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles?.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "all fileds are required" });
  }

  // validate user from database
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  // update user
  // check for duplicate username
  const duplicate = await User.findOne({ username })
    .select("-password")
    .lean()
    .exec();
  // allow updates to original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "duplicate username" });
  }
  // update user object
  user.username = username;
  user.roles = roles;
  user.active = active;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  const result = await user.save();
  res.json({ message: `${result.username} updated` });
});

// @route DELETE /users
// @desc delete a user
// @access private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  // validate incoming data
  if (!id) {
    return res.status(400).json({ message: "user ID required" });
  }
  // check if user has assigned notes
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: "user has notes assigned" });
  }
  // check if user exists in db
  const user = await User.findById(id).select("-password").exec();
  if (!user) {
    return res.status(400).json({ messgae: "user not found" });
  }
  // delete user from db
  const result = await user.deleteOne();
  res.json({
    message: `${result.username} with id ${result.id} deleted`,
  });
});

// @route GET /users/:id
// @desc get a specific user with given id
// @access private
const getOneUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // validate incoming data
  if (!id) {
    return res.status(400).json({ message: "user id required" });
  }
  // check if user exists
  const user = await User.findById(id).select("-password").lean().exec();
  console.log(user);
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }
  res.json(user);
});

module.exports = {
  getAllusers,
  createNewUser,
  updateUser,
  deleteUser,
  getOneUser,
};
