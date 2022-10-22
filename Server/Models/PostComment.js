const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const PostcommentSchema = new mongoose.Schema({
  workerId: { type: Schema.Types.ObjectId, ref: "Worker" },
  message: String,
  created_at: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Postcomment", PostcommentSchema);
