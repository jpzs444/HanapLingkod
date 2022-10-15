const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const ServiceSubCategory = require("../Models/SubCategory");
const Worker = require("../Models/Workers");

const ServiceRequestSchema = mongoose.Schema({
  workerId: { type: Schema.Types.ObjectId, ref: "Worker" },
  recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter" },
  workId: { type: Schema.Types.ObjectId, ref: "Work" },
  subCategory: String,
  minPrice: Number,
  maxPrice: Number,
  serviceDate: Date,
  startTime: Date,
  endTime: Date,
  address: String,
  description: String,
  requestStatus: Number,
  comment: String,
  geometry: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
  deleteflag: { type: Boolean, default: 0 },
  created_at: { type: Date, required: true, default: Date.now },
});

ServiceRequestSchema.pre("find", function (next) {
  this.populate("workerId");
  this.populate("recruiterId");

  next();
});

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
