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
    //ongoing
    // Booking.findOneAndUpdate({ _id: req.params.id }, {
    // }, { new: true });
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
