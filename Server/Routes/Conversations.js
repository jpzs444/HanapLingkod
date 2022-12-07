const router = require("express").Router();
const Conversation = require("../Models/Conversation");

//new conv

router.post("/conversations", async (req, res) => {
  try {
    //check if the convo already exist if true send the existing convo id of false create a new convo and return the id
    const conversation = await Conversation.find({
      $and: [
        { members: { $in: [req.body.senderId] } },
        { members: { $in: [req.body.receiverId] } },
      ],
    });
    if (conversation != 0) {
      res.status(200).json(conversation);
    } else {
      const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
      });
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/conversations/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
      deleteflag: false,
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get(
  "/conversations/find/:firstUserId/:secondUserId",
  async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = router;
