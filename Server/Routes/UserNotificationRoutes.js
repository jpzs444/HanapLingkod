const express = require("express");
const router = express.Router();
const UserNotification = require("../Models/Notifications");
const Work = require("../Models/Work");

router.route("/notification/:pushtoken").get(function (req, res) {
  UserNotification.find({ to: req.params.pushtoken }, function (err, notif) {
    if (notif) {
      res.send(notif);
    } else {
      res.send("No such data found");
    }
  });
});
module.exports = router;
