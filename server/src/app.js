const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/authRoutes");

const app = express();
app.use(cookieParser())
app.use(cors());
app.use(express.json());

app.use("/api/v0/auth", authRouter);


//global error handling 
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (err.rawError) {
    console.log(err.rawError.message);
  } else {
    console.log(err.message);
  }

  res
    .status(err.statusCode)
    .json({ status: "error", message: err.message || "Something went wrong. Please try again later." });
});

module.exports = app;
