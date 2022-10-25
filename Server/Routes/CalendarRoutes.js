const express = require("express");
const router = express.Router();
const Worker = require("../Models/Workers");
const dayjs = require("dayjs");
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");

router.route("/add-schedule/:user").post(async function (req, res) {
  let startTime = dayjs(
    req.body.startDate + " " + req.body.startTime
  ).toISOString();
  let endTime = dayjs(req.body.endDate + " " + req.body.endTime).toISOString();
  Worker.findOneAndUpdate(
    { _id: req.params.user },
    {
      $push: {
        unavailableTime: {
          title: req.body.title,
          startTime: startTime,
          endTime: endTime,
          wholeDay: req.body.wholeday,
          CannotDelete: 0,
        },
      },
    },
    function (err) {
      if (!err) {
        console.log("Succesfully added schedule");
        res.send("Succesfully added schedule");
      } else {
        res.send("error");
        console.log(err);
      }
    }
  );
});

router
  .route("/add-schedule/:user/:id")
  .delete(async function (req, res) {
    let query = await Worker.findOne({ _id: req.params.user }).exec();
    const { unavailableTime } = query;
    console.log(req.params.id);
    for (x of unavailableTime) {
      // console.log(x);
      if (x._id == req.params.id && x.CannotDelete == 0) {
        Worker.findOneAndUpdate(
          { _id: req.params.user },
          { $pull: { unavailableTime: { _id: req.params.id } } }
        ).exec();
        res.send("Schedule deleted");
      } else if (x._id == req.params.id && x.CannotDelete == 1) {
        console.log("cannot delete");
        // res.send("cannot delete");
      } else {
        console.log("Does Not Exist");
        // res.send("Does Not Exist");
      }
    }

    res.send("Cannot Delete or error has occured");
  })
  .put(async function (req, res) {
    let updated = {
      "unavailableTime.$.title": "sample1",
      "unavailableTime.$.wholeDay": false,
    };
    if (req.body.startTime !== undefined) {
      let startTime = dayjs(
        req.body.inputDate + " " + req.body.startTime
      ).toISOString();
      updated["unavailableTime.$.startTime"] = startTime;
    }
    if (req.body.endTime !== undefined) {
      let startTime = dayjs(
        req.body.inputDate + " " + req.body.endTime
      ).toISOString();
      updated["unavailableTime.$.endTime"] = startTime;
    }
    console.log(updated);
    let query = await Worker.findOne({ _id: req.params.user }).exec();
    const { unavailableTime } = query;
    for (x of unavailableTime) {
      // console.log(x);
      if (x._id == req.params.id) {
        // console.log("inside");

        Worker.findOneAndUpdate(
          { _id: req.params.user, "unavailableTime._id": req.params.id },
          {
            $set: updated,
          }
        ).exec();
        res.send("Schedule updated");
      }
    }
  });

module.exports = router;
