const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const CommentSchema = mongoose.Schema({
  workerId: { type: Schema.Types.ObjectId, ref: "Worker" },
  comment: String,
  created_at: { type: Date, required: true, default: Date.now },
});

CommentSchema.pre("find", function (next) {
  this.populate("workerId");
});
module.exports = mongoose.model("Comment", CommentSchema);
