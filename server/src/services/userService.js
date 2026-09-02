const User = require("../models/user.model");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");
const createNewUser = async ({ username, email, password }) => {
  try {
    return await User.create({ username, email, password });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      throw new AppError(`An account with this ${field} already exists.`, 409);
    }
    throw new AppError("Failed to create account. Please try again later.", 500, error);
  }
};

const getLoggedInUser = async ({ email, password }) => {
  try {
    const loggedInUser = await User.findOne({ email });
    if (!loggedInUser) {
      throw new AppError("No account found with this email.", 404);
    }

    //match the password

    const isCorrectPass = await bcrypt.compare(password, loggedInUser.password);
    if (!isCorrectPass) {
      throw new AppError("Invalid email or password.", 401);
    }

    return loggedInUser;
  } catch (error) {
    throw error;
  }
};

module.exports = { createNewUser, getLoggedInUser };
