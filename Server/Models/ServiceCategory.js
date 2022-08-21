const mongoose = require("mongoose");
const ServiceSubCategory = require("./SubCategory");

const serviceCategorySchema = mongoose.Schema({
  Category: String,
});

serviceCategorySchema.post("save", function (next) {
  console.log("asd");
});
serviceCategorySchema.pre(/Many$/, function (next) {
  ServiceSubCategory.deleteMany({}).exec();
  next();
});

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);
