const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const RecruitercommentSchema = new mongoose.Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
  reviewee: { type: Schema.Types.ObjectId, ref: "Recruiter" },
  reviewer: { type: Schema.Types.ObjectId, ref: "Worker" },
  rating: Number,
  message: String,
  created_at: { type: Date, required: true, default: Date.now },
});

RecruitercommentSchema.pre("find", function (next) {
  this.populate(
    "reviewer",
    "_id firstname lastname middlename age sex street purok barangay city province phoneNumber profilePic verification"
  );
  this.populate(
    "reviewee ",
    "_id firstname lastname middlename age sex street purok barangay city province phoneNumber profilePic verification"
  );

  next();
});

module.exports = mongoose.model("Recruitercomment", RecruitercommentSchema);
