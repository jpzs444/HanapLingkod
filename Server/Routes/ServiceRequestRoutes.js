const express = require("express");
const router = express.Router();
const ServiceRequest = require("../Models/ServiceRequest");
const Recruiter = require("../Models/Recruiters");
const Worker = require("../Models/Workers");
const notification = require("../Helpers/PushNotification");

router.route("/service-request/:user").get(async function (req, res) {
  console.log(req.params.user);
  try {
    let queryResultWorker = await ServiceRequest.find({
      workerId: req.params.user,
    }).sort({ date: -1, requestStatus: 1 });
    let queryResultRecruiter = await ServiceRequest.find({
      recruiterId: req.params.user,
    }).sort({ date: -1, requestStatus: 1 });

    res.send({ worker: queryResultWorker, recruiter: queryResultRecruiter });
  } catch (error) {
    res.send(error);
  }
});
router.route("/service-request").post(async function (req, res) {
  try {
    const pushID = await Worker.findOne(
      { _id: req.body.workerId },
      { pushtoken: 1, _id: 0 }
    ).lean();
    const serviceRequest = new ServiceRequest({
      workerId: req.body.workerId,
      recruiterId: req.body.recruiterId,
      subCategory: req.body.subCategory,
      minPrice: req.body.minPrice,
      maxPrice: req.body.maxPrice,
      serviceDate: req.body.serviceDate,
      startTime: req.body.startTime,
      description: req.body.description,
      geometry: { type: "point", coordinates: [req.body.long, req.body.lat] },
      requestStatus: 1,
    });
    console.log(pushID);
    serviceRequest.save(function (err) {
      if (!err) {
        res.send("New Service Request Created");
        notification(
          [pushID.pushtoken],
          "New Request",
          "New Request Check It out",
          req.body.workerId
        );
      } else {
        res.send(err);
      }
    });
  } catch (error) {
    res.send(error);
  }
});
//
router
  .route("/service-request/:user/:id")
  .put(async function (req, res) {
    try {
      let result;
      result = await ServiceRequest.findOneAndUpdate(
        { _id: req.params.id },
        {
          requestStatus: req.body.requestStatus,
          endTime: req.body.endTime,
          comment: req.body.endTime,
        },
        { new: true }
      );
      const { workerId, recruiterId } = result;
      const pushIDWorker = await Worker.findOne(
        { _id: workerId },
        { pushtoken: 1, _id: 0 }
      ).lean();
      const pushIDRecruiter = await Recruiter.findOne(
        { _id: recruiterId },
        { pushtoken: 1, _id: 0 }
      ).lean();
      console.log(pushIDWorker, pushIDRecruiter);

      if (req.body.requestStatus == 2) {
        console.log("asd");
        notification(
          [pushIDRecruiter.pushtoken],
          "Accepted",
          "your request has been accepted",
          recruiterId
        );
      } else if (req.body.requestStatus == 3) {
        notification(
          [pushIDRecruiter.pushtoken],
          "Rejected",
          "your request has been rejected",
          recruiterId
        );
      } else if (req.body.requestStatus == 4) {
        notification(
          [pushIDWorker.pushtoken],
          "Cancelled",
          "Recruiter Cancelled the request",
          workerId
        );
      }

      res.send(result);
    } catch (error) {
      res.send(error);
    }
  })
  .get(async function (req, res) {
    try {
      let queryResult = await ServiceRequest.find({ _id: req.params.id });
      res.send(queryResult);
    } catch (error) {
      res.send(error);
    }
  })
  .delete(async function (req, res) {
    ServiceRequest.findByIdAndDelete({ _id: req.params.id }, function (err) {
      if (!err) {
        res.send("Deleted Succesfully");
      }
    });
  });

module.exports = router;
