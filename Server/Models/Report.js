const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const reportSchema = new mongoose.Schema(
  {
    title: String,
    reportedUser: String,
    description: String,
    deleteflag: { type: Boolean, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
