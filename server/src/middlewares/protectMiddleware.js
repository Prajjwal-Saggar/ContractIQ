const dotenv = require("dotenv");
dotenv.config();

const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new AppError("Authentication required. Please login.", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Session expired. Please login again.", 401));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token. Please login again.", 401));
    }
    next(error); // AppError from the "no token" case, or anything unexpected
  }
};

module.exports = { protect };
