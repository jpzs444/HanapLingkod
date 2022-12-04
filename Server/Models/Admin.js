const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  middlename: String,
  birthday: Date,
  age: Number,
  sex: String,
  phoneNumber: String,
  emailAddress: String,
  accountStatus: String,
  role: String,
  pushtoken: { type: String, default: "" },
  accountStatus: String,
});

module.exports = mongoose.model("Admin", adminSchema);
