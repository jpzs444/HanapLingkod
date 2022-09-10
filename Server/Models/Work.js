const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const ServiceSubCategory = require("../Models/SubCategory");
const Worker = require("../Models/Workers");

const workSchema = mongoose.Schema({
  ServiceSubId: { type: Schema.Types.ObjectId, ref: "ServiceSubCategory" },
  workerId: { type: Schema.Types.ObjectId, ref: "Worker" },
  minPrice: Number,
  maxPrice: Number,
});

workSchema.pre("find", function (next) {
  this.populate("ServiceSubId");
  this.populate("workerId");

  next();
});

module.exports = mongoose.model("Work", workSchema);
