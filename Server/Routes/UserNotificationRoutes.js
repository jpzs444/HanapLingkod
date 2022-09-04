const express = require("express");
const router = express.Router();
const UserNotification = require("../Models/Notifications");
const Work = require("../Models/Work");
const Worker = require("../Models/Workers");
const Recuiter = require("../Models/Recuiters");

router
  .route("/notification/:pushtoken")
  .get(function (req, res) {
    UserNotification.find({ to: req.params.pushtoken }, function (err, notif) {
      if (notif) {
        res.send(notif);
      } else {
        res.send("No such data found");
      }
    });
  })
  .put(async function (req, res) {
    await UserNotification.updateMany(
      { to: req.params.pushtoken },
      { $set: { read: 1 } }
    );
    res.send("Updated Successfully");
  });

router.route("/setToken/:userID").put(function (req, res) {
  console.log(req.body.pushtoken);
  Worker.findByIdAndUpdate(
    { _id: req.params.userID },
    { $set: { pushtoken: req.body.pushtoken } }
  );
  Recuiter.findByIdAndUpdate(
    { _id: req.params.userID },
    { $set: { pushtoken: req.body.pushtoken } }
  );
  res.send("Updated Successfully");
});

module.exports = router;
