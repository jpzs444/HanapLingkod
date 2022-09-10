const express = require("express");
const router = express.Router();
const Work = require("../Models/Work");

router
  .route("/Work")
  .get(async function (req, res) {
    let queryResult = await Work.find({}).exec();
    res.send(queryResult);
  })
  .post(async function (req, res) {});

router.route("/Work/:UserId").get(function (req, res) {
  Work.find({ workerId: req.params.UserId }, function (err, found) {
    if (found) {
      res.send(found);
    } else {
      res.send("No such data found");
    }
  });
});

module.exports = router;
