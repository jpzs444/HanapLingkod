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
  console.log(req.params.userID);
  Worker.updateOne(
    { _id: { $eq: req.params.userID } },
    { pushtoken: req.body.pushtoken },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated Docs : ", docs);
      }
    }
  );
  Recuiter.updateOne(
    { _id: { $eq: req.params.userID } },
    { pushtoken: req.body.pushtoken },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated Docs : ", docs);
      }
    }
  );

  res.send("Updated Successfully");
});

module.exports = router;
