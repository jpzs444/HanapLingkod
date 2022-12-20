const express = require("express");
const router = express.Router();
const Worker = require("../Models/Workers");
const dayjs = require("dayjs");
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
var isBetween = require("dayjs/plugin/isBetween");

router.route("/schedule/:user").get(async function (req, res) {
  const user = await Worker.find(
    { _id: req.params.user },
    { unavailableTime: 1 }
  ).exec();
  res.send(user);
});

router.route("/add-schedule/:user").post(async function (req, res) {
  dayjs.extend(isBetween);

  let startTime = req.body.startTime;

  let endTime = req.body.endTime;

  //coflict checker di ko ginamit isang function dahil di sya pwde hehezz
  const worker = await Worker.findOne({ _id: req.params.user });
  const { unavailableTime } = worker;
  let conflict = false;
  for (item of unavailableTime) {
    console.log(startTime, item.startTime);
    if (
      dayjs(startTime).isBetween(
        item.startTime,
        dayjs(item.endTime),
        null,
        "[]"
      ) ||
      dayjs(endTime).isBetween(
        item.startTime,
        dayjs(item.endTime),
        null,
        "[]"
      ) ||
      dayjs(item.startTime).isBetween(startTime, dayjs(endTime), null, "[]") ||
      dayjs(item.endTime).isBetween(startTime, dayjs(endTime), null, "[]")
    ) {
      conflict = true;
    }
  }
  if (conflict === false) {
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
  } else {
    res.send("conflict sched");
    console.log("conflict sched");
  }
});

router
  .route("/add-schedule/:user/:id")
  .delete(async function (req, res) {
    try {
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
          break;
        } else if (x._id == req.params.id && x.CannotDelete == 1) {
          console.log("cannot delete");
          // res.send("cannot delete");
        } else {
          console.log("Does Not Exist");
          // res.send("Does Not Exist");
        }
      }
    } catch (error) {
      console.log(error);
      res.send("Cannot Delete or error has occured");
    }
  })
  .put(async function (req, res) {
    let updated = {
      "unavailableTime.$.title": req.body.title,
      "unavailableTime.$.wholeDay": req.body.wholeDay,
    };
    if (req.body.startTime !== undefined) {
      let startTime = dayjs(
        req.body.startDate + " " + req.body.startTime
      ).toISOString();
      updated["unavailableTime.$.startTime"] = startTime;
    }
    if (req.body.endTime !== undefined) {
      let endTime = dayjs(
        req.body.endDate + " " + req.body.endTime
      ).toISOString();
      updated["unavailableTime.$.endTime"] = endTime;
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
