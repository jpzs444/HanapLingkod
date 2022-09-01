const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const ServiceCategory = require("../Models/ServiceCategory");

const serviceSubCategorySchema = mongoose.Schema({
  ServiceID: { type: Schema.Types.ObjectId, ref: "ServiceCategory" },
  ServiceSubCategory: { type: String, required: true },
});

serviceSubCategorySchema.pre("find", function (next) {
  this.populate("ServiceID");
  
  next();
});

module.exports = mongoose.model("ServiceSubCategory", serviceSubCategorySchema);
