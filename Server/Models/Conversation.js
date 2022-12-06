const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema(
  {
    members: {
      type: Array,
    },
    deleteflag: { type: Boolean, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
