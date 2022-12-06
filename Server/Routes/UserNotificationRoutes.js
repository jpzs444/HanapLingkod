const express = require("express");
const router = express.Router();
const UserNotification = require("../Models/Notifications");
const Work = require("../Models/Work");
const Worker = require("../Models/Workers");
const Recruiter = require("../Models/Recruiters");
const { generateAccessToken, authenticateToken } = require("../Helpers/JWT");

router
  .route("/notification/:userId")
  .get(authenticateToken, async function (req, res) {
    let page;
    if (req.query.page) {
      page = parseInt(req.query.page);
    } else {
      page = 1;
    }
    const limit = 10;

    let result = await UserNotification.find({ userID: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(limit * page)
      .lean()
      .exec();
    res.send(result.reverse());
  })
  .put(authenticateToken, async function (req, res) {
    await UserNotification.updateMany(
      { userID: req.params.userId },
      { $set: { read: 1 } }
    );
    res.send("Updated Successfully");
  });

router.route("/setToken/:userID").put(authenticateToken, function (req, res) {
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
