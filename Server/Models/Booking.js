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
  address: String,
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
  comment: String,
});

BookingSchema.pre("find", function (next) {
  this.populate(
    "workerId",
    "_id firstname lastname middlename age sex street purok barangay city province phoneNumber profilePic verification"
  );
  this.populate(
    "recruiterId",
    "_id firstname lastname middlename age sex street purok barangay city province phoneNumber profilePic verification"
  );

  next();
});

module.exports = mongoose.model("Booking", BookingSchema);
