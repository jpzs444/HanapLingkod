const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const UserNotificationSchema = new Schema({
  to: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
    index: { expires: "1m" },
  },
  //   readAt: { type: Date, required: true, default: Date.now() },
});
// UserNotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3 });

module.exports = mongoose.model("UserNotification", UserNotificationSchema);
