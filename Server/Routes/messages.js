const router = require("express").Router();
const Conversation = require("../Models/Conversation");
const Message = require("../Models/Message");
const Recruiters = require("../Models/Recruiters");
const Workers = require("../Models/Workers");
const notification = require("../Helpers/PushNotification");

//add

router.post("/messages", async (req, res) => {
  try {
    let pushtoken = "";
    console.log(typeof req.body.text, req.body.text);
    const newMessage = new Message(req.body);
    const convo = await Conversation.findOne({
      _id: req.body.conversationId,
    }).lean();
    let members = convo.members;
    let receiver = members.filter((ids) => ids != req.body.sender);

    const pushIDWorker = await Workers.findOne(
      { _id: receiver },
      { pushtoken: 1, _id: 0 }
    ).lean();

    const pushIDRecruiter = await Recruiters.findOne(
      { _id: receiver },
      { pushtoken: 1, _id: 0 }
    ).lean();
    if (pushIDWorker !== null) {
      pushtoken = pushIDWorker.pushtoken;
    }
    if (pushIDRecruiter !== null) {
      pushtoken = pushIDRecruiter.pushtoken;
    }
    console.log(pushtoken);
    const savedMessage = await newMessage.save();
    notification(
      [pushtoken],
      "New Message",
      req.body.text,
      { Type: "New Message", id: req.body.conversationId },
      receiver[0]
    );
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/messages/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
