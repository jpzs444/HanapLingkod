const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const ServiceSubCategory = require("../Models/SubCategory");
const Worker = require("../Models/Workers");
const ServiceRequest = require("../Models/ServiceRequest");

const workSchema = mongoose.Schema({
  ServiceSubId: { type: Schema.Types.ObjectId, ref: "ServiceSubCategory" },
  workerId: { type: Schema.Types.ObjectId, ref: "Worker" },
  minPrice: Number,
  maxPrice: Number,
  deleteflag: { type: Boolean, default: 0 },
});

workSchema.pre("find", function (next) {
  this.populate("ServiceSubId");
  this.populate("workerId");

  next();
});
workSchema.post("findOneAndUpdate", async function (docs, next) {
  console.log("Work Middleware");
  const serviceRequestId = await ServiceRequest.find(
    {
      workId: docs._id,
    },
    {
      workerId: 0,
      recruiterId: 0,
      workId: 0,
      subCategory: 0,
      minPrice: 0,
      maxPrice: 0,
      serviceDate: 0,
      startTime: 0,
      endTime: 0,
      description: 0,
      requestStatus: 0,
      comment: 0,
      geometry: 0,
      deleteflag: 0,
      created_at: 0,
    }
  ).lean();
  // console.log(serviceRequestId);
  for (id of serviceRequestId) {
    await ServiceRequest.findOneAndUpdate({ _id: id._id }, { deleteflag: 1 });
  }
  next();
});

module.exports = mongoose.model("Work", workSchema);
