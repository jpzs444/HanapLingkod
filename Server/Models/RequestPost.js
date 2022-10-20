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
  postToggle: Boolean,
  address: String,
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
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
  this.populate("recruiterId");
  this.populate("ServiceID");

  next();
});

module.exports = mongoose.model("RequestPost", requestPostSchema);
