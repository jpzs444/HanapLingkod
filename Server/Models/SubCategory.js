const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const serviceSubCategorySchema = mongoose.Schema({
  ServiceID: { type: Schema.Types.ObjectId, ref: "ServiceCategory" },
  ServiceSubCategory: String,
});

module.exports = mongoose.model("serviceSubCategory", serviceSubCategorySchema);
