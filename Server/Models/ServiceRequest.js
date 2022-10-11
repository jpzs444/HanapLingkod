const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const ServiceSubCategory = require("../Models/SubCategory");
const Worker = require("../Models/Workers");

const ServiceRequestSchema = mongoose.Schema({
  workerId: { type: Schema.Types.ObjectId, ref: "Worker" },
  recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter" },
  subCategory: String,
  minPrice: Number,
  maxPrice: Number,
  serviceDate: Date,
  startTime: Date,
  endTime: Date,
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
  created_at: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
