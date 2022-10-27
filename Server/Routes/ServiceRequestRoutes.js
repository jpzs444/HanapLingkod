const express = require("express");
const router = express.Router();
const ServiceRequest = require("../Models/ServiceRequest");
const Recruiter = require("../Models/Recruiters");
const Worker = require("../Models/Workers");
const Booking = require("../Models/Booking");
const notification = require("../Helpers/PushNotification");
const dayjs = require("dayjs");
const AddToCalendar = require("../Helpers/TimeAdder");
const checkConflict = require("../Helpers/ConflictChecker");
const generateOTP = require("../Helpers/OTP_Generator");

router.route("/service-request/:user").get(async function (req, res) {
  console.log(req.params.user);
  try {
    let page;
    if (req.query.page) {
      page = parseInt(req.query.page);
    } else {
      page = 1;
    }
    const limit = 10;

    let queryResultWorker = await ServiceRequest.find({
      workerId: req.params.user,
    })
      .sort({ date: -1, requestStatus: 1 })
      .limit(limit * page)
      .lean();
    let queryResultRecruiter = await ServiceRequest.find({
      recruiterId: req.params.user,
    })
      .sort({ date: -1, requestStatus: 1 })
      .limit(limit * page)
      .lean();

    res.send({ worker: queryResultWorker, recruiter: queryResultRecruiter });
  } catch (error) {
    res.send(error);
  }
});
router.route("/service-request").post(async function (req, res) {
  try {
    let startTime = dayjs(
      req.body.serviceDate + " " + req.body.startTime
    ).toISOString();
    // console.log(req.body.serviceDate);

    // console.log(startTime);

    const pushID = await Worker.findOne(
      { _id: req.body.workerId },
      { pushtoken: 1, _id: 0 }
    ).lean();
    const serviceRequest = new ServiceRequest({
      workerId: req.body.workerId,
      recruiterId: req.body.recruiterId,
      workId: req.body.workId,
      subCategory: req.body.subCategory,
      address: req.body.address,
      minPrice: req.body.minPrice,
      maxPrice: req.body.maxPrice,
      serviceDate: req.body.serviceDate,
      startTime: startTime,
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
      let endTime;
      let result;

      if (req.body.endDate !== undefined && req.body.endTime !== undefined) {
        // console.log("qq");
        endTime = dayjs(
          req.body.endDate + " " + req.body.endTime
        ).toISOString();
      }

      result = await ServiceRequest.findOne({ _id: req.params.id });

      const { workerId, recruiterId } = result;
      const pushIDWorker = await Worker.findOne(
        { _id: workerId },
        { pushtoken: 1, _id: 0 }
      ).lean();
      const pushIDRecruiter = await Recruiter.findOne(
        { _id: recruiterId },
        { pushtoken: 1, _id: 0 }
      ).lean();

      if (req.body.acceptMore === "false") {
        console.log(workerId);
        Worker.findOneAndUpdate(
          { _id: workerId },
          {
            $push: {
              unavailableTime: {
                title: "Cannot Accept Anymore",
                startTime: result.startTime,
                wholeDay: 1,
                CannotDelete: 0,
              },
            },
          },
          function (err) {
            if (!err) {
              console.log("Cannot accept more today");
            } else {
              console.log(err);
            }
          }
        );
      }

      // console.log(endTime);
      if (req.body.requestStatus == 2) {
        if (await checkConflict(req.params.user, req.params.id, endTime)) {
          res.status(400).send("Conflict on Sched");
        } else {
          const reqObj = {
            requestStatus: req.body.requestStatus,
            endTime: req.body.endTime,
          };
          reqObj.endTime = endTime;
          await ServiceRequest.findOneAndUpdate(
            { _id: req.params.id },
            reqObj,
            {
              new: true,
            }
          );

          //create booking
          const OTP = generateOTP(6);
          // console.log(result);
          const newBooking = await Booking.create({
            workerId: result.workerId,
            recruiterId: result.recruiterId,
            workId: result.workId,
            subCategory: result.subCategory,
            minPrice: result.minPrice,
            maxPrice: result.maxPrice,
            serviceDate: result.serviceDate,
            startTime: result.startTime,
            endTime: endTime,
            description: result.description,
            otp: OTP,
            bookingStatus: 1,
            address: result.address,
            geometry: {
              type: "point",
              coordinates: [
                result.geometry.coordinates[0],
                result.geometry.coordinates[1],
              ],
            },
          });
          AddToCalendar(newBooking);
          //put delete flag to true
          await ServiceRequest.findOneAndUpdate(
            { _id: req.params.id },
            {
              deleteflag: true,
            }
          );
          // notify recruiter
          notification(
            [pushIDRecruiter.pushtoken],
            "Accepted",
            "your request has been accepted",
            recruiterId
          );
          res.send("Successfully Updated status 2 ");
        }
      }

      if (req.body.requestStatus == 3) {
        console.log("asdscanel");
        await ServiceRequest.findOneAndUpdate(
          { _id: req.params.id },
          {
            requestStatus: req.body.requestStatus,
          },
          {
            new: true,
          }
        );
        notification(
          [pushIDRecruiter.pushtoken],
          "Rejected",
          "your request has been rejected",
          recruiterId
        );
        res.send("Successfully Updated to status 3 ");
      }

      if (req.body.requestStatus == 4) {
        console.log("ssss");
        await ServiceRequest.findOneAndUpdate(
          { _id: req.params.id },
          {
            requestStatus: req.body.requestStatus,
          },
          {
            new: true,
          }
        );
        notification(
          [pushIDWorker.pushtoken],
          "Cancelled",
          "Recruiter Cancelled the request",
          workerId
        );
        res.send("Successfully Updated to status 4 ");
      }
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
    ServiceRequest.findByIdAndUpdate(
      { _id: req.params.id },
      { deleteflag: true },
      function (err) {
        if (!err) {
          res.send("Deleted Succesfully");
        }
      }
    );
  });
router.route("/service-request-comment/:id").post(async function (req, res) {
  ServiceRequest.findOneAndUpdate(
    { _id: req.params.id },
    {
      comment: req.body.comment,
    },
    function (err) {
      if (!err) {
        res.send("Success");
      } else {
        console.log(err);
      }
    }
  );
});

module.exports = router;
