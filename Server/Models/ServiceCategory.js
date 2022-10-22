const mongoose = require("mongoose");
const ServiceSubCategory = require("./SubCategory");

const serviceCategorySchema = mongoose.Schema({
  Category: String,
  image: String,
  deleteflag: { type: Boolean, default: 0 },
});

// serviceCategorySchema.post("findOneAndUpdate", async function (docs, next) {
//   console.log("Service Middleware");
//   // console.log(docs);

//   const subCatId = await ServiceSubCategory.find(
//     {
//       ServiceID: docs._id,
//     },
//     { __v: 0, ServiceID: 0, ServiceSubCategory: 0 }
//   ).lean();
//   for (id of subCatId) {
//     await ServiceSubCategory.findOneAndUpdate(
//       { _id: id._id },
//       { deleteflag: 1 }
//     );
//   }
//   next();
// });

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);
