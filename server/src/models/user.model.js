const { default: mongoose } = require("mongoose");
const bcrypt  = require("bcrypt");
const AppError = require("../utils/appError");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

// write the middle-ware for the password hashing
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw new AppError("Failed to hash password. Please try again later.", 500, error);
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
