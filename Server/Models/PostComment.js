const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const PostcommentSchema = new mongoose.Schema({
  workerId: { type: Schema.Types.ObjectId, ref: "Worker" },
  message: String,
  created_at: { type: Date, required: true, default: Date.now },
});

PostcommentSchema.pre("find", function (next) {
  this.populate("workerId", "-pushtoken -works -unavailableTime");
  next();
});

module.exports = mongoose.model("Postcomment", PostcommentSchema);
