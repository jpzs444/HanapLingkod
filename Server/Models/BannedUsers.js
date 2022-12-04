const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const bannedRecruiterSchema = new mongoose.Schema(
  {
    recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter" },
    ban: Boolean,
    offense: Number,
  },
  { timestamps: true }
);

const bannedWorkerSchema = new mongoose.Schema(
  {
    workerId: { type: Schema.Types.ObjectId, ref: "Worker" },
    ban: Boolean,
  },
  { timestamps: true }
);

const BannedRecruiter = mongoose.model(
  "BannedRecruiter",
  bannedRecruiterSchema
);
const BannedWorker = mongoose.model("BannedWorker", bannedWorkerSchema);
module.exports = {
  BannedWorker,
  BannedRecruiter,
};
