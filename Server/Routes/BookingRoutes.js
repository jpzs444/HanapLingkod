const express = require("express");
const router = express.Router();
const ServiceRequest = require("../Models/ServiceRequest");
const Recruiter = require("../Models/Recruiters");
const Worker = require("../Models/Workers");
const Booking = require("../Models/Booking");
const notification = require("../Helpers/PushNotification");
const dayjs = require("dayjs");

router.route("/booking/:user").get(async function (req, res) {
  try {
    // const endTime = dayjs(
    //   req.body.endDate + " " + req.body.endTime
    // ).toISOString();
    let queryResultWorker = await Booking.find({
      workerId: req.params.user,
    }).sort({ date: -1, bookingStatus: 1 });
    let queryResultRecruiter = await Booking.find({
      recruiterId: req.params.user,
    }).sort({ date: -1, bookingStatus: 1 });

    res.send({ worker: queryResultWorker, recruiter: queryResultRecruiter });
  } catch (error) {
    res.send(error);
  }
});

router
  .route("/booking/:user/:id")
  .put(async function (req, res) {
    // console.log(typeof req.body.confirmWorker);
    let result = await Booking.findOneAndUpdate(
      { _id: req.params.id },
      {
        bookingStatus: req.body.bookingStatus,
        statusWorker: req.body.statusWorker,
        statusRecruiter: req.body.statusRecruiter,
      },
      { new: true }
    );
    const { statusWorker, statusRecruiter } = result;
    if (statusWorker == 3 && statusRecruiter == 3) {
      // console.log("");
      Booking.findOneAndUpdate(
        { _id: req.params.id },
        {
          bookingStatus: 3,
        },
        function (err) {
          if (!err) {
            console.log("booking updated to Done");
          } else {
            console.log(err);
          }
        }
      );

        


    }
    if (req.body.statusWorker == 2) {
      Booking.findOneAndUpdate(
        { _id: req.params.id },
        {
          bookingStatus: 2,
        },
        function (err) {
          if (!err) {
            console.log("booking updated to Ongoing");
          } else {
            console.log(err);
          }
        }
      );
    }
    if (req.body.statusWorker == 4 || result.statusRecruiter == 4) {
      Booking.findOneAndUpdate(
        { _id: req.params.id },
        {
          bookingStatus: 4,
        },
        function (err) {
          if (!err) {
            console.log("booking updated to Cancelled");
          } else {
            console.log(err);
          }
        }
      );
    }
    res.send("updated Sucess");
  })
  .get(async function (req, res) {
    try {
      let queryResult = await Booking.find({ _id: req.params.id });
      res.send(queryResult);
    } catch (error) {
      res.send(error);
    }
  })
  .delete(async function (req, res) {
    Booking.findByIdAndUpdate(
      { _id: req.params.id },
      { deleteflag: true },
      function (err) {
        if (!err) {
          res.send("Deleted Succesfully");
        }
      }
    );
  });

module.exports = router;
