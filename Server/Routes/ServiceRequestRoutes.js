const express = require("express");
const router = express.Router();
const ServiceRequest = require("../Models/ServiceRequest");
const Recruiter = require("../Models/Recruiters");
const Worker = require("../Models/Workers");
const notification = require("../Helpers/PushNotification");

router
  .route("/service-request")
  .get(async function (req, res) {
    try {
      let queryResultWorker = await ServiceRequest.find({
        workerId: req.body.userId,
      }).sort({ date: -1, requestStatus: 1 });
      let queryResultRecruiter = await ServiceRequest.find({
        recruiterId: req.body.userId,
      }).sort({ date: -1, requestStatus: 1 });

      res.send({ worker: queryResultWorker, recruiter: queryResultRecruiter });
    } catch (error) {
      res.send(error);
    }
  })
  .post(async function (req, res) {
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
router
  .route("/service-request/:id")
  .put(async function (req, res) {
    try {
      ServiceRequest.findOneAndUpdate(
        { _id: req.params.id },
        {
          requestStatus: req.body.requestStatus,
          endTime: req.body.endTime,
          comment: req.body.endTime,
        },
        function (err) {
          if (!err) {
            res.send("Updated Successfully");
          } else {
            res.send(err);
          }
        }
      );
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
  });

module.exports = router;
