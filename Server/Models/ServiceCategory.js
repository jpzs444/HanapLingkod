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
  // if a service category is deleted query the sub category and find the null values and then delete it
  let array = await ServiceSubCategory.find({})
    .select({ ServiceID: 1, _id: 1 })
    .lean()
    .exec();
  console.log(array);
  console.time();
  for (var i = 0; i < array.length; i += 1) {
    if (array[i].ServiceID === null) {
      await ServiceSubCategory.deleteOne({ _id: array[i]._id });
    }
  }
  console.timeEnd();
});

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);
