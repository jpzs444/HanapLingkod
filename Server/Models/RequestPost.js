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

module.exports = mongoose.model("RequestPost", requestPostSchema);
