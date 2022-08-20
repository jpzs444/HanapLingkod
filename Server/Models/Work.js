const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const workSchema = mongoose.Schema({
  ServiceSubCode: { type: Schema.Types.ObjectId, ref: "serviceSubCategory" },
  workerId: { type: Schema.Types.ObjectId, ref: "Worker" },
  minPrice: Number,
  maxPrice: Number,
});

module.exports = mongoose.model("Work", workSchema);
