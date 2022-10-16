const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const commentSchema = new mongoose.Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
  reviewee: { type: Schema.Types.ObjectId, ref: "Recruiter" },
  reviwer: { type: Schema.Types.ObjectId, ref: "Worker" },
  rating: Number,
  message: String,
  created_at: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
