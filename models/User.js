const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      match: /^[0-9]{10}$/,
    },
    photo: {
      type: String,
      default: function() {
        return this.gender === "female"
          ? "https://res.cloudinary.com/dwr8472qb/image/upload/v1733908498/female_lcv6ml.png"
          : "https://res.cloudinary.com/dwr8472qb/image/upload/v1733908512/male_rusjtq.png";
      },
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "professor", "HOD", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);