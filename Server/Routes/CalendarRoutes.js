const express = require("express");
const router = express.Router();
const Worker = require("../Models/Workers");
const dayjs = require("dayjs");
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");

router.route("/add-schedule/:user").post(async function (req, res) {
  let startTime = dayjs(req.body.inputDate + "T" + req.body.startTime).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  let endTime = dayjs(req.body.inputDate + "T" + req.body.endTime).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  Worker.findOneAndUpdate(
    { _id: req.params.user },
    {
      $push: {
        unavailableTime: {
          title: req.body.title,
          startTime: startTime,
          endTime: endTime,
          wholeDay: req.body.wholeday,
        },
      },
    },
    function (err) {
      if (!err) {
        console.log("Succesfully added schedule");
      } else {
        console.log(err);
      }
    }
  );
});

router.route("/rr").post(function (req, res) {
  console.log(
    dayjs("2019-01-25 7:30:00")
      // .format("YYYY-MM-DD HH:mm:ss")
      .toISOString()
  ); // '2019-01-25T02:00:00.000Z'
});

module.exports = router;
