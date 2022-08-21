const mongoose = require("mongoose");
const ServiceSubCategory = require("./SubCategory");

const serviceCategorySchema = mongoose.Schema({
  Category: String,
});

serviceCategorySchema.pre(/Many$/, function (next) {
  ServiceSubCategory.deleteMany({}).exec();
  next();
});
serviceCategorySchema.post("findOneAndDelete", function (doc) {
  console.log(doc._id);
});

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);
