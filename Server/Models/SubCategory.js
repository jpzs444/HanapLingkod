const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const Work = require("./Work");

const serviceSubCategorySchema = mongoose.Schema({
  ServiceID: { type: Schema.Types.ObjectId, ref: "ServiceCategory" },
  ServiceSubCategory: { type: String, required: true },
});

serviceSubCategorySchema.pre("find", function (next) {
  this.populate("ServiceID");
  next();
});

serviceSubCategorySchema.post("deleteMany", function (next) {
  Work.deleteMany({}).exec();
  next();
});

serviceSubCategorySchema.post("findOneAndDelete", async function (doc, next) {
  // if a service category is deleted query the sub category and find the null values and then delete it
  let array = await Work.find({})
    .select({ ServiceIDServiceSubId: 1, _id: 1 })
    .lean()
    .exec();
  console.log(array);
  console.time();
  for (var i = 0; i < array.length; i += 1) {
    if (array[i].ServiceSubId === null) {
      await Work.deleteOne({ _id: array[i]._id });
    }
  }
  console.timeEnd();
});

module.exports = mongoose.model("ServiceSubCategory", serviceSubCategorySchema);
