const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const UserNotificationSchema = new Schema({
  to: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: {
    type: Date,
    expires: "1m",
    default: Date.now(),
    required: true,
  },
  //   readAt: { type: Date, required: true, default: Date.now() },
});
// UserNotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3 });

module.exports = mongoose.model("UserNotification", UserNotificationSchema);
