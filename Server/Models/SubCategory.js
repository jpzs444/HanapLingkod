const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const Work = require("./Work");

const serviceSubCategorySchema = mongoose.Schema({
  ServiceID: { type: Schema.Types.ObjectId, ref: "ServiceCategory" },
  ServiceSubCategory: { type: String, required: true },
  deleteflag: { type: Boolean, default: 0 },
});

serviceSubCategorySchema.pre("find", function (next) {
  this.populate("ServiceID");
  next();
});

// serviceSubCategorySchema.post("deleteMany", function (next) {
//   Work.deleteMany({}).exec();
//   next();
// });

serviceSubCategorySchema.post("findOneAndUpdate", async function (docs, next) {
  console.log("Sub Service  Middleware");

  const workId = await Work.find(
    {
      ServiceSubId: docs._id,
    },
    { __v: 0, ServiceSubId: 0, workerId: 0, minPrice: 0, maxPrice: 0 }
  ).lean();
  // console.log(workId);
  for (id of workId) {
    await Work.findOneAndUpdate({ _id: id._id }, { deleteflag: 1 });
  }
  // let array = await Work.find({})
  //   .select({ workerId: 0, minPrice: 0, maxPrice: 0 })
  //   .lean()
  //   .exec();
  // // console.log(array);
  // console.time();
  // for (var i = 0; i < array.length; i += 1) {
  //   if (array[i].ServiceSubId === null) {
  //     await Work.deleteOne({ _id: array[i]._id });
  //   }
  // }
  // console.timeEnd();
  // next();
});

module.exports = mongoose.model("ServiceSubCategory", serviceSubCategorySchema);
