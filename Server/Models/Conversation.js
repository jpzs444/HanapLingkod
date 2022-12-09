const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema(
  {
    members: {
      type: Array,
    },
    receiverSeen: { type: Boolean, default: 0 },
    senderSeen: { type: Boolean, default: 0 },
    latestMessage: String,
    deleteflag: { type: Boolean, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
