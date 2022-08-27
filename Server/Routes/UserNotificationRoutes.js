const express = require("express");
const router = express.Router();
const UserNotification = require("../Models/Notifications");
const Work = require("../Models/Work");

router.route("/try").post(function (req, res) {
  let arr = [];

  for (var i = 0; i < req.body.qw.length; i++) {
    arr.push({
      ServiceSubCode: req.body.qw[i],
      workerId: "630981265d84bd1d60dd8814",
      minPrice: req.body.min[i],
      maxPrice: req.body.max[i],
    });
  }
  console.log(arr);
  // const work = await Work.create(
  //   [
  //     {
  //       ServiceSubCode: req.body.qw,
  //       workerId: "worker[0].id",
  //       minPrice: req.body.minPrice,
  //       maxPrice: req.body.maxPrice,
  //     },
  //   ],
  //   { session }
  // ););
});

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
