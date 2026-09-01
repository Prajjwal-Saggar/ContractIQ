const dotenv = require("dotenv");
dotenv.config();

const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new AppError("Please Login", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Session expired, please login again", 401));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token, please login again", 401));
    }
    next(error); // AppError from the "no token" case, or anything unexpected
  }
};

module.exports = { protect };
