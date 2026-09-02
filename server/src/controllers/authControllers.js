const dotenv = require("dotenv");
dotenv.config();

const { createNewUser, getLoggedInUser , getCurrentUser } = require("../services/userService");
const AppError = require("../utils/appError");

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

/*
Stuff left to add in the Register
Check for already existing usernames or email 
Check if the email is valid or not use basic validation plus OTP 
*/
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await createNewUser({ username, email, password });
    //set the token for the user registration
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
    });

    return res
      .status(201)
      .json({ user: { username: newUser.username, email: newUser.email } });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const loggedInUser = await getLoggedInUser({ email, password });

    const token = jwt.sign({ id: loggedInUser._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
    });
    return res.status(200).json({
      user: { email: loggedInUser.email, username: loggedInUser.username },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    if (!req.cookies.token) {
      return res.status(400).json({ message: "Cannot Logout" });
    }
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(new AppError("Failed to logout. Please try again.", 500, error));
  }
};

const getMe = async (req,res,next) => {
  try {
    const userId = req.userId;

    if(!userId){
      return res.status(401).json({message:"Please Login"})
    }

    const user = await getCurrentUser(userId);
    
    return res.status(200).json({user})
  } catch (error) {
    next(error)
  }
}

module.exports = { registerUser, loginUser, logoutUser,getMe };
