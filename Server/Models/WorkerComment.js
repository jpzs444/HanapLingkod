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

module.exports = mongoose.model("Workercomment", WorkercommentSchema);
