const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const WorkercommentSchema = new mongoose.Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
  reviewee: { type: Schema.Types.ObjectId, ref: "Worker" },
  reviewer: { type: Schema.Types.ObjectId, ref: "Recruiter" },
  rating: Number,
  message: String,
  created_at: { type: Date, required: true, default: Date.now },
});

WorkercommentSchema.pre("find", function (next) {
  this.populate(
    "reviewee"
    // "_id firstname lastname middlename age sex street purok barangay city province phoneNumber profilePic verification"
  );
  this.populate(
    "reviewer"
    // "_id firstname lastname middlename age sex street purok barangay city province phoneNumber profilePic verification"
  );

  next();
});

module.exports = mongoose.model("Workercomment", WorkercommentSchema);
