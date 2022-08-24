const mongoose = require("mongoose");
const ServiceSubCategory = require("./SubCategory");

const serviceCategorySchema = mongoose.Schema({
  Category: String,
});

serviceCategorySchema.post(/Many$/, function (next) {
  ServiceSubCategory.deleteMany({}).exec();
  next();
});

serviceCategorySchema.post("findOneAndDelete", async function (doc, next) {
  ServiceSubCategory.deleteMany({ ServiceID: doc._id }).exec();
  console.log("ad");
  next();
});

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);
