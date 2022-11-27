const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const requestPostSchema = new mongoose.Schema({
  recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter" },
  ServiceID: { type: Schema.Types.ObjectId, ref: "ServiceCategory" },
  postDescription: String,
  created_at: { type: Date, required: true, default: Date.now },
  serviceDate: Date,
  startTime: Date,
  minPrice: Number,
  maxPrice: Number,
  postToggle: { type: Boolean, default: 1 },
  address: String,
  postCommentId: { type: Schema.Types.ObjectId, ref: "Postcomment" },
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
});

requestPostSchema.pre("find", function (next) {
  this.populate("recruiterId", "-GovId -password");
  this.populate("ServiceID");
  // this.populate("postCommentId");

  next();
});

module.exports = mongoose.model("RequestPost", requestPostSchema);
