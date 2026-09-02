const express = require("express");
const { protect } = require("../middlewares/protectMiddleware");
const authRouter = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controllers/authControllers");

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/me", protect, getMe);

module.exports = authRouter;
