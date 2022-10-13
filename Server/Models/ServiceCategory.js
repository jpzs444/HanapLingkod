const mongoose = require("mongoose");
const ServiceSubCategory = require("./SubCategory");

const serviceCategorySchema = mongoose.Schema({
  Category: String,
  deleteflag: { type: Boolean, default: 0 },
});

serviceCategorySchema.post("findOneAndUpdate", async function (docs, next) {
  console.log("Service Middleware");
  const subCatId = await ServiceSubCategory.find(
    {
      ServiceID: docs._id,
    },
    { __v: 0, ServiceID: 0, ServiceSubCategory: 0 }
  ).lean();
  for (id of subCatId) {
    await ServiceSubCategory.findOneAndUpdate(
      { _id: id._id },
      { deleteflag: 1 }
    );
  }
  next();

  // if a service category is deleted query the sub category and find the null values and then delete it
  // let array = await ServiceSubCategory.find({})
  //   .select({ ServiceID: 1, _id: 1 })
  //   .lean()
  //   .exec();
  // console.log(array);
  // console.time();
  // for (var i = 0; i < array.length; i += 1) {
  //   if (array[i].ServiceID === null) {
  //   }
  // }
  // console.timeEnd();
});

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);
