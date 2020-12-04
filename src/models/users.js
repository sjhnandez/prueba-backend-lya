const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: "String",
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: "String",
    required: true,
    trim: true,
  },
  active: {
    type: 'Boolean',
    required:false,
  }
});

userSchema.pre("save", function (next) {
  const user = this;
  console.log(user);
  if (!user.isModified && !user.isNew) {
    next();
    console.log("1asdasd");
  } else {
    bcrypt.hash(user.password, 5, (err, hash) => {
      if (err) {
        console.log("Error hashing password for user", user.name);
        next(err);
      } else {
        console.log("2");
        user.password = hash;
        user.active = false;
        next();
      }
    });
  }
});

module.exports = mongoose.model("User", userSchema);
