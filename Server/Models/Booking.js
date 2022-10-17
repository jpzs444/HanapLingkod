const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const ServiceSubCategory = require("../Models/SubCategory");
const Worker = require("../Models/Workers");

const BookingSchema = mongoose.Schema({
  workerId: { type: Schema.Types.ObjectId, ref: "Worker" },
  recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter" },
  workId: { type: Schema.Types.ObjectId, ref: "Work" },
  serviceRequestId: { type: Schema.Types.ObjectId, ref: "ServiceRequest" },
  subCategory: String,
  minPrice: Number,
  maxPrice: Number,
  serviceDate: Date,
  startTime: Date,
  endTime: Date,
  description: String,
  bookingStatus: Number,
  otp: String,
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
  statusWorker: { type: Number, default: 0 },
  statusRecruiter: { type: Number, default: 0 },
  deleteflag: { type: Boolean, default: 0 },
  created_at: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Booking", BookingSchema);
