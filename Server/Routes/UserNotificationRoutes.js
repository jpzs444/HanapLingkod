const express = require("express");
const router = express.Router();
const UserNotification = require("../Models/Notifications");
const Work = require("../Models/Work");
const Worker = require("../Models/Workers");
const Recruiter = require("../Models/Recruiters");

router
  .route("/notification/:userId")
  .get(function (req, res) {
    UserNotification.find({ userID: req.params.userId }, function (err, notif) {
      if (notif) {
        res.send(notif);
      } else {
        res.send("No such data found");
      }
    });
  })
  .put(async function (req, res) {
    await UserNotification.updateMany(
      { userID: req.params.pushtoken },
      { $set: { read: 1 } }
    );
    res.send("Updated Successfully");
  });

router.route("/setToken/:userID").put(function (req, res) {
  console.log(req.params.userID);
  console.log(req.body);
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
  Recruiter.updateOne(
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
