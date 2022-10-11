const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const commentSchema = new mongoose.Schema({
  workerId: { type: Schema.Types.ObjectId, ref: "Worker" },
  comment: String,
  created_at: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
