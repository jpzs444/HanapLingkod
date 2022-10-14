const express = require("express");
const router = express.Router();
const Worker = require("../Models/Workers");
const dayjs = require("dayjs");

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

module.exports = router;
